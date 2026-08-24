import { COLORS } from '@/utils/themeColors';
export const SITE = {
  nameArabic: 'جامعة العلوم الإسلامية',
  nameUrdu: 'علامہ محمد یوسف بنوری ٹاؤن گیا بہار انڈیا',
  bismillah: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
  hijriDate: '۱۴ ذوالحجہ ۱۴۴۷ھ',
  gregDate: '۳۱ مئی ۲۰۲۶ء',
  copyright: '© 2026 جامعة العلوم الإسلامية علامہ محمد یوسف بنوری ٹاؤن گیا — جملہ حقوق محفوظ ہیں',
}

export const NAV_ITEMS = [
  { label: 'تعارف',      href: '#', active: true,  hasDropdown: true  },
  { label: 'نظام تعلیم', href: '#', active: false, hasDropdown: true  },
  { label: 'دارالافتاء', href: '#', active: false, hasDropdown: true  },
  { label: 'نشر واشاعت', href: '#', active: false, hasDropdown: true  },
  { label: 'رابطہ',      href: '#', active: false, hasDropdown: false },
]

export const FEATURE_CARDS = [
  {
    id: 1,
    title: 'بانی جامعہ حضرت بنوری رحمہ اللہ',
    desc: 'تعارف، علمی و تحقیقی مقالات',
    icon: 'founder',
  },
  {
    id: 2,
    title: 'تعارف جامعہ بنوری ٹاؤن',
    desc: 'جامعہ اور اس کی شاخیں ایک نظر میں',
    icon: 'star',
  },
  {
    id: 3,
    title: 'دارالافتاء',
    desc: 'آپ کے مسائل اور ان کا حل',
    icon: 'books',
  },
  {
    id: 4,
    title: 'ماہنامہ بینات',
    desc: 'قرآن و سنت نبویہ کی تعلیمات کا علمبردار',
    icon: 'minaret',
  },
  {
    id: 5,
    title: 'کتابیں',
    desc: 'مفید علمی واصلاحی کتابیں',
    icon: 'library',
  },
  {
    id: 6,
    title: 'رابطہ',
    desc: 'برائے معلومات',
    icon: 'contact',
  },
]

export const NEW_QUESTION = {
  date: '2026-05-11',
  title: 'تیری بیٹی کو میں طلاق دیتا ہوں چھ مرتبہ کہنے کا حک...',
  text: 'میری ساس ہمارے گھر آئیں، وہاں لڑائی جھگڑا ہوا، اور انہوں نے مجھے کچھ تھپڑ بھی مارے۔ اس کے بعد میں گھر سے باہر چلا گیا۔ پھر میری ساس کے دیور ہمارے گھر آئے، میں ان کے ساتھ بیٹھ کر باتیں کر رہا تھا۔ اس دوران میری بہنوں اور بہنوئی کو بھی معلوم ہوا کہ گھر میں جھگڑا ہو رہا ہے...',
}

export const SELECTED_QUESTIONS = [
  { id: 1, title: 'مقررہ اوقات کے بعد ملازم (اجیر خاص) کا ذاتی کاروبار کرنا اور ادارے کی طرف سے اضافی کام لینے کا حکم' },
  { id: 2, title: 'کیا قربانی کے جانور میں عقیقہ کا حصہ ڈالنے کے لیے اسی جانور میں قربانی کا حصہ ڈالنا بھی ضروری ہے؟' },
  { id: 3, title: 'جیٹ جی پی ٹی سے دینی و دنیاوی مسائل میں راہنمائی حاصل کرنے کا حکم' },
  { id: 4, title: 'زکاۃ کی رقم سے کفن خرید کر کسی کو دینا' },
  { id: 5, title: 'گوگل اے آئی سے مسلہ معلوم کرنے کا حکم' },
  { id: 6, title: 'پیشاب کے بعد قطرے آنے والے شخص کی امامت کا حکم' },
]

export const ARTICLES = [
  { id: 1, title: 'مسجد اقصیٰ اور فلسطین - درد مندانہ گزارشات' },
  { id: 2, title: 'فلسطین اسرائیل جنگ اور ہماری ذمہ داریاں' },
  { id: 3, title: 'ہندوستان میں خطابت کے ائمہ اربعہ اور امیر شریعت مولانا عطاء اللہ شاہ بخاری رحم...' },
]

export const PRAYER_TIMES = {
  date: '۱۴ ذوالحجہ ۱۴۴۷ھ ۳۱ مئی ۲۰۲۶ء، گیا بہار انڈیا میں نماز کے اوقات',
  times: [
    { name: 'فجر',  time: '04:15', icon: '🌙' },
    { name: 'طلوع', time: '05:42', icon: '🌙' },
    { name: 'زوال', time: '12:29', icon: '☀️' },
    { name: 'عصر',  time: '17:11', icon: '☀️' },
    { name: 'غروب', time: '19:17', icon: '🌙' },
    { name: 'عشاء', time: '20:44', icon: '🌙' },
  ],
}

export const BOOKS = [
  { id: 1, title: 'تعارف جامعہ (دلیل الجامعہ)', gradient: `linear-gradient(160deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)` },
  { id: 2, title: 'قربانی کے احکام ومسائل',      gradient: `linear-gradient(160deg, ${COLORS.accent} 0%, ${COLORS.secondary} 100%)` },
  { id: 3, title: 'بصائر وعبر (جلد اول)',          gradient: `linear-gradient(160deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)` },
]

export const FOOTER_SITEMAP = ['صفحہ اول', 'تعارف', 'دارالافتاء', 'بینات', 'کتابیں', 'اسلامی نام']
export const FOOTER_DEPTS   = ['مسلہ پوچھیں', 'خواب کی تعبیر معلوم کریں', 'مسنون وماثور دعائیں', 'نماز کے اوقات', 'رابطہ', 'طریقہ تعاون']

export const CONTACT = {
  poBox:  'P.O. Box : 3465. Karachi-74800',
  phone1: '+92-21-34123366',
  phone2: '+92-21-34914665',
  email:  'info@banuri.edu.pk',
}
