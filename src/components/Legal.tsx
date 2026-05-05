/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export function Terms() {
  return (
    <LegalLayout title="Terms & Conditions">
      <section className="space-y-6">
        <h2 className="text-lg font-serif">1. Scope of Application</h2>
        <p className="text-xs font-light leading-relaxed opacity-70">
          Welcome to Seraphina. These Terms and Conditions govern your use of our website and purchase of products from our collection. By accessing our site, you agree to these conditions.
        </p>
      </section>
      <section className="space-y-6">
        <h2 className="text-lg font-serif">2. Intellectual Property</h2>
        <p className="text-xs font-light leading-relaxed opacity-70">
          All content, including but not limited to designs, photography, text, and logos, are the exclusive property of Seraphina Luxe and are protected by international copyright laws.
        </p>
      </section>
      <section className="space-y-6">
        <h2 className="text-lg font-serif">3. Orders and Payment</h2>
        <p className="text-xs font-light leading-relaxed opacity-70">
          Each order constitutes an offer to purchase. We reserve the right to refuse or cancel orders for any reason, including product availability or errors in pricing or product information.
        </p>
        <p className="text-xs font-light leading-relaxed opacity-70">
          We accept the following payment methods: Cash on Delivery; Payment Center and E-wallet; and Online Banking. Instructions or references for Payment Center/E-wallet and Online Banking will be provided when you finalize your order.
        </p>
      </section>
    </LegalLayout>
  );
}

export function Privacy() {
  return (
    <LegalLayout title="Privacy Policy">
      <section className="space-y-6">
        <h2 className="text-lg font-serif">Data Protection</h2>
        <p className="text-xs font-light leading-relaxed opacity-70">
          Your privacy is of paramount importance to Seraphina. We process personal data only to fulfill your requests and improve your experience. Your data is encrypted and handled with the highest standards of security.
        </p>
      </section>
      <section className="space-y-6">
        <h2 className="text-lg font-serif">Cookies</h2>
        <p className="text-xs font-light leading-relaxed opacity-70">
          We use essential cookies to maintain your shopping session and enhance site performance. You may adjust your browser settings to manage these, though some features may be limited.
        </p>
      </section>
    </LegalLayout>
  );
}

export function Delivery() {
  return (
    <LegalLayout title="Delivery & Returns">
      <section className="space-y-6">
        <h2 className="text-lg font-serif">Shipping Methods</h2>
        <p className="text-xs font-light leading-relaxed opacity-70">
          We offer complimentary standard shipping globally. Express delivery is available for urgent requirements, typically arriving within 2-3 business days.
        </p>
      </section>
      <section className="space-y-6">
        <h2 className="text-lg font-serif">Returns Policy</h2>
        <p className="text-xs font-light leading-relaxed opacity-70">
          Items may be returned within 30 days of receipt, provided they are in their original condition and packaging. Due to hygiene reasons, beauty products and personalized items are final sale.
        </p>
      </section>
    </LegalLayout>
  );
}

function LegalLayout({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="pt-40 min-h-screen max-w-3xl mx-auto px-6 pb-40">
      <div className="text-center mb-20 space-y-4">
        <h1 className="text-5xl font-serif">{title}</h1>
        <p className="text-[10px] uppercase tracking-[0.4em] opacity-40 font-bold">Luxury Agreement & Policy</p>
      </div>
      <div className="space-y-16">
        {children}
      </div>
    </div>
  );
}
