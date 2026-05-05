/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo, useCallback, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PRODUCTS } from '../data';
import { formatPeso } from '../utils/formatPeso';
import { Filter, ChevronDown, LayoutGrid, LayoutList } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  const activeCategory =
    categoryParam === 'Women' || categoryParam === 'Men' ? categoryParam : 'All';

  const [sortBy, setBy] = useState('featured');

  const setCategory = useCallback(
    (cat: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (cat === 'All') next.delete('category');
        else next.set('category', cat);
        return next;
      });
    },
    [setSearchParams]
  );

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

  const categories = ['All', 'Women', 'Men'];

  const filteredProducts = useMemo(() => {
    let result =
      activeCategory === 'All' ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCategory);

    if (sortBy === 'price-low') result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') result = [...result].sort((a, b) => b.price - a.price);

    return result;
  }, [activeCategory, sortBy]);

  return (
    <div className="pt-32 min-h-screen px-6 md:px-12 max-w-[1800px] mx-auto pb-40">
      {/* Editorial Header */}
      <div className="mb-20 text-center space-y-4">
        <h1 className="text-5xl md:text-7xl font-serif">
          {activeCategory === 'All' ? 'The Collection' : activeCategory}
        </h1>
        <p className="text-xs uppercase tracking-[0.4em] opacity-40 font-semibold">Excellence in every detail</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center border-y border-luxury-border py-6 mb-12 gap-8 sticky top-16 bg-white z-40 px-4">
        <div className="flex items-center gap-10 overflow-x-auto w-full md:w-auto no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`text-[10px] uppercase tracking-[0.3em] font-medium transition-all duration-300 relative pb-1 whitespace-nowrap ${
                activeCategory === cat ? 'opacity-100' : 'opacity-40 hover:opacity-100'
              }`}
            >
              {cat}
              {activeCategory === cat && (
                <motion.div layoutId="catUnderline" className="absolute bottom-0 left-0 w-full h-[1px] bg-luxury-black" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-6 md:pt-0 border-luxury-border">
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
              <Link to={`/product/${product.id}`} className={viewType === 'grid' ? "block" : "flex gap-12 items-center"}>
                <div className={`overflow-hidden relative ${viewType === 'grid' ? "aspect-[3/4]" : "w-1/3 aspect-[4/5]"}`}>
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-luxury-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  {/* Subtle Label */}
                  {idx % 3 === 0 && (
                    <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 text-[8px] uppercase tracking-[0.3em] font-bold">
                      Limited
                    </div>
                  )}
                </div>
                <div className={viewType === 'grid' ? "mt-8 text-center space-y-2" : "flex-1 space-y-4"}>
                  <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-bold">{product.category}</p>
                  <h3 className="text-xl font-serif tracking-wide">{product.name}</h3>
                  {viewType === 'list' && (
                    <p className="text-sm font-light text-luxury-black/60 max-w-xl leading-relaxed">
                      {product.description}
                    </p>
                  )}
                  <p className="text-sm font-medium tracking-[0.2em] pt-2">
                    {formatPeso(product.price)}
                  </p>
                  {viewType === 'list' && (
                    <div className="pt-4">
                      <button className="btn-luxury-outline py-2 px-6">View Details</button>
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-40 text-center space-y-6">
          <p className="font-serif italic text-2xl opacity-40">No items found in this selection.</p>
          <button type="button" onClick={() => setCategory('All')} className="btn-luxury-outline">View All Collection</button>
        </div>
      )}
    </div>
  );
}
