import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { COLORS } from "@/utils/themeColors";
import { motion } from "framer-motion";

export default function AnimatedFeatureCard({
  icon: Icon,
  title,
  description,
  to,
  index = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="h-full"
    >
      <Link to={to} className="group block h-full">
        <div
          className="relative h-full overflow-hidden rounded-3xl border bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_-12px_rgba(74,55,40,0.22)] shadow-[0_4px_24px_-6px_rgba(74,55,40,0.10)]"
          style={{ borderColor: COLORS.border }}
        >
          {/* Top gradient accent bar */}
          <div
            className="absolute inset-x-0 top-0 h-[3px] rounded-t-3xl"
            style={{
              background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.primary})`,
            }}
          />

          {/* Large visible warm beige blob — top-right (like screenshot 1) */}
          <div
            className="absolute -top-12 -right-12 h-40 w-40 rounded-full transition-all duration-500 group-hover:scale-110"
            style={{ backgroundColor: COLORS.secondary, opacity: 0.75 }}
          />
          {/* Smaller accent blob — bottom-left */}
          <div
            className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full transition-all duration-500 group-hover:scale-110"
            style={{ backgroundColor: COLORS.secondary, opacity: 0.5 }}
          />

          <div className="relative z-10 flex flex-col items-center text-center p-7 h-full">
            {/* Icon wrapper */}
            <div
              className="relative mb-5 flex h-[68px] w-[68px] items-center justify-center rounded-2xl border shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-xl"
              style={{
                background: `linear-gradient(135deg, ${COLORS.secondary} 0%, #ede6da 100%)`,
                borderColor: COLORS.border,
                color: COLORS.primary,
              }}
            >
              {/* Inner glow on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(ellipse at center, ${COLORS.accent}44, transparent 70%)`,
                }}
              />
              <Icon className="h-7 w-7 relative z-10" />
            </div>

            {/* Title */}
            <h3
              className="mb-3 text-lg font-bold leading-relaxed tracking-wide"
              style={{ color: COLORS.primary }}
            >
              {title}
            </h3>

            {/* Description */}
            <p
              className="text-sm leading-7 min-h-[88px] flex-1"
              style={{ color: COLORS.textSecondary }}
            >
              {description}
            </p>

            {/* Animated divider */}
            <div className="relative my-5 flex items-center justify-center">
              <div
                className="h-px w-10 transition-all duration-500 group-hover:w-20 rounded-full"
                style={{ backgroundColor: COLORS.accent }}
              />
            </div>

            {/* CTA */}
            <div
              className="inline-flex items-center gap-2 text-sm font-bold transition-all duration-300 group-hover:gap-3"
              style={{ color: COLORS.primary }}
            >
              مزید جانیں
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110"
                style={{ backgroundColor: COLORS.secondary }}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
