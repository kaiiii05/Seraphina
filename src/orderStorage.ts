/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StoredOrderLine {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedSize?: string;
  selectedColor?: string;
}

export type OrderStatus = 'Processing' | 'Cancelled';

/** Derived from payment type + calendar timeline from order date (not stored). */
export type OrderLifecycle = 'to_pay' | 'to_ship' | 'to_receive' | 'to_rate' | 'cancelled';

export const ORDER_LIFECYCLE_TABS: OrderLifecycle[] = [
  'to_pay',
  'to_ship',
  'to_receive',
  'to_rate',
  'cancelled'
];

export const ORDER_LIFECYCLE_LABEL: Record<OrderLifecycle, string> = {
  to_pay: 'To Pay',
  to_ship: 'To Ship',
  to_receive: 'To Receive',
  to_rate: 'To Rate',
  cancelled: 'Cancelled'
};

function endOfCalendarDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

/** Timestamp (ms) for end of the calendar day that is `daysAfter` days after the order was placed. */
function endOfDayAfterPlace(placedIso: string, daysAfter: number): number {
  const placed = new Date(placedIso);
  const t = new Date(placed);
  t.setDate(t.getDate() + daysAfter);
  return endOfCalendarDay(t).getTime();
}

/**
 * Stages move with calendar days from placedAt (aligned with delivery estimate on order detail):
 * - To Pay: COD only, through end of day +1
 * - To Ship: through end of day +2 (non-COD skips To Pay)
 * - To Receive: through end of day +3 (expected delivery window complete)
 * - To Rate: after end of day +3
 */
export function getOrderLifecycle(order: StoredOrder): OrderLifecycle {
  if (order.status === 'Cancelled') return 'cancelled';
  const now = Date.now();
  const isCod = order.paymentMethodId === 'cod';
  const endPay = endOfDayAfterPlace(order.placedAt, 1);
  const endShip = endOfDayAfterPlace(order.placedAt, 2);
  const endDelivery = endOfDayAfterPlace(order.placedAt, 3);

  if (isCod && now <= endPay) return 'to_pay';
  if (now <= endShip) return 'to_ship';
  if (now <= endDelivery) return 'to_receive';
  return 'to_rate';
}

export interface StoredOrder {
  id: string;
  placedAt: string;
  email: string;
  status: OrderStatus;
  paymentMethodId: string;
  paymentMethodLabel: string;
  shipping: {
    fullName: string;
    phoneNumber: string;
    address: string;
  };
  lines: StoredOrderLine[];
  subtotal: number;
  total: number;
}

const ORDERS_KEY = 'seraphina_orders_history';
export const LAST_ORDER_SESSION_KEY = 'seraphina_last_order_id';

function readOrders(): StoredOrder[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredOrder[]) : [];
  } catch {
    return [];
  }
}

export function persistOrder(order: StoredOrder): void {
  try {
    if (typeof localStorage === 'undefined') return;
    const orders = readOrders();
    orders.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders.slice(0, 50)));
    sessionStorage.setItem(LAST_ORDER_SESSION_KEY, order.id);
  } catch {
    /* ignore */
  }
}

export function getOrderById(orderId: string): StoredOrder | undefined {
  return readOrders().find((o) => o.id === orderId);
}

export function listOrders(): StoredOrder[] {
  return readOrders();
}

export function updateOrderStatus(orderId: string, status: OrderStatus): void {
  try {
    if (typeof localStorage === 'undefined') return;
    const orders = readOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) return;
    orders[idx] = { ...orders[idx], status };
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch {
    /* ignore */
  }
}
