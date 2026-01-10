"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-4 left-4 right-4 md:left-4 md:right-4 z-50 bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl font-bold text-black">
              Docsy
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#product"
              className="text-gray-700 hover:text-black transition-colors text-sm font-medium"
            >
              Product
            </a>
            <a
              href="#ats"
              className="text-gray-700 hover:text-black transition-colors text-sm font-medium"
            >
              ATS
            </a>
            <a
              href="#templates"
              className="text-gray-700 hover:text-black transition-colors text-sm font-medium"
            >
              Templates
            </a>
            <a
              href="#blog"
              className="text-gray-700 hover:text-black transition-colors text-sm font-medium"
            >
              Blog
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-700 hover:text-black transition-colors text-sm font-medium">
              Login
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Sign Up
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-4 space-y-4"
          >
            <a
              href="#product"
              className="block text-gray-700 hover:text-black transition-colors"
            >
              Product
            </a>
            <a
              href="#ats"
              className="block text-gray-700 hover:text-black transition-colors"
            >
              ATS
            </a>
            <a
              href="#templates"
              className="block text-gray-700 hover:text-black transition-colors"
            >
              Templates
            </a>
            <a
              href="#blog"
              className="block text-gray-700 hover:text-black transition-colors"
            >
              Blog
            </a>
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <button className="block w-full text-left text-gray-700 hover:text-black transition-colors">
                Login
              </button>
              <button className="block w-full bg-black text-white px-4 py-2 rounded-lg text-sm font-medium">
                Sign Up
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}

