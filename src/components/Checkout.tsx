/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { Truck, Wallet, CheckCircle2, Landmark, Plus, ChevronDown, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatPeso } from '../utils/formatPeso';
import {
  LAST_ORDER_SESSION_KEY,
  persistOrder,
  type StoredOrder
} from '../orderStorage';

type Step = 'shipping' | 'payment' | 'confirmation';

const PAYMENT_OPTIONS = [
  {
    id: 'cod',
    title: 'Cash on Delivery',
    description: 'Pay with cash when your order is delivered to you.'
  },
  {
    id: 'payment_center',
    title: 'Payment Center / E-wallet',
    description: 'Settle via partner payment centers or supported e-wallets.'
  },
  {
    id: 'online_banking',
    title: 'Online Banking',
    description: 'Pay through your bank\'s bill payment or transfer facility.'
  }
] as const;

const BANK_CHOICES = ['Visa', 'Mastercard', 'JCB', 'Amex', 'UnionPay'] as const;
const SHIPPING_FEE = 70;

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState<Step>('shipping');
  const [confirmationOrderId, setConfirmationOrderId] = useState<string | null>(null);
  const [bankChoice, setBankChoice] = useState<(typeof BANK_CHOICES)[number]>('Visa');
  const navigate = useNavigate();
  const orderTotal = cartTotal + SHIPPING_FEE;
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'United States',
    paymentMethod: '',
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
      if (!formData.paymentMethod) {
        alert('Please select a payment method');
        return;
      }
      if (!formData.agreeToTerms) {
        alert('Please agree to the Terms & Conditions');
        return;
      }

      const paymentLabel =
        PAYMENT_OPTIONS.find((o) => o.id === formData.paymentMethod)?.title ??
        formData.paymentMethod;
      const orderId = `SR-${Date.now()}`;

      const order: StoredOrder = {
        id: orderId,
        placedAt: new Date().toISOString(),
        email: formData.email.trim(),
        status: 'Processing',
        paymentMethodId: formData.paymentMethod,
        paymentMethodLabel: paymentLabel,
        shipping: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          postalCode: formData.postalCode.trim(),
          country: formData.country
        },
        lines: cart.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.images[0] ?? '',
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor
        })),
        subtotal: cartTotal,
        total: orderTotal
      };

      persistOrder(order);
      setConfirmationOrderId(orderId);
      setStep('confirmation');
      setTimeout(() => {
        clearCart();
      }, 500);
    }
  };

  const goToOrderTracking = () => {
    const id =
      confirmationOrderId ??
      (typeof sessionStorage !== 'undefined'
        ? sessionStorage.getItem(LAST_ORDER_SESSION_KEY)
        : null);
    if (id) {
      navigate(`/orders/${id}`);
    } else {
      alert('Unable to open order details. Please try again from checkout.');
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
        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-12 mb-12 md:mb-20 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] font-medium">
          <div className={`flex items-center gap-2 sm:gap-3 transition-opacity ${step === 'shipping' ? 'opacity-100 font-bold' : 'opacity-40'}`}>
            <span className={`w-6 h-6 flex items-center justify-center border ${step === 'shipping' ? 'border-luxury-black bg-luxury-black text-white' : 'border-luxury-black/20'}`}>1</span>
            Shipping
          </div>
          <div className="w-6 sm:w-10 h-[1px] bg-luxury-black/10" />
          <div className={`flex items-center gap-2 sm:gap-3 transition-opacity ${step === 'payment' ? 'opacity-100 font-bold' : 'opacity-40'}`}>
            <span className={`w-6 h-6 flex items-center justify-center border ${step === 'payment' ? 'border-luxury-black bg-luxury-black text-white' : 'border-luxury-black/20'}`}>2</span>
            Payment
          </div>
          <div className="w-6 sm:w-10 h-[1px] bg-luxury-black/10" />
          <div className={`flex items-center gap-2 sm:gap-3 transition-opacity ${step === 'confirmation' ? 'opacity-100 font-bold' : 'opacity-40'}`}>
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
                    <h1 className="text-4xl md:text-5xl font-serif">Order Completed</h1>
                    <p className="text-sm font-light opacity-60 max-w-sm mx-auto leading-relaxed">
                      Thank you for your order. A confirmation has been sent to{' '}
                      <span className="font-medium text-luxury-black">{formData.email}</span>. We will prepare your items for delivery shortly.
                    </p>
                  </div>
                  <div className="pt-8 flex flex-col md:flex-row gap-4 justify-center">
                    <button type="button" onClick={() => navigate('/shop')} className="btn-luxury">
                      Continue Shopping
                    </button>
                    <button type="button" onClick={goToOrderTracking} className="btn-luxury-outline">
                      Track Your Order
                    </button>
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                              <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                            </div>
                            <Input label="Address" name="address" value={formData.address} onChange={handleInputChange} required />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              <Input label="City" name="city" value={formData.city} onChange={handleInputChange} required />
                              <Input label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleInputChange} required />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {step === 'payment' && (
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                          <Header icon={<Wallet size={18} strokeWidth={1} />} title="Payment Method" />
                          <div className="grid grid-cols-1 gap-6">
                            <label
                              className={`block border cursor-pointer transition-all ${
                                formData.paymentMethod === 'online_banking'
                                  ? 'border-luxury-black bg-luxury-black/[0.015]'
                                  : 'border-luxury-border hover:border-luxury-black/40'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-4 p-5 sm:p-7 border-b border-luxury-black/10">
                                <div className="flex items-center gap-4 sm:gap-5">
                                  <span className="w-11 h-11 rounded-full bg-luxury-gold text-white flex items-center justify-center">
                                    <Landmark size={18} />
                                  </span>
                                  <span>
                                    <span className="block text-[11px] font-bold uppercase tracking-[0.2em]">
                                      Online Banking
                                    </span>
                                    <span className="block text-[10px] font-light opacity-60 mt-1">
                                      Continue with supported bank cards.
                                    </span>
                                  </span>
                                </div>
                                <span
                                  className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                                    formData.paymentMethod === 'online_banking'
                                      ? 'border-luxury-gold'
                                      : 'border-luxury-black/25'
                                  }`}
                                >
                                  <span
                                    className={`w-2.5 h-2.5 rounded-full ${
                                      formData.paymentMethod === 'online_banking'
                                        ? 'bg-luxury-gold'
                                        : 'bg-transparent'
                                    }`}
                                  />
                                </span>
                              </div>
                              <input
                                type="radio"
                                name="paymentMethod"
                                value="online_banking"
                                checked={formData.paymentMethod === 'online_banking'}
                                onChange={handleInputChange}
                                className="sr-only"
                              />
                              {formData.paymentMethod === 'online_banking' && (
                                <div className="p-5 sm:p-7 space-y-4">
                                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-luxury-black/50">
                                    Card Payment
                                  </p>
                                  <button
                                    type="button"
                                    className="w-full border border-luxury-black/80 px-4 sm:px-5 py-4 flex items-center justify-between text-left hover:border-luxury-black transition-colors"
                                  >
                                    <span className="flex items-center gap-3">
                                      <span className="w-10 h-10 rounded-full bg-luxury-neutral flex items-center justify-center">
                                        <Plus size={18} />
                                      </span>
                                      <span>
                                        <span className="block text-xl leading-none mb-1">Add debit/credit card</span>
                                        <span className="block text-sm font-light text-luxury-black/60">
                                          Visa, Mastercard, JCB, Amex, UnionPay
                                        </span>
                                      </span>
                                    </span>
                                    <CreditCard size={22} className="text-luxury-black/45" />
                                  </button>

                                  <div className="relative">
                                    <select
                                      value={bankChoice}
                                      onChange={(e) =>
                                        setBankChoice(e.target.value as (typeof BANK_CHOICES)[number])
                                      }
                                      className="w-full appearance-none bg-transparent border border-luxury-black/70 py-4 px-5 text-xl font-light focus:outline-none focus:border-luxury-black"
                                    >
                                      {BANK_CHOICES.map((choice) => (
                                        <option key={choice} value={choice}>
                                          {choice}
                                        </option>
                                      ))}
                                    </select>
                                    <ChevronDown
                                      size={18}
                                      className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                                    />
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input
                                      type="text"
                                      placeholder="Cardholder Name"
                                      className="border border-luxury-black/70 py-4 px-5 text-lg font-light bg-transparent focus:outline-none focus:border-luxury-black"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Card Number"
                                      className="border border-luxury-black/70 py-4 px-5 text-lg font-light bg-transparent focus:outline-none focus:border-luxury-black"
                                    />
                                    <input
                                      type="text"
                                      placeholder="MM/YY"
                                      className="border border-luxury-black/70 py-4 px-5 text-lg font-light bg-transparent focus:outline-none focus:border-luxury-black"
                                    />
                                    <input
                                      type="text"
                                      placeholder="CVV"
                                      className="border border-luxury-black/70 py-4 px-5 text-lg font-light bg-transparent focus:outline-none focus:border-luxury-black"
                                    />
                                  </div>

                                  <button
                                    type="button"
                                    className="w-full border border-luxury-black py-4 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-luxury-black hover:text-white transition-colors"
                                  >
                                    Save Card
                                  </button>
                                </div>
                              )}
                            </label>

                            <label
                              className={`block border cursor-pointer transition-all ${
                                formData.paymentMethod === 'payment_center'
                                  ? 'border-luxury-black bg-luxury-black/[0.015]'
                                  : 'border-luxury-border hover:border-luxury-black/40'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-4 p-5 sm:p-7 border-b border-luxury-black/10">
                                <div className="flex items-center gap-4 sm:gap-5">
                                  <span className="w-11 h-11 rounded-full bg-luxury-gold text-white flex items-center justify-center">
                                    <Wallet size={18} />
                                  </span>
                                  <span>
                                    <span className="block text-[11px] font-bold uppercase tracking-[0.2em]">
                                      Payment Center / E-wallet
                                    </span>
                                    <span className="block text-[10px] font-light opacity-60 mt-1">
                                      Settle via payment center partners or e-wallets.
                                    </span>
                                  </span>
                                </div>
                                <span
                                  className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                                    formData.paymentMethod === 'payment_center'
                                      ? 'border-luxury-gold'
                                      : 'border-luxury-black/25'
                                  }`}
                                >
                                  <span
                                    className={`w-2.5 h-2.5 rounded-full ${
                                      formData.paymentMethod === 'payment_center'
                                        ? 'bg-luxury-gold'
                                        : 'bg-transparent'
                                    }`}
                                  />
                                </span>
                              </div>
                              <input
                                type="radio"
                                name="paymentMethod"
                                value="payment_center"
                                checked={formData.paymentMethod === 'payment_center'}
                                onChange={handleInputChange}
                                className="sr-only"
                              />
                              {formData.paymentMethod === 'payment_center' && (
                                <div className="p-5 sm:p-7 space-y-5">
                                  <div className="flex items-start justify-between gap-4">
                                    <div>
                                      <p className="text-2xl leading-none mb-2">GCash</p>
                                      <p className="text-sm font-light text-luxury-black/65">
                                        Choose how you want to continue.
                                      </p>
                                    </div>
                                    <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-luxury-gold mt-1">
                                      E-wallet
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    className="w-full rounded-2xl border border-luxury-gold px-5 py-4 text-left"
                                  >
                                    <span className="block text-3xl leading-none mb-1">Pay without linking</span>
                                    <span className="block text-sm font-light text-luxury-black/65">
                                      Continue payment with GCash
                                    </span>
                                  </button>
                                  <button
                                    type="button"
                                    className="w-full rounded-2xl border border-luxury-black/75 px-5 py-4 text-left flex items-center justify-between gap-4"
                                  >
                                    <span>
                                      <span className="block text-3xl leading-none mb-1">Link account to pay</span>
                                      <span className="block text-sm font-light text-luxury-black/65">
                                        Pay instantly next time, no extra steps
                                      </span>
                                    </span>
                                    <span className="text-2xl text-luxury-gold">Link</span>
                                  </button>
                                </div>
                              )}
                            </label>

                            <label
                              className={`flex gap-4 p-5 border cursor-pointer transition-all ${
                                formData.paymentMethod === 'cod'
                                  ? 'border-luxury-black bg-luxury-black/[0.02]'
                                  : 'border-luxury-border hover:border-luxury-black/40'
                              }`}
                            >
                              <input
                                type="radio"
                                name="paymentMethod"
                                value="cod"
                                checked={formData.paymentMethod === 'cod'}
                                onChange={handleInputChange}
                                className="mt-1 accent-luxury-black"
                              />
                              <span className="space-y-1">
                                <span className="block text-[11px] font-bold uppercase tracking-[0.2em]">
                                  Cash on Delivery
                                </span>
                                <span className="block text-[10px] font-light opacity-60 leading-relaxed">
                                  Pay with cash when your order is delivered to you.
                                </span>
                              </span>
                            </label>
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

                      <div className="pt-8 flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white border-t border-luxury-black/5 mt-12">
                        {step === 'payment' ? (
                          <button type="button" onClick={() => setStep('shipping')} className="text-[10px] uppercase tracking-widest font-bold opacity-40 hover:opacity-100 transition-opacity">
                            Back to Shipping
                          </button>
                        ) : <div />}
                        <button type="submit" className="btn-luxury min-w-0 sm:min-w-[200px] w-full sm:w-auto">
                          {step === 'shipping' ? 'Continue to Payment' : 'Complete Purchase'}
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
                              <img src={item.images[0]} alt={item.name} className="w-full h-full object-contain object-center bg-luxury-neutral" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <h4 className="text-[10px] font-bold uppercase tracking-widest leading-tight">{item.name}</h4>
                              <p className="text-[9px] opacity-40 uppercase tracking-widest">Qty: {item.quantity} • {item.selectedSize || 'Standard'}</p>
                              <p className="text-[10px] font-medium pt-1">{formatPeso(item.price * item.quantity)}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-4 pt-10 border-t border-luxury-black/5">
                        <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase">
                          <span>Subtotal</span>
                          <span>{formatPeso(cartTotal)}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase mb-4">
                          <span>Shipping</span>
                          <span>{formatPeso(SHIPPING_FEE)}</span>
                        </div>
                        <div className="flex justify-between items-baseline pt-4 border-t border-luxury-black/10">
                          <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Total</span>
                          <span className="text-3xl font-serif">{formatPeso(orderTotal)}</span>
                        </div>
                      </div>

                      <div className="pt-6 text-center space-y-2 opacity-50 text-[9px] uppercase tracking-widest font-bold leading-relaxed">
                        <p>Cash on Delivery</p>
                        <p>Payment Center / E-wallet</p>
                        <p>Online Banking</p>
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
