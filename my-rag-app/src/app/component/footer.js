"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function Footer() {
  const pathname = usePathname();
  
  if (pathname === '/chatbot') {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-300 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-white tracking-tight">
            Study<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Smarter</span>
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
            Your intelligent learning assistant that adapts to your unique study style. Learn faster, remember more.
          </p>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Product</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-blue-400 transition-colors">Features</Link></li>
            <li><Link href="/" className="hover:text-blue-400 transition-colors">Pricing</Link></li>
            <li><Link href="/" className="hover:text-blue-400 transition-colors">Use Cases</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-purple-400 transition-colors">Blog</Link></li>
            <li><Link href="/" className="hover:text-purple-400 transition-colors">Documentation</Link></li>
            <li><Link href="/" className="hover:text-purple-400 transition-colors">Community</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="/" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/" className="hover:text-white transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm text-slate-500">
          © {currentYear} StudySmarter. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;