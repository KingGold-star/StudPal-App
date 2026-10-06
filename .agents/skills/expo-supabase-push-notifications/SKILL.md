---
name: expo-supabase-push-notifications
description: >-
  Complete implementation guide, architecture blueprint, and troubleshooting runbook for Expo Push Notifications using EAS and Supabase as the backend (Postgres, RLS, Edge Functions, and Database Webhooks) instead of Firebase.
---

# Expo Push Notifications with EAS & Supabase 🔔

This skill provides an end-to-end guide for implementing cross-platform push notifications in React Native / Expo apps using **EAS (Expo Application Services)** for native push credentials and **Supabase** (Postgres + RLS + Edge Functions + Database Webhooks) as the backend engine.

---

## 1. High-Level Architecture Overview

Unlike architectures that rely entirely on Firebase (Firestore + Firebase Cloud Functions), this architecture separates native OS delivery infrastructure from your backend database and business logic:

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Mobile Client (Expo)                          │
│  - Requests OS permission (expo-notifications)                         │
│  - Gets ExpoPushToken: ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]       │
│  - Upserts token to Supabase `push_tokens` table                       │
│  - Listens for Foreground/Background notifications & handles deep links│
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ (Token Sync)
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                           Supabase Backend                             │
│  - PostgreSQL: Stores user tokens in `push_tokens` with RLS            │
│  - Database Webhook / Trigger: Listens to new events (messages/alerts) │
│  - Edge Function (Deno): Dispatches push payload to Expo Push API     │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ (HTTP POST /--/api/v2/push/send)
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Expo Push Notification Service                  │
│  - Authenticates with APNs (iOS) & FCM v1 (Android) via EAS credentials│
│  - Routes push payloads directly to Apple APNs & Google FCM servers    │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
              Apple APNs (iOS)            Google FCM (Android)
                    │                             │
                    ▼                             ▼
              User's iPhone                 User's Android
```

---

## 2. Prerequisites & Native Credentials (EAS)

> [!IMPORTANT]
> Push notifications **cannot be tested reliably on emulators/simulators or Expo Go**. You must test on a **physical device** using an **EAS Development Build** (`npx expo run:ios` / `npx expo run:android` or `eas build --profile development`).

### Android Setup (Firebase Cloud Messaging FCM v1)
Even though Supabase is your backend database, Android OS push delivery requires an FCM v1 project for OS-level routing:
1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a project.
2. Add an Android App with your exact `android.package` from `app.json`.
3. Download `google-services.json` and place it in your project root.
4. Reference it in `app.json`:
   ```json
   "android": {
     "package": "com.yourname.app",
     "googleServicesFile": "./google-services.json"
   }
   ```
5. In Firebase Project Settings > **Service Accounts**, click **Generate new private key** (JSON).
6. Upload this key to EAS:
   ```bash
   eas credentials
   # Select Android > Select Build Profile > Google Service Account Key (FCM v1)
   ```

### iOS Setup (Apple Push Notification service APNs)
1. Ensure your Apple Developer Account is active.
2. Run `eas credentials` and select `iOS` -> `Push Notifications Key (.p8)`. EAS will automatically generate and register the APNs key in your Apple Developer portal.

---

## 3. Client-Side Implementation (Expo / React Native)

### A. Dependencies
```bash
npx expo install expo-notifications expo-device expo-constants
```

### B. `app.json` Configuration
```json
{
  "expo": {
    "name": "StudPal",
    "slug": "studpal",
    "extra": {
      "eas": {
        "projectId": "YOUR-EAS-PROJECT-ID-HERE"
      }
    },
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#ffffff",
          "sounds": ["./assets/notification-sound.wav"]
        }
      ]
    ]
  }
}
```

### C. Foreground Presentation Handler
In your root layout (`App.tsx` or `_layout.tsx`), set how notifications behave when the app is in the foreground:

```tsx
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
```

### D. Token Registration Function
```tsx
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) {
    console.warn('Push notifications require a physical device.');
    return null;
  }

  // 1. Android Notification Channel (Required for Android 8.0+)
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'default',
    });
  }

  // 2. Request Permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Failed to get push token: permission not granted.');
    return null;
  }

  // 3. Obtain Expo Push Token
  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;

  if (!projectId) {
    throw new Error('EAS Project ID not found in app.json.');
  }

  const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
  return tokenData.data;
}
```

### E. Notification Response & Deep Linking Listener
```tsx
import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';

