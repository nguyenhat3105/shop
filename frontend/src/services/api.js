import axios from 'axios';

const API_BASE = '/api';

// ── Axios instance với auth interceptor ───────────────────────
const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('accessToken');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

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
          // Refresh token cũng hết hạn — xóa toàn bộ và về trang login
          clearAuthAndRedirect();
          return Promise.reject(err);
        }
      } else {
        // Không có refresh token — xóa và về login
        clearAuthAndRedirect();
        return Promise.reject(err);
      }
    }
    return Promise.reject(err);
  }
);

function clearAuthAndRedirect() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  // Hiển thị thông báo trước khi redirect
  if (window.location.pathname !== '/login') {
    sessionStorage.setItem('sessionExpiredMsg', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    window.location.href = '/login';
  }
}

// ── AUTH ──────────────────────────────────────────────────────
export const register        = (data)  => axios.post(`${API_BASE}/auth/register`, data);
export const login           = (data)  => axios.post(`${API_BASE}/auth/login`, data);
export const loginWithGoogle = (token) => axios.post(`${API_BASE}/auth/google`, { token });
export const logout          = ()      => api.post(`/auth/logout`);
export const verifyEmail     = (token) => axios.get(`${API_BASE}/auth/verify`, { params: { token } });
export const forgotPassword  = (email) => axios.post(`${API_BASE}/auth/forgot-password`, { email });
export const resetPassword   = (token, newPassword) => axios.post(`${API_BASE}/auth/reset-password`, { token, newPassword });
export const getMe           = ()      => api.get(`/auth/me`);
export const refreshToken    = (rt)    => axios.post(`${API_BASE}/auth/refresh`, { refreshToken: rt });

// ── PRODUCT ──────────────────────────────────────────────────
export const getProducts = (page = 0, size = 12, sortBy = 'id', direction = 'asc') =>
  api.get('/products', { params: { page, size, sortBy, direction } });

export const getProductById = (id) => api.get(`/products/${id}`);

export const searchProducts = (keyword, page = 0, size = 12) =>
  api.get('/products/search', { params: { keyword, page, size } });

export const getRelatedProducts = (categoryId, excludeId) =>
  api.get(`/products/category/${categoryId}/related`, { params: { excludeId } });

export const getReviews = (id, page = 0, size = 10) =>
  api.get(`/products/${id}/reviews`, { params: { page, size } });
export const addReview = (id, data) => api.post(`/products/${id}/reviews`, data);

export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// ── FLASH SALE ────────────────────────────────────────────────
export const getFlashSaleProducts = () => api.get('/products/flash-sale');

// ── FREQUENTLY BOUGHT TOGETHER ────────────────────────────────
export const getFrequentlyBoughtTogether = (productId, limit = 4) =>
  api.get(`/products/${productId}/frequently-bought-together`, { params: { limit } });

// ── BATCH FETCH (recently viewed) ─────────────────────────────
export const getProductsByIds = (ids) => api.post('/products/batch', ids);

// ── PRODUCT VARIANTS ──────────────────────────────────────────
export const getProductVariants   = (productId) => api.get(`/products/${productId}/variants`);
export const addProductVariant    = (productId, data) => api.post(`/products/${productId}/variants`, data);
export const deleteProductVariant = (productId, variantId) =>
  api.delete(`/products/${productId}/variants/${variantId}`);

// ── CATEGORY ─────────────────────────────────────────────────
export const getCategories   = () => api.get('/categories');
export const getCategoryById = (id) => api.get(`/categories/${id}`);

// ── COUPON ───────────────────────────────────────────────────
export const validateCoupon = (code, orderValue) =>
  api.get('/coupons/validate', { params: { code, orderValue } });

// ── ORDER ────────────────────────────────────────────────────
export const createOrder       = (data) => api.post('/orders', data);
export const getOrderById      = (id)   => api.get(`/orders/${id}`);
export const getOrdersByEmail  = (email, page = 0, size = 10) =>
  api.get('/orders', { params: { email, page, size } });
export const getAllOrders       = (page = 0, size = 10) =>
  api.get('/orders/all', { params: { page, size } });
export const updateOrderStatus = (id, status) =>
  api.patch(`/orders/${id}/status`, { status });

// ── PAYMENT ──────────────────────────────────────────────────
export const createPaymentUrl = (orderId) => api.get('/payment/create-url', { params: { orderId } });

// ── LOYALTY POINTS ───────────────────────────────────────────
export const getLoyaltyBalance  = ()                 => api.get('/loyalty/balance');
export const getLoyaltyHistory  = (page = 0, size = 10) =>
  api.get('/loyalty/history', { params: { page, size } });
export const redeemLoyaltyPoints = (points)          => api.post('/loyalty/redeem', { points });

// ── SHIPPING ─────────────────────────────────────────────────
export const calculateShipping = (province) =>
  api.post('/shipping/calculate', { province });

// ── ADMIN ANALYTICS ──────────────────────────────────────────
export const getAnalytics     = ()               => api.get('/admin/analytics');
export const getDailyRevenue  = (days = 30)      => api.get('/admin/analytics/daily', { params: { days } });
export const getTopProducts   = (limit = 5)      => api.get('/admin/analytics/top-products', { params: { limit } });
export const getOrderStatus   = ()               => api.get('/admin/analytics/order-status');

// ── ADMIN INVENTORY ───────────────────────────────────────────
export const getInventory     = ()               => api.get('/admin/inventory');
export const getLowStock      = ()               => api.get('/admin/inventory/low-stock');
export const updateStock      = (id, stock)      => api.patch(`/admin/inventory/${id}`, { stock });

// ── ADMIN EXPORT ─────────────────────────────────────────────
export const exportOrders     = (from, to)       =>
  api.get('/admin/export/orders', { params: { from, to }, responseType: 'blob' });
export const exportInventory  = ()               =>
  api.get('/admin/export/inventory', { responseType: 'blob' });

export default api;
