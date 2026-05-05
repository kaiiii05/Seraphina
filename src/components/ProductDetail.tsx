/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import React, { useState, useMemo, useEffect } from 'react';
import { PRODUCTS } from '../data';
import { useCart } from '../context/CartContext';
import { formatPeso } from '../utils/formatPeso';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Minus, Plus, Heart, Truck, RefreshCw } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const product = useMemo(
    () => PRODUCTS.find((p) => p.id.toLowerCase() === (id ?? '').toLowerCase()),
    [id]
  );
  
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const colorsWithImages = useMemo(
    () =>
      product?.variants?.colors?.filter(
        (c): c is { name: string; hex: string; image: string } => Boolean(c.image)
      ) ?? [],
    [product]
  );

  const galleryImages = useMemo(() => {
    if (!product) return [];
    if (colorsWithImages.length) {
      const match = colorsWithImages.find((c) => c.name === selectedColor) ?? colorsWithImages[0];
      return match ? [match.image] : product.images;
    }
    return product.images;
  }, [product, colorsWithImages, selectedColor]);

  useEffect(() => {
    if (!product) return;
    const first = product.variants?.colors?.[0]?.name ?? '';
    setSelectedColor(first);
    setSelectedSize('');
    setQuantity(1);
  }, [product?.id]);

  if (!product) {
    return (
      <div className="pt-40 text-center">
        <h1 className="text-4xl font-serif mb-8">Product Not Found</h1>
        <button onClick={() => navigate('/shop')} className="btn-luxury-outline">Return to Collection</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: { redirectTo: location.pathname + location.search },
      });
      return;
    }

    if (product.variants?.sizes && !selectedSize) {
      alert('Please select a size');
      return;
    }

    if (product.variants?.colors?.length && !selectedColor) {
      alert('Please select a color');
      return;
    }

    const colorMeta = product.variants?.colors?.find((c) => c.name === selectedColor);
    const imagesForLine = colorMeta?.image
      ? [colorMeta.image, ...product.images.filter((i) => i !== colorMeta.image)]
      : product.images;

    setIsAdding(true);
    setTimeout(() => {
      addToCart({ ...product, images: imagesForLine }, quantity, selectedSize, selectedColor);
      setIsAdding(false);
    }, 800);
  };

  return (
    <div className="pt-24 min-h-screen pb-40">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-40 mb-12">
          <button onClick={() => navigate('/')}>Home</button>
          <ChevronRight size={10} />
          <button type="button" onClick={() => navigate('/shop')}>
            {product.category}
          </button>
          <ChevronRight size={10} />
          <span className="text-luxury-black opacity-100">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Image Gallery */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {galleryImages.map((img, idx) => (
              <motion.div 
                key={`${img}-${idx}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.2 }}
                className="aspect-[3/4] overflow-hidden bg-luxury-neutral"
              >
                <img 
                  src={img} 
                  alt={`${product.name} - view ${idx + 1}`} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s]"
                />
              </motion.div>
            ))}
          </div>

          {/* Product Info - Sticky */}
          <div className="lg:col-span-4 relative">
            <div className="lg:sticky lg:top-32 space-y-12">
              <header className="space-y-4">
                <p className="text-[10px] uppercase tracking-[0.4em] text-luxury-gold font-bold">{product.category}</p>
                <h1 className="text-4xl md:text-5xl font-serif tracking-tight">{product.name}</h1>
                <p className="text-xl font-medium tracking-widest">{formatPeso(product.price)}</p>
              </header>

              <div className="space-y-8">
                <p className="text-sm font-light leading-relaxed text-luxury-black/70">
                  {product.description}
                </p>

                {/* Variants - Size */}
                {product.variants?.sizes && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase tracking-widest font-bold">Select Size</span>
                      <button className="text-[9px] uppercase tracking-widest font-bold opacity-40 hover:opacity-100 transition-opacity underline decoration-luxury-black/20">Size Guide</button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {product.variants.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 text-[10px] border transition-all duration-300 ${
                            selectedSize === size 
                              ? 'bg-luxury-black text-white border-luxury-black' 
                              : 'bg-transparent border-luxury-border hover:border-luxury-black'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Variants - Color */}
                {product.variants?.colors && (
                  <div className="space-y-4">
                    <span className="text-[10px] uppercase tracking-widest font-bold">Select Color: <span className="opacity-40">{selectedColor || '—'}</span></span>
                    <div className="flex gap-4">
                      {product.variants.colors.map(color => (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(color.name)}
                          className={`w-8 h-8 rounded-full border-2 transition-all p-[2px] ${
                            selectedColor === color.name ? 'border-luxury-black' : 'border-transparent'
                          }`}
                          title={color.name}
                        >
                          <div className="w-full h-full rounded-full" style={{ backgroundColor: color.hex }} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="flex items-center gap-6">
                  <span className="text-[10px] uppercase tracking-widest font-bold">Quantity</span>
                  <div className="flex items-center border border-luxury-border px-3 py-2">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="opacity-50 hover:opacity-100 transition-opacity">
                      <Minus size={14} />
                    </button>
                    <span className="w-12 text-center text-xs font-medium">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="opacity-50 hover:opacity-100 transition-opacity">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Add to Cart */}
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="flex-1 btn-luxury flex items-center justify-center gap-3 relative overflow-hidden"
                  >
                    <AnimatePresence mode="wait">
                      {isAdding ? (
                        <motion.span 
                          key="adding"
                          initial={{ y: 20 }}
                          animate={{ y: 0 }}
                          className="flex items-center gap-2"
                        >
                          Adding to bag...
                        </motion.span>
                      ) : (
                        <motion.span 
                          key="add"
                          initial={{ y: -20 }}
                          animate={{ y: 0 }}
                        >
                          Add to Shopping Bag
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                  <button className="p-3 border border-luxury-border hover:border-luxury-black transition-colors group">
                    <Heart size={20} className="group-hover:fill-luxury-black transition-all" strokeWidth={1} />
                  </button>
                </div>
              </div>

              {/* Collapsible Info */}
              <div className="pt-12 border-t border-luxury-border divide-y divide-luxury-border">
                <details className="py-4 group" open>
                  <summary className="flex justify-between items-center cursor-pointer list-none text-[10px] uppercase tracking-widest font-bold">
                    Product Details
                    <ChevronRight size={14} className="group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="pt-4 text-xs font-light leading-relaxed text-luxury-black/60 space-y-4">
                    <p>Designed in our Paris studio and meticulously constructed to ensure a perfect fit that balances structure and elegance.</p>
                    <ul className="list-disc pl-4 space-y-2">
                      <li>100% Premium Material</li>
                      <li>Dry Clean Only</li>
                      <li>Internal hidden pockets</li>
                      <li>Made in Italy</li>
                    </ul>
                  </div>
                </details>
                
                <details className="py-4 group">
                  <summary className="flex justify-between items-center cursor-pointer list-none text-[10px] uppercase tracking-widest font-bold">
                    Delivery & Returns
                    <ChevronRight size={14} className="group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="pt-4 text-xs font-light leading-relaxed text-luxury-black/60 space-y-4">
                    <div className="flex gap-4">
                      <Truck size={14} className="opacity-40" />
                      <div>
                        <p className="font-medium">Complimentary Shipping</p>
                        <p>Enjoy free standard delivery on all orders over {formatPeso(500)}.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <RefreshCw size={14} className="opacity-40" />
                      <div>
                        <p className="font-medium">Free Returns</p>
                        <p>You have 30 days to return your order for a full refund or exchange.</p>
                      </div>
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>

        {/* Suggestion Section */}
        <div className="mt-40 border-t border-luxury-border pt-20">
          <h2 className="text-3xl font-serif mb-12">Complete the Look</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4).map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} className="group space-y-4 text-center">
                <div className="aspect-[3/4] overflow-hidden bg-luxury-neutral">
                  <img 
                    src={p.images[0]} 
                    alt={p.name} 
                    className="w-full h-full object-cover grayscale-[0.2] transition-transform duration-1000 group-hover:scale-110 group-hover:grayscale-0"
                  />
                </div>
                <h4 className="text-[10px] uppercase tracking-widest font-bold">{p.name}</h4>
                <p className="text-[10px] font-medium">{formatPeso(p.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
