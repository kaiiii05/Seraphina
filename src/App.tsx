/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Shop from './components/Shop';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderDetail from './components/OrderDetail';
import OrdersList from './components/OrdersList';
import { Terms, Privacy, Delivery } from './components/Legal';
import { Account, Login } from './components/Account';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen selection:bg-luxury-black selection:text-white">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<OrdersList />} />
                <Route path="/orders/:orderId" element={<OrderDetail />} />
                <Route path="/account" element={<Account />} />
                <Route path="/login" element={<Login />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/delivery" element={<Delivery />} />
                {/* Optional About/Contact routes could be added here */}
                <Route path="/about" element={<div className="pt-40 text-center"><h1 className="text-5xl font-serif italic">Our Story</h1><p className="mt-8 text-xs font-light max-w-lg mx-auto opacity-60 px-6">Founded on the principle of absolute harmony between architecture and fashion, Seraphina represents the pinnacle of modern luxury where every thread tells a story of craftsmanship.</p></div>} />
                <Route path="/contact" element={<div className="pt-40 text-center"><h1 className="text-5xl font-serif italic">Contact Us</h1><p className="mt-8 text-xs font-light max-w-lg mx-auto opacity-60 px-6">Our concierges are available to assist you with every detail of your Seraphina experience. reach@seraphina-luxe.com</p></div>} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

