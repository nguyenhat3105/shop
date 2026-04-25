import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider }  from './context/CartContext';
import { AuthProvider }  from './context/AuthContext';
import Navbar            from './components/Navbar';
import Footer            from './components/Footer';
import CartModal         from './components/CartModal';
import ToastContainer    from './components/ToastContainer';
import ProtectedRoute    from './components/ProtectedRoute';
import HomePage          from './pages/HomePage';
import ProductDetail     from './pages/ProductDetail';
import CartPage          from './pages/CartPage';
import CategoriesPage    from './pages/CategoriesPage';
import CategoryDetailPage from './pages/CategoryDetailPage';
import OrderHistoryPage  from './pages/OrderHistoryPage';
import AboutPage         from './pages/AboutPage';
import LoginPage         from './pages/LoginPage';
import RegisterPage      from './pages/RegisterPage';
import VerifyEmailPage   from './pages/VerifyEmailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VNPayReturnPage   from './pages/VNPayReturnPage';
import AdminLayout       from './pages/admin/AdminLayout';
import AdminOrders       from './pages/admin/AdminOrders';
import AdminProducts     from './pages/admin/AdminProducts';
import AdminDashboard    from './pages/admin/AdminDashboard';
import './index.css';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/"                element={<HomePage />} />
            <Route path="/products/:id"   element={<ProductDetail />} />
            <Route path="/cart"           element={<CartPage />} />
            <Route path="/categories"     element={<CategoriesPage />} />
            <Route path="/categories/:id" element={<CategoryDetailPage />} />
            <Route path="/about"          element={<AboutPage />} />
            <Route path="/login"          element={<LoginPage />} />
            <Route path="/register"       element={<RegisterPage />} />
            <Route path="/verify-email"   element={<VerifyEmailPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/vnpay-return"   element={<VNPayReturnPage />} />
            <Route 
              path="/orders" 
              element={
                <ProtectedRoute>
                  <OrderHistoryPage />
                </ProtectedRoute>
              } 
            />
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="products" element={<AdminProducts />} />
            </Route>
          </Routes>
          <Footer />
          <CartModal />
          <ToastContainer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
