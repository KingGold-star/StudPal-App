import AsyncStoragePackage from '@react-native-async-storage/async-storage';

const AsyncStorage = AsyncStoragePackage?.default || AsyncStoragePackage;

const NOTIFICATIONS_STORAGE_KEY = '@studpal_notifications_v2';

const safeGetItem = async (key) => {
  try {
    if (AsyncStorage && typeof AsyncStorage.getItem === 'function') {
      return await AsyncStorage.getItem(key);
    }
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
  } catch (e) {
    // safe fallback
  }
  return null;
};

const safeSetItem = async (key, val) => {
  try {
    if (AsyncStorage && typeof AsyncStorage.setItem === 'function') {
      await AsyncStorage.setItem(key, val);
      return;
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, val);
      return;
    }
  } catch (e) {
    // safe fallback
  }
};

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'srs', // 'srs' | 'achievement' | 'ai' | 'streak'
    title: 'Calculus Revision Due',
    message: 'Integration by Parts is ready for spaced repetition review.',
    time: '10m ago',
    timestamp: Date.now() - 10 * 60 * 1000,
    read: false,
    action: { route: 'study', params: { subject: 'Calculus', topic: 'Integration by Parts' } },
    actionLabel: 'Review Now',
  },
  {
    id: 'notif-2',
    type: 'achievement',
    title: 'Level 7 Scholar Achieved',
    message: 'You earned +320 XP this week and reached Rank #3 on the leaderboard!',
    time: '1h ago',
    timestamp: Date.now() - 60 * 60 * 1000,
    read: false,
    action: { route: 'leaderboard' },
    actionLabel: 'View Rank',
  },
  {
    id: 'notif-3',
    type: 'ai',
    title: 'AI Study Guide Ready',
    message: 'Branco compiled your personalized revision guide for Organic Chemistry.',
    time: '3h ago',
    timestamp: Date.now() - 3 * 60 * 60 * 1000,
    read: false,
    action: { route: 'aicoach', params: 'Explain Organic Chemistry mechanisms step by step' },
    actionLabel: 'Open Guide',
  },
  {
    id: 'notif-4',
    type: 'streak',
    title: '5-Day Streak on Fire! 🔥',
    message: 'Complete your 15-minute daily focus session today to protect your streak.',
    time: 'Yesterday',
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
    read: true,
    action: { route: 'schedule' },
    actionLabel: 'Start Session',
  },
];

class NotificationService {
  constructor() {
    this.notifications = [...INITIAL_NOTIFICATIONS];
    this.listeners = new Set();
    this.initialized = false;
    this._load();
  }

  async _load() {
    try {
      const stored = await safeGetItem(NOTIFICATIONS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.notifications = parsed;
        }
      }
    } catch (e) {
      console.warn('NotificationService load error:', e);
    } finally {
      this.initialized = true;
      this._notify();
    }
  }

  async _save() {
    try {
      await safeSetItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(this.notifications));
    } catch (e) {
      console.warn('NotificationService save error:', e);
    }
  }

  _notify() {
    const list = this.getNotifications();
    const unreadCount = this.getUnreadCount();
    this.listeners.forEach((fn) => {
      try {
        fn({ notifications: list, unreadCount });
      } catch (err) {
        console.error('NotificationService subscriber error:', err);
      }
    });
  }

  subscribe(listener) {
    this.listeners.add(listener);
    // Send immediate snapshot
    listener({ notifications: this.getNotifications(), unreadCount: this.getUnreadCount() });
    return () => {
      this.listeners.delete(listener);
    };
  }

  getNotifications() {
    return [...this.notifications];
  }

  getUnreadCount() {
    return this.notifications.filter((n) => !n.read).length;
  }

  async markAsRead(id) {
    let changed = false;
    this.notifications = this.notifications.map((n) => {
      if (n.id === id && !n.read) {
        changed = true;
        return { ...n, read: true };
      }
      return n;
    });
    if (changed) {
      await this._save();
      this._notify();
    }
  }

  async markAllAsRead() {
    let changed = false;
    this.notifications = this.notifications.map((n) => {
      if (!n.read) {
        changed = true;
        return { ...n, read: true };
      }
      return n;
    });
    if (changed) {
      await this._save();
      this._notify();
    }
  }

  async deleteNotification(id) {
    const prevLen = this.notifications.length;
    this.notifications = this.notifications.filter((n) => n.id !== id);
    if (this.notifications.length !== prevLen) {
      await this._save();
      this._notify();
    }
  }

  async clearAll() {
    if (this.notifications.length === 0) return;
    this.notifications = [];
    await this._save();
    this._notify();
  }

  async addNotification({ type = 'ai', title, message, action, actionLabel }) {
    const newNotif = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type,
      title: title || 'New Notification',
      message: message || '',
      time: 'Just now',
      timestamp: Date.now(),
      read: false,
      action: action || null,
      actionLabel: actionLabel || 'View',
    };
    this.notifications.unshift(newNotif);
    await this._save();
    this._notify();
    return newNotif;
  }
}

export const notificationService = new NotificationService();
