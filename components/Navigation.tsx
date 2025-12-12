'use client';

import { useState } from 'react';
import Link from 'next/link';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              C
            </div>
            <span className="text-xl font-bold text-gray-800">CircleCare</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link href="/how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">
              How It Works
            </Link>
            <Link href="/docs" className="text-gray-600 hover:text-blue-600 transition-colors">
              Docs
            </Link>
            <button className="btn-primary">
              Launch App
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/about" 
                className="text-gray-600 hover:text-blue-600 transition-colors px-2 py-1"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/how-it-works" 
                className="text-gray-600 hover:text-blue-600 transition-colors px-2 py-1"
                onClick={() => setIsOpen(false)}
              >
                How It Works
              </Link>
              <Link 
                href="/docs" 
                className="text-gray-600 hover:text-blue-600 transition-colors px-2 py-1"
                onClick={() => setIsOpen(false)}
              >
                Docs
              </Link>
              <button className="btn-primary w-full mt-4">
                Launch App
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}