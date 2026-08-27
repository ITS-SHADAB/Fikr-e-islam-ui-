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
    <div className="h-full">
      <Link to={to} className="group block h-full">
        <div
          className="relative h-full overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
          style={{ borderColor: COLORS.border }}
        >
          {/* Top gradient accent bar */}
          <div
            className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl"
            style={{
              background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.primary})`,
            }}
          />

          {/* Background warm beige blob — top-right */}
          <div
            className="absolute -top-10 -right-10 h-32 w-32 rounded-full pointer-events-none"
            style={{ backgroundColor: COLORS.secondary, opacity: 0.75 }}
          />
          {/* Accent blob — bottom-left */}
          <div
            className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full pointer-events-none"
            style={{ backgroundColor: COLORS.secondary, opacity: 0.5 }}
          />

          <div className="relative z-10 flex flex-col items-center text-center p-5 sm:p-6 h-full">
            {/* Static clean icon wrapper without animation */}
            <div
              className="relative mb-3 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl border shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${COLORS.secondary} 0%, #ede6da 100%)`,
                borderColor: COLORS.border,
                color: COLORS.primary,
              }}
            >
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>

            {/* Title */}
            <h3
              className="mb-2 text-base sm:text-lg font-bold leading-snug tracking-wide"
              style={{ color: COLORS.primary }}
            >
              {title}
            </h3>

            {/* Description */}
            <p
              className="text-xs sm:text-sm leading-6 min-h-[54px] flex-1"
              style={{ color: COLORS.textSecondary }}
            >
              {description}
            </p>

            {/* Divider */}
            <div className="relative my-3 flex items-center justify-center">
              <div
                className="h-px w-8 rounded-full"
                style={{ backgroundColor: COLORS.accent }}
              />
            </div>

            {/* CTA */}
            <div
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold"
              style={{ color: COLORS.primary }}
            >
              مزید جانیں
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full"
                style={{ backgroundColor: COLORS.secondary }}
              >
                <ArrowLeft className="h-3 w-3" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
