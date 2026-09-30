/**
 * Production SEO Helpers & Schema.org Structured Data Generators
 * Target Entity: Mufti Faizan Sarwar Misbahi
 * Canonical Domain: https://muftifaizansarwar.in
 */

export const BASE_PRODUCTION_URL = 'https://muftifaizansarwar.in';
export const DEFAULT_OG_IMAGE = 'https://muftifaizansarwar.in/assets/images/logo.webp';
export const DEFAULT_AUTHOR_IMAGE = 'https://muftifaizansarwar.in/assets/images/muftiSaheb.webp';

/**
 * Strips HTML tags and normalizes spaces for clean meta description / titles
 */
export const cleanText = (str = '', maxLength = 160) => {
  if (!str || typeof str !== 'string') return '';
  const stripped = str
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

  if (stripped.length <= maxLength) return stripped;
  // Truncate at word boundary
  const truncated = stripped.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 50 ? truncated.slice(0, lastSpace) : truncated) + '...';
};

/**
 * Safely decodes a URL slug, handling both single and double percent-encoded Unicode strings
 */
export const safeDecodeSlug = (str = '') => {
  if (!str || typeof str !== 'string') return '';
  let decoded = str;
  try {
    for (let i = 0; i < 3; i++) {
      if (!decoded.includes('%')) break;
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    }
  } catch {
    // Return current progress if malformed sequence
  }
  return decoded.trim();
};

/**
 * Normalizes and builds a canonical production URL with Unicode slug encoding.
 * Byte-for-byte consistent with sitemap.xml and idempotent.
 */
export const buildCanonicalUrl = (basePath = '', slug = '') => {
  let fullPath = String(basePath || '').trim();
  if (fullPath.startsWith('http://') || fullPath.startsWith('https://')) {
    try {
      const u = new URL(fullPath);
      fullPath = u.pathname;
    } catch {
      fullPath = fullPath.replace(/^https?:\/\/[^/]+/, '');
    }
  }

  if (slug) {
    const cleanSlug = safeDecodeSlug(slug);
    const cleanBase = fullPath.replace(/\/+$/, '');
    fullPath = `${cleanBase}/${cleanSlug}`;
  }

  if (!fullPath.startsWith('/')) fullPath = `/${fullPath}`;
  if (fullPath.length > 1 && fullPath.endsWith('/')) fullPath = fullPath.slice(0, -1);

  if (fullPath === '/' || !fullPath) {
    return `${BASE_PRODUCTION_URL}/`;
  }

  // Split path segments, decode each safely to avoid double-encoding, then encodeURI
  const segments = fullPath
    .split('/')
    .filter(Boolean)
    .map((seg) => encodeURI(safeDecodeSlug(seg)));

  return `${BASE_PRODUCTION_URL}/${segments.join('/')}`;
};

/**
 * Schema.org Person Entity Definition (Mufti Faizan Sarwar Misbahi)
 * Incorporates legitimate search & name variations without doorway pages.
 */
export const getPersonEntitySchema = () => ({
  '@type': 'Person',
  '@id': `${BASE_PRODUCTION_URL}/#person`,
  name: 'مفتی محمد فیضان سرور مصباحی',
  alternateName: [
    'Mufti Faizan Sarwar Misbahi',
    'Mufti Faizan Sarwar',
    'Mufti Faizan Sarvar',
    'Mufti Faizan Sarvar Misbahi',
    'مفتی فیضان سرور',
    'Mufti Faizan',
    'Mufti Sarwar',
    'Mufti Faizan Sarwar Sahib',
    'Mufti Faizan Sarwar Sahab',
  ],
  jobTitle: 'قاضیٔ شریعت، محقق قلم کار، استاذ الحدیث و بانی کنز المکاتب بورڈ',
  description:
    'برصغیر کے معروف دینی اسکالر، محقق، مصنف، قاضیٔ شریعت دار القضاء ادارۂ شرعیہ اورنگ آباد اور بانی کنز المکاتب بورڈ۔',
  url: `${BASE_PRODUCTION_URL}/`,
  image: DEFAULT_AUTHOR_IMAGE,
  sameAs: [
    'https://youtube.com/@faizansarwarmisbahi5651?si=KGBF1iU1VQ0DUTPM',
    'https://t.me/faizansarwarmisbahi',
    'https://whatsapp.com/channel/0029Va62ICRDZ4LaWYNIr32k',
    'https://www.facebook.com/share/1JcsQwS4h5/',
  ],
  knowsAbout: [
    'Islamic Jurisprudence (Fiqh)',
    'Hadith Studies (Usool-e-Hadith)',
    'Dar-ul-Qaza & Shariah Rulings',
    'Islamic Research & Publications',
  ],
});

/**
 * Schema.org WebSite Definition
 */
