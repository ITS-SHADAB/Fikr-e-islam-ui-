import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Eye, FileText, ArrowLeft, ArrowRight } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { FATWA_CATEGORY_TRANSLATIONS } from "@/utils/categories";

export default function FatwaCard({ fatwa }) {
  const { settings } = useSettings();
  const language =
    settings?.language === "ur" || settings?.language === "Urdu" ? "ur" : "en";

  const {
    slug,
    title,
    category,
    question,
    detailedAnswer,
    publishDate,
    viewCount,
  } = fatwa;

  const formattedDate = new Date(publishDate).toLocaleDateString(
    language === "ur" ? "ur-PK" : "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  // Strip HTML tags for answer preview
  const plainAnswer = detailedAnswer
    ? detailedAnswer.replace(/<[^>]*>/g, "")
    : "";

  return (
    <Link
      to={`/fatwas/${slug}`}
      className="premium-card p-6 flex flex-col h-full group text-start hover:no-underline text-inherit cursor-pointer"
    >
      {/* Category and stats metadata */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 shrink-0">
        <span className="bg-secondary text-textSecondary text-xs font-bold px-2.5 py-1 rounded-full text-[10px]">
          {language === "ur"
            ? FATWA_CATEGORY_TRANSLATIONS[category] || category
            : category}
        </span>
        <div className="flex items-center gap-3.5 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-accent" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-accent" />
            {viewCount} {language === "en" ? "views" : "بار دیکھا گیا"}
          </span>
        </div>
      </div>

      {/* Rulings Title */}
      <h3 className="text-md font-bold text-slate-900 group-hover:text-primary transition-colors leading-[1.85] mb-3 flex items-start gap-2">
        <FileText className="w-5 h-5 text-accent shrink-0 mt-0.5" />
        <span className="line-clamp-2">{title}</span>
      </h3>

      {/* Visitor Question Query */}
      <div className="bg-slate-50 border-r-2 border-accent p-3 rounded mb-4 shrink-0">
        <span className="block text-xs font-bold text-primary mb-1">
          {language === "en" ? "Question:" : "سوال:"}
        </span>
        <p className="text-textPrimary text-xs italic line-clamp-2 leading-[2.0]">
          "{question}"
        </p>
      </div>

      {/* Rulings Answer Snippet */}
      <div className="flex-grow">
        <span className="block text-xs font-bold text-slate-500 mb-1">
          {language === "en" ? "Fatwa Summary:" : "خلاصہ فتویٰ:"}
        </span>
        <p className="text-textPrimary text-sm line-clamp-3 leading-[2.1] mb-4 font-normal">
          {plainAnswer}
        </p>
      </div>


      {/* Action CTA link */}
      <div className="mt-auto pt-2 shrink-0 flex justify-start">
        <span className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-accent transition-colors">
          {language === "en" ? "View Full Fatwa" : "مکمل فتویٰ دیکھیں"}
          {language === "en" ? (
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          ) : (
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          )}
        </span>
      </div>
    </Link>
  );
}
