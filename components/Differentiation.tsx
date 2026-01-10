"use client";

import { motion } from "framer-motion";

const traditionalIssues = [
  "Static templates",
  "No ATS intelligence",
  "Manual editing for every job",
];

const platformBenefits = [
  "Live AI editing",
  "Real ATS scoring",
  "One resume → many jobs",
  "Built for real recruiters",
];

export default function Differentiation() {
  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-black text-center mb-8 sm:mb-12 md:mb-16"
        >
          Why This Is Different
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
          {/* Traditional Resume Builders */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gray-50 p-6 sm:p-8 rounded-xl border-2 border-gray-200"
          >
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="text-3xl sm:text-4xl mr-2 sm:mr-3">❌</div>
              <h3 className="text-xl sm:text-2xl font-bold text-black">
                Traditional Resume Builders
              </h3>
            </div>
            <ul className="space-y-3">
              {traditionalIssues.map((issue, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span className="text-gray-700">{issue}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Your Platform */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-black p-6 sm:p-8 rounded-xl text-white"
          >
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="text-3xl sm:text-4xl mr-2 sm:mr-3">✅</div>
              <h3 className="text-xl sm:text-2xl font-bold">ResumeIt Platform</h3>
            </div>
            <ul className="space-y-3">
              {platformBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-white/60 mr-2">•</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

