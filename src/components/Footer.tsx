/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-luxury-border mt-20">
      <div className="w-full px-6 md:px-10 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8">Navigation</h4>
            <ul className="space-y-4">
              <li><Link to="/shop" className="text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">Shop</Link></li>
            </ul>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8">Client Service</h4>
            <ul className="space-y-4">
              <li><Link to="/contact" className="text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">Contact Us</Link></li>
              <li><Link to="/delivery" className="text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">Delivery & Returns</Link></li>
              <li><Link to="/faq" className="text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">FAQ</Link></li>
              <li><Link to="/tracking" className="text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">Order Tracking</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8">Legal</h4>
            <ul className="space-y-4">
              <li><Link to="/terms" className="text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">Cookie Policy</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8">Newsletter</h4>
            <p className="text-[11px] opacity-40 leading-relaxed font-light tracking-wide">
              Subscribe to receive updates on new collections and exclusive events.
            </p>
            <div className="flex border-b border-luxury-black pb-2">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="bg-transparent text-[9px] w-full focus:outline-none tracking-widest font-light"
              />
              <button className="text-[9px] tracking-widest font-bold uppercase">Join</button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-luxury-border px-6 md:px-10 py-4 md:h-12 md:py-0 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0 bg-white">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-[9px] tracking-[0.15em] uppercase text-luxury-black/40">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Use</Link>
          <Link to="/delivery">Returns & Refunds</Link>
        </div>
        <div className="text-[9px] tracking-[0.15em] uppercase text-luxury-black/40">
          © 2026 SERAPHINA LUXE. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}
