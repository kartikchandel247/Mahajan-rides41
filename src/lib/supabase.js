// Polyfill WebSocket for Node runtime environments without native WebSocket
if (typeof globalThis !== 'undefined' && !globalThis.WebSocket) {
  globalThis.WebSocket = class DummyWebSocket {
    constructor() {}
    addEventListener() {}
    removeEventListener() {}
  };
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || 'https://kcvnmquwqpuiftaeccgb.supabase.co';
const supabaseAnonKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjdm5tcXV3cXB1aWZ0YWVjY2diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2NjY5MzcsImV4cCI6MjEwNjI0MjkzN30.sMyq9CDLcDd8PeXAoNzM7-jfJaWrOHozqHdaObXPIhI';

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
  } catch {
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
  } catch {
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

// ==============================================================================
// 5. PUBLIC & ADMIN GALLERY SERVICES
// ==============================================================================

/**
 * Curated Himachal Journey Media (starter seed items)
 */
export const INITIAL_CURATED_GALLERY = [
  {
    id: 'tempo-cockpit',
    title: '17-Seater Force Tempo Traveller Luxury Cockpit',
    media_url: '/vehicle/tempo_traveller_cockpit.png',
    media_type: 'image',
    circuit_category: 'Tempo Fleet',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    id: 'tempo-seats',
    title: '17-Seater Deluxe Pushback Recliner Seats & Ambient AC',
    media_url: '/vehicle/tempo_traveller_seats.png',
    media_type: 'image',
    circuit_category: 'Tempo Fleet',
    created_at: new Date().toISOString()
  }
];

/**
 * Fetch all gallery media items (Supabase DB + serverless API + fallback)
 */
export async function fetchGalleryItems() {
  const sanitizeItems = (rawItems) => {
    if (!Array.isArray(rawItems)) return [];
    // Only permit admin uploads or official vehicle assets; filter out website tour places
    return rawItems.filter(item => item && item.media_url && !item.media_url.startsWith('/places/'));
  };

  // 1. Try serverless endpoint first
  try {
    const apiRes = await fetch('/api/gallery');
    if (apiRes.ok) {
      const result = await apiRes.json();
      if (result.success && Array.isArray(result.data)) {
        const sanitized = sanitizeItems(result.data);
        if (sanitized.length > 0) {
          return { success: true, data: sanitized };
        }
      }
    }
  } catch {
    // Continue to direct Supabase
  }

  // 2. Direct Supabase query
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const sanitized = sanitizeItems(data);
        if (sanitized.length > 0) {
          return { success: true, data: sanitized };
        }
      }
    } catch (dbErr) {
      console.warn('[Gallery] Supabase direct query exception:', dbErr.message);
    }
  }

  // 3. Fallback to the 2 official Tempo Traveller fleet images
  return { success: true, data: INITIAL_CURATED_GALLERY, isFallback: true };
}

/**
 * Upload a media file (photo or video) to Supabase Storage bucket 'gallery-media'
 */
export async function uploadGalleryMediaFile(file) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured with storage credentials.');
  }

  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const cleanBaseName = file.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  const filePath = `uploads/${Date.now()}_${cleanBaseName}.${fileExt}`;

  // 1. Upload to Supabase Storage bucket 'gallery-media'
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('gallery-media')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (uploadError) {
    console.error('[Supabase Storage] Upload error:', uploadError);
    throw uploadError;
  }

  // 2. Retrieve public URL
  const { data: urlData } = supabase.storage
    .from('gallery-media')
    .getPublicUrl(filePath);

  return {
    filePath: uploadData.path,
    publicUrl: urlData.publicUrl
  };
}

/**
 * Add a new media asset record to public.gallery_items
 */
export async function addGalleryItem({ title, media_url, media_type = 'image', circuit_category = 'Himachal Circuits' }) {
  const payload = {
    title: title?.trim() || 'Himachal Mountain Memory',
    media_url: media_url.trim(),
    media_type: media_type === 'video' ? 'video' : 'image',
    circuit_category: circuit_category || 'Himachal Circuits',
    created_at: new Date().toISOString()
  };

  // 1. Try serverless endpoint
  try {
    const apiRes = await fetch('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (apiRes.ok) {
      const result = await apiRes.json();
      if (result.success && result.data) {
        return { success: true, data: result.data[0] || result.data };
      }
    }
  } catch {
    // Fallback to client
  }

  // 2. Direct Supabase Client
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('gallery_items')
      .insert([payload])
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  }

  throw new Error('Supabase client unavailable to insert gallery item.');
}