export function useNotificationObserver() {
  const router = useRouter();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    // Fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Received notification:', notification);
    });

    // Fired whenever a user taps on or interacts with a notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (data?.url) {
        router.push(data.url); // Navigate to target screen
      }
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [router]);
}
```

---

## 4. Supabase Backend Architecture (Replacing Firebase)

### A. Database Schema (`push_tokens` Table)
Run this SQL migration in your Supabase SQL editor:

```sql
-- 1. Create table supporting multiple devices per user
create table if not exists public.push_tokens (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  expo_push_token text not null unique,
  device_type text, -- 'ios' | 'android'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Indexes for fast lookup
create index if not exists idx_push_tokens_user_id on public.push_tokens(user_id);

-- 3. Enable RLS
alter table public.push_tokens enable row level security;

-- Users can insert or update their own push tokens
create policy "Users can manage their own push tokens"
  on public.push_tokens
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Service role has full access (for Edge Functions)
create policy "Service role has full access to push_tokens"
  on public.push_tokens
  for all
  to service_role
  using (true)
  with check (true);
```

### B. Client-Side Token Sync with Supabase
When the user logs in or launches the app:

```tsx
import { supabase } from '@/lib/supabase';
import { Platform } from 'react-native';
import { registerForPushNotificationsAsync } from './notifications';

export async function syncPushTokenWithSupabase(userId: string) {
  const token = await registerForPushNotificationsAsync();
  if (!token) return;

  const { error } = await supabase
    .from('push_tokens')
    .upsert(
      {
        user_id: userId,
        expo_push_token: token,
        device_type: Platform.OS,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'expo_push_token' }
    );

  if (error) {
    console.error('Error saving push token to Supabase:', error);
  }
}

export async function removePushTokenOnLogout(token: string) {
  await supabase.from('push_tokens').delete().eq('expo_push_token', token);
}
```

---

## 5. Supabase Edge Function: `send-push-notification`

Create a Supabase Edge Function to send notifications via Expo Push API:

```bash
supabase functions new send-push-notification
```

**`supabase/functions/send-push-notification/index.ts`**:
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface PushPayload {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

serve(async (req) => {
  try {
    const { userId, title, body, data } = (await req.json()) as PushPayload;

    if (!userId || !title || !body) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase Admin Client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 1. Fetch user's registered tokens
    const { data: tokens, error } = await supabaseAdmin
      .from('push_tokens')
      .select('expo_push_token')
      .eq('user_id', userId);

    if (error || !tokens || tokens.length === 0) {
      return new Response(JSON.stringify({ message: 'No registered push tokens for user' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Prepare Expo Push API Messages
    const messages = tokens.map((t) => ({
      to: t.expo_push_token,
      sound: 'default',
      title,
      body,
      data: data ?? {},
    }));

    // 3. Send to Expo Push Service
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

    // 4. Clean up invalid/unregistered tokens
    if (result.data) {
      for (let i = 0; i < result.data.length; i++) {
        const ticket = result.data[i];
        if (ticket.status === 'error' && ticket.details?.error === 'DeviceNotRegistered') {
          const invalidToken = tokens[i].expo_push_token;
          await supabaseAdmin.from('push_tokens').delete().eq('expo_push_token', invalidToken);
          console.log(`Pruned inactive token: ${invalidToken}`);
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
```

Deploy the function:
```bash
supabase functions deploy send-push-notification
```

---

## 6. Automating Notifications with Database Webhooks

To trigger push notifications automatically whenever a new record is inserted into a table (e.g. `messages` or `notifications`):

1. Go to **Supabase Dashboard > Database > Webhooks**.
2. Click **Create a new webhook**.
3. Set Table: `public.messages` (or your notifications table).
4. Set Events: `INSERT`.
5. Webhook Type: **Supabase Edge Functions**.
6. Edge Function: `send-push-notification`.
7. HTTP Headers: Add `Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>`.

---

## 7. Testing & Verification Checklist

- [ ] Tested on a physical iOS or Android device.
- [ ] Created development build using `npx expo run:android` or `npx expo run:ios`.
- [ ] Registered token is successfully stored in Supabase `push_tokens` table.
- [ ] Tested sending a push notification from the [Expo Push Notification Tool](https://expo.dev/notifications).
- [ ] Tested sending via Supabase Edge Function invocation.
- [ ] Tapped notification when app was closed/backgrounded and confirmed deep link redirected to the correct screen.
- [ ] Verified invalid tokens (`DeviceNotRegistered`) are automatically pruned from Supabase.
