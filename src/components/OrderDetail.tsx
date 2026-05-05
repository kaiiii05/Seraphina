/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getOrderById } from '../orderStorage';
import { formatPeso } from '../utils/formatPeso';
import { ChevronLeft } from 'lucide-react';

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const order = useMemo(() => (orderId ? getOrderById(orderId) : undefined), [orderId]);

  if (!orderId || !order) {
    return (
      <div className="pt-40 min-h-screen px-6 text-center pb-40 max-w-lg mx-auto">
        <h1 className="text-4xl font-serif mb-6">Order not found</h1>
        <p className="text-sm font-light opacity-60 mb-10 leading-relaxed">
          We couldn&apos;t find this order reference. If you completed a checkout on this device, try again from your confirmation screen.
        </p>
        <Link to="/shop" className="btn-luxury-outline inline-block">
          Back to Shop
        </Link>
      </div>
    );
  }

  const placedLabel = new Date(order.placedAt).toLocaleString(undefined, {
    dateStyle: 'long',
    timeStyle: 'short'
  });

  return (
    <div className="pt-32 min-h-screen pb-40 px-6 md:px-12 max-w-[880px] mx-auto">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold opacity-40 hover:opacity-100 mb-16 transition-opacity"
      >
        <ChevronLeft size={14} /> Back
      </button>

      <div className="space-y-2 mb-16">
        <p className="text-[10px] uppercase tracking-[0.35em] text-luxury-gold font-bold">Order detail</p>
        <h1 className="text-4xl md:text-5xl font-serif tracking-tight">{order.id}</h1>
        <div className="flex flex-wrap gap-x-10 gap-y-2 pt-4 text-[11px] uppercase tracking-widest font-semibold opacity-60">
          <span>Status: <span className="text-luxury-black">{order.status}</span></span>
          <span>Placed: <span className="text-luxury-black normal-case">{placedLabel}</span></span>
        </div>
      </div>

      <section className="border border-luxury-border bg-white divide-y divide-luxury-border mb-14">
        <div className="p-8 md:p-10 space-y-3">
          <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold">Shipping address</h2>
          <p className="text-sm font-light leading-relaxed text-luxury-black/70">
            {order.shipping.firstName} {order.shipping.lastName}
            <br />
            {order.shipping.address}
            <br />
            {order.shipping.city} {order.shipping.postalCode}
            <br />
            {order.shipping.country}
          </p>
        </div>
        <div className="p-8 md:p-10 space-y-3">
          <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold">Contact &amp; payment</h2>
          <p className="text-sm font-light leading-relaxed text-luxury-black/70">
            Confirmation email sent to{' '}
            <span className="text-luxury-black font-medium">{order.email}</span>
            <br />
            <span className="block mt-2">Payment method: {order.paymentMethodLabel}</span>
          </p>
        </div>
      </section>

      <section className="space-y-8 mb-14">
        <h2 className="text-xl font-serif">Items</h2>
        <ul className="space-y-6">
          {order.lines.map((line) => (
            <li
              key={`${line.productId}-${line.selectedColor ?? ''}-${line.selectedSize ?? ''}`}
              className="flex gap-6 border-b border-luxury-border/40 pb-6 last:border-0"
            >
              <div className="w-20 h-[5.5rem] bg-luxury-neutral shrink-0 overflow-hidden">
                <img
                  src={line.image}
                  alt={line.name}
                  className="w-full h-full object-contain object-center bg-luxury-neutral"
                />
              </div>
              <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.12em]">{line.name}</p>
                  <p className="text-[10px] uppercase tracking-widest opacity-45 mt-2">
                    Quantity: {line.quantity}
                    {line.selectedColor && ` • Color: ${line.selectedColor}`}
                    {line.selectedSize && ` • Size: ${line.selectedSize}`}
                  </p>
                </div>
                <p className="text-sm font-medium shrink-0">{formatPeso(line.price * line.quantity)}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-luxury-black/10 pt-10 space-y-4 max-w-sm ml-auto text-right">
        <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
          <span className="opacity-50">Subtotal</span>
          <span>{formatPeso(order.subtotal)}</span>
        </div>
        <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
          <span className="opacity-50">Shipping</span>
          <span className="text-luxury-gold">Complimentary</span>
        </div>
        <div className="flex justify-between items-baseline pt-4 border-t border-luxury-black/10">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Total</span>
          <span className="text-2xl font-serif">{formatPeso(order.total)}</span>
        </div>
      </section>

      <div className="pt-16">
        <Link to="/shop" className="btn-luxury-outline inline-block text-[10px] uppercase tracking-widest">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
