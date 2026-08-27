// categories.js

// ============================================================
// FATWA CATEGORIES
// ============================================================
export const FATWA_CATEGORIES = [
  { value: 'SALAH', labelUr: 'نماز', labelEn: 'SALAH' },
  { value: 'FASTING', labelUr: 'روزہ', labelEn: 'FASTING' },
  { value: 'ZAKAT', labelUr: 'زکوٰۃ', labelEn: 'ZAKAT' },
  { value: 'HAJJ_UMRAH', labelUr: 'حج و عمرہ', labelEn: 'HAJJ & UMRAH' },
  { value: 'MARRIAGE', labelUr: 'نکاح', labelEn: 'MARRIAGE' },
  { value: 'DIVORCE', labelUr: 'طلاق', labelEn: 'DIVORCE' },
  { value: 'BUSINESS', labelUr: 'تجارت', labelEn: 'BUSINESS' },
  { value: 'FAMILY_ISSUES', labelUr: 'خاندانی امور', labelEn: 'FAMILY ISSUES' },
  { value: 'EDUCATION', labelUr: 'تعلیم', labelEn: 'EDUCATION' },
  { value: 'GENERAL_QUESTIONS', labelUr: 'عام معلومات', labelEn: 'GENERAL QUESTIONS' },
];

export const FATWA_VALUES = FATWA_CATEGORIES.map(c => c.value);
export const FATWA_TRANSLATIONS = FATWA_CATEGORIES.reduce((acc, c) => {
  acc[c.value] = c.labelUr;
  return acc;
}, {});
export const FATWA_EN_LABELS = FATWA_CATEGORIES.reduce((acc, c) => {
  acc[c.value] = c.labelEn;
  return acc;
}, {});

// ============================================================
// PUBLICATION CATEGORIES
// ============================================================
export const PUBLICATION_CATEGORIES = [
  { value: 'QURAN_TAFSEER', labelUr: 'تفسیرِ قرآن', labelEn: 'QURAN TAFSEER' },
  { value: 'HADITH_SCIENCES', labelUr: 'علومِ حدیث', labelEn: 'HADITH SCIENCES' },
  { value: 'FIQH_FATAWA', labelUr: 'فقہ و فتاویٰ', labelEn: 'FIQH & FATAWA' },
  { value: 'AQEEDAH', labelUr: 'عقائد', labelEn: 'AQEEDAH' },
  { value: 'SEERAH', labelUr: 'سیرتِ نبوی ﷺ', labelEn: 'SEERAH' },
  { value: 'ISLAMIC_HISTORY', labelUr: 'اسلامی تاریخ', labelEn: 'ISLAMIC HISTORY' },
  { value: 'FAMILY_SOCIAL_ISSUES', labelUr: 'خاندانی و معاشرتی مسائل', labelEn: 'FAMILY & SOCIAL ISSUES' },
  { value: 'EDUCATION_UPBRINGING', labelUr: 'تعلیم و تربیت', labelEn: 'EDUCATION & UPBRINGING' },
  { value: 'DAWAH_REFORM', labelUr: 'دعوت و اصلاح', labelEn: 'DAWAH & REFORM' },
  { value: 'MISC_ISLAMIC_TOPICS', labelUr: 'متفرق اسلامی مضامین', labelEn: 'MISC. ISLAMIC TOPICS' },
];

export const PUBLICATION_VALUES = PUBLICATION_CATEGORIES.map(c => c.value);
export const PUBLICATION_TRANSLATIONS = PUBLICATION_CATEGORIES.reduce((acc, c) => {
  acc[c.value] = c.labelUr;
  return acc;
}, {});
export const PUBLICATION_EN_LABELS = PUBLICATION_CATEGORIES.reduce((acc, c) => {
  acc[c.value] = c.labelEn;
  return acc;
}, {});

