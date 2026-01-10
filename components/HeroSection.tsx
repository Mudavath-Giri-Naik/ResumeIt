"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center w-full">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-black mb-3 sm:mb-4 md:mb-6 leading-tight px-2"
        >
          Edit, Optimize, and Tailor
          <br className="hidden sm:block" />
          <span className="inline-block sm:inline">
            <br className="sm:hidden" />
            <span className="bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
              Your Resume with AI
            </span>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-4 sm:mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-2"
        >
          Upload your resume, edit it like Google Docs, chat with AI for
          improvements, test ATS score with any job description, and download a
          job-ready PDF.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-2"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-black text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-gray-800 transition-colors w-full sm:w-auto"
          >
            Redesign from Existing
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = "/editor"}
            className="bg-black text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-gray-800 transition-colors w-full sm:w-auto"
          >
            Design from Scratch
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

