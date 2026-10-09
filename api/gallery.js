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
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  realtime: {
    createWebSocket: false
  }
});

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Fetch all active gallery items
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(400).json({ success: false, error: error.message });
      }

      // Exclude legacy website place photos; allow only admin uploads and official vehicle images
      const validItems = (data || []).filter(item => item.media_url && !item.media_url.startsWith('/places/'));
      return res.status(200).json({ success: true, data: validItems });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // POST: Add new gallery item (image or video)
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const { title, media_url, media_type, circuit_category } = body;

      if (!media_url) {
        return res.status(400).json({ success: false, error: 'media_url is required' });
      }

      const payload = {
        title: title ? title.trim() : 'Himachal Mountain Memory',
        media_url: media_url.trim(),
        media_type: media_type === 'video' ? 'video' : 'image',
        circuit_category: circuit_category || 'Himachal Circuits',
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('gallery_items')
        .insert([payload])
        .select();

      if (error) {
        return res.status(400).json({ success: false, error: error.message });
      }

      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // DELETE: Remove gallery item by id
  if (req.method === 'DELETE') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const id = req.query.id || body.id;

      if (!id) {
        return res.status(400).json({ success: false, error: 'Item ID is required for deletion' });
      }

      const { error } = await supabase
        .from('gallery_items')
        .delete()
        .eq('id', id);

      if (error) {
        return res.status(400).json({ success: false, error: error.message });
      }

      return res.status(200).json({ success: true, deletedId: id });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
