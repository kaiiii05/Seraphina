/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from './context/CartContext';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'AURELLE',
    price: 585,
    category: 'Women',
    description:
      'Radiant white florals warmed by golden amber and sheer musk. Aurelle opens with bergamot and neroli, deepening into jasmine sambac on a sandalwood veil—ethereal, lasting, unmistakably Seraphina.',
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7b655?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=1200&auto=format&fit=crop'
    ]
  },
  {
    id: '2',
    name: 'CELESTIQUE',
    price: 560,
    category: 'Men',
    description:
      'A celestial veil of iris, powdery violet, and cool aldehydes. Celestique drifts from crisp pear to a heart of orris butter, settling on a whisper of white cedar—refined, luminous, and composed.',
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1615634260167-c8cd4b803f1b?q=80&w=1200&auto=format&fit=crop'
    ]
  },
  {
    id: '3',
    name: 'LUNARIA',
    price: 600,
    category: 'Women',
    description:
      'Night-blooming jasmine and blackcurrant over a moonlit base of patchouli and vanilla orchid. Lunaria is depth without weight—mysterious, velvety, and made for after dark.',
    images: [
      'https://images.unsplash.com/photo-1590736969955-71cc94901144?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1615529343904-7d5b4eaf0b3d?q=80&w=1200&auto=format&fit=crop'
    ]
  },
  {
    id: '4',
    name: 'VELMIRA',
    price: 540,
    category: 'Men',
    description:
      'Velvet rose, smoked tea, and spiced pink pepper on a resinous amber foundation. Velmira balances strength and softness—a signature for those who prefer their florals with an edge.',
    images: [
      'https://images.unsplash.com/photo-1571781926291-c477eb046024?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620291578223-ffe7e3268c74?q=80&w=1200&auto=format&fit=crop'
    ]
  }
];
