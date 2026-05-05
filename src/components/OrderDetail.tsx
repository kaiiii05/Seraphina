/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrderById, updateOrderStatus } from '../orderStorage';
import { formatPeso } from '../utils/formatPeso';
import { CreditCard, MapPin, Truck } from 'lucide-react';

function formatLineSpecs(line: {
  selectedColor?: string;
  selectedSize?: string;
  quantity: number;
}): string {
  const parts: string[] = [];
  if (line.selectedColor) parts.push(line.selectedColor.toUpperCase());
  if (line.selectedSize) parts.push(`SIZE ${line.selectedSize}`.toUpperCase());
  parts.push(`QTY ${line.quantity}`);
  return parts.join(' · ');
}

function deliveryRange(placedIso: string): { start: string; end: string } {
  const placed = new Date(placedIso);
  const d1 = new Date(placed);
  d1.setDate(d1.getDate() + 2);
  const d2 = new Date(placed);
  d2.setDate(d2.getDate() + 3);
  const opt: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return {
    start: d1.toLocaleDateString(undefined, opt),
    end: d2.toLocaleDateString(undefined, opt)
  };
}

export default function OrderDetail() {
  const { orderId } = useParams();
  const [refreshKey, setRefreshKey] = useState(0);

  const order = useMemo(() => (orderId ? getOrderById(orderId) : undefined), [orderId, refreshKey]);

  const productHeading = useMemo(() => {
    if (!order) return '';
    const names = [...new Set(order.lines.map((l) => l.name))];
    if (names.length === 0) return order.id;
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} & ${names[1]}`;
    return `${names.slice(0, -1).join(', ')} & ${names[names.length - 1]}`;
  }, [order]);

  const handleCancel = () => {
    if (!orderId || !order || order.status === 'Cancelled') return;
    if (!window.confirm('Cancel this order before it ships?')) return;
    updateOrderStatus(orderId, 'Cancelled');
    setRefreshKey((k) => k + 1);
  };

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

  const placed = new Date(order.placedAt);
  const placedVerbose = placed.toLocaleString(undefined, {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit'
  });

  const paymentUpper = order.paymentMethodLabel.toUpperCase();
  const isCod = order.paymentMethodId === 'cod';
  const statusTag = order.status === 'Cancelled' ? 'CANCELLED' : isCod ? 'TO PAY' : 'PAID';
  const { start, end } = deliveryRange(order.placedAt);
  const cancelled = order.status === 'Cancelled';

  return (
    <div className="min-h-screen flex flex-col pb-0">
      <div className="flex-1 pt-32 md:pt-36 px-6 md:px-12 max-w-[960px] w-full mx-auto pb-32">
        {/* Title row */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 mb-14">
          <div className="space-y-5 max-w-2xl">
            <p className="text-[10px] uppercase tracking-[0.4em] text-luxury-gold font-bold">{statusTag}</p>
            <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] leading-[1.1] font-serif tracking-tight text-luxury-black">
              {productHeading}
            </h1>
            <p className="text-xs font-light text-luxury-black/45 tracking-wide">
              Placed {placedVerbose}
              <span className="block sm:inline sm:before:content-['_|_'] sm:before:mx-3 sm:before:text-luxury-black/25 sm:before:font-light">
                Reference {order.id}
              </span>
            </p>
          </div>

          <div className="lg:text-right lg:pt-2 shrink-0 space-y-3 lg:max-w-xs">
            <p className="text-[10px] uppercase tracking-[0.32em] font-bold text-luxury-black/40">Order total</p>
            <p className="text-3xl md:text-4xl font-serif tracking-tight">{formatPeso(order.total)}</p>
            {!cancelled && (
              <p className="text-[11px] font-light text-luxury-black/50 leading-relaxed lg:ml-auto">
                Fulfillment updates appear here as your order moves through each stage.
              </p>
            )}
          </div>
        </div>

        {/* Delivery */}
        <section
          className={`border border-luxury-black mb-12 p-6 md:p-8 flex gap-6 ${cancelled ? 'opacity-50' : ''}`}
        >
          <div className="shrink-0 w-10 h-10 border border-luxury-border flex items-center justify-center text-luxury-gold">
            <Truck size={20} strokeWidth={1} />
          </div>
          <div className="space-y-3 min-w-0">
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-luxury-black/40">Delivery</p>
            {cancelled ? (
              <p className="text-sm font-light text-luxury-black/55">This order was cancelled. No delivery will be scheduled.</p>
            ) : (
              <>
                <p className="text-sm font-semibold tracking-wide">Expected delivery: 2–3 business days</p>
                <p className="text-sm font-light text-luxury-black/55">
                  Estimated arrival between {start} and {end}
                </p>
                <p className="text-sm font-semibold pt-1">Shipping fee: Complimentary · Standard delivery</p>
              </>
            )}
          </div>
        </section>

        {/* Items */}
        <section className="mb-14 space-y-6">
          <h2 className="text-[10px] uppercase tracking-[0.35em] font-bold text-luxury-black/40">Items</h2>
          <div className="space-y-5">
            {order.lines.map((line) => (
              <div
                key={`${line.productId}-${line.selectedColor ?? ''}-${line.selectedSize ?? ''}-${line.quantity}`}
                className="border border-luxury-black p-5 md:p-6 flex gap-5 md:gap-8"
              >
                <div className="w-24 h-[7.5rem] md:w-28 md:h-32 bg-luxury-neutral shrink-0 border border-luxury-border/80">
                  <img
                    src={line.image}
                    alt={line.name}
                    className="w-full h-full object-contain object-center bg-luxury-neutral"
                  />
                </div>
                <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 min-w-0">
                  <div className="space-y-3">
                    <p className="text-base md:text-lg font-serif tracking-wide">{line.name}</p>
                    <p className="text-[10px] uppercase tracking-[0.28em] font-semibold text-luxury-black/45">
                      {formatLineSpecs(line)}
                    </p>
                  </div>
                  <p className="text-base md:text-lg font-serif shrink-0">{formatPeso(line.price * line.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Address + payment */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 mb-20">
          <div className="flex gap-5">
            <div className="shrink-0 w-10 h-10 border border-luxury-border flex items-center justify-center text-luxury-gold mt-0.5">
              <MapPin size={18} strokeWidth={1} />
            </div>
            <div className="space-y-4 min-w-0">
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-luxury-black/40">Shipping address</p>
              <p className="text-sm font-light leading-relaxed text-luxury-black/65">
                {order.shipping.firstName} {order.shipping.lastName}
                <br />
                {order.shipping.address}
                <br />
                {order.shipping.city}, {order.shipping.postalCode}
                <br />
                {order.shipping.country}
                <span className="block mt-4 text-luxury-black/55">{order.email}</span>
              </p>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="shrink-0 w-10 h-10 border border-luxury-border flex items-center justify-center text-luxury-gold mt-0.5">
              <CreditCard size={18} strokeWidth={1} />
            </div>
            <div className="space-y-4 min-w-0">
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-luxury-black/40">Payment</p>
              <p className="text-sm font-light text-luxury-black/65 leading-relaxed">{paymentUpper}</p>
            </div>
          </div>
        </section>

        {/* Cancel */}
        {!cancelled && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-8 border-b border-luxury-border">
            <p className="text-xs font-light text-luxury-black/50 leading-relaxed">
              Need to change plans? You can cancel before this order ships.
            </p>
            <button
              type="button"
              onClick={handleCancel}
              className="shrink-0 px-8 py-3 text-[10px] uppercase tracking-[0.28em] font-bold border border-red-700 text-red-700 hover:bg-red-700 hover:text-white transition-colors"
            >
              Cancel order
            </button>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="sticky bottom-0 left-0 w-full mt-auto bg-luxury-neutral/90 backdrop-blur-sm border-t border-luxury-border">
        <div className="max-w-[960px] mx-auto px-6 md:px-12 h-14 flex items-center justify-between">
          <Link
            to="/account"
            className="text-[10px] uppercase tracking-[0.3em] font-bold text-luxury-black hover:opacity-60 transition-opacity"
          >
            Orders
          </Link>
          <Link
            to="/shop"
            className="text-[10px] uppercase tracking-[0.3em] font-bold text-luxury-black/45 hover:text-luxury-black transition-colors"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