// ============================================================
// ARTICLE CATEGORIES
// ============================================================
export const ARTICLE_CATEGORIES = [
  { value: 'QURAN_TAFSEER', labelUr: 'تفسیرِ قرآن', labelEn: 'QURAN TAFSEER' },
  { value: 'HADITH_SCIENCES', labelUr: 'علومِ حدیث', labelEn: 'HADITH SCIENCES' },
  { value: 'FIQH_FATAWA', labelUr: 'فقہ و فتاویٰ', labelEn: 'FIQH & FATAWA' },
  { value: 'AQEEDAH', labelUr: 'عقائد', labelEn: 'AQEEDAH' },
  { value: 'SEERAH', labelUr: 'سیرتِ نبوی ﷺ', labelEn: 'SEERAH' },
  { value: 'ISLAMIC_HISTORY', labelUr: 'اسلامی تاریخ', labelEn: 'ISLAMIC HISTORY' },
  { value: 'FAMILY_SOCIAL_ISSUES', labelUr: 'خاندانی و معاشرتی مسائل', labelEn: 'FAMILY & SOCIAL ISSUES' },
  { value: 'EDUCATION_UPBRINGING', labelUr: 'تعلیم و تربیت', labelEn: 'EDUCATION & UPBRINGING' },
  { value: 'DAWAH_REFORM', labelUr: 'دعوت و اصلاح', labelEn: 'DAWAH & REFORM' },
  { value: 'MISC_ISLAMIC_TOPICS', labelUr: 'متفرق اسلامی مضامین', labelEn: 'MISC. ISLAMIC TOPICS' },
];

export const ARTICLE_VALUES = ARTICLE_CATEGORIES.map(c => c.value);
export const ARTICLE_TRANSLATIONS = ARTICLE_CATEGORIES.reduce((acc, c) => {
  acc[c.value] = c.labelUr;
  return acc;
}, {});
export const ARTICLE_EN_LABELS = ARTICLE_CATEGORIES.reduce((acc, c) => {
  acc[c.value] = c.labelEn;
  return acc;
}, {});

// ============================================================
// LECTURE CATEGORIES
// ============================================================
export const LECTURE_CATEGORIES = [
  { value: 'YOUTUBE_VIDEOS', labelUr: 'یوٹیوب ویڈیوز', labelEn: 'YOUTUBE VIDEOS' },
  { value: 'FACEBOOK_VIDEOS', labelUr: 'فیس بک ویڈیوز', labelEn: 'FACEBOOK VIDEOS' },
  { value: 'AUDIO_LECTURES', labelUr: 'صوتی بیانات', labelEn: 'AUDIO LECTURES' },
  { value: 'BAYAN_RECORDINGS', labelUr: 'ریکارڈنگز', labelEn: 'BAYAN RECORDINGS' },
];

export const LECTURE_VALUES = LECTURE_CATEGORIES.map(c => c.value);
export const LECTURE_TRANSLATIONS = LECTURE_CATEGORIES.reduce((acc, c) => {
  acc[c.value] = c.labelUr;
  return acc;
}, {});
export const LECTURE_EN_LABELS = LECTURE_CATEGORIES.reduce((acc, c) => {
  acc[c.value] = c.labelEn;
  return acc;
}, {});

// ============================================================
// QA CATEGORIES (Synchronized with Server Model Enum)
// ============================================================
export const QA_CATEGORIES = [
  { value: 'Salah', labelUr: 'نماز', labelEn: 'Salah' },
  { value: 'Fasting', labelUr: 'روزہ', labelEn: 'Fasting' },
  { value: 'Zakat', labelUr: 'زکوٰۃ', labelEn: 'Zakat' },
  { value: 'Hajj & Umrah', labelUr: 'حج و عمرہ', labelEn: 'Hajj & Umrah' },
  { value: 'Marriage', labelUr: 'نکاح', labelEn: 'Marriage' },
  { value: 'Divorce', labelUr: 'طلاق', labelEn: 'Divorce' },
  { value: 'Business', labelUr: 'تجارت', labelEn: 'Business' },
  { value: 'Family Issues', labelUr: 'خاندانی امور', labelEn: 'Family Issues' },
  { value: 'Education', labelUr: 'تعلیم', labelEn: 'Education' },
  { value: 'Aqidah', labelUr: 'عقائد', labelEn: 'Aqidah' },
  { value: 'Quran', labelUr: 'قرآن کریم', labelEn: 'Quran' },
  { value: 'Hadith', labelUr: 'حدیث شریف', labelEn: 'Hadith' },
  { value: 'General', labelUr: 'عام مسائل', labelEn: 'General' },
];

