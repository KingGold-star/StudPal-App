// src/services/networkService.js
import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

let NetInfo = null;
try {
  NetInfo = require('@react-native-community/netinfo').default || require('@react-native-community/netinfo');
} catch (e) {
  // Graceful fallback if native module is not linked in certain environments
}

class NetworkService {
  constructor() {
    this._isOnline = true;
    this._listeners = new Set();
    this._initialized = false;
    this._init();
  }

  _init() {
    if (this._initialized) return;
    this._initialized = true;

    // 1. Web environment listener
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      this._isOnline = typeof navigator !== 'undefined' ? navigator.onLine !== false : true;

      window.addEventListener('online', () => {
        this._updateStatus(true);
      });

      window.addEventListener('offline', () => {
        this._updateStatus(false);
      });
      return;
    }

    // 2. Mobile React Native environment listener
    if (NetInfo && typeof NetInfo.addEventListener === 'function') {
      try {
        NetInfo.fetch().then((state) => {
          // Only mark offline if hardware is explicitly disconnected (e.g. airplane mode)
          const isExplicitlyDisconnected = state.isConnected === false;
          this._updateStatus(!isExplicitlyDisconnected);
        }).catch(() => {});

        NetInfo.addEventListener((state) => {
          const isExplicitlyDisconnected = state.isConnected === false;
          this._updateStatus(!isExplicitlyDisconnected);
        });
        return;
      } catch (err) {
        console.warn('[NetworkService] NetInfo init warning:', err);
      }
    }

    // 3. Fallback Periodic Ping Probe (runs every 30 seconds)
    this._scheduleHeartbeat();
  }

  _scheduleHeartbeat() {
    if (typeof setInterval !== 'undefined') {
      setInterval(() => {
        this.checkConnection().catch(() => {});
      }, 30000);
    }
  }

  _updateStatus(isOnline) {
    if (this._isOnline !== isOnline) {
      this._isOnline = isOnline;
      this._notify();
    }
  }

  _notify() {
    this._listeners.forEach((listener) => {
      try {
        listener(this._isOnline);
      } catch (err) {
        console.error('[NetworkService] Listener exception:', err);
      }
    });
  }

  /**
   * Record that an active network API call succeeded, clearing any transient false offline flags
   */
  recordSuccessfulTraffic() {
    this._updateStatus(true);
  }

  /**
   * Synchronous check if the device is currently online
   */
  isOnline() {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined') {
      return navigator.onLine !== false;
    }
    return this._isOnline;
  }

  /**
   * Asynchronous check with quick network probe
   */
  async checkConnection() {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined') {
      const webOnline = navigator.onLine !== false;
      this._updateStatus(webOnline);
      return webOnline;
    }

    if (NetInfo && typeof NetInfo.fetch === 'function') {
      try {
        const state = await NetInfo.fetch();
        const isExplicitlyDisconnected = state.isConnected === false;
        if (isExplicitlyDisconnected) {
          this._updateStatus(false);
          return false;
        }
      } catch (e) {
        // Continue to probe fallback
      }
    }

    // Lightweight probe using standard 204 connectivity endpoint
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch('https://clients3.google.com/generate_204', {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const online = res.status >= 200 && res.status < 400;
      this._updateStatus(online);
      return online;
    } catch (e) {
      // If NetInfo already verified connection, do not falsely report offline on transient probe error
      if (this._isOnline && NetInfo) {
        return this._isOnline;
      }
      this._updateStatus(false);
      return false;
    }
  }

  /**
   * Subscribe to connectivity changes
   */
  subscribe(listener) {
    this._listeners.add(listener);
    // Notify immediately with current state
    try {
      listener(this.isOnline());
    } catch (e) {}
    return () => this._listeners.delete(listener);
  }
}

export const networkService = new NetworkService();

/**
 * Custom React Hook to observe connectivity in UI components
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(networkService.isOnline());

  useEffect(() => {
    const unsub = networkService.subscribe((online) => {
      setIsOnline(online);
    });
    return unsub;
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
  };
}

export default networkService;
