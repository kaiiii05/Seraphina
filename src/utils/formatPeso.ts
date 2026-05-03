/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/** Format amounts as Philippine pesos (PHP). */
export function formatPeso(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
