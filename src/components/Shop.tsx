/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../data';
import { formatPeso } from '../utils/formatPeso';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import type { Product } from '../context/CartContext';
import { Filter, LayoutGrid, LayoutList } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const BUY_NOW_KEY = 'seraphina_buy_now_pending';

function shopLinePayload(product: Product) {
  const selectedSize = undefined as string | undefined;
  if (product.variants?.sizes?.length) {
    return null;
  }
  const selectedColor = product.variants?.colors?.[0]?.name ?? '';
  if (product.variants?.colors?.length && !selectedColor) {
    return null;
  }
  const colorMeta = product.variants?.colors?.find((c) => c.name === selectedColor);
  const imagesForLine = colorMeta?.image
    ? [colorMeta.image, ...product.images.filter((i) => i !== colorMeta.image)]
    : product.images;
  return {
    cartProduct: { ...product, images: imagesForLine },
    selectedSize,
    selectedColor: product.variants?.colors?.length ? selectedColor : undefined
  };
}

export default function Shop() {
  const navigate = useNavigate();
  const { addToCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [sortBy, setBy] = useState('featured');

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);

    return result;
  }, [sortBy]);

  const handleAddToCart = (product: Product) => {
    const payload = shopLinePayload(product);
    if (!payload) {
      window.alert('Please open the product page to choose size or color options.');
      navigate(`/product/${product.id}`);
      return;
    }
    if (!isAuthenticated) {
      navigate('/login', { state: { redirectTo: '/shop' } });
      return;
    }
    addToCart(
      payload.cartProduct,
      1,
      payload.selectedSize,
      payload.selectedColor
    );
  };

  const handleBuyNow = (product: Product) => {
    const payload = shopLinePayload(product);
    if (!payload) {
      window.alert('Please open the product page to choose size or color options.');
      navigate(`/product/${product.id}`);
      return;
    }
    if (!isAuthenticated) {
      sessionStorage.setItem(
        BUY_NOW_KEY,
        JSON.stringify({
          productId: product.id,
          quantity: 1,
          selectedSize: payload.selectedSize,
          selectedColor: payload.selectedColor
        })
      );
      navigate('/login', { state: { redirectTo: '/checkout', fromBuyNow: true } });
      return;
    }
    clearCart();
    addToCart(
      payload.cartProduct,
      1,
      payload.selectedSize,
      payload.selectedColor
    );
    navigate('/checkout');
  };

  return (
    <div className="pt-32 min-h-screen px-6 md:px-12 max-w-[1800px] mx-auto pb-40">
      {/* Editorial Header */}
      <div className="mb-20 text-center space-y-4">
        <h1 className="text-5xl md:text-7xl font-serif">The Collection</h1>
        <p className="text-xs uppercase tracking-[0.4em] opacity-40 font-semibold">Excellence in every detail</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center border-y border-luxury-border py-6 mb-12 gap-8 sticky top-16 bg-white z-40 px-4">
        <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold opacity-70 hover:opacity-100 transition-opacity"
            >
              <Filter size={14} /> Filter
            </button>
            <div className="h-4 w-[1px] bg-luxury-black/10" />
            <select 
              className="bg-transparent text-[10px] uppercase tracking-widest font-semibold focus:outline-none cursor-pointer opacity-70 hover:opacity-100"
              value={sortBy}
              onChange={(e) => setBy(e.target.value)}
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
          
          <div className="hidden sm:flex items-center gap-2 opacity-40">
            <button onClick={() => setViewType('grid')} className={viewType === 'grid' ? 'text-luxury-black opacity-100' : ''}>
              <LayoutGrid size={16} />
            </button>
            <button onClick={() => setViewType('list')} className={viewType === 'list' ? 'text-luxury-black opacity-100' : ''}>
              <LayoutList size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className={viewType === 'grid' 
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-20" 
        : "flex flex-col gap-12"
      }>
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product, idx) => (
            <motion.div
              layout
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, delay: idx * 0.05 }}
              className="group"
            >
              <div className={viewType === 'grid' ? 'block' : 'flex gap-12 items-center'}>
                <Link
                  to={`/product/${product.id}`}
                  className={`block overflow-hidden relative ${viewType === 'grid' ? 'aspect-[3/4]' : 'w-1/3 shrink-0 aspect-[4/5]'}`}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain object-center bg-luxury-neutral"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-luxury-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  {idx % 3 === 0 && (
                    <div className="pointer-events-none absolute top-4 left-4 bg-white/90 px-3 py-1 text-[8px] uppercase tracking-[0.3em] font-bold">
                      Limited
                    </div>
                  )}
                </Link>
                <div
                  className={
                    viewType === 'grid'
                      ? 'mt-8 flex flex-col items-center text-center space-y-4'
                      : 'flex-1 flex flex-col space-y-4'
                  }
                >
                  <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-bold">{product.category}</p>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-xl font-serif tracking-wide hover:opacity-70 transition-opacity">
                      {product.name}
                    </h3>
                  </Link>
                  {viewType === 'list' && (
                    <p className="text-sm font-light text-luxury-black/60 max-w-xl leading-relaxed">
                      {product.description}
                    </p>
                  )}
                  <p className="text-base font-semibold tracking-[0.15em]">{formatPeso(product.price)}</p>
                  <div
                    className={
                      viewType === 'grid'
                        ? 'mt-2 flex flex-col gap-2 w-full max-w-[280px]'
                        : 'mt-2 flex flex-col sm:flex-row gap-2 w-full max-w-xl'
                    }
                  >
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 py-3.5 px-4 text-[9px] sm:text-[10px] uppercase tracking-[0.22em] sm:tracking-[0.28em] font-bold bg-luxury-black text-white border border-luxury-black hover:bg-white hover:text-luxury-black transition-colors text-center"
                    >
                      Add to Shopping Bag
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBuyNow(product)}
                      className="flex-1 py-3.5 px-4 text-[9px] sm:text-[10px] uppercase tracking-[0.22em] sm:tracking-[0.28em] font-bold bg-white border border-luxury-black text-luxury-black hover:bg-luxury-black hover:text-white transition-colors text-center"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-40 text-center space-y-6">
          <p className="font-serif italic text-2xl opacity-40">No items found in this selection.</p>
          <Link to="/shop" className="btn-luxury-outline inline-block">
            View All Collection
          </Link>
        </div>
      )}
    </div>
  );
}
