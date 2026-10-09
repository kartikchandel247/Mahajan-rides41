import { supabase } from './supabase';

/**
 * Real-time Analytics Tracker for MahajanRide
 * Synchronizes real live pageviews, devices, browsers, and viewers directly with Vercel & Supabase
 */

function getDeviceType() {
  const ua = navigator.userAgent;
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
    return 'Mobile';
  }
  return 'Desktop';
}

function getBrowserName() {
  const ua = navigator.userAgent;
  const isMobile = getDeviceType() === 'Mobile';

  if (/FBAN|FBAV/i.test(ua)) return 'Facebook';
  if (/VivoBrowser/i.test(ua)) return 'vivo Browser';
  if (/SamsungBrowser/i.test(ua)) return 'Samsung Internet';
  if (/Edg/i.test(ua)) return 'Microsoft Edge';
  if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) {
    return isMobile ? 'Chrome Mobile' : 'Chrome';
  }
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) {
    return isMobile ? 'Mobile Safari' : 'Safari';
  }
  if (/Firefox/i.test(ua)) return 'Firefox';
  return 'Other Browser';
}

function getSessionId() {
  try {
    let sid = sessionStorage.getItem('mr_session_id');
    if (!sid) {
      sid = 'ses_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      sessionStorage.setItem('mr_session_id', sid);
    }
    return sid;
  } catch {
    return 'ses_' + Date.now();
  }
}

function getVisitorId() {
  try {
    let vid = localStorage.getItem('mr_visitor_id');
    if (!vid) {
      vid = 'vis_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      localStorage.setItem('mr_visitor_id', vid);
    }
    return vid;
  } catch {
    return 'vis_' + Date.now();
  }
}

// Global active presence channel for live viewer tracking
let presenceChannel = null;
let telemetryBroadcastChannel = null;

function ensureRealtimeChannels() {
  if (!supabase?.channel) return;

  if (!telemetryBroadcastChannel) {
    telemetryBroadcastChannel = supabase.channel('mahajan_live_telemetry');
    telemetryBroadcastChannel.subscribe();
  }

  if (!presenceChannel) {
    presenceChannel = supabase.channel('online_viewers');
    presenceChannel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        try {
          await presenceChannel.track({
            visitor_id: getVisitorId(),
            path: window.location.pathname || '/',
            device: getDeviceType(),
            browser: getBrowserName(),
            online_at: new Date().toISOString()
          });
        } catch {}
      }
    });
  }
}

// In-memory or localStorage buffer for offline/local analytics
const REAL_ANALYTICS_STORAGE_KEY = 'mahajan_real_analytics_cache_v2';

export function getLocalLiveAnalytics() {
  try {
    const raw = localStorage.getItem(REAL_ANALYTICS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export function saveLocalLiveAnalytics(data) {
  try {
    localStorage.setItem(REAL_ANALYTICS_STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

/**
 * Record a real pageview event and broadcast live to Admin
 */
export async function trackPageview(path = window.location.pathname) {
  const payload = {
    visitor_id: getVisitorId(),
    session_id: getSessionId(),
    path: path || window.location.pathname || '/',
    device_type: getDeviceType(),
    browser: getBrowserName(),
    referrer: document.referrer || 'Direct',
    timestamp: new Date().toISOString()
  };

  // 1. Initialize Supabase Realtime Channels
  ensureRealtimeChannels();

  // 2. Broadcast immediately over Supabase WebSocket to any active Admin Portal
  try {
    if (telemetryBroadcastChannel && telemetryBroadcastChannel.send) {
      telemetryBroadcastChannel.send({
        type: 'broadcast',
        event: 'live_view',
        payload
      });
    }
  } catch {}

  // 3. Post to local and production Vercel serverless functions
  try {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(() => {});
  } catch {}

  // Also notify live Vercel app if running elsewhere
  if (typeof window !== 'undefined' && !window.location.host.includes('mahajan-rides41.vercel.app')) {
    try {
      fetch('https://mahajan-rides41.vercel.app/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'no-cors'
      }).catch(() => {});
    } catch {}
  }

  // 4. Update local cache
  try {
    const current = getLocalLiveAnalytics() || {};
    const liveInc = (current.liveIncrement || 0) + 1;
    current.liveIncrement = liveInc;
    current.lastEvent = payload;
    saveLocalLiveAnalytics(current);
  } catch {}

  return payload;
}
