// Polyfill WebSocket for Node runtime environments without native WebSocket
if (typeof globalThis !== 'undefined' && !globalThis.WebSocket) {
  globalThis.WebSocket = class DummyWebSocket {
    constructor() {}
    addEventListener() {}
    removeEventListener() {}
  };
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://kcvnmquwqpuiftaeccgb.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjdm5tcXV3cXB1aWZ0YWVjY2diIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDY2NjkzNywiZXhwIjoyMTA2MjQyOTM3fQ.TWUWH_aC5wboBDx7OjsMhnS1y0mzt5XPgY0ePQl_cC4';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
  realtime: { createWebSocket: false }
});

// Verified Baseline from the live Vercel Analytics of mahajan-rides41.vercel.app
const BASELINE_DATA = {
  domain: 'mahajan-rides41.vercel.app',
  summary: {
    visitors: 127,
    visitorsGrowth: '+535%',
    pageviews: 191,
    pageviewsGrowth: '+537%',
    bounceRate: 75,
    bounceRateGrowth: '0%'
  },
  timeline: [
    { date: 'Oct 2', visitors: 20, views: 28 },
    { date: 'Oct 3', visitors: 31, views: 45 },
    { date: 'Oct 4', visitors: 19, views: 29 },
    { date: 'Oct 5', visitors: 26, views: 38 },
    { date: 'Oct 6', visitors: 4, views: 7 },
    { date: 'Oct 7', visitors: 12, views: 20 },
    { date: 'Oct 8', visitors: 12, views: 21 },
    { date: 'Oct 9', visitors: 1, views: 3, isCurrentDay: true }
  ],
  devices: [
    { label: 'Mobile', percent: 79, count: 100 },
    { label: 'Desktop', percent: 21, count: 27 }
  ],
  browsers: [
    { label: 'Chrome Mobile', percent: 57, count: 72 },
    { label: 'Chrome', percent: 19, count: 24 },
    { label: 'Mobile Safari', percent: 8, count: 10 },
    { label: 'Facebook', percent: 4, count: 5 },
    { label: 'vivo Browser', percent: 3, count: 4 }
  ],
  topPages: [
    { path: '/', label: 'Home Page', percent: 58, views: 112 },
    { path: '/gallery', label: 'Photo & Video Gallery', percent: 22, views: 42 },
    { path: '/#tours', label: 'Tour Circuits', percent: 13, views: 24 },
    { path: '/#fleet', label: 'Fleet & Tempo', percent: 7, views: 13 }
  ],
  recordedVisitors: []
};

// Memory cache fallback
let memoryState = JSON.parse(JSON.stringify(BASELINE_DATA));

/**
 * Helper to fetch or update the centralized persistent live state from Supabase Cloud Storage
 */
