/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const { cartCount } = useCart();
  const { user } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Shop', path: '/shop' },
    { name: 'Promotions', path: '/shop?promo=active' },
    { name: 'Story', path: '/about' },
  ];

  const navOnLightBg = isScrolled || isMobileMenuOpen;
  const homeAtTop = location.pathname === '/' && !navOnLightBg;

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-700 h-16 border-b flex items-center shrink-0',
        navOnLightBg
          ? 'bg-white border-luxury-border shadow-sm'
          : homeAtTop
            ? 'bg-white/80 backdrop-blur-md border-luxury-border/40'
            : 'bg-white/95 backdrop-blur-sm border-luxury-border/30'
      )}
    >
      <div className="w-full px-4 sm:px-6 md:px-10 flex items-center justify-between h-full">
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden transition-colors text-luxury-black opacity-80 hover:opacity-100"
          id="mobile-menu-toggle"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Desktop Left Links */}
        <div className="hidden md:flex items-center gap-8 text-[11px] tracking-[0.2em] uppercase font-medium text-luxury-black">
          {navLinks.slice(0, 3).map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                'hover:opacity-50 transition-all border-b pb-1',
                location.pathname + location.search === link.path
                  ? 'font-bold border-luxury-black'
                  : 'border-transparent'
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Logo */}
        <Link
          to="/"
          className="absolute left-1/2 -translate-x-1/2 text-sm sm:text-xl md:text-2xl tracking-[0.18em] sm:tracking-[0.3em] font-serif font-light mb-1 uppercase text-luxury-black transition-colors whitespace-nowrap"
        >
          S E R A P H I N A
        </Link>

        {/* Desktop Right Links / Icons */}
        <div className="flex gap-3 sm:gap-6 md:gap-8 text-[10px] sm:text-[11px] tracking-[0.16em] sm:tracking-[0.2em] uppercase font-medium items-center text-luxury-black">
          <button className="hover:opacity-50 transition-opacity hidden md:block uppercase tracking-[0.2em]" id="nav-search">
            Search
          </button>
          <Link 
            to={user ? "/account" : "/login"} 
            className="hover:opacity-50 transition-opacity hidden sm:block uppercase tracking-[0.2em]" 
            id="nav-user"
          >
            Account
          </Link>
          <Link to="/cart" className="hover:opacity-50 transition-opacity relative flex items-center gap-1 uppercase tracking-[0.16em] sm:tracking-[0.2em]" id="nav-cart">
            Cart {cartCount > 0 && `(${cartCount})`}
          </Link>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 w-full bg-white border-b border-luxury-black/10 py-10 px-8 flex flex-col gap-6"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-serif tracking-widest uppercase border-b border-luxury-black/5 pb-2"
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