export const QA_VALUES = QA_CATEGORIES.map(c => c.value);

export const QA_TRANSLATIONS = {
  ...QA_CATEGORIES.reduce((acc, c) => {
    acc[c.value] = c.labelUr;
    return acc;
  }, {}),
  // Legacy uppercase key aliases
  SALAH: 'نماز',
  FASTING: 'روزہ',
  ZAKAT: 'زکوٰۃ',
  HAJJ_UMRAH: 'حج و عمرہ',
  MARRIAGE: 'نکاح',
  DIVORCE: 'طلاق',
  BUSINESS: 'تجارت',
  FAMILY_ISSUES: 'خاندانی امور',
  EDUCATION: 'تعلیم',
  GENERAL_QUESTIONS: 'عام مسائل',
  AQIDAH: 'عقائد',
  QURAN: 'قرآن کریم',
  HADITH: 'حدیث شریف',
  GENERAL: 'عام مسائل',
};

export const QA_EN_LABELS = {
  ...QA_CATEGORIES.reduce((acc, c) => {
    acc[c.value] = c.labelEn;
    return acc;
  }, {}),
  SALAH: 'Salah',
  FASTING: 'Fasting',
  ZAKAT: 'Zakat',
  HAJJ_UMRAH: 'Hajj & Umrah',
  MARRIAGE: 'Marriage',
  DIVORCE: 'Divorce',
  BUSINESS: 'Business',
  FAMILY_ISSUES: 'Family Issues',
  EDUCATION: 'Education',
  GENERAL_QUESTIONS: 'General',
  AQIDAH: 'Aqidah',
  QURAN: 'Quran',
  HADITH: 'Hadith',
  GENERAL: 'General',
};

// ============================================================
// BOOK LANGUAGE TRANSLATIONS
// ============================================================
export const BOOK_LANGUAGE_TRANSLATIONS = {
  'ur': 'اردو',
  'ar': 'عربی',
  'en': 'انگریزی',
};

