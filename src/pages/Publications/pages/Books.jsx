import { COLORS } from '@/utils/themeColors';
import React, { useState } from 'react'
import { PageContainer, ConfirmationBox } from '@/components';
import { BOOKS } from '@/data/siteData';
import { useSettings } from '@/hooks/useSettings';

export default function Books() {
  const { settings } = useSettings();
  const [selectedBook, setSelectedBook] = useState(null);
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  return (
    <PageContainer
      title={language === 'en' ? 'Useful Educational & Reformative Books' : 'مفید علمی و اصلاحی کتابیں'}
      subtitle={language === 'en' ? 'Masterpieces written by the elders of Jamia Banuri Town' : 'جامعہ بنوری ٹاؤن کے اکابرین کی تحریر کردہ شاہکار کتب'}
    >
      <div className={`space-y-6 ${language === 'ur' ? 'text-right' : 'text-left'}`} dir={language === 'ur' ? 'rtl' : 'ltr'}>
        <p>
          {language === 'en'
            ? 'The writing and compilation department of the Jamia is active in scientific and research activities. Numerous valuable religious, jurisprudential, and educational books written by the elders of the Jamia are provided free of charge for study.'
            : 'جامعہ کا شعبہ تصنیف و تالیف علمی تحقیقی سرگرمیوں میں پیش پیش ہے۔ اکابرینِ جامعہ کی تحریر کردہ متعدد گرانقدر دینی، فقہی اور تعلیمی کتابیں مطالعہ کے لیے بلا معاوضہ فراہم کی جاتی ہیں۔'
          }
        </p>

        <h3 className="text-[22px] font-bold text-primary border-b pb-2">
          {language === 'en' ? 'Featured Books Repository' : 'نمایاں کتب کا ذخیرہ'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
          {BOOKS.map((book) => (
            <div
              key={book.id}
              className="border border-border rounded-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow bg-white text-center"
            >
              {/* Book cover representation */}
              <div
                style={{ background: book.gradient || `linear-gradient(160deg, ${COLORS.primary} 0%, ${COLORS.primary} 100%)` }}
                className="h-[200px] flex items-center justify-center p-4 text-white font-bold text-[20px] select-none shadow-inner"
              >
                {book.title}
              </div>

              {/* Book Info */}
              <div className="p-4 bg-gray-50 border-t border-border flex flex-col gap-2">
                <span className="text-[17px] font-bold text-primary">{book.title}</span>
                <span className="text-[13px] text-accent">
                  {language === 'en' ? 'Publishing Department, Jamia Banuri Town' : 'شعبہ نشر و اشاعت، جامعہ بنوری ٹاؤن'}
                </span>
                <button
                  onClick={() => {
                    setSelectedBook(book);
                    setShowConfirmBox(true);
                  }}
                  className="mt-2 bg-primary hover:bg-primary text-white py-1.5 text-[14px] font-bold transition-colors shadow-sm cursor-pointer"
                >
                  {language === 'en' ? '📖 Read Free Online' : '📖 مفت آن لائن پڑھیں'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation / Alert Box */}
      <ConfirmationBox
        isOpen={showConfirmBox}
        onClose={() => setShowConfirmBox(false)}
        title={language === 'en' ? 'Online Reading' : 'آن لائن مطالعہ'}
        message={
          language === 'en'
            ? `Reading of "${selectedBook?.title}" will be available on the website soon.`
            : `"${selectedBook?.title}" کا مطالعہ جلد ہی ویب سائٹ پر میسر ہوگا۔`
        }
        type="info"
        confirmText={language === 'en' ? 'OK' : 'ٹھیک ہے'}
        showCancel={false}
      />
    </PageContainer>
  )
}

