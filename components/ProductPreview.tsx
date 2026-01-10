"use client";

import { motion } from "framer-motion";

export default function ProductPreview() {
  return (
    <section id="product" className="pt-6 sm:pt-8 md:pt-10 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 p-8 md:p-12 shadow-xl"
        >
          {/* Mockup Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="text-sm text-gray-500">ResumeIt Editor</div>
          </div>

          {/* Mockup Content */}
          <div className="bg-white rounded-lg p-6 md:p-8 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Sidebar - Resume Editor */}
              <div className="lg:col-span-2">
                <div className="mb-4">
                  <div className="h-8 bg-gray-100 rounded w-48 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="h-6 bg-gray-100 rounded w-32 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar - AI Chat & ATS Score */}
              <div className="space-y-4">
                {/* AI Chat Panel */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full mr-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>

                {/* ATS Score Panel */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="h-5 bg-green-200 rounded w-32 mb-2"></div>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    94%
                  </div>
                  <div className="h-3 bg-green-200 rounded w-full"></div>
                </div>

                {/* Job Description Input */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="h-4 bg-gray-300 rounded w-40 mb-3"></div>
                  <div className="h-20 bg-white rounded border border-gray-300"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center text-gray-600 mt-8 text-lg"
        >
          A focused editor built only for resumes — no distractions.
        </motion.p>
      </div>
    </section>
  );
}

