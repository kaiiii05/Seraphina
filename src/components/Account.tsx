/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatPeso } from '../utils/formatPeso';
import { LogOut, Package, Settings, CreditCard, ChevronRight } from 'lucide-react';

export function Login() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.redirectTo ?? '/account';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signup') {
      register(name, email, password);
    } else {
      login(email, password);
    }
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

  if (!user) {
    return <Login />;
  }

  const mockOrders = [
    { id: 'SR-9921', date: 'Oct 12, 2025', total: 268800, status: 'Delivered' },
    { id: 'SR-8812', date: 'Sep 04, 2025', total: 156800, status: 'Processing' }
  ];

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
          <AccountNavLink icon={<Package size={16} />} label="Order History" active />
          <AccountNavLink icon={<CreditCard size={16} />} label="Payment Methods" />
          <AccountNavLink icon={<Settings size={16} />} label="Account Settings" />
        </div>

        {/* Content */}
        <div className="lg:col-span-8 space-y-12">
          <section className="space-y-8">
            <h2 className="text-xl font-serif">Recent Purchases</h2>
            <div className="space-y-4">
              {mockOrders.map(order => (
                <div key={order.id} className="border border-luxury-border p-6 flex justify-between items-center bg-luxury-off-white group hover:border-luxury-black transition-colors cursor-pointer">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest">{order.id}</p>
                    <p className="text-xs font-light opacity-50">{order.date}</p>
                  </div>
                  <div className="flex items-center gap-12">
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatPeso(order.total)}</p>
                      <p className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">{order.status}</p>
                    </div>
                    <ChevronRight size={16} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="pt-12 border-t border-luxury-border grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold">Personal Presence</h3>
              <p className="text-xs font-light leading-relaxed opacity-60">
                {user.name} <br />
                {user.email} <br />
                +1 (555) 012-3456
              </p>
              <button className="text-[10px] underline underline-offset-4 opacity-40 hover:opacity-100 font-bold uppercase tracking-widest transition-opacity">Edit Info</button>
            </div>
            <div className="space-y-4">
              <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold">Primary Residence</h3>
              <p className="text-xs font-light leading-relaxed opacity-60">
                1240 Park Avenue <br />
                New York, NY 10128 <br />
                United States
              </p>
              <button className="text-[10px] underline underline-offset-4 opacity-40 hover:opacity-100 font-bold uppercase tracking-widest transition-opacity">Manage Addresses</button>
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
