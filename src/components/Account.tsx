/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../data';
import {
  listOrders,
  getOrderLifecycle,
  ORDER_LIFECYCLE_TABS,
  ORDER_LIFECYCLE_LABEL,
  type OrderLifecycle
} from '../orderStorage';
import { formatPeso } from '../utils/formatPeso';
import type { Product } from '../context/CartContext';
import { LogOut, Package, Settings, ChevronRight } from 'lucide-react';

type LoginLocationState = {
  redirectTo?: string;
  fromBuyNow?: boolean;
};

const BUY_NOW_STORAGE_KEY = 'seraphina_buy_now_pending';

function applyBuyNowPending(
  redirectTo: string,
  fromBuyNow: boolean | undefined,
  clearCart: () => void,
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void
) {
  const raw = sessionStorage.getItem(BUY_NOW_STORAGE_KEY);
  sessionStorage.removeItem(BUY_NOW_STORAGE_KEY);
  if (!raw || !fromBuyNow || redirectTo !== '/checkout') return;

  try {
    const pending = JSON.parse(raw) as {
      productId: string;
      quantity: number;
      selectedSize?: string;
      selectedColor?: string;
    };
    const p = PRODUCTS.find((x) => x.id === pending.productId);
    if (!p) return;

    const colorMeta = p.variants?.colors?.find((c) => c.name === pending.selectedColor);
    const imagesForLine = colorMeta?.image
      ? [colorMeta.image, ...p.images.filter((i) => i !== colorMeta.image)]
      : p.images;
    clearCart();
    addToCart(
      { ...p, images: imagesForLine },
      Math.max(1, Number(pending.quantity) || 1),
      pending.selectedSize,
      pending.selectedColor
    );
  } catch {
    /* ignore malformed payload */
  }
}

