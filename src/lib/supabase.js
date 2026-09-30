import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a single supabase client for interacting with your database
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

/**
 * Check whether Supabase is configured with environment variables
 */
export function isSupabaseConfigured() {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    !supabaseUrl.includes('your-project') &&
    supabase
  );
}

/**
 * Client helper to log booking inquiries / quote requests
 */
export async function saveClientInquiry(inquiryData) {
  if (!isSupabaseConfigured()) {
    console.log('[Supabase Client] Skipping database write (credentials not set in .env)');
    return { success: false, skipped: true };
  }

  try {
    const { data, error } = await supabase
      .from('inquiries')
      .insert([
        {
          name: inquiryData.name || 'Anonymous Traveler',
          phone: inquiryData.phone || '',
          destination: inquiryData.destination || '',
          pickup_location: inquiryData.pickupLocation || '',
          travel_date: inquiryData.travelDate || '',
          group_size: inquiryData.groupSize || '',
          vehicle_type: inquiryData.vehicleType || '17-Seater Force Tempo Traveller',
          special_notes: inquiryData.specialNotes || '',
          created_at: new Date().toISOString(),
        }
      ]);

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('[Supabase Client] Failed to save inquiry:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Parse review item from Supabase database to extract optional photo
 */
export function parseReviewPayload(item) {
  if (!item) return item;
  let photo = item.photo_url || item.photo || null;
  let cleanComment = item.comment || '';

  if (!photo && cleanComment.startsWith('__PHOTO__:')) {
    const endIdx = cleanComment.indexOf('__\n');
    if (endIdx !== -1) {
      photo = cleanComment.substring(10, endIdx);
      cleanComment = cleanComment.substring(endIdx + 3);
    }
  }

  return {
    ...item,
    photo,
    comment: cleanComment
  };
}

/**
 * Fetch permanently saved passenger reviews from Supabase
 */
export async function fetchCustomerReviews() {
  if (!isSupabaseConfigured()) {
    return { success: false, data: [] };
  }

  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    const parsedData = (data || []).map(parseReviewPayload);
    return { success: true, data: parsedData };
  } catch (err) {
    console.warn('[Supabase Client] Could not fetch reviews:', err.message);
    return { success: false, data: [] };
  }
}

/**
 * Permanently save a new client/passenger review to Supabase
 */
export async function saveCustomerReview(reviewData) {
  if (!isSupabaseConfigured()) {
    console.log('[Supabase Client] Skipping review write (Supabase not configured)');
    return { success: false, skipped: true };
  }

  try {
    const rawComment = reviewData.quote?.trim() || reviewData.comment?.trim() || '';
    const finalComment = reviewData.photo 
      ? `__PHOTO__:${reviewData.photo}__\n${rawComment}` 
      : rawComment;

    const insertPayload = {
      name: reviewData.name.trim(),
      city: reviewData.city?.trim() || 'Himachal Passenger',
      tour: reviewData.tour || 'Custom Himachal Round Trip',
      rating: Number(reviewData.rating) || 5,
      comment: finalComment,
      verified: true,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('reviews')
      .insert([insertPayload])
      .select();

    if (error) throw error;
    const parsedReturn = (data || []).map(parseReviewPayload);
    return { success: true, data: parsedReturn };
  } catch (err) {
    console.error('[Supabase Client] Failed to save review:', err);
    return { success: false, error: err.message };
  }
}
