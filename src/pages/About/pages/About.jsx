import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  GraduationCap,
  Scale,
  Building,
  Calendar,
  Send,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  BookMarked,
  ScrollText,
  FileCheck2,
  Users2,
  PenLine,
  Library,
  Quote,
  Users,
  UserCheck,
  Globe,
  X,
  Check
} from 'lucide-react';
import muftiSahebImg from '@/assets/images/muftiSaheb.png';
import tarufBannerImg from '@/assets/images/taruf-banner.jpg';
import logoImg from '@/assets/images/logo.jpeg';
import { useSettings } from '@/hooks/useSettings';
import { getPublications } from '@/services';
import { COLORS } from '@/utils/themeColors';
import './About.css';

export default function About() {
  const { settings } = useSettings();
  const [dbBooks, setDbBooks] = useState([]);
  const [activeArea, setActiveArea] = useState(null);

  const language =
    settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';
  const isRTL = language === 'ur';

  // Keyboard accessibility and body scroll lock for Detail Modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveArea(null);
      }
    };
    if (activeArea) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeArea]);

  // Extract scholar profile data from API settings
  const scholarInfo = settings?.scholarInfo || {};
  const contactInfo = settings?.contactInfo || {};
  const socialLinks = settings?.socialLinks || {};

  const scholarName =
    scholarInfo.fullName ||
    (isRTL ? 'مفتی محمد فیضان سرور مصباحی' : 'Mufti Muhammad Faizan Sarwar Misbahi');

  const scholarTitle =
    scholarInfo.title ||
    (isRTL
      ? 'قاضیٔ شریعت · استاذ الحدیث · محقق و مصنف'
      : 'Qazi-e-Shariat · Teacher of Hadith · Researcher & Author');

  const scholarPhoto = scholarInfo.photo || muftiSahebImg;

  // Fetch 4 selected books from database
  useEffect(() => {
    let isMounted = true;
    async function loadBooks() {
      try {
        const res = await getPublications({ limit: 4 });
        const books = res?.books || res?.data || (Array.isArray(res) ? res : []);
        if (isMounted) {
          setDbBooks(books.slice(0, 4));
        }
      } catch (err) {
        console.warn('Could not load publications for About page:', err);
      }
    }
    loadBooks();
    return () => {
      isMounted = false;
    };
  }, []);

  // ── Exactly 8 Interactive Key Areas (100% Verified from Original Biography/Interview PDF) ──
  const keyAreas = [
    {
      id: 'religious-education',
      title: isRTL ? 'دینی تعلیم' : 'Religious Education',
      englishTitle: 'RELIGIOUS EDUCATION',
      shortDesc: isRTL
        ? 'ابتدائی تعلیم، حفظِ قرآن اور جامعہ اشرفیہ مبارک پور سے ۱۱ سالہ درسِ نظامی و تخصص'
        : 'Quranic memorization, 11-year Dars-e-Nizami & Hadith specialization at Jamia Ashrafia',
      icon: BookOpen,
      highlight: isRTL ? 'دستارِ تخصص: ۲۰۱۹ء' : 'Specialization: 2019',
      detailedDesc: isRTL
        ? 'موضع بدھول سے ابتدائی تعلیم و ناظرہ، مدرسہ قاسم العلوم اور دارالعلوم فردوسیہ جمشیدپور سے حفظِ قرآن، جامعہ فاروقیہ بنارس سے دورۂ حفظ، اور پھر برصغیر کے عظیم علمی مرکز جامعہ اشرفیہ مبارک پور میں مسلسل ۱۱ سال تک مولویت، قراءتِ حفص، عالمیت، فضیلت اور تخصص فی الحدیث و مشقِ افتاء کی باوقار تکمیل۔'
        : 'Foundational education in Badhaul, Quranic memorization at Madrasa Qasim-ul-Uloom and Darul Uloom Firdausia Jamshedpur, Dawrah Hifz at Jamia Farooqia Benares, followed by 11 continuous years of higher Islamic scholarship (Dars-e-Nizami, Fazilat, Qira\'at Hafs, and Hadith Specialization with Ifta) at Jamia Ashrafia Mubarakpur.',
      stages: isRTL
        ? [
            {
              stageTitle: 'ابتدائی تعلیم و ناظرہ قرآن',
              institution: 'موضع بدھول، قاسمۂ، ضلع اورنگ آباد (بہار)',
              period: 'آبائی وطن',
              desc: 'بنیادی تعلیم اور ناظرہ قرآنِ پاک کی تعلیم اپنے آبائی گاؤں بدھول (قصبہ رفیع گنج سے تقریباً ۱۵ کلومیٹر) میں حاصل کی۔'
            },
            {
              stageTitle: 'حفظِ قرآن مجید (ابتدائی ۸ پارے)',
              institution: 'مدرسہ قاسم العلوم، شملہ پاک، قاسمۂ (اورنگ آباد، بہار)',
              period: 'مرحلۂ اول',
              desc: 'حفظِ قرآن کا باقاعدہ آغاز فرمایا اور ابتدائی ۸ پارے مدرسہ قاسم العلوم شملہ پاک، قاسمۂ میں حفظ کیے۔'
            },
            {
              stageTitle: 'تکمیلِ حفظِ قرآن (بقیہ ۲۲ پارے)',
              institution: 'دارالعلوم فردوسیہ، خانقاہ شریف، جمشیدپور',
              period: '۲۰۰۵ء (دستارِ حفظ)',
              desc: 'بقیہ ۲۲ پارے دارالعلوم فردوسیہ خانقاہ شریف جمشیدپور میں مکمل حفظ کیے اور وہیں سے ۲۰۰۵ء میں حفظِ قرآن کی باوقار دستار بندی ہوئی۔'
            },
            {
              stageTitle: 'دورۂ حفظِ قرآن',
              institution: 'جامعہ فاروقیہ بنارس',
              period: 'حفظِ پختگی',
              desc: 'دورۂ حفظِ قرآن کے لیے جامعہ فاروقیہ بنارس تشریف لے گئے اور وہاں حضرت حافظ عثمان فردوسی گدیوی کی درسگاہ سے مستفید ہوئے۔'
            },
            {
              stageTitle: 'درسِ نظامی و سندِ فضیلت (۱۱ سالہ قیام)',
              institution: 'جامعہ اشرفیہ مبارک پور (اعظم گڑھ، یوپی)',
              period: '۲۰۰۹ء – ۲۰۱۷ء',
              desc: 'اواخر ۲۰۰۹ء میں برصغیر کے عظیم علمی مرکز جامعہ اشرفیہ مبارک پور میں داخلہ لیا اور پورے ۱۱ سال تک مسلسل تعلیم حاصل کرتے رہے۔ اس دوران مولویت، قراءتِ حفص، عالمیت اور ۲۰۱۷ء میں سندِ فضیلت مکمل فرمائی۔'
            },
            {
              stageTitle: 'تخصص فی الحدیث و مشقِ افتاء',
              institution: 'جامعہ اشرفیہ مبارک پور',
              period: '۲۰۱۹ء (دستارِ تخصص)',
              desc: 'سندِ فضیلت کے بعد شعبۂ تحقیق سے تخصص فی الحدیث (تحقیق فی الحدیث) اور مشقِ افتاء کا کورس مکمل کیا، اور ۲۰۱۹ء میں دستارِ تخصص کی سعادت حاصل ہوئی۔'
            }
          ]
        : [
            {
              stageTitle: 'Primary Education & Nazira Quran',
              institution: 'Village Badhaul, Qasma, Aurangabad (Bihar)',
              period: 'Hometown',
              desc: 'Completed primary schooling and foundational Quranic reading (Nazira) in his native village Badhaul, Aurangabad (Bihar).'
            },
            {
              stageTitle: 'Hifz-ul-Quran (Initial 8 Paras)',
              institution: 'Madrasa Qasim-ul-Uloom, Shamla Pak, Qasma (Bihar)',
              period: 'Stage 1',
              desc: 'Commenced Quranic memorization, successfully memorizing the first 8 Paras at Madrasa Qasim-ul-Uloom Shamla Pak.'
            },
            {
              stageTitle: 'Completion of Hifz (Remaining 22 Paras)',
              institution: 'Darul Uloom Firdausia, Khanqah Sharif, Jamshedpur',
              period: '2005 (Dastar-e-Hifz)',
              desc: 'Memorized the remaining 22 Paras at Darul Uloom Firdausia Khanqah Sharif, Jamshedpur, receiving the formal Hifz graduation turban in 2005.'
            },
            {
              stageTitle: 'Dawrah Hifz-ul-Quran',
              institution: 'Jamia Farooqia Benares',
              period: 'Consolidation',
              desc: 'Pursued rigorous revision and mastery (Dawrah Hifz) at Jamia Farooqia Benares under the direct supervision of Hafiz Usman Firdausi Gaddiwi.'
            },
            {
              stageTitle: 'Dars-e-Nizami & Fazilat Degree (11-Year Tenure)',
              institution: 'Jamia Ashrafia Mubarakpur (Azamgarh, UP)',
              period: '2009 – 2017',
              desc: 'Enrolled in late 2009 at Jamia Ashrafia Mubarakpur, completing 11 consecutive years of study across Maulviyat, Qira\'at Hafs, Alimiyat, and the prestigious Fazilat degree in 2017.'
            },
            {
              stageTitle: 'Postgraduate Hadith Specialization & Practical Ifta',
              institution: 'Jamia Ashrafia Mubarakpur',
              period: '2019 (Dastar-e-Takhasus)',
              desc: 'Completed advanced research in Hadith methodology (Tahqeeq fil Hadith) and practical juristic drafting (Mashq-e-Ifta), crowned with the Dastar-e-Takhasus in 2019.'
            }
          ]
    },
    {
      id: 'academic-services',
      title: isRTL ? 'علمی و تدریسی خدمات' : 'Academic Services',
      englishTitle: 'ACADEMIC SERVICES',
      shortDesc: isRTL
        ? 'جامعات و مدارس میں درسِ نظامی، حدیث اور فقہ کی تدریسی خدمات'
        : 'Teaching Dars-e-Nizami, Hadith and Fiqh across recognized institutions',
      icon: GraduationCap,
      detailedDesc: isRTL
        ? 'فراغت کے بعد جامعۃ المدینہ فیضانِ عطار نیپال گنج، جامعۃ المدینہ فیضانِ امیر معاویہ اورنگ آباد، مرکزی دار القراءت جمشیدپور اور الجامعۃ الغوثیہ للبنات ہواگ میں کتبِ درسِ نظامی کی تدریس، طلبہ کی تربیت اور ناظمِ تعلیمات کی باوقار خدمات۔'
        : 'Dedicated teaching of Dars-e-Nizami textbooks, Hadith, and Islamic jurisprudence across Jamiatul Madina Nepalgunj (Nepal), Jamiatul Madina Aurangabad, Markazi Dar-ul-Qira\'at Jamshedpur, and academic directorship at Al-Jamiatul Ghausia Lilbanat, Ramgarh.',
      points: isRTL
        ? [
            'فراغت کے بعد دعوتِ اسلامی کے شعبۂ درسِ نظامی سے وابستہ ہوئے اور جامعۃ المدینہ فیضانِ عطار، نیپال گنج (نیپال) میں ۳ سال تک تدریسی خدمات انجام دیں۔',
            'مجلسِ جامعات المدینہ ہند کے ذیلی شعبے ”مجلسِ مضمون نگاری ہند“ کے باضابطہ نگران مقرر ہوئے۔',
            'جامعۃ المدینہ فیضانِ امیر معاویہ، شہر اورنگ آباد (بہار) میں ۲ سال تک کتبِ درسِ نظامی کی تدریس فرمائی۔',
            'مرکزی دار القراءت، ذاکر نگر جمشیدپور (شاخ جامعہ اشرفیہ مبارک پور) میں ۲ ماہ تک تدریسی فرائض انجام دیے۔',
            'الجامعۃ الغوثیہ للبنات ہواگ، رام گڑھ (جھارکھنڈ) میں بحیثیت ناظمِ تعلیمات باوقار تعلیمی خدمات۔',
            'تحریکِ علمائے جھارکھنڈ کے اہم رکن اور آن لائن مراسلاتی افتاء کورس بنام ”مجلسِ امامِ اعظم ابو حنیفہ تربیتِ افتاء“ کے اساتذہ میں شامل۔'
          ]
        : [
            'Joined Dars-e-Nizami faculty post-graduation, teaching for 3 consecutive years at Jamiatul Madina Faizan-e-Attar, Nepalgunj (Nepal).',
            'Appointed Official Director (Nigran) of "Majlis Mazmoon Nigari Hind" under the Central Board of Jamiat-ul-Madina India.',
            'Taught classical Dars-e-Nizami curricula for 2 years at Jamiatul Madina Faizan-e-Ameer Muawiya, Aurangabad (Bihar).',
            'Served as instructional faculty for 2 months at Markazi Dar-ul-Qira\'at, Zakir Nagar, Jamshedpur (branch of Jamia Ashrafia).',
            'Academic Director (Nazim-e-Ta\'leemat) at Al-Jamiatul Ghausia Lilbanat Howag, Ramgarh (Jharkhand).',
            'Key member of Tehreek Ulema-e-Jharkhand and faculty mentor at the online distance Ifta course "Majlis Imam-e-Azam Abu Hanifa Tarbiyat-e-Ifta".'
          ]
    },
    {
      id: 'fatwa-judicial',
      title: isRTL ? 'افتاء و قضائے شرعی' : 'Fatwa & Judiciary',
      englishTitle: 'FATWA & JUDICIAL SERVICES',
      shortDesc: isRTL
        ? 'دار القضاء اورنگ آباد کے قاضیٔ شریعت اور مستند فتاویٰ نویسی'
        : 'Official Qazi-e-Shariat at Dar-ul-Qadha Aurangabad & certified Fatwas',
      icon: Scale,
      highlight: isRTL ? 'انتخابِ قضاء: ۲۱ فروری ۲۰۲۴ء' : 'Elected: 21 Feb 2024',
      detailedDesc: isRTL
        ? '۲۱ فروری ۲۰۲۴ء کو کبار علمائے کرام کی موجودگی میں دار القضاء ادارۂ شرعیہ اورنگ آباد کے قاضیٔ شریعت منتخب ہوئے۔ دار القضاء میں مقدمات کی سماعت، تحقیق و تفتیش کے بعد فیصلہ سازی، تقریباً ۱۰۰ تحریری شرعی فیصلوں کا اجرا اور فتاویٰ کا وسیع معتمد سلسلہ۔'
        : 'Unanimously elected and invested as official Qazi-e-Shariat at Dar-ul-Qadha Idara-e-Shari\'ah Aurangabad on 21 February 2024 in the presence of eminent Islamic scholars. Authored approximately 100 binding Shariah judicial decrees alongside extensive fatwa drafting.',
      points: isRTL
        ? [
            '۲۱ فروری ۲۰۲۴ء کو تحریکِ بیداری کانفرنس میں مولانا غلام رسول بلیاوی، قاضیٔ شرع مفتی ڈاکٹر امجد رضا امجد پٹنہ، سید شرف الدین نیر قادری، مولانا جمال احمد قادری کلیری شیخ الحدیث وغیرہ کبار علماء کی موجودگی میں دار القضاء ادارۂ شرعیہ اورنگ آباد کے ”قاضیٔ شریعت“ منتخب ہوئے اور دستار بندی ہوئی۔',
            'مولانا نور الدین رشیدی صاحب کی معاونت کے ساتھ دار القضاء میں بحسن و خوبی فتویٰ نویسی اور قضائے شرعی کے فرائض کی انجام دہی۔',
            'دار القضاء میں عہدۂ قضاء پر رہتے ہوئے ۲ سالوں میں عائلی و شرعی نزاعات پر اب تک تقریباً ۱۰۰ باضابطہ فیصلے تحریر فرما چکے ہیں۔',
            'مقدمات کی باقاعدہ سماعت اور دقیق تحقیق و تفتیش کے بعد اسلامی شریعت کے مطابق فیصلہ سازی اور فتویٰ نویسی کا فعال نظام۔',
            'مختلف دینی و سماجی استفسارات کے جوابات میں جاری کردہ فتاویٰ کا طویل سلسلہ (مجموعۂ فتاویٰ) جو ایک ضخیم جلد بن سکتا ہے۔'
          ]
        : [
            'Elected official Qazi-e-Shariat at Dar-ul-Qadha Idara-e-Shari\'ah Aurangabad on 21 Feb 2024 during the Tehreek-e-Baidari Conference, attended by leading senior scholars (Maulana Ghulam Rasool Balyawi, Qazi-e-Shara\' Dr. Amjad Raza Amjad Patna, Shaykh-ul-Hadith Maulana Jamal Ahmad Qadri, etc.).',
            'Discharging judicial arbitration and fatwa drafting with distinction alongside assistant jurist Maulana Nooruddin Rashidi.',
            'Adjudicated and authored approximately 100 formal written Shariah judgments across marital and civil disputes over 2 years.',
            'Systematic judicial court procedure: formal case hearings, meticulous evidence verification, and verdict delivery according to Islamic law.',
            'Author of an extensive compendium of juristic answers (Majmu\'ah-e-Fatawa) forming a comprehensive scholarly volume.'
          ],
      actionLink: { text: isRTL ? 'استفتاء پوچھیں' : 'Ask a Question', url: '/ask' }
    },
    {
      id: 'social-reform',
      title: isRTL ? 'اصلاحِ معاشرہ و مسنون نکاح' : 'Social Reform & Sunnah Nikah',
      englishTitle: 'SOCIAL REFORM & SUNNAH NIKAH',
      shortDesc: isRTL
        ? 'سادہ مسنون نکاح، مہرِ معجل اور انسدادِ جہیز کی عملی جدوجہد'
        : 'Active campaign against dowry, promoting simple mosque Nikah',
      icon: Users,
      highlight: isRTL ? 'تاریخِ نکاح: ۳ اپریل ۲۰۲۱ء' : 'Nikah: 3 April 2021',
      detailedDesc: isRTL
        ? '۲۰ شعبان ۱۴۴۲ھ / ۳ اپریل ۲۰۲۱ء کو اپنے نکاح میں مروجہ جہیز (۳ تا ۴ لاکھ روپے کے سامان) کا قطعی بائیکاٹ کر کے مسجد میں سادگی سے نکاح فرمایا، مہرِ معجل نقد ادا کیا، بینڈ باجے اور غیر شرعی رسوم کی عملی مخالفت کر کے نوجوان نسل کے لیے عملی نمونہ پیش کیا۔'
        : 'Led a courageous grassroots reform during his own marriage on 20 Shaban 1442 AH / 3 April 2021: completely rejected 3-4 lakhs customary dowry, solemnized in the mosque, paid Mahr-e-Mu\'ajjal upfront in cash, and boycotted un-Islamic rituals, setting an exemplary precedent for Muslim youth.',
      points: isRTL
        ? [
            '۲۰ شعبان ۱۴۴۲ھ / ۳ اپریل ۲۰۲۱ء بروز ہفتہ بعد نمازِ ظہر مسجد کے صحن میں انتہائی سادگی کے ساتھ نکاح فرمایا، اور ۲۰ سے ۲۵ منٹ مسجد کی فضیلت اور غلط رسوم کی نحوست پر ولولہ انگیز بیان دیا۔',
            'سسرال والوں سے پلنگ، الماری، کولر، فریج، برتن وغیرہ کسی بھی قسم کے جہیز کا سامان لینے سے قطعی انکار کیا، اور صرف دلہن کو ان کے ذاتی کپڑے، سنگار بکس اور مٹھائی کے ساتھ رخصت کروایا۔',
            'سنتِ مہرِ معجل (۱۱،۷۸۶ روپے) نقد ادا کیا، اور اپنے چھوٹے بھائی اور بہن کے نکاح میں بھی نقد مہرِ معجل ادا کروا کر علاقے میں مسلسل تین نکاحوں میں سنت کا احیاء فرمایا۔',
            'بینڈ باجے، گانے بجانے اور غیر شرعی رسومات کا سخت بائیکاٹ؛ ڈھول باجے والے دو نکاحوں کو پڑھانے سے انکار کیا اور اپنی بہن کی شادی میں بھی بینڈ باجے پر نکاح پڑھانے سے منع فرما دیا۔',
            'شریعت کے احکام کے مطابق غیر محرم سے ہلدی لگانے کی رسم کو مسترد کیا، اور بارات کا بوجھ کم کرنے کے لیے ۳۰۰ کی جگہ صرف ۱۰۰ افراد تک محدود رکھا۔'
          ]
        : [
            'Solemnized his own Nikah with utmost simplicity inside the mosque courtyard after Zuhr prayer on 3 April 2021, followed by a 20-25 minute address on Sunnah marriage and evils of dowry.',
            'Strictly refused 3 to 4 lakhs worth of furniture, appliances, and utensils from the bride\'s family, bringing only his bride home with her personal clothing, bridal box, and sweets.',
            'Paid Mahr-e-Mu\'ajjal (Rs. 11,786) immediately in cash, and facilitated prompt cash dower payment for his younger brother and sister, establishing a Sunnah tradition in the region.',
            'Strictly boycotted brass bands, DJs, and drums (Dhol Baja); refused to solemnize two weddings where musical instruments were used and barred them even from his sister\'s wedding.',
            'Refused non-Mahram customary Haldi rituals and curtailed the wedding party (Barat) to only 100 people instead of hundreds to relieve financial burdens.'
          ]
    },
    {
      id: 'writing-publications',
      title: isRTL ? 'تصنیف و تالیف' : 'Writing & Research',
      englishTitle: 'WRITING & PUBLICATIONS',
      shortDesc: isRTL
        ? 'اصولِ حدیث، فقہ اور تاریخ پر اہم تحقیقی کتب و رسائل'
        : 'Monographs and treatises on Hadith principles, Fiqh & history',
      icon: PenLine,
      highlight: isRTL ? 'ہند و پاک سے شائع شدہ کتب' : 'Published in India & Pakistan',
      detailedDesc: isRTL
        ? 'اصولِ حدیث، اصولِ فقہ، سوانح و تاریخ اور معاصر فقہی مسائل پر مستند اور ضخیم کتب و تحقیقی مقدمات کی تصنیف، جو ہند و پاک کے مختلف معروف علمی اداروں سے شائع ہو چکے ہیں۔'
        : 'Author of definitive scholarly treatises on Hadith methodology, classical Fiqh, Islamic history, and contemporary juristic dilemmas, published across renowned academic presses in India and Pakistan.',
      points: isRTL
        ? [
            'زبدۃ الفکر فی مسائل نزھۃ النظر (اصولِ حدیث کی معروف کتاب ”نزہۃ النظر“ کی شرح و تسہیل، ۱۶۰ صفحات، تحریکِ اصلاحِ ملت مظفر پور، ۲۰۱۷ء)۔',
            'فیضان المناظرہ (اصولِ مناظرہ کی کتاب ”مناظرۂ رشیدیہ“ کا مبسوط ترجمہ، ۱۱۰ صفحات، ہند و پاک دونوں سے شائع شدہ)۔',
            'تذکرۂ مجددینِ اسلام (پہلی سے پندرہویں صدی کے مجددین کا تذکرہ، ۴۲۰ صفحات، امام احمد رضا اکیڈمی بریلی شریف، ۲۰۱۶ء) مع تحقیقی مقدمہ ”حدیثِ مجدد ـــ ایک تجزیاتی مطالعہ“ (۳۰ صفحات)۔',
            'مجتہدینِ اسلام جلد اول (۲۰ مجتہدینِ صحابہ و ۹۴ مفتیانِ صحابہ، ۶۱۶ صفحات، ۲۰۱۷ء) مع مقدمہ ”عہدِ رسالت میں صحابہ کی فقہی و اجتہادی تربیت“ (۴۳ صفحات)۔',
            'مجتہدینِ اسلام جلد دوم (۷۸ تابعینِ کرام، ۴۶۰ صفحات، ۲۰۱۸ء) مع مقدمہ ”عہدِ تابعین کا فقہی ماحول“ (۳۵ صفحات)۔',
            'فروغِ رضویات میں فرزندانِ جامعہ اشرفیہ کی خدمات (۱۴ مشائخ و ۱۳۳ فرزندانِ اشرفیہ، ۶۶۰ صفحات، ۲۰۱۹ء) مع مقدمہ ”امام احمد رضا اور جامعہ اشرفیہ“ (۳۶ صفحات)۔',
            'اذنِ عام ــ چند اصولی مباحث (کووڈ-۱۹ لاک ڈاؤن میں نمازِ جمعہ کے شرعی احکام پر مبسوط مستقل کتاب) اور ”گھروں میں نماز باجماعت کے شرعی مسائل“۔',
            'فیضان القراءت حاشیہ ضیاء القراءت، اصولِ حدیث میں علمائے پاک و ہند کی قلمی خدمات (۱۰۰ سے زائد کتب کا تعارف)، اور ”نماز میں ہاتھ کہاں باندھیں“۔'
          ]
        : [
            'Zubdat-ul-Fikr fi Masa\'il Nuzhat-un-Nazar (Commentary on Ibn Hajar\'s Hadith principles, 160 pages, Tehreek Islah-e-Millat, 2017).',
            'Faizan-ul-Munazarah (Exposition of Munazarah Rasheediyyah, 110 pages, published across India and Pakistan).',
            'Tazkira Mujaddideen-e-Islam (420 pages on revivalists across 15 centuries, Imam Ahmad Raza Academy Bareilly, 2016) with monograph "Hadith-e-Mujaddid" (30 pages).',
            'Mujtahideen-e-Islam Vol 1 (20 Mujtahid Sahaba & 94 Mufti Sahaba, 616 pages, 2017) with introduction on legal training in prophetic era (43 pages).',
            'Mujtahideen-e-Islam Vol 2 (78 prominent Tabi\'een jurists, 460 pages, 2018) with introduction on legal climate of Tabi\'een (35 pages).',
            'Furoogh-e-Rizviyat mein Farzandan-e-Ashrafia (14 Mashaikh & 133 Ashrafia scholars, 660 pages, 2019) with introduction on intellectual links (36 pages).',
            'Idhn-e-Aam: Chand Usooli Mabahis (Comprehensive treatise on Friday prayer regulations during Covid-19 lockdowns) & home congregational prayer guide.',
            'Faizan-ul-Qira\'at Hashiya Diya-ul-Qira\'at, Qalmi Khidmat in Usool-e-Hadith (survey of 100+ works), and treatise on hand placement in prayer.'
          ],
      actionLink: { text: isRTL ? 'تمام تصانیف دیکھیں' : 'View All Works', url: '/books' }
    },
    {
      id: 'quranic-maktabs',
      title: isRTL ? 'قرآنی مکاتب (کنز المکاتب بورڈ)' : 'Quranic Maktabs Board',
      englishTitle: 'KANZ-UL-MAKATIB BOARD',
      shortDesc: isRTL
        ? 'کنز المکاتب بورڈ کے تحت قرآنی مکاتب کا منظم و یکساں سلسلہ'
        : 'Standardized Quranic maktabs network under Kanz-ul-Makatib Board',
      highlight: isRTL ? 'قیام: ۲۰۲۴ء (۵ شاخیں)' : 'Est. 2024 (5 Branches)',
      icon: Building,
      detailedDesc: isRTL
        ? 'سن ۲۰۲۴ء میں ”کنز المکاتب بورڈ“ کے نام سے باضابطہ تنظیم کا قیام عمل میں لایا گیا، جو نونہالانِ اسلام کے لیے قرآنی مکاتب کا ایک منظم سلسلہ ہے۔ اس کی ۵ شاخیں ”قرآنی مکتب“ کے نام سے قائم ہو چکی ہیں اور ملک گیر توسیع جاری ہے۔'
        : 'Founded the "Kanz-ul-Makatib Board" in 2024 to spearhead a nationwide network of standardized Quranic Maktabs. Successfully established 5 active branches named "Quranic Maktab" with continuing expansion across the country.',
      points: isRTL
        ? [
            'سن ۲۰۲۴ء میں ”کنز المکاتب بورڈ“ کے نام سے ایک مستقل اور منظم تنظیم قائم فرمائی۔',
            'قرآنی مکاتب کا ایک باضابطہ و جدید تعلیمی سلسلہ، جس کے تحت ۵ شاخیں ”قرآنی مکتب“ کے نام سے قائم ہو چکی ہیں۔',
            'کنز المکاتب بورڈ کے تحت چلنے والے قرآنی مکاتب کی باقاعدہ تعلیمی، تدریسی اور انتظامی نگرانی۔',
            'بورڈ کے اصول و ضوابط اور نصاب کو ملک بھر میں پذیرائی حاصل ہو رہی ہے اور مزید وسعت پر کام جاری ہے۔'
          ]
        : [
            'Established the formal educational organization "Kanz-ul-Makatib Board" in 2024.',
            'Structured Quranic literacy network with 5 verified branches operating under the title "Quranic Maktab".',
            'Direct administrative, syllabus, and pedagogical supervision of all participating Maktabs under the Board.',
            'Standardized regulations and curricula widely acclaimed nationwide with active expansion work underway.'
          ]
    }
  ];

  // ── 2. Four Compact Credentials / Stats (100% Verified from PDF) ──
  const credentials = [
    {
      num: '1995ء',
      label: isRTL ? 'سنہ ولادت' : 'Born',
      sub: isRTL ? 'بدھول، اورنگ آباد (بہار)' : 'Badhaul, Bihar',
      icon: Calendar
    },
    {
      num: '2019ء',
      label: isRTL ? 'تخصص فی الحدیث و افتاء' : 'Specialization',
      sub: isRTL ? 'جامعہ اشرفیہ مبارک پور' : 'Jamia Ashrafia',
      icon: GraduationCap
    },
    {
      num: '2024ء',
      label: isRTL ? 'منصبِ قضاء' : 'Qazi-e-Shariat',
      sub: isRTL ? 'دار القضاء ادارۂ شرعیہ' : 'Dar-ul-Qadha',
      icon: Scale
    },
    {
      num: '۵+',
      label: isRTL ? 'قرآنی مکاتب (بورڈ)' : 'Quranic Maktabs',
      sub: isRTL ? 'کنز المکاتب بورڈ' : 'Kanz-ul-Makatib',
      icon: Building
    }
  ];

  // ── 3. Strictly 3 Major Scholarly Milestones (Distinct Life Chapters) ──
  const journeyMilestones = [
    {
      step: '۰۱',
      period: '2005ء',
      title: isRTL ? 'تکمیلِ حفظِ قرآن مجید' : 'Completion of Quranic Memorization',
      desc: isRTL
        ? 'دارالعلوم فردوسیہ خانقاہ شریف جمشیدپور میں قرآنِ پاک مکمل حفظ فرمایا اور ۲۰۰۵ء میں باوقار دستارِ حفظ حاصل کی۔'
        : 'Completed Quranic memorization at Darul Uloom Firdausia Jamshedpur, receiving the formal Hifz investiture in 2005.'
    },
    {
      step: '۰۲',
      period: '2009ء – 2019ء',
      title: isRTL ? 'اشرفیہ میں ۱۱ سالہ تعلیم و تخصص' : 'Ashrafia Scholarship & Hadith Specialization',
      desc: isRTL
        ? 'جامعہ اشرفیہ مبارک پور سے مسلسل ۱۱ سالہ درسِ نظامی، سندِ فضیلت، قراءتِ حفص اور تحقیق فی الحدیث و مشقِ افتاء کی تکمیل۔'
        : 'Completed 11 consecutive years of Dars-e-Nizami, Fazilat degree, and postgraduate Hadith Specialization at Jamia Ashrafia.'
    },
    {
      step: '۰۳',
      period: '2024ء',
      title: isRTL ? 'مسندِ قضائے شرعی' : 'Investiture as Qazi-e-Shariat',
      desc: isRTL
        ? 'کبار علمائے ہند کی متفقہ تائید سے دار القضاء ادارۂ شرعیہ اورنگ آباد کے قاضیٔ شریعت منتخب و فائز المرام ہوئے۔'
        : 'Unanimously appointed as official Qazi-e-Shariat at Dar-ul-Qadha Idara-e-Shari\'ah Aurangabad.'
    }
  ];

  // ── 4. Strictly 6 Core Scholarly Disciplines (Pure Academic Specializations) ──
  const expertiseItems = [
    {
      title: isRTL ? 'فقہِ حنفی و اصولِ فقہ' : 'Hanafi Fiqh & Legal Theory',
      desc: isRTL ? 'کتبِ اصول و فتاویٰ کی روشنی میں دقیق فقہی استنباط و تخریج' : 'Classical Hanafi jurisprudence, legal maxims and juristic derivation',
      icon: Scale
    },
    {
      title: isRTL ? 'علم الحدیث و تحقیقِ اسناد' : 'Hadith Methodology & Takhreej',
      desc: isRTL ? 'اصولِ محدثین، نقدِ رجال اور کتبِ احادیث کی اسنادی جانچ' : 'Hadith authentication, narrator criticism and chain analysis',
      icon: BookMarked
    },
    {
      title: isRTL ? 'اصولِ افتاء و صناعتِ فتویٰ' : 'Fatwa Drafting & Methodology',
      desc: isRTL ? 'رسم المفتی کے اصولوں کے مطابق دقیق شرعی سوالات کے جوابات' : 'Rigorous Shariah legal methodology and fatwa drafting principles',
      icon: FileCheck2
    },
    {
      title: isRTL ? 'علومِ قرآن و تجوید و قراءات' : 'Quranic Sciences & Tajweed',
      desc: isRTL ? 'قراءتِ حفص، اصولِ ترتیل اور صوتی تجوید کا مستند علم' : 'Phonetic Tajweed, Qira\'at Hafs and analytical Quranic sciences',
      icon: BookOpen
    },
    {
      title: isRTL ? 'علم الکلام و دفاعِ عقائدِ حقہ' : 'Scholastic Theology (Kalam)',
      desc: isRTL ? 'اہلِ سنت کے مسلّم عقائد کا اثبات اور بدعات کا مدلل رد' : 'Orthodox Sunni theology, refutation of modernism and sectarian doubts',
      icon: ScrollText
    },
    {
      title: isRTL ? 'اصولِ مناظرہ و تحقیقِ مخطوطات' : 'Dialectics & Manuscript Study',
      desc: isRTL ? 'اصولِ جدل، مناظرۂ رشیدیہ کی شرح اور متون کی تفہیم' : 'Islamic debate principles, classical dialectics and text analysis',
      icon: Library
    }
  ];

  // ── 5. Authentic Publications List (Fallback if API empty) ──
  const fallbackBooks = [
    {
      title: isRTL ? 'تذکرۂ مجددینِ اسلام' : 'Tazkira Mujaddideen-e-Islam',
      category: isRTL ? 'سوانح و تاریخ' : 'History',
      pages: isRTL ? '۴۵۰ صفحات' : '450 Pages',
      desc: isRTL ? 'پہلی تا پندرہویں صدی کے ۱۴ مجددینِ اسلام کا وقیع تحقیقی تذکرہ۔' : 'Comprehensive study of 14 Mujaddids across 15 Islamic centuries.'
    },
    {
      title: isRTL ? 'مجتہدینِ اسلام (جلد اول و دوم)' : 'Mujtahideen-e-Islam (Vols 1 & 2)',
      category: isRTL ? 'فقہ و حدیث' : 'Fiqh & Hadith',
      pages: isRTL ? '۱۰۷۶ صفحات' : '1076 Pages',
      desc: isRTL ? 'صحابۂ مجتہدین اور تابعینِ فقہاء کی فقہی خدمات پر مفصل تحقیق۔' : 'In-depth research on Sahaba and Tabi\'een jurists.'
    },
    {
      title: isRTL ? 'زبدۃ الفکر فی مسائل نزھۃ النظر' : 'Zubdat-ul-Fikr fi Nuzhat-un-Nazar',
      category: isRTL ? 'اصولِ حدیث' : 'Hadith Principles',
      pages: isRTL ? '۱۶۰ صفحات' : '160 Pages',
      desc: isRTL ? 'اصولِ حدیث پر حافظ ابن حجر کی نزہۃ النظر کی تسہیل و تشریح۔' : 'Methodological exposition of Ibn Hajar\'s Hadith principles.'
    },
    {
      title: isRTL ? 'اذنِ عام ــ چند اصولی مباحث' : 'Izn-e-Aam: Usooli Mabaahith',
      category: isRTL ? 'معاصر مسائل' : 'Contemporary Fiqh',
      pages: isRTL ? 'تحقیقی رسالہ' : 'Treatise',
      desc: isRTL ? 'کووڈ-۱۹ لاک ڈاؤن میں نمازِ جمعہ کے شرعی احکام پر مبسوط کتاب۔' : 'Juristic treatise on Shariah conditions of Friday congregational prayers.'
    }
  ];

  const displayedBooks = dbBooks && dbBooks.length > 0 ? dbBooks : fallbackBooks;

  return (
    <div
      className="about-page-root min-h-screen pt-3 sm:pt-4 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto selection:bg-[#A8793E]/20"
      style={{
        backgroundColor: COLORS?.background
      }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >

      {/* ══════════════════════════════════════════════════════════════
          TOP TARUF HERO BANNER (Full-Width, Clean, Cinematic)
      ══════════════════════════════════════════════════════════════ */}
      <div className="about-animate about-d-1 about-banner-wrap w-full relative mb-8 sm:mb-10 lg:mb-12">
        <div className="about-banner-container relative w-full overflow-hidden">
          {/* Clean Panoramic Background Image (Full-width, no text in image) */}
          <img
            src={tarufBannerImg}
            alt={isRTL ? "تعارف - فقہ اسلامی" : "Taruf - Islamic Scholarship"}
            className="about-banner-img"
          />

          {/* Minimal Subtle Scrim for Visual Integration & Legibility */}
          <div className="about-banner-scrim" />

          {/* Clean Centered Title & Subtitle Directly Over Banner (No Box/Card) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4 select-none">
            <h1
              className="about-urdu text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold text-amber-50 leading-normal inline-block px-6 overflow-visible"
              style={{
                letterSpacing: 0,
                textShadow: '0 2px 10px rgba(0,0,0,0.95), 0 4px 24px rgba(0,0,0,0.95), 0 0 8px rgba(0,0,0,0.95)'
              }}
            >
              {isRTL ? 'تعارف' : 'Introduction'}
            </h1>
            <div className="flex items-center justify-center gap-2 pt-1 px-4">
              <span className="text-amber-300 text-[10px] sm:text-xs">❖</span>
              <p
                className="about-urdu text-xs sm:text-sm md:text-[15px] font-medium text-amber-200/95 leading-normal"
                style={{
                  letterSpacing: 0,
                  textShadow: '0 1px 8px rgba(0,0,0,0.95), 0 2px 16px rgba(0,0,0,0.9)'
                }}
              >
                {isRTL ? 'علم، شریعت اور امت کی خدمت کا سفر' : 'The Journey of Knowledge, Shariah & Service to the Ummah'}
              </p>
              <span className="text-amber-300 text-[10px] sm:text-xs">❖</span>
            </div>
          </div>
        </div>
      </div>


      {/* ══════════════════════════════════════════════════════════════
          1. HERO SECTION — EDITORIAL SCHOLAR PROFILE WITH FRAMED IMAGE
      ══════════════════════════════════════════════════════════════ */}
      <section className="about-animate about-d-2 mb-10 sm:mb-14 lg:mb-16">
        <div
          className="about-hero-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 0.95fr)',
            gap: 'clamp(20px, 4vw, 36px)',
            alignItems: 'center'
          }}
        >
          {/* ── Text Column (RTL Right) ── */}
          <div className="about-hero-content space-y-4 sm:space-y-4.5" style={{ textAlign: isRTL ? 'right' : 'left' }}>

            {/* Badge: مختصر تعارف */}
            <div className="about-hero-badges flex flex-wrap items-center gap-2.5">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-xs"
                style={{
                  backgroundColor: `${COLORS?.primary}`,
                  color: '#FAF5EE',
                  borderColor: `${COLORS?.accent}45`
                }}
              >
                <ScrollText className="w-3.5 h-3.5 text-amber-300" />
                <span className="about-urdu">{isRTL ? 'مختصر تعارف' : 'Brief Profile'}</span>
              </div>
              <div className="w-6 h-6 rounded-full border overflow-hidden shrink-0 shadow-xs bg-white p-0.5" style={{ borderColor: `${COLORS?.accent}50` }}>
                <img src={logoImg} alt="Logo" className="w-full h-full object-cover rounded-full" />
              </div>
              <span
                className="text-[11px] font-medium px-2.5 py-0.5 rounded-full border"
                style={{
                  backgroundColor: `${COLORS?.cardBg}`,
                  borderColor: `${COLORS?.border}25`,
                  color: COLORS?.textSecondary
                }}
              >
                {isRTL ? 'اورنگ آباد، بہار' : 'Aurangabad, Bihar'}
              </span>
            </div>

            {/* Scholar Name */}
            <div className="space-y-1.5">
              <h2
                className="about-urdu font-bold leading-[1.3] tracking-tight"
                style={{
                  color: COLORS?.textPrimary,
                  fontSize: 'clamp(1.85rem, 3.8vw, 2.75rem)'
                }}
              >
                {scholarName}
              </h2>

              {/* Titles Subtitle Pill */}
              <div
                className="inline-block px-3 py-1 rounded-xl text-xs sm:text-sm font-semibold border"
                style={{
                  backgroundColor: `${COLORS?.accent}10`,
                  borderColor: `${COLORS?.accent}30`,
                  color: COLORS?.textSecondary
                }}
              >
                <p className="about-urdu leading-normal">
                  {scholarTitle}
                </p>
              </div>
            </div>

            {/* Concise 2-3 Lines Introduction */}
            <p
              className="about-urdu text-sm sm:text-[15px] leading-relaxed sm:leading-[2.1] text-justify"
              style={{ color: COLORS?.textSecondary }}
            >
              {isRTL
                ? 'دار القضاء ادارۂ شرعیہ اورنگ آباد کے قاضیٔ شریعت اور برصغیر کے معروف اسلامی محقق۔ آپ قرآن و سنت کی روشنی میں مسنون معاشرت کے احیاء، فقہی استنباط اور قرآنی مکاتب کے قیام کے لیے سرگرم عمل ہیں۔'
                : 'Official Qazi-e-Shariat at Dar-ul-Qadha Aurangabad and accomplished Islamic researcher, dedicated to revitalizing the Prophetic Sunnah, Shariah jurisprudence, and structured Quranic literacy.'}
            </p>

            {/* Action Buttons */}
            <div className="about-hero-cta flex flex-wrap items-center gap-2.5 pt-1.5">
              <a
                href="#publications"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                style={{ backgroundColor: COLORS?.primary, color: '#FAF5EE' }}
              >
                <BookOpen className="w-4 h-4 text-amber-300" />
                <span className="about-urdu">{isRTL ? 'مطبوعات دیکھیں' : 'View Publications'}</span>
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-colors hover:bg-white"
                style={{
                  backgroundColor: COLORS?.cardBg,
                  borderColor: `${COLORS?.border}35`,
                  color: COLORS?.primary
                }}
              >
                <Send className="w-3.5 h-3.5" style={{ color: COLORS?.accent }} />
                <span className="about-urdu">{isRTL ? 'رابطہ کریں' : 'Contact'}</span>
              </Link>
              <Link
                to="/ask"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors hover:text-amber-800"
                style={{ color: COLORS?.textSecondary }}
              >
                <HelpCircle className="w-3.5 h-3.5" style={{ color: COLORS?.accent }} />
                <span className="about-urdu">{isRTL ? 'استفتاء پوچھیں' : 'Ask Fatwa'}</span>
                {isRTL ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
              </Link>
            </div>
          </div>

          {/* ── Image Column (RTL Left): Clean Sharp Portrait (No overlays, no waves, no blur) ── */}
          <div className="about-hero-img-wrap flex items-center justify-center">
            <div
              className="about-image-frame w-full"
              style={{
                maxWidth: '380px',
                aspectRatio: '3.9 / 4.9'
              }}
            >
              {/* Authentic Scholar Image (Completely clean, sharp, no overlays) */}
              <img
                src={scholarPhoto}
                alt={scholarName}
                className="w-full h-full object-cover object-[center_20%] select-none transition-transform duration-500 hover:scale-[1.02]"
                onError={(e) => {
                  if (e.currentTarget.src !== muftiSahebImg) {
                    e.currentTarget.src = muftiSahebImg;
                  }
                }}
              />
            </div>
          </div>

        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════
          2. CREDENTIALS & VITAL STATS (Compact 4-Highlight Bar)
      ══════════════════════════════════════════════════════════════ */}
      <section className="about-animate about-d-3 mb-10 sm:mb-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
          {credentials.map((stat, idx) => {
            const IconComp = stat.icon;
            return (
              <div
                key={idx}
                className="about-card p-4 sm:p-4.5 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="font-mono font-bold text-xl sm:text-2xl tracking-tight"
                    style={{ color: COLORS?.textPrimary }}
                  >
                    {stat.num}
                  </span>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${COLORS?.accent}12`, color: COLORS?.accent }}
                  >
                    <IconComp className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h4 className="about-urdu text-xs sm:text-sm font-bold text-stone-900 leading-snug">
                    {stat.label}
                  </h4>
                  <p className="about-urdu text-[11px] text-stone-600 mt-0.5">
                    {stat.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════
          3. KEY AREAS — 6 INTERACTIVE EDITORIAL CARDS WITH DETAIL MODAL
      ══════════════════════════════════════════════════════════════ */}
      <section className="about-animate about-d-4 mb-12 sm:mb-16">

        {/* ── Section Header with Flanking Quotation Panels (Directly from Visual Reference) ── */}
        <div className="about-key-header-wrap mb-7 sm:mb-9 flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">

          {/* Left Prophetic Hadith Box (Desktop / Tablet) */}
          <div className="about-header-quote-box hidden lg:flex flex-col justify-center text-center p-3.5 rounded-2xl border flex-1 max-w-[260px] shadow-2xs">
            <span className="text-amber-800/40 text-lg leading-none mb-1 font-serif">“</span>
            <p className="about-quran text-xs font-bold text-amber-950 leading-relaxed">
              مَن سَلَكَ طَرِيقاً يَلْتَمِسُ فِيهِ عِلْماً سَهَّلَ اللَّهُ لَهُ طَرِيقاً إِلَى الجَنَّةِ
            </p>
            <span className="text-[10.5px] text-amber-900/70 mt-1 font-semibold">﴿ صحیح مسلم ﴾</span>
          </div>

          {/* Centered Heading & Ornamental Divider */}
          <div className="text-center space-y-1.5 flex-1 px-2">
            <div className="inline-flex items-center justify-center gap-2">
              <span className="h-px w-6 sm:w-10 bg-[#A8793E]/40" />
              <span
                className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase font-sans"
                style={{ color: COLORS?.accent }}
              >
                KEY AREAS
              </span>
              <span className="h-px w-6 sm:w-10 bg-[#A8793E]/40" />
            </div>

            <div className="flex items-center justify-center gap-3">
              <span className="text-[#A8793E] text-xs sm:text-sm select-none">❖</span>
              <h2
                className="about-urdu font-bold text-stone-900 tracking-tight"
                style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.5rem)', lineHeight: 1.25 }}
              >
                {isRTL ? 'اہم شعبہ جات' : 'Key Areas of Service'}
              </h2>
              <span className="text-[#A8793E] text-xs sm:text-sm select-none">❖</span>
            </div>

            <p className="about-urdu text-xs sm:text-sm font-medium text-stone-600 max-w-md mx-auto leading-relaxed">
              {isRTL
                ? 'علم، تربیت اور اصلاح کے جامع میدان'
                : 'Comprehensive Spheres of Knowledge, Spiritual Training & Social Reform'}
            </p>
          </div>

          {/* Right Mission Callout Box (Desktop / Tablet) */}
          <div className="about-header-quote-box hidden lg:flex flex-col justify-center text-center p-3.5 rounded-2xl border flex-1 max-w-[260px] shadow-2xs">
            <span className="text-[10.5px] font-bold tracking-wider text-amber-800 uppercase mb-1">
              {isRTL ? 'ہمـارا مقصـد' : 'Our Mission'}
            </span>
            <p className="about-urdu text-xs sm:text-[13px] font-bold text-stone-800 leading-relaxed">
              {isRTL
                ? 'دین کی صحیح تعلیم اور امت کی اصلاح ہے'
                : 'Authentic Islamic education and sincere reform of the Ummah'}
            </p>
          </div>

        </div>

        {/* ── 6 Interactive Cards Grid (3x2 Desktop, 2x3 Tablet, 1x6 Mobile) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5.5">
          {keyAreas.map((area) => {
            const AreaIcon = area.icon;
            return (
              <button
                key={area.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveArea(area);
                }}
                className="about-key-card group text-center flex flex-col justify-between items-center p-4.5 sm:p-5 rounded-2xl sm:rounded-[22px] cursor-pointer relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#A8793E]/40"
                aria-haspopup="dialog"
                aria-label={`${area.title} - ${area.englishTitle}`}
              >
                {/* Background Watermark silhouette */}
                <div className="about-card-watermark absolute inset-0 pointer-events-none" />

                <div className="relative z-10 w-full flex flex-col items-center text-center space-y-2.5">
                  {/* Optional Highlight Pill (Centered) */}
                  {area.highlight && (
                    <div className="mb-0.5">
                      <span className="about-urdu text-[10px] sm:text-[10.5px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100/90 text-amber-900 border border-amber-300/60 shadow-2xs inline-block">
                        {area.highlight}
                      </span>
                    </div>
                  )}

                  {/* Icon Badge (Centered) */}
                  <div className="about-card-icon-badge w-12 h-12 sm:w-13 sm:h-13 mx-auto rounded-full flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105">
                    <AreaIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-amber-300" />
                  </div>

                  {/* Urdu Title & English Subtitle (Centered) */}
                  <div className="space-y-0.5 text-center w-full">
                    <h3 className="about-urdu text-base sm:text-lg font-bold text-stone-900 leading-snug group-hover:text-amber-900 transition-colors">
                      {area.title}
                    </h3>
                    <span className="block text-[9.5px] sm:text-[10px] font-bold text-[#A8793E] tracking-widest uppercase font-sans">
                      {area.englishTitle}
                    </span>
                  </div>

                  {/* Short Description (Centered & Balanced) */}
                  <p className="about-urdu text-xs sm:text-[12.5px] text-stone-600 leading-relaxed text-center max-w-[94%] mx-auto">
                    {area.shortDesc}
                  </p>
                </div>

                {/* Footer Action: مزید تفصیل + Animated Arrow (Centered & Balanced) */}
                <div
                  className="relative z-10 pt-3 mt-3 border-t w-full flex items-center justify-center gap-2"
                  style={{ borderColor: 'rgba(168, 121, 62, 0.16)' }}
                >
                  <span className="about-urdu text-xs font-bold text-stone-700 group-hover:text-amber-900 transition-colors">
                    {isRTL ? 'مزید تفصیل' : 'View Details'}
                  </span>
                  <div className="about-card-action-btn w-6.5 h-6.5 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-[#A8793E] group-hover:text-white shadow-2xs">
                    {isRTL ? (
                      <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Bottom Summary Ribbon (Directly from Visual Reference) ── */}
        <div className="about-key-ribbon mt-6 py-3 px-4.5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
          <div className="about-urdu text-xs font-medium text-stone-700 hidden md:flex items-center gap-2">
            <span className="text-amber-700 text-xs">❖</span>
            <span>علم کی روشنی سے بہتر کوئی میراث نہیں</span>
          </div>

          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('publications');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="about-urdu inline-flex items-center gap-2 px-6 py-2 rounded-full text-xs sm:text-sm font-bold shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer bg-[#2B2118] text-amber-100 border border-[#A8793E]/50 hover:bg-[#3D2E22]"
          >
            <BookOpen className="w-4 h-4 text-amber-300" />
            <span>{isRTL ? 'تمام تفصیلات دیکھیں' : 'View Complete Details'}</span>
            <span className="text-xs">{isRTL ? '←' : '→'}</span>
          </button>

          <div className="about-urdu text-xs font-medium text-stone-700 hidden md:flex items-center gap-2">
            <span>ہر فرد تک علم، ہر گھر تک اصلاح</span>
            <span className="text-amber-700 text-xs">❖</span>
          </div>
        </div>

      </section>

      {/* ══════════════════════════════════════════════════════════════
          REUSABLE DETAIL MODAL (Rendered via createPortal directly to document.body)
      ══════════════════════════════════════════════════════════════ */}
      {activeArea && createPortal(
        <div
          className="about-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setActiveArea(null);
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="about-modal-title"
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <div
            className="about-modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar */}
            <div
              className="relative px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between text-white border-b shrink-0"
              style={{ backgroundColor: '#2B2118', borderColor: 'rgba(168, 121, 62, 0.35)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 bg-[#1F1710] border border-[#A8793E]/50 text-amber-300 shadow-inner">
                  {React.createElement(activeArea.icon, { className: 'w-5 h-5' })}
                </div>
                <div>
                  <h3 id="about-modal-title" className="about-urdu text-base sm:text-xl font-bold text-amber-100 leading-tight">
                    {activeArea.title}
                  </h3>
                  <span className="text-[10px] font-bold text-[#A8793E] uppercase tracking-wider block mt-0.5">
                    {activeArea.englishTitle}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveArea(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-amber-200/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border border-amber-200/20"
                aria-label={isRTL ? 'بند کریں' : 'Close'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-start flex-1 min-h-0">
              {/* Highlight Badge if exists */}
              {activeArea.highlight && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-100/90 text-amber-950 border border-amber-300">
                  <span className="text-amber-700">❖</span>
                  <span className="about-urdu">{activeArea.highlight}</span>
                </div>
              )}

              {/* Detailed Overview Card */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-amber-500/5 border border-amber-800/15">
                <p className="about-urdu text-xs sm:text-[13.5px] leading-relaxed sm:leading-[2.1] text-stone-800 text-justify">
                  {activeArea.detailedDesc}
                </p>
              </div>

              {/* If activeArea has stages (e.g. Detailed Education Journey from PDF), render structured timeline cards */}
              {activeArea.stages && activeArea.stages.length > 0 && (
                <div className="space-y-3">
                  <h4 className="about-urdu text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded-full bg-[#A8793E]" />
                    <span>{isRTL ? 'تعلیمی منازل و تاریخی مراحل (مستند دستاویزی سفر):' : 'Verified Educational Journey & Milestones:'}</span>
                  </h4>
                  <div className="space-y-2.5">
                    {activeArea.stages.map((stage, sIdx) => (
                      <div
                        key={sIdx}
                        className="about-stage-card p-3 sm:p-3.5 rounded-xl bg-[#FAF6F0] border border-[#A8793E]/25 text-start space-y-1 relative shadow-2xs"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-[#A8793E]/15 pb-1.5">
                          <span className="about-urdu text-xs sm:text-[13.5px] font-bold text-[#2B2118] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#A8793E] shrink-0" />
                            {stage.stageTitle}
                          </span>
                          {stage.period && (
                            <span className="text-[10px] sm:text-[10.5px] font-bold px-2 py-0.5 rounded-md bg-[#A8793E]/15 text-[#885d26] font-sans">
                              {stage.period}
                            </span>
                          )}
                        </div>
                        {stage.institution && (
                          <div className="about-urdu text-[11px] sm:text-[11.5px] font-semibold text-[#A8793E] flex items-center gap-1">
                            <span>📍</span>
                            <span>{stage.institution}</span>
                          </div>
                        )}
                        <p className="about-urdu text-xs sm:text-[12.5px] text-stone-700 leading-relaxed pt-0.5">
                          {stage.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Verified Key Points List */}
              {activeArea.points && activeArea.points.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="about-urdu text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded-full bg-[#A8793E]" />
                    <span>{isRTL ? 'اہم دستاویزی نکات و خدمات:' : 'Verified Key Highlights & Points:'}</span>
                  </h4>
                  <ul className="space-y-2">
                    {activeArea.points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-stone-700 leading-relaxed">
                        <span className="w-4.5 h-4.5 rounded-full bg-[#A8793E]/15 text-[#A8793E] flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">
                          ✓
                        </span>
                        <span className="about-urdu flex-1">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Optional Contextual Action Link */}
              {activeArea.actionLink && (
                <div className="pt-2">
                  <Link
                    to={activeArea.actionLink.url}
                    onClick={() => setActiveArea(null)}
                    className="about-urdu inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-xs font-bold text-white transition-all duration-200 hover:opacity-95 shadow-sm"
                    style={{ backgroundColor: '#2B2118', border: '1px solid rgba(168, 121, 62, 0.4)' }}
                  >
                    <span>{activeArea.actionLink.text}</span>
                    <span>{isRTL ? '←' : '→'}</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              className="px-5 py-3 sm:px-6 bg-[#F3ECE0] border-t flex items-center justify-end shrink-0"
              style={{ borderColor: 'rgba(168, 121, 62, 0.20)' }}
            >
              <button
                type="button"
                onClick={() => setActiveArea(null)}
                className="about-urdu px-5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors bg-stone-200 hover:bg-stone-300 text-stone-800"
              >
                {isRTL ? 'بند کریں' : 'Close'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}


      {/* ══════════════════════════════════════════════════════════════
          4. SCHOLARLY JOURNEY — 3 MAJOR MILESTONES
      ══════════════════════════════════════════════════════════════ */}
      <section className="about-animate about-d-5 mb-10 sm:mb-14">
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div className="flex items-center gap-2.5">
            <span
              className="w-1.5 h-5 rounded-full shrink-0"
              style={{ background: `linear-gradient(to bottom, ${COLORS?.accent}, ${COLORS?.accent}60)` }}
            />
            <h2 className="about-urdu text-lg sm:text-xl font-bold text-stone-900">
              {isRTL ? 'علمی سنگِ میل' : 'Scholarly Journey'}
            </h2>
          </div>
          <span className="about-urdu text-xs text-stone-500 hidden sm:inline-block">
            {isRTL ? '۳ اہم تعلیمی و تدریسی مراحل' : '3 Pivotal Milestones'}
          </span>
        </div>

        <div className="about-timeline-connector grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {journeyMilestones.map((item, idx) => (
            <div
              key={idx}
              className="about-card p-4.5 sm:p-5 flex flex-col justify-between relative z-10"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className="font-mono font-bold text-xs px-2 py-0.5 rounded-md"
                    style={{ backgroundColor: `${COLORS?.accent}15`, color: COLORS?.accent }}
                  >
                    {item.step}
                  </span>
                  <span className="about-urdu text-[11px] font-bold text-stone-600">
                    {item.period}
                  </span>
                </div>
                <h3 className="about-urdu text-sm font-bold text-stone-900 pt-0.5">
                  {item.title}
                </h3>
                <p className="about-urdu text-xs text-stone-600 leading-relaxed text-justify">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════
          5. CORE AREAS OF EXPERTISE (6 Compact Chips)
      ══════════════════════════════════════════════════════════════ */}
      <section className="about-animate about-d-6 mb-10 sm:mb-14">
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div className="flex items-center gap-2.5">
            <span
              className="w-1.5 h-5 rounded-full shrink-0"
              style={{ background: `linear-gradient(to bottom, ${COLORS?.accent}, ${COLORS?.accent}60)` }}
            />
            <h2 className="about-urdu text-lg sm:text-xl font-bold text-stone-900">
              {isRTL ? 'علمی و اختصاصی مہارت' : 'Areas of Expertise'}
            </h2>
          </div>
          <span className="about-urdu text-xs text-stone-500 hidden sm:inline-block">
            {isRTL ? 'فقہ، حدیث اور قضائے شرعی' : 'Fiqh, Hadith & Qadha'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {expertiseItems.map((exp, idx) => {
            const ExpIcon = exp.icon;
            return (
              <div
                key={idx}
                className="about-card p-3.5 sm:p-4 flex items-start gap-3"
              >
                <div
                  className="w-8.5 h-8.5 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: `${COLORS?.accent}12`, color: COLORS?.accent }}
                >
                  <ExpIcon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <h3 className="about-urdu text-xs sm:text-sm font-bold text-stone-900">
                    {exp.title}
                  </h3>
                  <p className="about-urdu text-[11px] text-stone-600 leading-relaxed">
                    {exp.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════
          6. SELECTED WORKS — MAX 4 COMPACT PUBLICATION CARDS
      ══════════════════════════════════════════════════════════════ */}
      <section id="publications" className="about-animate about-d-7 mb-10 sm:mb-14">
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div className="flex items-center gap-2.5">
            <span
              className="w-1.5 h-5 rounded-full shrink-0"
              style={{ background: `linear-gradient(to bottom, ${COLORS?.accent}, ${COLORS?.accent}60)` }}
            />
            <h2 className="about-urdu text-lg sm:text-xl font-bold text-stone-900">
              {isRTL ? 'منتخب تصانیف و کتب' : 'Selected Publications'}
            </h2>
          </div>
          <Link
            to="/books"
            className="inline-flex items-center gap-1 text-xs font-bold transition-colors hover:underline"
            style={{ color: COLORS?.accent }}
          >
            <span className="about-urdu">{isRTL ? 'تمام تصانیف دیکھیں' : 'View All'}</span>
            {isRTL ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {displayedBooks.map((book, idx) => (
            <div
              key={book._id || idx}
              className="about-card p-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span
                    className="about-urdu px-2 py-0.5 rounded font-semibold"
                    style={{ backgroundColor: `${COLORS?.accent}14`, color: COLORS?.accent }}
                  >
                    {book.category || (isRTL ? 'کتاب' : 'Book')}
                  </span>
                  <span className="font-mono text-stone-500">
                    {book.pageCount ? `${book.pageCount} ص` : book.pages}
                  </span>
                </div>
                <h3 className="about-urdu text-xs sm:text-sm font-bold text-stone-900 line-clamp-2 leading-snug">
                  {book.title}
                </h3>
                <p className="about-urdu text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
                  {book.summary || book.desc}
                </p>
              </div>
              <div
                className="pt-2.5 mt-2.5 border-t flex items-center justify-between"
                style={{ borderColor: 'rgba(168, 121, 62, 0.15)' }}
              >
                <Link
                  to={book.slug ? `/books/${book.slug}` : (book._id ? `/books/${book._id}` : '/books')}
                  className="about-urdu text-xs font-bold transition-colors flex items-center gap-1 hover:underline"
                  style={{ color: COLORS?.accent }}
                >
                  <span>{isRTL ? 'مطالعہ کریں' : 'Read Online'}</span>
                  {isRTL ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════
          7. KANZ-UL-MAKATIB BOARD — COMPACT ACHIEVEMENT BANNER
      ══════════════════════════════════════════════════════════════ */}
      <section className="about-animate about-d-7 mb-10 sm:mb-12">
        <div
          className="about-card p-5 sm:p-6 border overflow-hidden"
          style={{
            borderColor: `${COLORS?.accent}40`,
            backgroundColor: '#F7F1E8'
          }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4.5">
            <div className="space-y-1.5 text-center sm:text-start flex-1">
              <span
                className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider block"
                style={{ color: COLORS?.accent }}
              >
                {isRTL ? 'قرآنی بیداری تحریک' : 'QURANIC EDUCATION INITIATIVE'}
              </span>
              <h3 className="about-urdu text-base sm:text-lg font-bold text-stone-900">
                {isRTL ? 'کنز المکاتب بورڈ (ملک گیر قرآنی مکاتب)' : 'Kanz-ul-Makatib Board'}
              </h3>
              <p className="about-urdu text-xs text-stone-600 leading-relaxed max-w-xl">
                {isRTL
                  ? 'نئی نسل کو صحیح تلفظ، تجوید اور بنیادی عقائد سے آراستہ کرنے کے لیے قائم منظم قرآنی نصاب اور سرپرستی کا ملک گیر نظام۔'
                  : 'Nationwide standardized curriculum providing youth with authentic Tajweed and foundational Islamic ethics.'}
              </p>
            </div>

            <div
              className="rounded-xl px-5 py-2.5 border text-center shrink-0 bg-white/60 shadow-xs"
              style={{ borderColor: `${COLORS?.border}30` }}
            >
              <span className="about-shimmer-gold block text-2xl sm:text-3xl font-bold font-mono">
                {isRTL ? '۵+' : '5+'}
              </span>
              <span className="about-urdu block text-[11px] font-bold text-amber-900 mt-0.5">
                {isRTL ? 'فعال قرآنی مکاتب' : 'Active Maktabs'}
              </span>
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════
          8. FINAL CTA — COMPACT FOOTER BAR
      ══════════════════════════════════════════════════════════════ */}
      <section className="about-animate about-d-8 mb-4">
        <div
          className="rounded-2xl p-5 sm:p-6 border text-white shadow-md"
          style={{
            backgroundColor: COLORS?.primary,
            borderColor: `${COLORS?.accent}40`
          }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-start">
            <div className="flex-1">
              <h3 className="about-urdu text-sm sm:text-base font-bold text-amber-100">
                {isRTL ? 'مفتی صاحب سے رابطہ و آن لائن استفادہ' : 'Connect & Learn from the Scholar'}
              </h3>
              <p className="about-urdu text-xs text-stone-300 mt-1 leading-relaxed">
                {isRTL
                  ? 'ٹیلی گرام اور واٹس ایپ چینلز کے ذریعے مستند فتاویٰ اور علمی رہنمائی حاصل کریں۔'
                  : 'Join official communication channels for verified fatwas, judicial verdicts, and publications.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
              {contactInfo.whatsapp && (
                <a
                  href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-transform hover:-translate-y-0.5"
                  style={{ backgroundColor: '#25D366', color: '#fff' }}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              )}
              {socialLinks.telegram && (
                <a
                  href={socialLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-transform hover:-translate-y-0.5"
                  style={{ backgroundColor: '#0088cc', color: '#fff' }}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Telegram</span>
                </a>
              )}
              <Link
                to="/ask"
                className="about-urdu px-4 py-2 rounded-lg text-xs font-bold border hover:bg-white/10 text-white transition-colors"
                style={{ borderColor: 'rgba(255,255,255,0.35)' }}
              >
                {isRTL ? 'استفتاء پوچھیں' : 'Ask Question'}
              </Link>
            </div>
          </div>
        </div>

        {/* Primary Biographical Source Citation */}
        <div
          className="text-center text-[11px] pt-3.5 mt-3 border-t"
          style={{ borderColor: 'rgba(168, 121, 62, 0.15)', color: COLORS?.textSecondary }}
        >
          <p className="about-urdu">
            {isRTL
              ? 'ماخذ: سوانحی تعارف و انٹرویو بقلم مولانا محمد ابوہریرہ رضوی مصباحی (الجامعۃ الغوثیہ للبنات ہواگ، رام گڑھ، جھارکھنڈ)'
              : 'Primary Source: Biographical Memoir & Interview by Maulana Muhammad Abu Huraira Rizvi Misbahi'}
          </p>
        </div>
      </section>

    </div>
  );
}
