"use client";

import { motion } from "framer-motion";

const useCases = [
  "Students applying for internships",
  "Freshers applying for multiple roles",
  "Professionals switching jobs",
  "Tech roles vs non-tech roles",
];

export default function UseCases() {
  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-black text-center mb-8 sm:mb-12"
        >
          Perfect For
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 hover:border-black transition-colors"
            >
              <div className="flex items-center">
                <div className="w-2 h-2 bg-black rounded-full mr-3 sm:mr-4 flex-shrink-0"></div>
                <p className="text-base sm:text-lg text-gray-800">{useCase}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

