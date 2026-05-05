/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from './context/CartContext';

const P = {
  velmira: '/products/velmira',
  aurelle: '/products/aurelle',
  celestique: '/products/celestique',
  lunaria: '/products/lunaria'
} as const;

export const PRODUCTS: Product[] = [
  {
    id: 'velmira',
    name: 'VELMIRA',
    price: 540,
    category: 'Men',
    description:
      'Velvet rose, smoked tea, and spiced pink pepper on a resinous amber foundation. Velmira balances strength and softness—a signature for those who prefer their florals with an edge.',
    images: [`${P.velmira}/black.jpg`],
    variants: {
      colors: [
        { name: 'Black', hex: '#1c1c1c', image: `${P.velmira}/black.jpg` },
        { name: 'Brown', hex: '#5c4033', image: `${P.velmira}/brown.jpg` },
        { name: 'Pink', hex: '#e8b4b8', image: `${P.velmira}/pink.jpg` },
        { name: 'White', hex: '#f2f0e9', image: `${P.velmira}/white.jpg` }
      ]
    }
  },
  {
    id: 'aurelle',
    name: 'AURELLE',
    price: 585,
    category: 'Women',
    description:
      'Radiant white florals warmed by golden amber and sheer musk. Aurelle opens with bergamot and neroli, deepening into jasmine sambac on a sandalwood veil—ethereal, lasting, unmistakably Seraphina.',
    images: [`${P.aurelle}/black.jpg`],
    variants: {
      colors: [
        { name: 'Black', hex: '#1c1c1c', image: `${P.aurelle}/black.jpg` },
        { name: 'Coffee', hex: '#6f4e37', image: `${P.aurelle}/coffee.jpg` },
        { name: 'Cream', hex: '#e8e0d5', image: `${P.aurelle}/cream.jpg` },
        { name: 'Red', hex: '#9b2335', image: `${P.aurelle}/red.jpg` }
      ]
    }
  },
  {
    id: 'celestique',
    name: 'CELESTIQUE',
    price: 560,
    category: 'Men',
    description:
      'A celestial veil of iris, powdery violet, and cool aldehydes. Celestique drifts from crisp pear to a heart of orris butter, settling on a whisper of white cedar—refined, luminous, and composed.',
    images: [`${P.celestique}/black.jpg`],
    variants: {
      colors: [
        { name: 'Black', hex: '#1c1c1c', image: `${P.celestique}/black.jpg` },
        { name: 'Cream', hex: '#e8e0d5', image: `${P.celestique}/cream.jpg` },
        { name: 'Dark Brown', hex: '#3e2723', image: `${P.celestique}/dark-brown.jpg` }
      ]
    }
  },
  {
    id: 'lunaria',
    name: 'LUNARIA',
    price: 600,
    category: 'Women',
    description:
      'Night-blooming jasmine and blackcurrant over a moonlit base of patchouli and vanilla orchid. Lunaria is depth without weight—mysterious, velvety, and made for after dark.',
    images: [`${P.lunaria}/black.jpg`],
    variants: {
      colors: [
        { name: 'Army Green', hex: '#3d4a32', image: `${P.lunaria}/army-green.jpg` },
        { name: 'Black', hex: '#1c1c1c', image: `${P.lunaria}/black.jpg` },
        { name: 'Brown', hex: '#5c4033', image: `${P.lunaria}/brown.jpg` },
        { name: 'Coffee', hex: '#6f4e37', image: `${P.lunaria}/coffee.jpg` },
        { name: 'Cream', hex: '#e8e0d5', image: `${P.lunaria}/cream.jpg` }
      ]
    }
  }
];
