/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from './context/CartContext';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'L’ÉLÉGANCE SILK GOWN',
    price: 3450,
    category: 'Women',
    description: 'A masterpiece of silhouette and texture, this floor-length gown is crafted from the finest Italian silk, featuring a delicate hand-draped bodice and a dramatic flowing skirt.',
    images: [
      'https://images.unsplash.com/photo-1539109132332-629263ef71d1?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae13?q=80&w=1200&auto=format&fit=crop'
    ],
    variants: {
      sizes: ['FR 34', 'FR 36', 'FR 38', 'FR 40'],
      colors: [
        { name: 'Noir', hex: '#000000' },
        { name: 'Nacre', hex: '#f8f4f0' }
      ]
    }
  },
  {
    id: '2',
    name: 'CHRONOS VELVET BLAZER',
    price: 2800,
    category: 'Men',
    description: 'The epitome of modern tailoring, this velvet blazer features silk-satin lapels and a sharp, structured shoulder. Perfect for evening affairs that require a touch of distinction.',
    images: [
      'https://images.unsplash.com/photo-1593032465175-481ac7f402a1?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507679799987-c7377ec48696?q=80&w=1200&auto=format&fit=crop'
    ],
    variants: {
      sizes: ['EU 48', 'EU 50', 'EU 52', 'EU 54'],
      colors: [
        { name: 'Midnight', hex: '#191970' },
        { name: 'Onyx', hex: '#0a0a0a' }
      ]
    }
  },
  {
    id: '5',
    name: 'RENAISSANCE WOOL COAT',
    price: 3100,
    category: 'Women',
    description: 'Crafted from pure cashmere-wool blend, this coat redefines winter elegance with its oversized silhouette and signature belted waist.',
    images: [
      'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=1200&auto=format&fit=crop'
    ],
    variants: {
      sizes: ['FR 36', 'FR 38', 'FR 40'],
      colors: [
        { name: 'Beige', hex: '#d2b48c' },
        { name: 'Charcoal', hex: '#36454f' }
      ]
    }
  },
  {
    id: '6',
    name: 'HERITAGE LEATHER LOAFERS',
    price: 950,
    category: 'Men',
    description: 'Classic loafers refined for the modern gentleman. Features hand-burnished leather and a sleek almond-toe profile.',
    images: [
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1531310197839-ccf54634509e?q=80&w=1200&auto=format&fit=crop'
    ]
  }
];
