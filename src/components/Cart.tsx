/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCart } from '../context/CartContext';
import { formatPeso } from '../utils/formatPeso';
import { Link, useNavigate } from 'react-router-dom';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SHIPPING_FEE = 70;

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();
  const estimatedTotal = cartTotal + SHIPPING_FEE;

  if (cart.length === 0) {
    return (
      <div className="pt-40 min-h-[70vh] flex flex-col items-center justify-center space-y-8">
        <div className="relative">
          <ShoppingBag size={80} strokeWidth={0.5} className="opacity-10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-bold whitespace-nowrap">Bag is empty</span>
          </div>
        </div>
        <h1 className="text-4xl font-serif text-center">Your shopping bag <br /><span className="serif-italic">awaits.</span></h1>
        <p className="text-xs font-light text-luxury-black/50 text-center max-w-xs leading-relaxed">
          Embark on your journey through our latest collections and discover pieces that define elegance.
        </p>
        <Link to="/shop" className="btn-luxury mt-4">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 min-h-screen pb-40 px-6 md:px-12 max-w-[1500px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-end mb-12 md:mb-16 gap-4 md:gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif mb-2">Shopping Bag</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] opacity-40 font-bold">{cartCount} {cartCount === 1 ? 'Item' : 'Items'}</p>
        </div>
        <Link to="/shop" className="text-[10px] uppercase tracking-widest font-bold border-b border-luxury-black/20 pb-1 hover:border-luxury-black transition-colors">
          Continue Browsing
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        {/* Cart items */}
        <div className="lg:col-span-8 space-y-4">
          <AnimatePresence mode="popLayout">
            {cart.map((item) => (
              <motion.div
                layout
                key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex gap-4 md:gap-8 py-6 md:py-8 border-b border-luxury-black/5 group"
              >
                <Link to={`/product/${item.id}`} className="w-24 md:w-32 aspect-[3/4] overflow-hidden bg-luxury-neutral">
                  <img 
                    src={item.images[0]} 
                    alt={item.name} 
                    className="w-full h-full object-contain object-center"
                  />
                </Link>
                
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-bold tracking-widest uppercase mb-1">{item.name}</h3>
                      <p className="text-[10px] opacity-40 uppercase tracking-widest mb-4">{item.category}</p>
                      
                      <div className="flex gap-6 text-[10px] uppercase tracking-widest font-medium opacity-60">
                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                        {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                      className="opacity-20 hover:opacity-100 transition-opacity p-2"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
                    <div className="flex items-center border border-luxury-black/10 px-2 py-1 w-fit">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 opacity-40 hover:opacity-100">
                        <Minus size={12} />
                      </button>
                      <span className="w-10 text-center text-xs">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 opacity-40 hover:opacity-100">
                        <Plus size={12} />
                      </button>
                    </div>
                    <p className="text-sm font-medium">{formatPeso(item.price * item.quantity)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="lg:col-span-4">
          <div className="bg-luxury-neutral p-10 space-y-10">
            <h2 className="text-xl font-serif">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-light">
                <span className="opacity-60 uppercase tracking-widest">Subtotal</span>
                <span>{formatPeso(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-xs font-light">
                <span className="opacity-60 uppercase tracking-widest">Digital Packaging</span>
                <span className="text-luxury-gold uppercase tracking-widest">Complimentary</span>
              </div>
              <div className="flex justify-between text-xs font-light">
                <span className="opacity-60 uppercase tracking-widest">Shipping</span>
                <span>{formatPeso(SHIPPING_FEE)}</span>
              </div>
              <div className="pt-6 mt-6 border-t border-luxury-black/10 flex justify-between items-baseline">
                <span className="text-xs uppercase tracking-[0.2em] font-bold">Estimated Total</span>
                <span className="text-2xl font-serif">{formatPeso(estimatedTotal)}</span>
              </div>
              <p className="text-[10px] opacity-40 italic leading-relaxed pt-2">
                Taxes are calculated based on your shipping address and will be added during checkout.
              </p>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="w-full btn-luxury flex items-center justify-center gap-3"
            >
              Secure Checkout
              <ArrowRight size={14} />
            </button>
            
            <div className="space-y-6 pt-4">
              <div className="flex gap-4 items-start">
                <div className="p-2 bg-white rounded-full"><ShoppingBag size={14} strokeWidth={1} /></div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold mb-1">Luxury Packaging</p>
                  <p className="text-[10px] font-light opacity-50">All orders arrive in our signature gift binding, scented with Essence D’or.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
