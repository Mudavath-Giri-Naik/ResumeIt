"use client";

import { motion } from "framer-motion";

const plans = [
  {
    name: "Free",
    description: "Upload + basic edit",
    features: ["Upload resume", "Basic editing", "PDF export"],
  },
  {
    name: "Pro",
    description: "ATS score + tailoring",
    features: ["Everything in Free", "ATS scoring", "Job-specific tailoring"],
  },
  {
    name: "Premium",
    description: "Unlimited job-specific resumes",
    features: [
      "Everything in Pro",
      "Unlimited tailoring",
      "AI improvements",
      "Priority support",
    ],
  },
];

export default function PricingPreview() {
  return (
    <section
      id="pricing"
      className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white"
    >
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-black text-center mb-3 sm:mb-4"
        >
          Simple Pricing
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-gray-600 text-base sm:text-lg mb-8 sm:mb-12 md:mb-16"
        >
          Start free. Upgrade when ready.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`p-6 sm:p-8 rounded-xl border-2 ${
                index === 1
                  ? "border-black bg-black text-white"
                  : "border-gray-200 bg-white"
              }`}
            >
              <h3 className="text-xl sm:text-2xl font-bold mb-2">{plan.name}</h3>
              <p
                className={`mb-4 sm:mb-6 text-sm sm:text-base ${
                  index === 1 ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {plan.description}
              </p>
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <span
                      className={`mr-2 flex-shrink-0 ${
                        index === 1 ? "text-white" : "text-black"
                      }`}
                    >
                      ✓
                    </span>
                    <span
                      className={`text-sm sm:text-base ${
                        index === 1 ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition-colors ${
                  index === 1
                    ? "bg-white text-black hover:bg-gray-100"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                Get Started
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

