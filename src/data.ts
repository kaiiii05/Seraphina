/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from './context/CartContext';

/** Stable CDN images (avoids broken Unsplash hotlinks on some hosts). */
const img = (seed: string) =>
  `https://picsum.photos/seed/${seed}/900/1200`;

export const PRODUCTS: Product[] = [
  {
    id: 'aurelle',
    name: 'AURELLE',
    price: 585,
    category: 'Women',
    description:
      'Radiant white florals warmed by golden amber and sheer musk. Aurelle opens with bergamot and neroli, deepening into jasmine sambac on a sandalwood veil—ethereal, lasting, unmistakably Seraphina.',
    images: [img('seraphina-aurelle-a'), img('seraphina-aurelle-b')]
  },
  {
    id: 'celestique',
    name: 'CELESTIQUE',
    price: 560,
    category: 'Men',
    description:
      'A celestial veil of iris, powdery violet, and cool aldehydes. Celestique drifts from crisp pear to a heart of orris butter, settling on a whisper of white cedar—refined, luminous, and composed.',
    images: [img('seraphina-celestique-a'), img('seraphina-celestique-b')]
  },
  {
    id: 'lunaria',
    name: 'LUNARIA',
    price: 600,
    category: 'Women',
    description:
      'Night-blooming jasmine and blackcurrant over a moonlit base of patchouli and vanilla orchid. Lunaria is depth without weight—mysterious, velvety, and made for after dark.',
    images: [img('seraphina-lunaria-a'), img('seraphina-lunaria-b')]
  },
  {
    id: 'velmira',
    name: 'VELMIRA',
    price: 540,
    category: 'Men',
    description:
      'Velvet rose, smoked tea, and spiced pink pepper on a resinous amber foundation. Velmira balances strength and softness—a signature for those who prefer their florals with an edge.',
    images: [img('seraphina-velmira-a'), img('seraphina-velmira-b')]
  }
];
