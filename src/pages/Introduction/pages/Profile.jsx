import React, { useState } from 'react'
import PageContainer from '../../../components/PageContainer/PageContainer'
import { ConfirmationBox } from '@/components'

export default function Profile() {
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  return (
    <PageContainer
      title="تعارف جامعہ (پروفائل)"
      subtitle="جامعہ العلوم الاسلامیہ بنوری ٹاؤن ایک نظر میں"
    >
      <div className="space-y-6">
        <p>
          جامعہ العلوم الاسلامیہ علامہ بنوری ٹاؤن گیا بہار انڈیا کا شمار عالم اسلام کے ممتاز ترین تعلیمی و تربیتی مراکز میں ہوتا ہے۔ اس کی بنیاد 1953ء میں محدث العصر حضرت علامہ سید محمد یوسف بنوری رحمہ اللہ نے رکھی۔
        </p>

        <h3 className="text-[22px] font-bold text-primary border-b border-border pb-2 font-serif">نمایاں تعلیمی اعداد و شمار</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6 text-center">
          <div className="bg-white border border-border p-6 rounded-[20px] shadow-sm">
            <div className="text-[36px] font-bold text-accent">12,000+</div>
            <div className="text-[16px] text-textPrimary font-bold mt-2">کل فارغ التحصیل علماء</div>
          </div>
          <div className="bg-white border border-border p-6 rounded-[20px] shadow-sm">
            <div className="text-[36px] font-bold text-accent">3,500+</div>
            <div className="text-[16px] text-textPrimary font-bold mt-2">موجودہ زیرِ تعلیم طلبہ</div>
          </div>
          <div className="bg-white border border-border p-6 rounded-[20px] shadow-sm">
            <div className="text-[36px] font-bold text-accent">150+</div>
            <div className="text-[16px] text-textPrimary font-bold mt-2">جید اساتذہ و مفتیانِ کرام</div>
          </div>
        </div>

        <h3 className="text-[22px] font-bold text-primary border-b border-border pb-2 font-serif">اہم تعلیمی شعبہ جات</h3>
        <p>
          جامعہ میں حفظِ قرآن سے لے کر دورہ حدیث (ایم اے اسلامک اسٹڈیز) اور اس کے بعد تخصص (پی ایچ ڈی مساوی تعلیم) کے درج ذیل کورسز کروائے جاتے ہیں:
        </p>

        <ul className="list-disc list-inside space-y-2 pr-4 text-textPrimary">
          <li><strong>شعبہ درسِ نظامی:</strong> ثانویہ عامہ، ثانویہ خاصہ، عالیہ، اور عالمیہ (دورہ حدیث)۔</li>
          <li><strong>شعبہ تخصص فی الافتاء:</strong> فقہ اور افتاء کی خصوصی تدریس و تحقیق۔</li>
          <li><strong>شعبہ تخصص فی الحدیث:</strong> علم الحدیث اور اسماء الرجال پر ریسرچ۔</li>
          <li><strong>شعبہ تحفیظ القرآن:</strong> بچوں کے لیے تجوید کے ساتھ حفظ قرآن کا بہترین انتظام۔</li>
        </ul>

        <div className="text-center pt-8">
          <a
            href="#download-mock"
            onClick={(e) => {
              e.preventDefault();
              setShowDownloadModal(true);
            }}
            className="inline-flex items-center gap-2 bg-primary text-white font-bold py-3.5 px-7 rounded shadow-md hover:bg-primary/90 transition-colors cursor-pointer"
          >
            📂 تعارف جامعہ (پی ڈی ایف گائیڈ) ڈاؤن لوڈ کریں
          </a>
        </div>
      </div>

      {/* Confirmation / Alert Box */}
      <ConfirmationBox
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        title="ڈاؤن لوڈ گائیڈ"
        message="تعارف نامہ (دلیل الجامعہ) کی پی ڈی ایف فائل ڈاؤن لوڈ ہونا شروع ہو گئی ہے۔"
        type="success"
        confirmText="ٹھیک ہے"
        showCancel={false}
      />
    </PageContainer>
  )
}


