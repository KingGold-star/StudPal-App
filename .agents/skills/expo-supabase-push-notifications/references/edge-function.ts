// Supabase Edge Function: send-push-notification
// Deploy command: supabase functions deploy send-push-notification

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface PushNotificationRequest {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  badge?: number;
  sound?: 'default' | string;
}

serve(async (req) => {
  try {
    const { userId, title, body, data, badge, sound } = (await req.json()) as PushNotificationRequest;

    if (!userId || !title || !body) {
      return new Response(JSON.stringify({ error: 'Missing required parameters: userId, title, body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 1. Fetch user's registered tokens
    const { data: tokens, error: tokenError } = await supabaseAdmin
      .from('push_tokens')
      .select('expo_push_token')
      .eq('user_id', userId);

    if (tokenError) {
      throw tokenError;
    }

    if (!tokens || tokens.length === 0) {
      return new Response(JSON.stringify({ message: 'User has no registered push tokens' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Format messages for Expo Push API
    const messages = tokens.map((t) => ({
      to: t.expo_push_token,
      sound: sound ?? 'default',
      title,
      body,
      badge: badge ?? undefined,
      data: data ?? {},
    }));

    // 3. Dispatch to Expo Push API
    const expoResponse = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    });

    const result = await expoResponse.json();

    // 4. Invalidate and prune bad/expired tokens (DeviceNotRegistered)
    if (result.data && Array.isArray(result.data)) {
      for (let i = 0; i < result.data.length; i++) {
        const ticket = result.data[i];
        if (ticket.status === 'error' && ticket.details?.error === 'DeviceNotRegistered') {
          const staleToken = tokens[i].expo_push_token;
          await supabaseAdmin.from('push_tokens').delete().eq('expo_push_token', staleToken);
          console.warn(`Pruned unregistered device token: ${staleToken}`);
        }
      }
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