export const getWebSiteSchema = () => ({
  '@type': 'WebSite',
  '@id': `${BASE_PRODUCTION_URL}/#website`,
  name: 'مفتی محمد فیضان سرور مصباحی',
  alternateName: [
    'Mufti Faizan Sarwar Misbahi',
    'Mufti Faizan Sarwar',
    'Mufti Faizan Sarvar',
    'مفتی فیضان سرور',
    'فکرِ اسلام',
    'Fikr-e-Islam',
  ],
  url: `${BASE_PRODUCTION_URL}/`,
  publisher: {
    '@id': `${BASE_PRODUCTION_URL}/#person`,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: `${BASE_PRODUCTION_URL}/articles?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
});

/**
 * BreadcrumbList Schema generator
 */
export const getBreadcrumbSchema = (breadcrumbs = []) => {
  const itemListElement = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'صفحہ اول',
      item: `${BASE_PRODUCTION_URL}/`,
    },
    ...breadcrumbs.map((b, idx) => ({
      '@type': 'ListItem',
      position: idx + 2,
      name: cleanText(b.name, 60),
      item: b.url.startsWith('http') ? b.url : `${BASE_PRODUCTION_URL}${b.url}`,
    })),
  ];

  return {
    '@type': 'BreadcrumbList',
    itemListElement,
  };
};

/**
 * Article Schema generator
 */
export const getArticleSchema = ({
  title,
  summary,
  slug,
  publishDate,
  updatedAt,
  image,
  category,
}) => {
  const url = buildCanonicalUrl('/articles', slug);
  const schema = {
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: cleanText(title, 110),
    description: cleanText(summary, 200),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    url,
    inLanguage: 'ur',
    author: {
      '@id': `${BASE_PRODUCTION_URL}/#person`,
    },
    publisher: {
      '@id': `${BASE_PRODUCTION_URL}/#person`,
    },
  };

  if (image) {
    schema.image = image.startsWith('http') ? image : `${BASE_PRODUCTION_URL}${image}`;
  } else {
    schema.image = DEFAULT_OG_IMAGE;
  }

  if (publishDate) schema.datePublished = new Date(publishDate).toISOString();
  if (updatedAt) schema.dateModified = new Date(updatedAt).toISOString();
  if (category) schema.articleSection = category;

  return schema;
};

/**
 * Fatwa / Legal Ruling Schema generator (using Scholarly/Article structure)
 */
export const getFatwaSchema = ({
  title,
  summary,
  slug,
  publishDate,
  updatedAt,
  category,
}) => {
  const url = buildCanonicalUrl('/fatwas', slug);
  const schema = {
    '@type': 'Article',
    '@id': `${url}#fatwa`,
    headline: cleanText(title, 110),
    description: cleanText(summary, 200),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    url,
    inLanguage: 'ur',
    author: {
      '@id': `${BASE_PRODUCTION_URL}/#person`,
    },
    publisher: {
      '@id': `${BASE_PRODUCTION_URL}/#person`,
    },
    image: DEFAULT_OG_IMAGE,
  };

  if (publishDate) schema.datePublished = new Date(publishDate).toISOString();
  if (updatedAt) schema.dateModified = new Date(updatedAt).toISOString();
  if (category) schema.articleSection = category;

  return schema;
};

/**
 * Book / Publication Schema generator
 */
export const getBookSchema = ({
  title,
  summary,
  slug,
  author,
  coverImage,
  pageCount,
  publishDate,
  updatedAt,
  blanguage = 'ur',
}) => {
  const url = buildCanonicalUrl('/publications', slug);
  const schema = {
    '@type': 'Book',
    '@id': `${url}#book`,
    name: cleanText(title, 110),
    description: cleanText(summary, 250),
    url,
    inLanguage: blanguage,
    author: {
      '@type': 'Person',
      name: author || 'مفتی محمد فیضان سرور مصباحی',
      url: `${BASE_PRODUCTION_URL}/about`,
    },
  };

  if (coverImage) {
    schema.image = coverImage.startsWith('http')
      ? coverImage
      : `${BASE_PRODUCTION_URL}${coverImage}`;
  } else {
    schema.image = DEFAULT_OG_IMAGE;
  }

  if (pageCount && Number(pageCount) > 0) {
    schema.numberOfPages = Number(pageCount);
  }
  if (publishDate) schema.datePublished = new Date(publishDate).toISOString();
  if (updatedAt) schema.dateModified = new Date(updatedAt).toISOString();

  return schema;
};

/**
 * QAPage / Question & Answer Schema generator
 */
export const getQASchema = ({
  questionTitle,
  detailedQuestion,
  answerContent,
  slug,
  answeredAt,
  answeredByName,
}) => {
  const url = buildCanonicalUrl('/qa', slug);
  const cleanQ = cleanText(detailedQuestion || questionTitle, 300);
  const cleanA = cleanText(answerContent, 500);

  return {
    '@type': 'QAPage',
    mainEntity: {
      '@type': 'Question',
      name: cleanText(questionTitle, 110),
      text: cleanQ,
      answerCount: cleanA ? 1 : 0,
      acceptedAnswer: cleanA
        ? {
            '@type': 'Answer',
            text: cleanA,
            dateCreated: answeredAt ? new Date(answeredAt).toISOString() : undefined,
            author: {
              '@type': 'Person',
              name: answeredByName || 'مفتی محمد فیضان سرور مصباحی',
              url: `${BASE_PRODUCTION_URL}/about`,
            },
          }
        : undefined,
    },
  };
};

/**
 * CollectionPage Schema generator for listings
 */
export const getCollectionSchema = ({ name, description, url }) => ({
  '@type': 'CollectionPage',
  name: cleanText(name, 100),
  description: cleanText(description, 200),
  url: url.startsWith('http') ? url : `${BASE_PRODUCTION_URL}${url}`,
  inLanguage: 'ur',
  isPartOf: {
    '@id': `${BASE_PRODUCTION_URL}/#website`,
  },
});
