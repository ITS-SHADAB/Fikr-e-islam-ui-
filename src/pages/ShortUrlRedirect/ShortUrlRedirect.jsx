import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { getFatwaByShortCode } from "@/services/fatwa";
import { getArticleByShortCode } from "@/services/article";
import { getPublicationBySlug } from "@/services/publication";
import { getQuestionBySlug } from "@/services/question";
import { Spinner, SEO } from "@/components";
import { COLORS } from "@/utils/themeColors";
import { AlertCircle, Home, BookOpen } from "lucide-react";

const fetchBook = async (code) => {
  const data = await getPublicationBySlug(code);
  const slug = data?.book?.slug || data?.slug;
  if (slug) {
    return { success: true, slug };
  }
  return data;
};

const fetchQuestion = async (code) => {
  const data = await getQuestionBySlug(code);
  const slug = data?.question?.slug || data?.slug;
  if (slug) {
    return { success: true, slug };
  }
  return data;
};

const TYPE_CONFIG = {
  fatwa: {
    itemLabel: "فتویٰ",
    pluralPath: "/fatwas",
    pluralLabel: "تمام فتاویٰ",
    fetcher: getFatwaByShortCode,
  },
  article: {
    itemLabel: "مضمون",
    pluralPath: "/articles",
    pluralLabel: "تمام مضامین",
    fetcher: getArticleByShortCode,
  },
  book: {
    itemLabel: "کتاب",
    pluralPath: "/publications",
    pluralLabel: "تمام کتب",
    fetcher: fetchBook,
  },
  publication: {
    itemLabel: "کتاب",
    pluralPath: "/publications",
    pluralLabel: "تمام کتب",
    fetcher: fetchBook,
  },
  question: {
    itemLabel: "سوال و جواب",
    pluralPath: "/qa",
    pluralLabel: "تمام سوال و جواب",
    fetcher: fetchQuestion,
  },
  qa: {
    itemLabel: "سوال و جواب",
    pluralPath: "/qa",
    pluralLabel: "تمام سوال و جواب",
    fetcher: fetchQuestion,
  },
};

export default function ShortUrlRedirect({ type = "fatwa" }) {
  const { code } = useParams();
  const navigate = useNavigate();
  const [errorState, setErrorState] = useState(null);

  const config = TYPE_CONFIG[type] || TYPE_CONFIG.fatwa;
  const { itemLabel, pluralPath, pluralLabel, fetcher } = config;

  useEffect(() => {
    let isMounted = true;

    async function resolveShortUrl() {
      if (!code) {
        if (isMounted) setErrorState("کوڈ فراہم نہیں کیا گیا ہے۔");
        return;
      }

      try {
        const result = await fetcher(code);

        if (!isMounted) return;

        if (result?.success && result?.slug) {
          const destination = `${pluralPath}/${result.slug}`;
          // Use replace to avoid keeping the intermediate short redirect in history
          navigate(destination, { replace: true });
        } else {
          setErrorState(`مطلوبہ ${itemLabel} دستیاب نہیں ہے۔ ہو سکتا ہے اسے ہٹا دیا گیا ہو۔`);
        }
      } catch (err) {
        if (!isMounted) return;
        const msg =
          err?.response?.data?.message ||
          `مطلوبہ ${itemLabel} نہیں ملا یا لنک کی میعاد ختم ہو چکی ہے۔`;
        setErrorState(msg);
      }
    }

    resolveShortUrl();

    return () => {
      isMounted = false;
    };
  }, [code, fetcher, itemLabel, navigate, pluralPath]);

  // Loading / Redirecting state
  if (!errorState) {
    return (
      <div
        className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center"
        style={{ backgroundColor: COLORS.background }}
        dir="rtl"
      >
        <SEO
          title={`منتقلی ہو رہی ہے... | فکرِ اسلام`}
          description="مطلوبہ صفحے پر منتقل کیا جا رہا ہے..."
          noindex={true}
        />
        <div
          className="p-8 sm:p-10 rounded-3xl border shadow-md max-w-md w-full flex flex-col items-center"
          style={{
            backgroundColor: COLORS.white,
            borderColor: COLORS.border,
          }}
        >
          <Spinner size="lg" text={`${itemLabel} پر منتقل کیا جا رہا ہے...`} />
          <p
            className="text-xs sm:text-sm mt-4 font-['Payami_Nastaleeq',serif]"
            style={{ color: COLORS.textSecondary }}
          >
            براہِ کرم چند لمحے انتظار فرمائیں، اصل صفحہ کھولا جا رہا ہے...
          </p>
        </div>
      </div>
    );
  }

  // Error / Not Found state
  return (
    <div
      className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16"
      style={{ backgroundColor: COLORS.background }}
      dir="rtl"
    >
      <SEO
        title={`${itemLabel} نہیں ملا | فکرِ اسلام`}
        description="مطلوبہ لنک درست نہیں ہے یا مواد حذف کر دیا گیا ہے۔"
        noindex={true}
      />
      <div
        className="p-6 sm:p-10 rounded-3xl border shadow-lg max-w-lg w-full text-center relative overflow-hidden"
        style={{
          backgroundColor: COLORS.white,
          borderColor: COLORS.border,
        }}
      >
        {/* Decorative Top Accent Bar */}
        <div
          className="absolute top-0 inset-x-0 h-1.5"
          style={{ backgroundColor: COLORS.accent }}
        />

        <div
          className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: `${COLORS.accent}15` }}
        >
          <AlertCircle className="w-8 h-8" style={{ color: COLORS.accent }} />
        </div>

        <h1
          className="text-xl sm:text-2xl font-bold font-['Payami_Nastaleeq',serif] mb-2"
          style={{ color: COLORS.primary }}
        >
          مطلوبہ {itemLabel} دستیاب نہیں ہے
        </h1>

        <p
          className="text-xs sm:text-sm mb-6 leading-relaxed font-['Payami_Nastaleeq',serif]"
          style={{ color: COLORS.textSecondary }}
        >
          {errorState}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to={pluralPath}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white transition-opacity hover:opacity-90 font-['Payami_Nastaleeq',serif]"
            style={{ backgroundColor: COLORS.primary }}
          >
            <BookOpen className="w-4 h-4" />
            <span>{pluralLabel} دیکھیں</span>
          </Link>

          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm border transition-colors hover:bg-stone-50 font-['Payami_Nastaleeq',serif]"
            style={{
              borderColor: COLORS.border,
              color: COLORS.textSecondary,
              backgroundColor: COLORS.background,
            }}
          >
            <Home className="w-4 h-4" />
            <span>مرکزی صفحہ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

ShortUrlRedirect.propTypes = {
  type: PropTypes.oneOf(["fatwa", "article", "book", "publication", "question", "qa"]).isRequired,
};
