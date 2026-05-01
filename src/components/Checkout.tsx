/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ShieldCheck, Truck, CreditCard, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Step = 'shipping' | 'payment' | 'confirmation';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState<Step>('shipping');
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'United States',
    cardNumber: '',
    expiry: '',
    cvv: '',
    agreeToTerms: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const val = type === 'checkbox' ? target.checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'shipping') setStep('payment');
    else if (step === 'payment') {
      if (!formData.agreeToTerms) {
        alert('Please agree to the Terms & Conditions');
        return;
      }
      setStep('confirmation');
      setTimeout(() => {
        clearCart();
      }, 500);
    }
  };

  if (cart.length === 0 && step !== 'confirmation') {
    return (
      <div className="pt-40 text-center">
        <h1 className="text-3xl font-serif mb-8">Checkout Session Expired</h1>
        <button onClick={() => navigate('/shop')} className="btn-luxury-outline">Return to Collection</button>
      </div>
    );
  }

  return (
    <div className="pt-32 min-h-screen bg-luxury-neutral/30 pb-40">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Progress Tracker */}
        <div className="flex justify-center items-center gap-4 md:gap-12 mb-20 text-[10px] uppercase tracking-[0.3em] font-medium">
          <div className={`flex items-center gap-3 transition-opacity ${step === 'shipping' ? 'opacity-100 font-bold' : 'opacity-40'}`}>
            <span className={`w-6 h-6 flex items-center justify-center border ${step === 'shipping' ? 'border-luxury-black bg-luxury-black text-white' : 'border-luxury-black/20'}`}>1</span>
            Shipping
          </div>
          <div className="w-10 h-[1px] bg-luxury-black/10" />
          <div className={`flex items-center gap-3 transition-opacity ${step === 'payment' ? 'opacity-100 font-bold' : 'opacity-40'}`}>
            <span className={`w-6 h-6 flex items-center justify-center border ${step === 'payment' ? 'border-luxury-black bg-luxury-black text-white' : 'border-luxury-black/20'}`}>2</span>
            Payment
          </div>
          <div className="w-10 h-[1px] bg-luxury-black/10" />
          <div className={`flex items-center gap-3 transition-opacity ${step === 'confirmation' ? 'opacity-100 font-bold' : 'opacity-40'}`}>
            <span className="w-6 h-6 flex items-center justify-center border border-luxury-black/20">3</span>
            Confirmation
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-12">
            <AnimatePresence mode="wait">
              {step === 'confirmation' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-12 md:p-24 shadow-sm text-center space-y-8"
                >
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                      <CheckCircle2 size={40} strokeWidth={1} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-serif">Absolu Éclat</h1>
                    <p className="text-sm font-light opacity-60 max-w-sm mx-auto leading-relaxed">
                      Thank you for your order. A confirmation has been sent to <span className="font-medium text-luxury-black">{formData.email}</span>. Your pieces of elegance will arrive shortly.
                    </p>
                  </div>
                  <div className="pt-8 flex flex-col md:flex-row gap-4 justify-center">
                    <button onClick={() => navigate('/shop')} className="btn-luxury">Continue Shopping</button>
                    <button className="btn-luxury-outline">Track Your Order</button>
                  </div>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                  {/* Left Column: Forms */}
                  <div className="lg:col-span-7 bg-white p-8 md:p-12 shadow-sm">
                    <form onSubmit={handleNext} className="space-y-12">
                      {step === 'shipping' && (
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                          <Header icon={<Truck size={18} strokeWidth={1} />} title="Shipping Information" />
                          <div className="grid grid-cols-1 gap-6">
                            <Input label="Email address" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                            <div className="grid grid-cols-2 gap-6">
                              <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                              <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                            </div>
                            <Input label="Address" name="address" value={formData.address} onChange={handleInputChange} required />
                            <div className="grid grid-cols-2 gap-6">
                              <Input label="City" name="city" value={formData.city} onChange={handleInputChange} required />
                              <Input label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleInputChange} required />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {step === 'payment' && (
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                          <Header icon={<CreditCard size={18} strokeWidth={1} />} title="Payment Details" />
                          <div className="grid grid-cols-1 gap-6">
                            <Input label="Card Number" name="cardNumber" placeholder="0000 0000 0000 0000" value={formData.cardNumber} onChange={handleInputChange} required />
                            <div className="grid grid-cols-2 gap-6">
                              <Input label="Expiry Date" name="expiry" placeholder="MM/YY" value={formData.expiry} onChange={handleInputChange} required />
                              <Input label="CVV" name="cvv" placeholder="000" value={formData.cvv} onChange={handleInputChange} required />
                            </div>
                          </div>
                          
                          <div className="pt-6 space-y-4">
                            <label className="flex items-start gap-4 cursor-pointer group">
                              <input 
                                type="checkbox" 
                                name="agreeToTerms"
                                checked={formData.agreeToTerms}
                                onChange={(e) => handleInputChange(e as any)}
                                className="mt-1 accent-luxury-black"
                              />
                              <span className="text-[10px] leading-relaxed opacity-60 font-light group-hover:opacity-100 transition-opacity">
                                I agree to the <a href="/terms" className="underline underline-offset-4 decoration-luxury-black/20">Terms & Conditions</a> and <a href="/privacy" className="underline underline-offset-4 decoration-luxury-black/20">Privacy Policy</a>.
                              </span>
                            </label>
                          </div>
                        </motion.div>
                      )}

                      <div className="pt-8 flex justify-between items-center bg-white border-t border-luxury-black/5 mt-12 pt-8">
                        {step === 'payment' ? (
                          <button type="button" onClick={() => setStep('shipping')} className="text-[10px] uppercase tracking-widest font-bold opacity-40 hover:opacity-100 transition-opacity">
                            Back to Shipping
                          </button>
                        ) : <div />}
                        <button type="submit" className="btn-luxury min-w-[200px]">
                          {step === 'shipping' ? 'Secure Payment' : 'Complete Purchase'}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Right Column: Mini Summary */}
                  <div className="lg:col-span-5">
                    <div className="bg-white p-8 md:p-10 shadow-sm space-y-10">
                      <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold">In Your Bag</h3>
                      
                      <div className="space-y-6 max-h-[400px] overflow-y-auto no-scrollbar">
                        {cart.map(item => (
                          <div key={item.id} className="flex gap-4">
                            <div className="w-16 h-20 bg-luxury-neutral overflow-hidden flex-shrink-0">
                              <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <h4 className="text-[10px] font-bold uppercase tracking-widest leading-tight">{item.name}</h4>
                              <p className="text-[9px] opacity-40 uppercase tracking-widest">Qty: {item.quantity} • {item.selectedSize || 'Standard'}</p>
                              <p className="text-[10px] font-medium pt-1">${(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-4 pt-10 border-t border-luxury-black/5">
                        <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase">
                          <span>Subtotal</span>
                          <span>${cartTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase mb-4">
                          <span>Shipping</span>
                          <span className="text-luxury-gold">Complimentary</span>
                        </div>
                        <div className="flex justify-between items-baseline pt-4 border-t border-luxury-black/10">
                          <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Total</span>
                          <span className="text-3xl font-serif">${cartTotal.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="pt-6 flex items-center justify-center gap-3 opacity-30 text-[9px] uppercase tracking-widest grayscale font-bold">
                        <ShieldCheck size={14} />
                        End-to-End Encrypted Secure Checkout
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

const Header = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
  <div className="flex items-center gap-4 mb-4">
    <div className="opacity-40">{icon}</div>
    <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold">{title}</h2>
  </div>
);

const Input = ({ label, name, ...props }: { label: string, name: string } & any) => (
  <div className="space-y-2">
    <label className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-40">{label}</label>
    <input 
      name={name}
      className="w-full bg-luxury-neutral/40 border-b border-luxury-border py-3 px-4 text-xs focus:outline-none focus:border-luxury-black transition-all placeholder:opacity-20 font-light"
      {...props}
    />
  </div>
);
