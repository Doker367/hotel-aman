/* ============================================================
   AMAN RESORTS - API Service Layer
   Handles all communication with the backend
   ============================================================ */

const API = (() => {
  const BASE_URL = '/api';

  async function request(endpoint, options = {}) {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('aman_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw { status: response.status, ...data };
      }

      return data;
    } catch (err) {
      if (err.status) throw err;
      console.error(`[API] Request failed: ${endpoint}`, err);
      throw { success: false, error: 'Network error. Please check your connection.' };
    }
  }

  return {
    // ── Rooms ──────────────────────────────────
    getRooms: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/rooms${query ? `?${query}` : ''}`);
    },

    getRoom: (idOrSlug) => request(`/rooms/${idOrSlug}`),

    checkAvailability: (roomId, checkIn, checkOut) =>
      request(`/rooms/availability?roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}`),

    // ── Bookings ───────────────────────────────
    createBooking: (data) =>
      request('/bookings', { method: 'POST', body: JSON.stringify(data) }),

    // ── Gallery ────────────────────────────────
    getGallery: (category) => {
      const query = category ? `?category=${category}` : '';
      return request(`/gallery${query}`);
    },

    // ── Services ───────────────────────────────
    getServices: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/services${query ? `?${query}` : ''}`);
    },

    // ── Testimonials ───────────────────────────
    getTestimonials: (featured) => {
      const query = featured ? '?featured=true' : '';
      return request(`/testimonials${query}`);
    },

    // ── Contact ────────────────────────────────
    submitContact: (data) =>
      request('/contact', { method: 'POST', body: JSON.stringify(data) }),

    // ── Auth ───────────────────────────────────
    login: (email, password) =>
      request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

    getProfile: () => request('/auth/profile'),

    // ── Admin ──────────────────────────────────
    getDashboard: () => request('/admin/dashboard'),
    getRecentBookings: () => request('/admin/bookings/recent'),
    getAllBookings: () => request('/bookings'),
    updateBookingStatus: (id, status) =>
      request(`/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    getMessages: () => request('/contact'),
  };
})();
