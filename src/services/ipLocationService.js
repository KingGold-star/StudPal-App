// src/services/ipLocationService.js

const IP_COUNTRY_STORAGE_KEY = "@studpal_ip_country_code_v1";

class IpLocationService {
  constructor() {
    this.countryCode = "NG"; // Default fallback
    this.ip = null;
    this.listeners = new Set();
    this.isLoading = false;
    this.init();
  }

  init() {
    // 1. Load cached IP country code from storage if available
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const cached = window.localStorage.getItem(IP_COUNTRY_STORAGE_KEY);
        if (cached && cached.length === 2) {
          this.countryCode = cached.toUpperCase();
        }
      }
    } catch (e) {
      console.warn("IpLocationService: error loading cached country code", e);
    }

    // 2. Fetch fresh IP location in background
    this.fetchIpCountryCode();
  }

  getCountryCode() {
    return this.countryCode;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    try {
      listener(this.countryCode, this.ip);
    } catch (e) {
      console.error("Error in initial IpLocation listener call", e);
    }
    return () => {
      this.listeners.delete(listener);
    };
  }

  notify() {
    for (const listener of this.listeners) {
      try {
        listener(this.countryCode, this.ip);
      } catch (e) {
        console.error("Error notifying IpLocation listener", e);
      }
    }
  }

  async fetchIpCountryCode() {
    if (this.isLoading) return this.countryCode;
    this.isLoading = true;

    try {
      // Primary provider: api.country.is (very fast, CORS friendly, returns { ip, country: 'NG' })
      const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), 4000) : null;

      const response = await fetch("https://api.country.is/", {
        signal: controller ? controller.signal : undefined,
      });
      if (timeoutId) clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data && data.country && data.country.length === 2) {
          const code = data.country.toUpperCase();
          this.countryCode = code;
          this.ip = data.ip || null;
          this.saveToStorage(code);
          this.notify();
          this.isLoading = false;
          return code;
        }
      }
    } catch (err) {
      // Fallback provider 1: ipwho.is
      try {
        const res2 = await fetch("https://ipwho.is/");
        if (res2.ok) {
          const data2 = await res2.json();
          if (data2 && data2.country_code && data2.country_code.length === 2) {
            const code2 = data2.country_code.toUpperCase();
            this.countryCode = code2;
            this.ip = data2.ip || null;
            this.saveToStorage(code2);
            this.notify();
            this.isLoading = false;
            return code2;
          }
        }
      } catch (err2) {
        // Fallback provider 2: ipapi.co
        try {
          const res3 = await fetch("https://ipapi.co/country/");
          if (res3.ok) {
            const text = (await res3.text()).trim();
            if (text && text.length === 2) {
              const code3 = text.toUpperCase();
              this.countryCode = code3;
              this.saveToStorage(code3);
              this.notify();
              this.isLoading = false;
              return code3;
            }
          }
        } catch (err3) {
          console.warn("All IP geolocation lookups timed out, keeping code:", this.countryCode);
        }
      }
    }

    this.isLoading = false;
    return this.countryCode;
  }

  saveToStorage(code) {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(IP_COUNTRY_STORAGE_KEY, code);
      }
    } catch (e) {
      // ignore storage errors
    }
  }
}

export const ipLocationService = new IpLocationService();
