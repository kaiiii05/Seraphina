/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data';
import { formatPeso } from '../utils/formatPeso';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const featuredProducts = PRODUCTS.slice(0, 3);
  const heroProduct = PRODUCTS[0];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex overflow-hidden border-b border-luxury-border">
        {/* Left: Editorial Hero (55%) */}
        <div className="w-[55%] border-r border-luxury-border relative group bg-luxury-neutral overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <img 
              src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=2400&auto=format&fit=crop" 
              alt="Luxury Editorial" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </motion.div>
          
          <div className="absolute inset-0 flex flex-col justify-end p-16 md:p-24 text-white z-10">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.6, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-[10px] tracking-[0.3em] uppercase mb-6"
            >
              Campaign // Spring 2026
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1.2 }}
              className="text-6xl md:text-8xl leading-[0.9] serif-italic mb-6"
            >
              The Ethereal <br /> Monogram
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="text-[12px] tracking-widest uppercase mb-10 max-w-xs font-light"
            >
              An exploration of texture and heritage in modern silhouette.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              <Link to="/shop" className="btn-luxury-outline inline-block bg-transparent text-white border-white hover:bg-white hover:text-luxury-black">
                Discover the Story
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Right: Featured Item (45%) */}
        <div className="w-[45%] flex flex-col bg-luxury-off-white overflow-hidden justify-center p-16 md:p-24">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="space-y-12"
          >
            <div className="flex justify-between items-start gap-6">
              <h2 className="text-3xl font-serif tracking-wide leading-tight">{heroProduct.name}</h2>
              <span className="text-lg font-light tracking-tighter shrink-0">{formatPeso(heroProduct.price)}</span>
            </div>
            <p className="text-[11px] text-black/50 uppercase tracking-[0.1em]">Eau de parfum • House of Seraphina</p>

            <div className="space-y-8">
              <Link to={`/product/${heroProduct.id}`} className="w-full btn-luxury inline-block text-center whitespace-nowrap">
                Add to Shopping Bag
              </Link>
            </div>

            <div className="pt-12 border-t border-luxury-border space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-wider">Complimentary Shipping</h3>
                  <p className="text-[10px] text-black/40 serif-italic mt-1">Standard: 2-4 business days</p>
                </div>
                <div className="text-[9px] uppercase border border-luxury-border px-2 py-1 font-bold">Free</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Collection Editorial */}
      <section className="py-40 px-6 md:px-12 max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="space-y-12"
          >
            <span className="text-[10px] uppercase tracking-[0.4em] text-luxury-gold font-bold">Savoir-Faire</span>
            <h2 className="text-5xl md:text-7xl leading-[1.1] font-serif">The Art of <br /><span className="serif-italic">Precise Craftsmanship</span></h2>
            <p className="text-[14px] font-light text-luxury-black/60 leading-relaxed max-w-lg tracking-wide">
              Every fold, every stitch, every texture is a testament to our commitment to excellence. We believe that true luxury is found in the details that remain unseen yet deeply felt.
            </p>
            <div className="pt-4">
              <Link to="/about" className="group flex items-center gap-6 text-[10px] uppercase tracking-[0.3em] font-bold">
                Read the Story
                <span className="w-12 h-[1px] bg-luxury-black transition-all duration-500 group-hover:w-20" />
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="aspect-[4/5] relative bg-luxury-neutral"
          >
            <img 
              src="https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=1200&auto=format&fit=crop" 
              alt="Artisan at work" 
              className="w-full h-full object-cover grayscale transition-all duration-700 hover:grayscale-0"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </section>

      {/* Trending Items Grid */}
      <section className="bg-luxury-neutral py-32 px-6 md:px-12">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <h2 className="text-4xl md:text-5xl font-serif">Trending Now</h2>
            <Link to="/shop" className="text-xs uppercase tracking-widest font-semibold pb-1 border-b border-luxury-black transition-opacity hover:opacity-60">
              View All Collection
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {featuredProducts.map((product, idx) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.2 }}
                className="group cursor-pointer"
              >
                <Link to={`/product/${product.id}`} className="block overflow-hidden relative aspect-[3/4]">
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-luxury-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute bottom-6 left-6 text-white opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700 font-serif italic text-lg">
                    Discover More
                  </div>
                </Link>
                <div className="mt-6 text-center space-y-2">
                  <p className="text-[10px] uppercase tracking-widest opacity-50 font-semibold">{product.category}</p>
                  <h3 className="text-lg font-serif tracking-wide">{product.name}</h3>
                  <p className="text-xs font-medium tracking-widest">{formatPeso(product.price)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Campaign Section */}
      <section className="relative h-[80vh] w-full flex items-center px-6 md:px-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=2400&auto=format&fit=crop" 
            alt="New Campaign" 
            className="w-full h-full object-cover grayscale"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-luxury-black/40" />
        </div>
        
        <div className="relative z-10 max-w-xl text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-5xl md:text-7xl font-serif mb-8 leading-tight">Limited Edition: <br />The Golden Hour</h2>
            <p className="text-lg font-light opacity-80 mb-12 leading-relaxed">
              An exclusive collection available only for the season. Discover the interplay of light and texture in pieces designed for timeless moments.
            </p>
            <Link to="/shop?collection=limited" className="btn-luxury bg-white text-luxury-black border-none">
              Explore Collection
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
