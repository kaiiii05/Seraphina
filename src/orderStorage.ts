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

export interface StoredOrder {
  id: string;
  placedAt: string;
  email: string;
  status: OrderStatus;
  paymentMethodId: string;
  paymentMethodLabel: string;
  shipping: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
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
