export const OFFICIAL_CONTACT = {
  headingUr: 'مفتی صاحب سے رابطہ کریں',
  headingEn: 'Contact Mufti Sahab',
  address: 'دارالقضاء ادارۂ شرعیہ اورنگ آباد، بہار (انڈیا)',
  email: 'faizansarwarmisbahi@gmail.com',
  phone: '+91 8317780566',
  rawPhone: '+918317780566',
  mailto: 'mailto:faizansarwarmisbahi@gmail.com',
  tel: 'tel:+918317780566',
};

export const OFFICIAL_SOCIAL_LINKS = {
  telegram: 'https://t.me/faizansarwarmisbahi',
  whatsapp: 'https://whatsapp.com/channel/0029Va62ICRDZ4LaWYNIr32k',
  youtube: 'https://youtube.com/@faizansarwarmisbahi5651?si=KGBF1iU1VQ0DUTPM',
  facebook: 'https://www.facebook.com/share/1JcsQwS4h5/',
};

/**
 * Formats phone number so '+91' is strictly at the start (left),
 * followed by the 10-digit number.
 * Embeds Left-to-Right Mark (\u200E) to prevent the '+' symbol from flipping to the end in RTL mode.
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '\u200E+91 8317780566';
  const str = String(phone).trim();
  const digits = str.replace(/[^\d]/g, '');
  if (digits.endsWith('8317780566') || digits === '8317780566') {
    return '\u200E+91 8317780566';
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return `\u200E+91 ${digits.slice(2)}`;
  }
  if (digits.length === 10) {
    return `\u200E+91 ${digits}`;
  }
  if (str.startsWith('+')) {
    return `\u200E${str}`;
  }
  return `\u200E+${str}`;
};

/**
 * Formats phone number for tel: links (clean digits with leading +).
 */
export const getTelLink = (phone) => {
  if (!phone) return 'tel:+918317780566';
  const digits = String(phone).replace(/[^\d]/g, '');
  if (digits.endsWith('8317780566')) {
    return 'tel:+918317780566';
  }
  if (digits.length === 10) {
    return `tel:+91${digits}`;
  }
  if (digits.startsWith('91')) {
    return `tel:+${digits}`;
  }
  return `tel:+${digits}`;
};
