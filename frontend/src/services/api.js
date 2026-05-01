import axios from 'axios';

const API_BASE = '/api';

// ── Axios instance với auth interceptor ───────────────────────
const api = axios.create({ baseURL: API_BASE });

// Gắn access token vào mọi request
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('accessToken');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Auto-refresh khi nhận 401
api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
          localStorage.setItem('accessToken',  data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          original.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(original);
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(err);
  }
);

// ── AUTH ──────────────────────────────────────────────────────
export const register   = (data)  => axios.post(`${API_BASE}/auth/register`, data);
export const login      = (data)  => axios.post(`${API_BASE}/auth/login`, data);
export const loginWithGoogle = (token) => axios.post(`${API_BASE}/auth/google`, { token });
export const logout     = ()      => api.post(`/auth/logout`);
export const verifyEmail= (token) => axios.get(`${API_BASE}/auth/verify`, { params: { token } });
export const forgotPassword = (email) => axios.post(`${API_BASE}/auth/forgot-password`, { email });
export const resetPassword  = (token, newPassword) => axios.post(`${API_BASE}/auth/reset-password`, { token, newPassword });
export const getMe      = ()      => api.get(`/auth/me`);
export const refreshToken = (rt)  => axios.post(`${API_BASE}/auth/refresh`, { refreshToken: rt });

// ── PRODUCT ──────────────────────────────────────────────────
export const getProducts = (page = 0, size = 12, sortBy = 'id', direction = 'asc') =>
  api.get('/products', { params: { page, size, sortBy, direction } });

export const getProductById = (id) => api.get(`/products/${id}`);

export const searchProducts = (keyword, page = 0, size = 12) =>
  api.get('/products/search', { params: { keyword, page, size } });

export const getRelatedProducts = (categoryId, excludeId) => 
  api.get(`/products/category/${categoryId}/related`, { params: { excludeId } });

export const getReviews = (id, page = 0, size = 10) => api.get(`/products/${id}/reviews`, { params: { page, size } });
export const addReview  = (id, data) => api.post(`/products/${id}/reviews`, data);

export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// ── PRODUCT VARIANTS ──────────────────────────────────────────
export const getProductVariants = (productId) => api.get(`/products/${productId}/variants`);
export const addProductVariant  = (productId, data) => api.post(`/products/${productId}/variants`, data);
export const deleteProductVariant = (productId, variantId) => api.delete(`/products/${productId}/variants/${variantId}`);

// ── CATEGORY ─────────────────────────────────────────────────
export const getCategories   = ()   => api.get('/categories');
export const getCategoryById = (id) => api.get(`/categories/${id}`);

// ── COUPON ───────────────────────────────────────────────────
export const validateCoupon = (code, orderValue) => api.get('/coupons/validate', { params: { code, orderValue } });

// ── ORDER ────────────────────────────────────────────────────
export const createOrder     = (data) => api.post('/orders', data);
export const getOrderById    = (id)   => api.get(`/orders/${id}`);
export const getOrdersByEmail= (email, page = 0, size = 10)=> api.get('/orders', { params: { email, page, size } });
export const getAllOrders    = (page = 0, size = 10) => api.get('/orders/all', { params: { page, size } });
export const updateOrderStatus = (id, status) => api.patch(`/orders/${id}/status`, { status });

// ── PAYMENT ──────────────────────────────────────────────────
export const createPaymentUrl = (orderId) => api.get('/payment/create-url', { params: { orderId } });

// ── ADMIN ────────────────────────────────────────────────────
export const getAnalytics = () => api.get('/admin/analytics');

// ── WISHLIST ─────────────────────────────────────────────────
export const getWishlist    = ()   => api.get('/wishlist');
export const addToWishlist = (id) => api.post(`/wishlist/${id}`);
export const removeFromWishlist = (id) => api.delete(`/wishlist/${id}`);
export const checkInWishlist = (id) => api.get(`/wishlist/check/${id}`);

export default api;

