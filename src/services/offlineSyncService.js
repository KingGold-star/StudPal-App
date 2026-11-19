// src/services/offlineSyncService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { networkService } from './networkService';
import { supabase } from '../lib/supabaseClient';
import { studySupabaseService } from './supabase/studyService';
import { gamificationSupabaseService } from './supabase/gamificationService';
import { profileService } from './supabase/profileService';
import { settingsSupabaseService } from './supabase/settingsService';
import { communitySupabaseService } from './supabase/communityService';

const QUEUE_STORAGE_KEY = '@studpal_offline_sync_queue_v1';
const CACHED_PROFILE_KEY = '@studpal_cached_user_profile_v1';
const CACHED_ONBOARDING_KEY = '@studpal_cached_user_onboarding_v1';

class OfflineSyncService {
  constructor() {
    this.isSyncing = false;
    this.init();
  }

  init() {
    // Listen for network reconnection to trigger immediate sync
    networkService.subscribe((isOnline) => {
      if (isOnline) {
        this.processQueue().catch(() => {});
      }
    });
  }

  // ─── Local Profile & Onboarding Cache ──────────────────────────────────────

  async cacheLocalProfile(profileData) {
    if (!profileData) return;
    try {
      await AsyncStorage.setItem(CACHED_PROFILE_KEY, JSON.stringify(profileData));
    } catch (e) {
      console.warn('[OfflineSyncService] Failed to cache profile:', e);
    }
  }

  async getCachedLocalProfile() {
    try {
      const raw = await AsyncStorage.getItem(CACHED_PROFILE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  async cacheLocalOnboarding(onboardingData) {
    if (!onboardingData) return;
    try {
      await AsyncStorage.setItem(CACHED_ONBOARDING_KEY, JSON.stringify(onboardingData));
    } catch (e) {
      console.warn('[OfflineSyncService] Failed to cache onboarding:', e);
    }
  }

  async getCachedLocalOnboarding() {
    try {
      const raw = await AsyncStorage.getItem(CACHED_ONBOARDING_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  // ─── Offline Action Queue ──────────────────────────────────────────────────

  async enqueueAction(actionType, payload) {
    try {
      const currentQueue = await this.getQueue();
      const SINGLETON_ACTIONS = ['SETTINGS_UPDATE', 'GAMIFICATION_PROGRESS', 'PROFILE_UPDATE', 'USER_SUBJECTS'];
      let updatedQueue = currentQueue;
      if (SINGLETON_ACTIONS.includes(actionType)) {
        updatedQueue = currentQueue.filter((item) => item.type !== actionType);
      }
      const newAction = {
        id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        type: actionType,
        payload,
        createdAt: new Date().toISOString(),
      };
      updatedQueue.push(newAction);
      await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(updatedQueue));
      console.log(`[OfflineSyncService] Enqueued offline action: ${actionType} (queue length: ${updatedQueue.length})`);

      // If we happen to be online and not already syncing, try processing immediately
      if (networkService.isOnline() && !this.isSyncing) {
        this.processQueue().catch(() => {});
      }
    } catch (e) {
      console.warn('[OfflineSyncService] Failed to enqueue action:', e);
    }
  }

  async getQueue() {
    try {
      const raw = await AsyncStorage.getItem(QUEUE_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  async clearQueue() {
    try {
      await AsyncStorage.removeItem(QUEUE_STORAGE_KEY);
    } catch (e) {}
  }

  /**
   * Process all pending actions in queue when connected
   */
  async processQueue() {
    if (this.isSyncing) return;
    if (!networkService.isOnline()) return;

    const queue = await this.getQueue();
    if (queue.length === 0) return;

    this.isSyncing = true;
    console.log(`[OfflineSyncService] Starting sync of ${queue.length} offline actions...`);

    try {
      const { data: { user } = {} } = await supabase.auth.getUser().catch(() => ({ data: {} }));
      const userId = user?.id;

      if (!userId) {
        // Cannot sync to Supabase without authenticated user, retain in queue without busy-looping
        return;
      }

      const remainingQueue = [];

      for (const item of queue) {
        try {

          switch (item.type) {
            case 'STUDY_SESSION':
              await studySupabaseService.recordStudySession(userId, item.payload);
              break;

            case 'GAMIFICATION_PROGRESS':
              await gamificationSupabaseService.syncProgress(userId, item.payload);
              break;

            case 'PROFILE_UPDATE':
              await profileService.updateProfile(userId, item.payload);
              break;

            case 'SETTINGS_UPDATE':
              await settingsSupabaseService.syncSettings(userId, item.payload);
              break;

            case 'COMMUNITY_JOIN':
              await communitySupabaseService.joinCommunity(userId, item.payload.communityId);
              break;

            case 'USER_SUBJECTS':
              await studySupabaseService.syncUserSubjects(userId, item.payload);
              break;

            default:
              console.warn('[OfflineSyncService] Unknown action type:', item.type);
          }
        } catch (itemErr) {
          console.warn(`[OfflineSyncService] Error processing action ${item.type}:`, itemErr);
          remainingQueue.push(item);
        }
      }

      await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(remainingQueue));
      console.log(`[OfflineSyncService] Sync cycle complete. Remaining queued: ${remainingQueue.length}`);
    } catch (err) {
      console.warn('[OfflineSyncService] processQueue error:', err);
    } finally {
      this.isSyncing = false;
    }
  }
}

export const offlineSyncService = new OfflineSyncService();
export default offlineSyncService;
