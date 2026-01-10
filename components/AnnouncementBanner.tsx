"use client";

import { motion } from "framer-motion";

export default function AnnouncementBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-20 md:pt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-1 sm:pb-2">
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center space-x-1.5 sm:space-x-2 bg-gray-100 rounded-full px-3 sm:px-4 py-1 sm:py-1.5">
            <span className="text-xs sm:text-sm text-gray-700 font-medium">
              Used by 10,000+ job seekers
            </span>
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

