import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://kcvnmquwqpuiftaeccgb.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjdm5tcXV3cXB1aWZ0YWVjY2diIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDY2NjkzNywiZXhwIjoyMTA2MjQyOTM3fQ.TWUWH_aC5wboBDx7OjsMhnS1y0mzt5XPgY0ePQl_cC4';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export default async function handler(req, res) {
  // CORS Headers for worldwide access
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // Health check endpoint
    return res.status(200).json({ status: 'ok', service: 'Mahajanride Inquiries API', timestamp: new Date().toISOString() });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    
    const payload = {
      name: body.name || 'Website Visitor',
      phone: body.phone || '',
      destination: body.destination || '',
      pickup_location: body.pickupLocation || body.pickup_location || '',
      travel_date: body.travelDate || body.travel_date || '',
      group_size: body.groupSize || body.group_size || '',
      vehicle_type: body.vehicleType || body.vehicle_type || '17-Seater Force Tempo Traveller',
      special_notes: body.specialNotes || body.special_notes || '',
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('inquiries')
      .insert([payload])
      .select();

    if (error) {
      console.error('[API /inquire] Supabase insert error:', error);
      return res.status(400).json({ success: false, error: error.message });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('[API /inquire] Server exception:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
