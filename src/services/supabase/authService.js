// src/services/supabase/authService.js
import { Platform, Linking } from 'react-native';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { networkService } from '../networkService';
import { offlineSyncService } from '../offlineSyncService';

const normalizeEmail = (email) => {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
};

export const authService = {
  /**
   * Register a new user with Supabase Auth
   */
  async signUp({ email, password, username, fullName, metadata = {} }) {
    const cleanEmail = normalizeEmail(email);
    const cleanUsername = username ? username.trim() : cleanEmail.split('@')[0];
    const cleanFullName = fullName ? fullName.trim() : cleanUsername;

    // 1. If not configured or offline, create a local offline user immediately
    if (!isSupabaseConfigured() || !networkService.isOnline()) {
      const localUser = {
        id: 'local_user_' + Date.now(),
        email: cleanEmail,
        user_metadata: {
          username: cleanUsername,
          full_name: cleanFullName,
          ...metadata,
        },
      };

      await offlineSyncService.cacheLocalProfile({
        id: localUser.id,
        email: cleanEmail,
        name: cleanFullName,
        username: cleanUsername,
        country: metadata.country || 'Nigeria',
        countryCode: metadata.countryCode || 'NG',
      });

      return {
        data: {
          user: localUser,
          session: null,
        },
        error: null,
        isLocalFallback: true,
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            username: cleanUsername,
            full_name: cleanFullName,
            country: metadata.country || 'Nigeria',
            country_code: metadata.countryCode || 'NG',
            ...metadata,
          },
        },
      });

      // Handle Supabase rate limiting or email issues gracefully
      if (error) {
        // If Supabase free tier email limit (3 emails/hr) was hit
        if (
          error.status === 429 ||
          error.code === 'over_email_send_rate_limit' ||
          (error.message && error.message.toLowerCase().includes('rate limit'))
        ) {
          console.warn('[authService] Supabase email rate limit reached. Falling back to local offline user.');
          const localUser = {
            id: 'local_user_' + Date.now(),
            email: cleanEmail,
            user_metadata: {
              username: cleanUsername,
              full_name: cleanFullName,
              ...metadata,
            },
          };

          await offlineSyncService.cacheLocalProfile({
            id: localUser.id,
            email: cleanEmail,
            name: cleanFullName,
            username: cleanUsername,
            country: metadata.country || 'Nigeria',
            countryCode: metadata.countryCode || 'NG',
          });

          return {
            data: { user: localUser, session: null },
            error: null,
            isLocalFallback: true,
            rateLimitNotice: true,
          };
        }

        // Clean user-friendly errors
        if (error.message && error.message.toLowerCase().includes('already registered')) {
          return {
            data: null,
            error: new Error('An account with this email already exists. Please log in.'),
          };
        }

        if (error.code === 'email_address_invalid' || (error.message && error.message.includes('invalid'))) {
          return {
            data: null,
            error: new Error('Please enter a valid email address (e.g. name@gmail.com).'),
          };
        }

        return { data: null, error };
      }

      // If user was created, check if session was established
      if (data?.user) {
        // If email confirmation is enabled in Supabase, session will be null.
        // Try logging in immediately just in case email confirmation is turned off or auto-confirmed
        if (!data.session) {
          try {
            const loginCheck = await supabase.auth.signInWithPassword({
              email: cleanEmail,
              password,
            });
            if (loginCheck?.data?.session) {
              data.session = loginCheck.data.session;
            }
          } catch (_) {}
        }

        // If session is still null, mark that email confirmation is pending
        const emailConfirmationPending = !data.session;

        // Cache user profile locally right away so user is never blocked
        await offlineSyncService.cacheLocalProfile({
          id: data.user.id,
          email: cleanEmail,
          name: cleanFullName,
          username: cleanUsername,
          country: metadata.country || 'Nigeria',
          countryCode: metadata.countryCode || 'NG',
        });

        // Upsert profile in Supabase if session exists
        if (data.session) {
          try {
            await supabase.from('profiles').upsert({
              id: data.user.id,
              email: cleanEmail,
              username: cleanUsername,
              full_name: cleanFullName,
              country: metadata.country || 'Nigeria',
              country_code: metadata.countryCode || 'NG',
              updated_at: new Date().toISOString(),
            });
          } catch (profileErr) {
            console.warn('[authService] Profile upsert notice:', profileErr);
          }
        }

        return { data, error: null, emailConfirmationPending };
      }

      return { data, error: null };
    } catch (err) {
      console.error('[authService.signUp] Exception:', err);
      return { data: null, error: err };
    }
  },

  /**
   * Sign in with existing credentials
   */
  async signIn({ email, password }) {
    const cleanEmail = normalizeEmail(email);

    // If offline or Supabase not configured, check local cache
    if (!isSupabaseConfigured() || !networkService.isOnline()) {
      const cached = await offlineSyncService.getCachedLocalProfile();
      if (cached && normalizeEmail(cached.email) === cleanEmail) {
        return {
          data: {
            user: {
              id: cached.id,
              email: cached.email,
              user_metadata: {
                username: cached.username,
                full_name: cached.name,
              },
            },
            session: null,
          },
          error: null,
          isLocalOfflineLogin: true,
        };
      }
      return {
        data: null,
        error: new Error('You are currently offline. Please connect to the internet to sign in to your cloud account.'),
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        if (error.message === 'Email not confirmed') {
          return {
            data: null,
            error: new Error(
              'Email not confirmed. Please check your inbox for the Supabase confirmation link, or disable "Confirm email" in your Supabase dashboard (Authentication -> Providers -> Email).'
            ),
            isEmailNotConfirmed: true,
            email: cleanEmail,
          };
        }

        if (error.message === 'Invalid login credentials') {
          return {
            data: null,
            error: new Error('Invalid email or password. Please verify your credentials and try again.'),
          };
        }

        return { data: null, error };
      }

      if (data?.user) {
        await offlineSyncService.cacheLocalProfile({
          id: data.user.id,
          email: cleanEmail,
          name: data.user.user_metadata?.full_name || data.user.user_metadata?.username || 'Student',
          username: data.user.user_metadata?.username || cleanEmail.split('@')[0],
          country: data.user.user_metadata?.country || 'Nigeria',
          countryCode: data.user.user_metadata?.country_code || 'NG',
        });
      }

      return { data, error: null };
    } catch (err) {
      console.error('[authService.signIn] Exception:', err);
      return { data: null, error: err };
    }
  },

  /**
   * Resend signup email confirmation
   */
  async resendConfirmationEmail(email) {
    const cleanEmail = normalizeEmail(email);
    if (!isSupabaseConfigured() || !cleanEmail) {
      return { error: new Error('Invalid email or Supabase configuration.') };
    }
    try {
      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email: cleanEmail,
      });
      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  /**
   * Sign out current user
   */
  async signOut() {
    if (!isSupabaseConfigured()) {
      return { error: null };
    }
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (err) {
      console.error('[authService.signOut] Exception:', err);
      return { error: err };
    }
  },

  /**
   * Get active session
   */
  async getSession() {
    if (!isSupabaseConfigured()) {
      return { data: { session: null }, error: null };
    }
    try {
      return await supabase.auth.getSession();
    } catch (err) {
      return { data: { session: null }, error: err };
    }
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    if (!isSupabaseConfigured()) {
      return null;
    }
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    } catch (err) {
      return null;
    }
  },

  /**
   * Listen to Supabase Auth state changes
   */
  onAuthStateChange(callback) {
    if (!isSupabaseConfigured()) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
    return supabase.auth.onAuthStateChange(callback);
  },

  /**
   * Send password reset email
   */
  async resetPassword(email) {
    const cleanEmail = normalizeEmail(email);
    if (!isSupabaseConfigured() || !cleanEmail) {
      return { error: null };
    }
    try {
      return await supabase.auth.resetPasswordForEmail(cleanEmail);
    } catch (err) {
      return { error: err };
    }
  },

  /**
   * Update user password
   */
  async updatePassword(newPassword) {
    if (!isSupabaseConfigured()) {
      return { error: null };
    }
    try {
      return await supabase.auth.updateUser({ password: newPassword });
    } catch (err) {
      return { error: err };
    }
  },

  /**
   * Google OAuth sign in
   */
  async signInWithGoogle() {
    if (!isSupabaseConfigured()) {
      return { data: null, error: new Error('Supabase is not configured') };
    }
    try {
      const redirectUrl =
        Platform.OS === 'web' && typeof window !== 'undefined'
          ? window.location.origin
          : 'studpal://auth/callback';

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        return { data: null, error };
      }

      if (data?.url) {
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          window.location.href = data.url;
        } else {
          await Linking.openURL(data.url);
        }
      }

      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  /**
   * Apple OAuth sign in
   */
  async signInWithApple() {
    if (!isSupabaseConfigured()) {
      return { data: null, error: new Error('Supabase is not configured') };
    }
    try {
      const redirectUrl =
        Platform.OS === 'web' && typeof window !== 'undefined'
          ? window.location.origin
          : 'studpal://auth/callback';

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        return { data: null, error };
      }

      if (data?.url) {
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          window.location.href = data.url;
        } else {
          await Linking.openURL(data.url);
        }
      }

      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  /**
   * Handle incoming OAuth callback URL for native mobile deep linking
   */
  async handleOpenUrl(url) {
    if (!url || !isSupabaseConfigured()) return { data: null, error: null };
    try {
      if (url.includes('code=')) {
        const cleanUrl = url.replace(/^[a-zA-Z0-9_-]+:\/\//, 'https://studpal.app/');
        const urlObj = new URL(cleanUrl);
        const code = urlObj.searchParams.get('code');
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          return { data, error };
        }
      } else if (url.includes('access_token=')) {
        const hash = url.split('#')[1] || url.split('?')[1] || '';
        const params = new URLSearchParams(hash);
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');
        if (access_token && refresh_token) {
          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
          return { data, error };
        }
      }
      return { data: null, error: null };
    } catch (err) {
      console.warn('[authService.handleOpenUrl] OAuth deep-link error:', err);
      return { data: null, error: err };
    }
  },
};

export default authService;
