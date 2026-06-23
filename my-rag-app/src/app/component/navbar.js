"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from "./AuthContext"

function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  if (pathname === '/chatbot' || pathname === '/authenticate/login' || pathname === '/authenticate/register') {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="bg-black/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <span className="text-2xl font-bold text-white cursor-pointer">EduAI</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className="border-transparent text-slate-400 hover:border-slate-600 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                Home
              </Link>
              {isAuthenticated && (
                <>
                  <Link href="/chatbot" className="border-transparent text-slate-400 hover:border-slate-600 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                    Chatbot
                  </Link>
                  <Link href="/youtube" className="border-transparent text-slate-400 hover:border-slate-600 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                    YouTube Summary
                  </Link>
                </>
              )}
              <a href="#" className="border-transparent text-slate-400 hover:border-slate-600 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                Pricing
              </a>
              <a href="#" className="border-transparent text-slate-400 hover:border-slate-600 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                About
              </a>
            </div>
          </div>
          <div className="flex items-center">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <div className="px-4 py-2 text-sm font-medium text-white bg-blue-600/20 border border-blue-500/30 rounded-lg">
                  {user.name}
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-sm font-medium text-slate-400 hover:text-red-400 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link href="/authenticate/login">
                  <button className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors border border-transparent hover:border-slate-700 rounded-lg">
                    Sign In
                  </button>
                </Link>
                <Link href="/authenticate/register">
                  <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600/80 hover:bg-blue-600 transition-colors rounded-lg">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;