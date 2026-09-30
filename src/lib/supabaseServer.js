/**
 * Supabase Server-Side Setup
 * Powered by @supabase/server and @supabase/supabase-js
 */
import { createSupabaseContext, withSupabase } from '@supabase/server';
import { createClient } from '@supabase/supabase-js';

// Environment variables for server environment (Node/Vercel/SSR)
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Creates an admin / server Supabase client
 */
export function createServerSupabaseClient(options = {}) {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('[Supabase Server] Warning: Missing SUPABASE_URL or SUPABASE_KEY in environment variables.');
    return null;
  }
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    ...options,
  });
}

/**
 * Creates a scoped Supabase server context for request handling
 */
export function getServerContext(req) {
  if (!supabaseUrl || !supabaseKey) return null;
  try {
    return createSupabaseContext({
      url: supabaseUrl,
      key: supabaseKey,
      req,
    });
  } catch (err) {
    console.error('[Supabase Server] Error creating context:', err);
    return null;
  }
}

/**
 * Helper: Save tour lead or booking inquiry on the server
 */
export async function saveServerBookingInquiry(inquiryData) {
  const client = createServerSupabaseClient();
  if (!client) {
    return { success: false, message: 'Supabase server client not configured' };
  }

  try {
    const { data, error } = await client
      .from('inquiries')
      .insert([
        {
          name: inquiryData.name,
          phone: inquiryData.phone,
          destination: inquiryData.destination,
          pickup_location: inquiryData.pickupLocation,
          travel_date: inquiryData.travelDate,
          group_size: inquiryData.groupSize,
          vehicle_type: inquiryData.vehicleType || '17-Seater Force Tempo Traveller',
          special_notes: inquiryData.specialNotes,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('[Supabase Server] Error saving booking inquiry:', error);
    return { success: false, error: error.message };
  }
}

export { withSupabase, createSupabaseContext };