export function Login() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, register } = useAuth();
  const { clearCart, addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const loginState = location.state as LoginLocationState | null;
  const redirectTo =
    loginState?.redirectTo ?? (location.pathname === '/account' ? '/account' : '/shop');

  useEffect(() => {
    if (!loginState?.fromBuyNow) {
      sessionStorage.removeItem(BUY_NOW_STORAGE_KEY);
    }
  }, [loginState]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signup') {
      register(name, email, password);
    } else {
      login(email, password);
    }
    applyBuyNowPending(redirectTo, loginState?.fromBuyNow, clearCart, addToCart);
    navigate(redirectTo);
  };

  return (
    <div className="pt-40 min-h-screen flex flex-col items-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-12 text-center"
      >
        <div className="space-y-4">
          <h1 className="text-5xl font-serif">{mode === 'signup' ? 'Create Account' : 'Sign In'}</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] opacity-40 font-bold">
            {mode === 'signup' ? 'Join the Seraphina House' : 'Access your Seraphina Profile'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 text-left">
          {mode === 'signup' && (
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-40">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-luxury-neutral/40 border-b border-luxury-border py-4 px-0 text-sm focus:outline-none focus:border-luxury-black transition-all placeholder:opacity-20 font-light"
                placeholder="Enter your name"
              />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-40">Email Address</label>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-luxury-neutral/40 border-b border-luxury-border py-4 px-0 text-sm focus:outline-none focus:border-luxury-black transition-all placeholder:opacity-20 font-light"
              placeholder="Enter your email"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-40">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-luxury-neutral/40 border-b border-luxury-border py-4 px-0 text-sm focus:outline-none focus:border-luxury-black transition-all placeholder:opacity-20 font-light"
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="w-full btn-luxury">
            {mode === 'signup' ? 'Create Account' : 'Continue'}
          </button>
        </form>

        <div className="pt-8 border-t border-luxury-border">
          <p className="text-[10px] opacity-40 uppercase tracking-widest leading-loose">
            {mode === 'signup' ? 'Already have an account?' : 'New to Seraphina?'} <br />
            <button
              type="button"
              onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
              className="text-luxury-black font-bold hover:underline underline-offset-4"
            >
              {mode === 'signup' ? 'Sign In' : 'Create an Account'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const orders = useMemo(() => listOrders(), [location.key]);
  const [activeLifecycle, setActiveLifecycle] = useState<OrderLifecycle>('to_pay');

  if (!user) {
    return <Login />;
  }

  const filteredOrders = orders.filter((o) => getOrderLifecycle(o) === activeLifecycle);

  return (
    <div className="pt-40 min-h-screen pb-40 px-6 md:px-12 max-w-[1200px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-serif italic">Bonjour, {user.name}</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] opacity-40 font-bold">Member Since {user.memberSince}</p>
        </div>
        <button 
          onClick={() => { logout(); navigate('/'); }}
          className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold opacity-40 hover:opacity-100 transition-opacity"
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Sidebar Nav */}
        <div className="lg:col-span-4 space-y-2">
          <AccountNavLink icon={<Package size={16} />} label="Orders" active />
          <AccountNavLink icon={<Settings size={16} />} label="Account Settings" />
        </div>

        {/* Content */}
        <div className="lg:col-span-8 space-y-12">
          <section className="space-y-8">
            <h2 className="text-xl font-serif">Orders</h2>
            {orders.length === 0 ? (
              <div className="border border-luxury-border bg-luxury-off-white p-10 text-center space-y-6">
                <p className="text-sm font-light text-luxury-black/60 leading-relaxed max-w-md mx-auto">
                  You have no orders yet. When you complete a purchase, it will appear here.
                </p>
                <Link to="/shop" className="inline-block btn-luxury-outline text-[10px] uppercase tracking-widest">
                  Browse the collection
                </Link>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap gap-x-1 gap-y-2 border-b border-luxury-border pb-1">
                  {ORDER_LIFECYCLE_TABS.map((tab) => {
                    const count = orders.filter((o) => getOrderLifecycle(o) === tab).length;
                    const active = activeLifecycle === tab;
                    return (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveLifecycle(tab)}
                        className={`px-3 sm:px-4 py-2.5 text-[9px] sm:text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.2em] font-bold transition-colors border-b-2 -mb-px ${
                          active
                            ? 'border-luxury-black text-luxury-black'
                            : 'border-transparent text-luxury-black/45 hover:text-luxury-black/70'
                        }`}
                      >
                        {ORDER_LIFECYCLE_LABEL[tab]}
                        <span className={`ml-1.5 tabular-nums ${active ? 'opacity-70' : 'opacity-40'}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] font-light text-luxury-black/45 leading-relaxed -mt-2">
                  Orders advance by schedule: Cash on Delivery stays in To Pay through day 1; then To Ship, To Receive
                  through your delivery window, and To Rate after the expected delivery date has passed.
                </p>
                {filteredOrders.length === 0 ? (
                  <div className="border border-luxury-border bg-luxury-off-white p-10 text-center">
                    <p className="text-sm font-light text-luxury-black/55">
                      No orders in {ORDER_LIFECYCLE_LABEL[activeLifecycle]}.
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {filteredOrders.map((o) => {
                      const life = getOrderLifecycle(o);
                      return (
                        <li key={o.id}>
                          <Link
                            to={`/orders/${o.id}`}
                            className="group flex justify-between gap-6 border border-luxury-border bg-white p-6 hover:border-luxury-black/40 transition-colors"
                          >
                            <div className="space-y-2 min-w-0">
                              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-luxury-gold">
                                {ORDER_LIFECYCLE_LABEL[life]}
                              </p>
                              <p className="text-sm font-serif truncate">
                                {o.lines
                                  .map((l) => l.name)
                                  .filter((n, i, a) => a.indexOf(n) === i)
                                  .join(' · ')}
                              </p>
                              <p className="text-[10px] uppercase tracking-widest opacity-40">
                                {o.id} ·{' '}
                                {new Date(o.placedAt).toLocaleString(undefined, {
                                  dateStyle: 'medium',
                                  timeStyle: 'short'
                                })}
                              </p>
                            </div>
                            <div className="flex items-center gap-6 shrink-0">
                              <div className="text-right">
                                <p className="text-xs font-semibold">{formatPeso(o.total)}</p>
                                <p className="text-[10px] uppercase tracking-widest opacity-45 mt-1">
                                  {ORDER_LIFECYCLE_LABEL[life]}
                                </p>
                              </div>
                              <ChevronRight
                                size={18}
                                className="opacity-25 group-hover:opacity-70 transition-opacity"
                              />
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </>
            )}
          </section>

          <section className="pt-12 border-t border-luxury-border grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold">Profile</h3>
              <p className="text-xs font-light leading-relaxed opacity-60">
                {user.name}
                <br />
                {user.email}
              </p>
              <p className="text-[10px] font-light opacity-40 italic">Phone and preferences can be added at checkout.</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold">Shipping address</h3>
              <p className="text-xs font-light leading-relaxed opacity-60">
                No saved address yet. Your delivery details are collected when you place an order.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function AccountNavLink({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center justify-between p-4 text-[10px] uppercase tracking-widest font-bold transition-all ${
      active ? 'bg-luxury-black text-white' : 'hover:bg-luxury-neutral opacity-60 hover:opacity-100'
    }`}>
      <div className="flex items-center gap-4">
        {icon}
        {label}
      </div>
      <ChevronRight size={14} className={active ? 'opacity-40' : 'opacity-0'} />
    </button>
  );
}