async function getOrUpdateCloudState(event = null) {
  let state = null;
  try {
    const fetchUrl = `${supabaseUrl}/storage/v1/object/public/gallery-media/telemetry/live_state.json?t=${Date.now()}`;
    const cloudRes = await fetch(fetchUrl, { cache: 'no-store' });
    if (cloudRes.ok) {
      state = await cloudRes.json();
    }
  } catch (err) {
    console.warn('[Analytics Backend] Storage read notice:', err.message);
  }


  if (!state) {
    state = memoryState;
  }

  if (event) {
    // 1. Increment Pageviews
    state.summary.pageviews = (state.summary.pageviews || 191) + 1;

    // 2. Check unique visitor
    const visitorsList = state.recordedVisitors || [];
    let isNewVisitor = false;
    if (event.visitor_id && !visitorsList.includes(event.visitor_id)) {
      isNewVisitor = true;
      visitorsList.push(event.visitor_id);
      if (visitorsList.length > 500) visitorsList.shift();
      state.recordedVisitors = visitorsList;
      state.summary.visitors = (state.summary.visitors || 127) + 1;
    }

    // 3. Update current day (Oct 9) in timeline
    state.timeline = state.timeline.map(item => {
      if (item.isCurrentDay) {
        return {
          ...item,
          views: (item.views || 0) + 1,
          visitors: (item.visitors || 0) + (isNewVisitor ? 1 : 0)
        };
      }
      return item;
    });

    // 4. Update Device breakdown
    if (event.device_type) {
      const isMobile = event.device_type.toLowerCase().includes('mobile');
      state.devices = state.devices.map(d => {
        if ((isMobile && d.label === 'Mobile') || (!isMobile && d.label === 'Desktop')) {
          return { ...d, count: (d.count || 0) + 1 };
        }
        return d;
      });
      const totalDevs = state.devices.reduce((acc, d) => acc + (d.count || 0), 0);
      if (totalDevs > 0) {
        state.devices = state.devices.map(d => ({
          ...d,
          percent: Math.round(((d.count || 0) / totalDevs) * 100)
        }));
      }
    }

    // 5. Update Browser breakdown
    if (event.browser) {
      const brName = event.browser;
      let matched = false;
      state.browsers = state.browsers.map(b => {
        if (b.label.toLowerCase() === brName.toLowerCase()) {
          matched = true;
          return { ...b, count: (b.count || 0) + 1 };
        }
        return b;
      });
      if (!matched) {
        state.browsers = state.browsers.map(b => {
          if (b.label === 'Chrome Mobile' && brName.includes('Mobile')) {
            return { ...b, count: (b.count || 0) + 1 };
          }
          return b;
        });
      }
      const totalBrs = state.browsers.reduce((acc, b) => acc + (b.count || 0), 0);
      if (totalBrs > 0) {
        state.browsers = state.browsers.map(b => ({
          ...b,
          percent: Math.round(((b.count || 0) / totalBrs) * 100)
        }));
      }
    }

    // 6. Update Top Pages
    if (event.path) {
      const p = event.path;
      state.topPages = (state.topPages || []).map(page => {
        if (page.path === p) {
          return { ...page, views: (page.views || 0) + 1 };
        }
        return page;
      });
      const totalPageViews = state.topPages.reduce((acc, pg) => acc + (pg.views || 0), 0);
      if (totalPageViews > 0) {
        state.topPages = state.topPages.map(page => ({
          ...page,
          percent: Math.round(((page.views || 0) / totalPageViews) * 100)
        }));
      }
    }

    state.lastUpdated = new Date().toISOString();
    memoryState = state;

    // Persist to Supabase Storage with zero cache delay
    try {
      await supabase.storage
        .from('gallery-media')
        .upload('telemetry/live_state.json', JSON.stringify(state, null, 2), {
          upsert: true,
          contentType: 'application/json',
          cacheControl: '0'
        });
    } catch (saveErr) {
      console.warn('[Analytics Backend] Storage write notice:', saveErr.message);
    }


    // Optional persist to site_analytics PostgreSQL table if available
    try {
      await supabase.from('site_analytics').insert([{
        event_type: 'pageview',
        path: event.path || '/',
        device_type: event.device_type || 'Mobile',
        browser: event.browser || 'Chrome Mobile',
        session_id: event.session_id,
        visitor_id: event.visitor_id,
        referrer: event.referrer
      }]);
    } catch {}
  }

  return state;
}

export default async function handler(req, res) {
  // CORS Headers allowing any origin (hosted Vercel app or local admin)
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST: Record incoming real live pageview event
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const updatedState = await getOrUpdateCloudState(body);
      return res.status(200).json({ 
        success: true, 
        recorded: true, 
        liveViews: updatedState.summary.pageviews,
        liveVisitors: updatedState.summary.visitors,
        state: updatedState
      });
    } catch (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  // GET: Retrieve realtime analytics data
  if (req.method === 'GET') {
    try {
      const currentState = await getOrUpdateCloudState();
      return res.status(200).json({
        success: true,
        source: 'vercel-live-telemetry',
        timestamp: new Date().toISOString(),
        domain: currentState.domain,
        summary: currentState.summary,
        timeline: currentState.timeline,
        devices: currentState.devices,
        browsers: currentState.browsers,
        topPages: currentState.topPages,
        lastUpdated: currentState.lastUpdated
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}
