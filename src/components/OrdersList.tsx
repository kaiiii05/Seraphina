/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { listOrders } from '../orderStorage';
import { formatPeso } from '../utils/formatPeso';
import { ChevronRight } from 'lucide-react';

export default function OrdersList() {
  const location = useLocation();
  const orders = useMemo(() => listOrders(), [location.key]);

  return (
    <div className="pt-36 min-h-screen pb-40 px-6 md:px-12 max-w-[920px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 mb-16">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-luxury-gold font-bold mb-4">Seraphina</p>
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight">My orders</h1>
          <p className="text-xs font-light text-luxury-black/50 mt-4 max-w-md leading-relaxed">
            Orders saved on this device appear here. Open an order for full shipment and payment details.
          </p>
        </div>
        <Link
          to="/shop"
          className="text-[10px] uppercase tracking-[0.3em] font-bold border-b border-luxury-black pb-1 hover:opacity-60 transition-opacity self-start sm:self-auto"
        >
          Continue shopping
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="border border-luxury-border bg-white p-16 text-center space-y-6">
          <p className="text-sm font-light text-luxury-black/55 leading-relaxed">You have no orders yet.</p>
          <Link to="/shop" className="btn-luxury inline-block text-[10px] uppercase tracking-widest">
            Browse the collection
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {orders.map((o) => (
            <li key={o.id}>
              <Link
                to={`/orders/${o.id}`}
                className="group flex justify-between gap-6 border border-luxury-border bg-white p-6 md:p-8 hover:border-luxury-black/40 transition-colors"
              >
                <div className="space-y-2 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-luxury-gold">
                    {o.status === 'Cancelled' ? 'Cancelled' : o.lines[0]?.name ?? 'Order'}
                  </p>
                  <p className="text-sm font-serif truncate">{o.lines.map((l) => l.name).filter((n, i, a) => a.indexOf(n) === i).join(' · ')}</p>
                  <p className="text-[10px] uppercase tracking-widest opacity-40">
                    {o.id} · {new Date(o.placedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right">
                    <p className="text-xs font-semibold">{formatPeso(o.total)}</p>
                    <p className="text-[10px] uppercase tracking-widest opacity-45 mt-1">{o.status}</p>
                  </div>
                  <ChevronRight size={18} className="opacity-25 group-hover:opacity-70 transition-opacity" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
