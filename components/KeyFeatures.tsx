"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "Docs-like Resume Editor",
    description: "Edit your resume like you edit Google Docs — intuitive and fast.",
  },
  {
    title: "AI Resume Assistant",
    description: "Chat with AI to improve content, optimize bullets, and enhance wording.",
  },
  {
    title: "ATS Score with Job Description",
    description: "Paste any job description and instantly see your resume match score.",
  },
  {
    title: "Job-Specific Resume Tailoring",
    description: "One resume, automatically tailored for every job application.",
  },
  {
    title: "Grammar & Bullet Improvement",
    description: "AI-powered suggestions to make your resume stand out.",
  },
  {
    title: "ATS-Friendly PDF Export",
    description: "Download clean, optimized PDFs that pass ATS systems.",
  },
];

export default function KeyFeatures() {
  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-black text-center mb-8 sm:mb-12 md:mb-16"
        >
          Everything You Need
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 hover:border-black transition-colors"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-black mb-2">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

