import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kcvnmquwqpuiftaeccgb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjdm5tcXV3cXB1aWZ0YWVjY2diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2NjY5MzcsImV4cCI6MjEwNjI0MjkzN30.sMyq9CDLcDd8PeXAoNzM7-jfJaWrOHozqHdaObXPIhI';

// Create a single supabase client for interacting with your database
export const supabase = (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project'))
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

/**
 * Check whether Supabase is configured with environment variables or active defaults
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
 * Client helper to log booking inquiries / quote requests with multi-tier autosave
 * 1. LocalStorage instantaneous backup
 * 2. Vercel Serverless Function (/api/inquire) with service role permissions
 * 3. Direct Supabase PostgREST insert fallback
 */
export async function saveClientInquiry(inquiryData) {
  // 1. Instant local autosave to prevent any data loss
  try {
    const localStoreKey = 'mahajanride_saved_inquiries_v1';
    const existing = JSON.parse(localStorage.getItem(localStoreKey) || '[]');
    existing.unshift({
      ...inquiryData,
      local_id: 'inq_' + Date.now(),
      created_at: new Date().toISOString()
    });
    localStorage.setItem(localStoreKey, JSON.stringify(existing.slice(0, 50)));
  } catch (storageErr) {
    console.warn('[Autosave] LocalStorage write error:', storageErr);
  }

  // 2. High-reliability Vercel Serverless Endpoint
  try {
    const apiRes = await fetch('/api/inquire', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inquiryData),
    });

    if (apiRes.ok) {
      const result = await apiRes.json();
      if (result.success) {
        console.log('[Autosave] Inquiry saved to cloud database via Serverless API:', result.data);
        return { success: true, data: result.data };
      }
    }
  } catch (apiErr) {
    console.warn('[Autosave] /api/inquire unavailable, using fallback:', apiErr.message);
  }

  // 3. Direct client Supabase fallback
  if (isSupabaseConfigured()) {
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

      if (!error) {
        return { success: true, data };
      }
      console.warn('[Autosave] Direct client write error:', error.message);
    } catch (err) {
      console.warn('[Autosave] Direct client exception:', err.message);
    }
  }

  return { success: true, localSaved: true };
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
 * Fetch permanently saved passenger reviews from Serverless API / Supabase
 */
export async function fetchCustomerReviews() {
  // 1. Try serverless endpoint
  try {
    const apiRes = await fetch('/api/reviews');
    if (apiRes.ok) {
      const result = await apiRes.json();
      if (result.success && Array.isArray(result.data)) {
        const parsed = result.data.map(parseReviewPayload);
        return { success: true, data: parsed };
      }
    }
  } catch (_e) {
    // Continue to direct Supabase client
  }

  // 2. Direct Supabase client
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
 * Permanently save a new client/passenger review to Serverless API / Supabase
 */
export async function saveCustomerReview(reviewData) {
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

  // 1. Try serverless endpoint
  try {
    const apiRes = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(insertPayload)
    });

    if (apiRes.ok) {
      const result = await apiRes.json();
      if (result.success && result.data) {
        const parsedReturn = result.data.map(parseReviewPayload);
        return { success: true, data: parsedReturn };
      }
    }
  } catch (_e) {
    // Continue to direct Supabase client
  }

  // 2. Fallback to direct client
  if (!isSupabaseConfigured()) {
    return { success: false, skipped: true };
  }

  try {
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