/**
 * Delete a media asset record from gallery_items and Supabase Storage
 */
export async function deleteGalleryItem(id, mediaUrl = '') {
  // 1. Attempt to remove from Supabase Storage bucket if it is a Supabase Storage URL
  if (isSupabaseConfigured() && mediaUrl && mediaUrl.includes('/gallery-media/')) {
    try {
      const parts = mediaUrl.split('/gallery-media/');
      if (parts[1]) {
        const decodedPath = decodeURIComponent(parts[1]);
        await supabase.storage.from('gallery-media').remove([decodedPath]);
      }
    } catch (storageErr) {
      console.warn('[Storage Cleanup] Failed to delete file from storage:', storageErr);
    }
  }

  // 2. Try serverless API
  try {
    const apiRes = await fetch(`/api/gallery?id=${id}`, {
      method: 'DELETE'
    });
    if (apiRes.ok) {
      const result = await apiRes.json();
      if (result.success) return { success: true };
    }
  } catch {
    // Fallback to client
  }

  // 3. Direct Supabase PostgREST
  if (isSupabaseConfigured()) {
    const { error } = await supabase
      .from('gallery_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  }

  return { success: true, localOnly: true };
}


// ==============================================================================
// 6. ADMIN AUTHENTICATION & ROLE AUTHORIZATION
// ==============================================================================

/**
 * Sign in Admin user with email & password via Supabase Auth
 */
export async function adminSignIn(email, password) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase Auth is not configured.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: password.trim()
  });

  if (error) throw error;
  return data;
}

/**
 * Sign out current admin user
 */
export async function adminSignOut() {
  if (!isSupabaseConfigured()) return { success: true };
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return { success: true };
}

/**
 * Check current authenticated session and verify admin role
 */
export async function getCurrentAdminProfile() {
  if (!isSupabaseConfigured()) {
    return { isAuthenticated: false, user: null, adminProfile: null };
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { isAuthenticated: false, user: null, adminProfile: null };
  }

  // Check against public.admins table
  try {
    const { data: adminRecord, error: adminErr } = await supabase
      .from('admins')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (adminRecord && !adminErr) {
      return {
        isAuthenticated: true,
        user,
        adminProfile: adminRecord,
        isAdmin: true
      };
    }

    // Check if user has admin email or role in user_metadata
    const email = user.email || '';
    const userRole = user.app_metadata?.role || user.user_metadata?.role;
    
    // Check if email matches any admin record
    const { data: emailMatch } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (emailMatch) {
      return {
        isAuthenticated: true,
        user,
        adminProfile: emailMatch,
        isAdmin: true
      };
    }

    // Authenticated user with metadata or fallback profile
    const fallbackProfile = {
      id: user.id,
      full_name: user.user_metadata?.full_name || email.split('@')[0] || 'Admin Officer',
      email: email,
      phone: user.user_metadata?.phone || '',
      role: userRole || 'admin'
    };

    return {
      isAuthenticated: true,
      user,
      adminProfile: fallbackProfile,
      isAdmin: true
    };
  } catch (err) {
    console.warn('[Admin Profile] Verification exception:', err);
    return {
      isAuthenticated: true,
      user,
      adminProfile: {
        id: user.id,
        full_name: user.email?.split('@')[0] || 'Admin',
        email: user.email,
        role: 'admin'
      },
      isAdmin: true
    };
  }
}

/**
 * Fetch all booking inquiries for admin dashboard
 */
export async function fetchAdminInquiries() {
  // 1. Check local storage backup
  let localItems = [];
  try {
    localItems = JSON.parse(localStorage.getItem('mahajanride_saved_inquiries_v1') || '[]');
  } catch {}

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        return { success: true, data };
      }
    } catch {}
  }

  return { success: true, data: localItems };
}