// ============================================================
// CATEGORY MAP (Combined for convenience)
// ============================================================
export const CATEGORY_MAP = {
  fatwas: FATWA_CATEGORIES,
  publications: PUBLICATION_CATEGORIES,
  articles: ARTICLE_CATEGORIES,
  lectures: LECTURE_CATEGORIES,
  qa: QA_CATEGORIES,
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get Urdu label for a category value
 * @param {string} categoryValue - The category value (e.g., 'SALAH')
 * @param {string} categoryType - The category type ('fatwas', 'qa', 'publications', 'articles', 'lectures')
 * @returns {string} - The Urdu label
 */
export const getCategoryUrduLabel = (categoryValue, categoryType = 'fatwas') => {
  const map = {
    fatwas: FATWA_TRANSLATIONS,
    qa: QA_TRANSLATIONS,
    publications: PUBLICATION_TRANSLATIONS,
    articles: ARTICLE_TRANSLATIONS,
    lectures: LECTURE_TRANSLATIONS,
  };
  return map[categoryType]?.[categoryValue] || categoryValue;
};

/**
 * Get English label for a category value
 * @param {string} categoryValue - The category value (e.g., 'SALAH')
 * @param {string} categoryType - The category type ('fatwas', 'qa', 'publications', 'articles', 'lectures')
 * @returns {string} - The English label
 */
export const getCategoryEnglishLabel = (categoryValue, categoryType = 'fatwas') => {
  const map = {
    fatwas: FATWA_EN_LABELS,
    qa: QA_EN_LABELS,
    publications: PUBLICATION_EN_LABELS,
    articles: ARTICLE_EN_LABELS,
    lectures: LECTURE_EN_LABELS,
  };
  return map[categoryType]?.[categoryValue] || categoryValue;
};

/**
 * Get all categories for a specific type
 * @param {string} categoryType - The category type ('fatwas', 'qa', 'publications', 'articles', 'lectures')
 * @returns {Array} - Array of category objects with value, labelUr, and labelEn
 */
export const getCategoriesByType = (categoryType) => {
  return CATEGORY_MAP[categoryType] || [];
};

/**
 * Get category label based on current language
 * @param {string} categoryValue - The category value (e.g., 'SALAH')
 * @param {string} language - The language code ('en' or 'ur')
 * @param {string} categoryType - The category type ('fatwas', 'qa', 'publications', 'articles', 'lectures')
 * @returns {string} - The label in the specified language
 */
export const getCategoryLabel = (categoryValue, language = 'en', categoryType = 'fatwas') => {
  if (language === 'ur') {
    return getCategoryUrduLabel(categoryValue, categoryType);
  }
  return getCategoryEnglishLabel(categoryValue, categoryType);
};

// ============================================================
// BACKWARD COMPATIBILITY (Legacy exports)
// ============================================================
export const FATWA_CATEGORY_TRANSLATIONS = FATWA_TRANSLATIONS;
export const PUBLICATION_CATEGORY_TRANSLATIONS = PUBLICATION_TRANSLATIONS;
export const ARTICLE_CATEGORY_TRANSLATIONS = ARTICLE_TRANSLATIONS;
export const LECTURE_CATEGORY_TRANSLATIONS = LECTURE_TRANSLATIONS;
export const QA_CATEGORY_TRANSLATIONS = QA_TRANSLATIONS;

// Legacy combined translation object
export const CATEGORY_TRANSLATIONS = {
  ...FATWA_TRANSLATIONS,
  ...ARTICLE_TRANSLATIONS,
  ...LECTURE_TRANSLATIONS,
};

// ============================================================
// DEFAULT EXPORT
// ============================================================
export default {
  // Fatwa
  FATWA_CATEGORIES,
  FATWA_VALUES,
  FATWA_TRANSLATIONS,
  FATWA_EN_LABELS,
  FATWA_CATEGORY_TRANSLATIONS,

  // Publication
  PUBLICATION_CATEGORIES,
  PUBLICATION_VALUES,
  PUBLICATION_TRANSLATIONS,
  PUBLICATION_EN_LABELS,
  PUBLICATION_CATEGORY_TRANSLATIONS,

  // Article
  ARTICLE_CATEGORIES,
  ARTICLE_VALUES,
  ARTICLE_TRANSLATIONS,
  ARTICLE_EN_LABELS,
  ARTICLE_CATEGORY_TRANSLATIONS,

  // Lecture
  LECTURE_CATEGORIES,
  LECTURE_VALUES,
  LECTURE_TRANSLATIONS,
  LECTURE_EN_LABELS,
  LECTURE_CATEGORY_TRANSLATIONS,

  // QA
  QA_CATEGORIES,
  QA_VALUES,
  QA_TRANSLATIONS,
  QA_EN_LABELS,
  QA_CATEGORY_TRANSLATIONS,

  // Book Languages
  BOOK_LANGUAGE_TRANSLATIONS,

  // Combined
  CATEGORY_MAP,
  CATEGORY_TRANSLATIONS,

  // Helpers
  getCategoryUrduLabel,
  getCategoryEnglishLabel,
  getCategoriesByType,
  getCategoryLabel,
};