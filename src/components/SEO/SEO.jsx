import React, { useEffect } from 'react';
import {
  BASE_PRODUCTION_URL,
  DEFAULT_OG_IMAGE,
  cleanText,
  buildCanonicalUrl,
} from '@/utils/seoHelpers';

const SITE_NAME = 'مفتی محمد فیضان سرور مصباحی | فکرِ اسلام';
const DEFAULT_DESCRIPTION =
  'مفتی فیضان سرور کی باضابطہ ویب سائٹ - فقہی فتاویٰ، علمی مضامین، کتب و رسائل، سوال و جواب اور شرعی رہنمائی۔ Official platform of Mufti Faizan Sarwar Misbahi (Fikr-e-Islam).';

/**
 * Helper to update or create a <meta> element in document.head
 */
const setMetaTag = (attribute, attrValue, content) => {
  if (typeof document === 'undefined') return;
  let element = document.head.querySelector(`meta[${attribute}="${attrValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content || '');
};

/**
 * Helper to update or create a <link> element in document.head
 */
const setLinkTag = (rel, href) => {
  if (typeof document === 'undefined') return;
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href || '');
};

/**
 * Reusable Production SEO Component
 */
export default function SEO({
  title,
  description,
  canonical,
  image,
  type = 'website',
  noindex = false,
  schema = null,
}) {
  const serializedSchema = schema ? JSON.stringify(schema) : null;

  useEffect(() => {
    if (typeof document === 'undefined') return;

    // 1. Dynamic Title
    const pageTitle = cleanText(title, 100);
    const fullTitle = pageTitle
      ? pageTitle.includes('فیضان سرور') || pageTitle.includes('فکر')
        ? pageTitle
        : `${pageTitle} | ${SITE_NAME}`
      : SITE_NAME;
    document.title = fullTitle;

    // 2. Meta Description
    const metaDesc = cleanText(description, 160) || DEFAULT_DESCRIPTION;
    setMetaTag('name', 'description', metaDesc);

    // 3. Robots
    const robotsContent = noindex ? 'noindex, nofollow' : 'index, follow';
    setMetaTag('name', 'robots', robotsContent);

    // 4. Canonical URL
    let fullCanonical = BASE_PRODUCTION_URL;
    if (canonical) {
      fullCanonical = canonical.startsWith('http')
        ? canonical
        : buildCanonicalUrl(canonical);
    }
    setLinkTag('canonical', fullCanonical);

    // 5. Open Graph Metadata
    const ogImg = image
      ? image.startsWith('http')
        ? image
        : `${BASE_PRODUCTION_URL}${image}`
      : DEFAULT_OG_IMAGE;

    setMetaTag('property', 'og:site_name', 'مفتی فیضان سرور | Fikr-e-Islam');
    setMetaTag('property', 'og:locale', 'ur_PK');
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', metaDesc);
    setMetaTag('property', 'og:url', fullCanonical);
    setMetaTag('property', 'og:image', ogImg);

    // 6. Twitter Card Metadata
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', metaDesc);
    setMetaTag('name', 'twitter:image', ogImg);

    // 7. Schema.org JSON-LD Injection
    let scriptTag = document.getElementById('seo-jsonld');
    if (!schema) {
      if (scriptTag) scriptTag.remove();
    } else {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'seo-jsonld';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }

      // If array of schemas or single schema
      const jsonLdContent = Array.isArray(schema)
        ? {
            '@context': 'https://schema.org',
            '@graph': schema,
          }
        : {
            '@context': 'https://schema.org',
            ...schema,
          };

      scriptTag.textContent = JSON.stringify(jsonLdContent, null, 2);
    }
  }, [title, description, canonical, image, type, noindex, serializedSchema]);

  return null;
}
