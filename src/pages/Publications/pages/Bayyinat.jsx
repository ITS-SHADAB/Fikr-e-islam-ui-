import React, { useState } from 'react'
import { PageContainer, ConfirmationBox } from '@/components';
import { ARTICLES } from '@/data/siteData';
import { useSettings } from '@/hooks/useSettings';

export default function Bayyinat() {
  const { settings } = useSettings();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  return (
    <PageContainer
      title={language === 'en' ? 'Monthly Bayyinat' : 'ماہنامہ بینات'}
      subtitle={language === 'en' ? 'The scholarly & reformative voice' : 'ترجمانِ علمی و اصلاحی مجلہ'}
    >
      <div className={`space-y-6 ${language === 'ur' ? 'text-right' : 'text-left'}`} dir={language === 'ur' ? 'rtl' : 'ltr'}>
        <p>
          {language === 'en'
            ? '"Bayyinat" is a scientific, research-oriented, and training magazine published to spread the authentic interpretations of the Quran and Sunnah.'
            : '"بینات" ایک علمی، تحقیقی، دینی اور تربیتی سلسلہ ہے، جو دین کے پیغام اور قرآن و سنت کی سچی تشریحات کو عام کرنے کے لیے پیش کیا جاتا ہے۔'
          }
        </p>

        <h3 className="text-[22px] font-bold text-primary border-b pb-2">
          {language === 'en' ? 'Selected Articles from the Latest Issue' : 'تازہ ترین شمارے کے منتخب مضامین'}
        </h3>

        <div className="space-y-3 my-6">
          {ARTICLES.map((art) => (
            <div key={art.id} className="bg-background border border-border p-4 rounded-sm hover:border-accent transition-colors cursor-pointer flex justify-between items-center">
              <span className="font-bold text-primary text-[17px]">{art.title}</span>
              <span className="text-accent text-[14px]">
                {language === 'en' ? 'Read Article 🗎' : 'مضمون پڑھیں 🗎'}
              </span>
            </div>
          ))}
        </div>

        <h3 className="text-[22px] font-bold text-primary border-b pb-2">
          {language === 'en' ? 'Permanent Columns and Departments of Bayyinat' : 'بینات کے مستقل کالم اور شعبہ جات'}
        </h3>
        <ul className={`list-disc list-inside space-y-2 text-[17px] ${language === 'ur' ? 'pr-4' : 'pl-4'}`}>
          <li>
            <strong>{language === 'en' ? 'Editorial (Isharaat): ' : 'اشارات (اداریہ):'}</strong>{' '}
            {language === 'en' ? 'Detailed Shariah commentary on contemporary tribulations and global issues.' : 'عصری فتنوں اور عالمی مسائل پر مفصل شرعی تبصرہ۔'}
          </li>
          <li>
            <strong>{language === 'en' ? 'Tafsir & Hadith: ' : 'تفسیر و حدیث:'}</strong>{' '}
            {language === 'en' ? 'Understanding Quran and Hadith in light of authentic statements of ancient predecessors.' : 'ائمہ سلف کے معتبر اقوال کی روشنی میں قرآن و حدیث کا فہم۔'}
          </li>
          <li>
            <strong>{language === 'en' ? 'Fatwas: ' : 'فتاویٰ:'}</strong>{' '}
            {language === 'en' ? 'Simple explanations of selected fatwas issued by Darul Ifta.' : 'دارالافتاء کی طرف سے جاری کردہ منتخب فتاویٰ کی عام فہم تشریح۔'}
          </li>
          <li>
            <strong>{language === 'en' ? 'Obituaries & Biographies: ' : 'وفیات و سوانح:'}</strong>{' '}
            {language === 'en' ? 'Life events of pious predecessors and deceased leaders of the Ummah.' : 'سلف صالحین اور وفات پا جانے والے اکابرینِ امت کے حالاتِ زندگی۔'}
          </li>
        </ul>

        <div className="text-center pt-6">
          <button
            onClick={() => setShowSubscriptionModal(true)}
            className="bg-primary text-white py-3 px-6 text-[16px] font-bold hover:bg-primary transition-colors cursor-pointer"
          >
            {language === 'en' ? '✍️ Become an Annual Subscriber (Get printed copies home-delivered)' : '✍️ سالانہ خریدار بنیں (پرنٹڈ کاپی گھر منگوائیں)'}
          </button>
        </div>

      </div>

      {/* Confirmation / Alert Box */}
      <ConfirmationBox
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        title={language === 'en' ? 'Annual Subscription' : 'سالانہ خریدار بنیں'}
        message={
          language === 'en'
            ? 'The annual subscription form is disabled in this demo version.'
            : 'سالانہ خریدار بننے کا فارم ڈیمو ورژن میں غیر فعال ہے۔'
        }
        type="info"
        confirmText={language === 'en' ? 'OK' : 'ٹھیک ہے'}
        showCancel={false}
      />
    </PageContainer>
  )
}

