import React, { useState } from 'react'
import PageContainer from '../../../components/PageContainer/PageContainer'
import { ConfirmationBox } from '@/components'

export default function NewQuestions() {
  const [showQuestionModal, setShowQuestionModal] = useState(false);

  const fatawa = [
    {
      q: 'سوال: کیا قربانی کے جانور (جیسے گائے) میں عقیقہ کا حصہ ڈالا جا سکتا ہے؟ اور کیا اس کے لیے اسی جانور میں قربانی کا حصہ ڈالنا بھی شرط ہے؟',
      a: 'جواب: جی ہاں! بڑے جانور یعنی گائے، بیل، اونٹ وغیرہ جس میں سات حصے ہو سکتے ہیں، اس میں قربانی کے حصوں کے ساتھ عقیقہ کا حصہ بھی ڈالا جا سکتا ہے۔ اس سے عقیقہ بھی درست ہو جائے گا اور قربانی بھی۔ عقیقہ کا حصہ ڈالنے کے لیے اسی شخص کا قربانی کا حصہ ڈالنا شرط نہیں ہے، بلکہ اگر کچھ لوگ صرف قربانی کر رہے ہوں اور کوئی ایک شخص عقیقہ کا حصہ ڈال لے تو یہ بھی بالکل جائز ہے۔ واللہ اعلم بالصواب۔'
    },
    {
      q: 'سوال: جیٹ جی پی ٹی (ChatGPT) یا گوگل اے آئی (Google AI) سے دینی و شرعی مسائل میں راہنمائی حاصل کرنے اور اس پر عمل کرنے کا کیا حکم ہے؟',
      a: 'جواب: مصنوعی ذہانت (AI) کے ٹولز محض معلومات کا ذخیرہ فراہم کرتے ہیں، ان میں فہم و استنباط اور شرعی بصیرت موجود نہیں ہوتی۔ یہ ٹولز بسا اوقات غلط یا غیر مستند مواد کو بھی درست بنا کر پیش کر دیتے ہیں۔ لہٰذا دینی و شرعی مسائل میں محض ان پر انحصار کرنا اور ان کے دیے گئے جوابات پر عمل کرنا شرعاً جائز نہیں ہے۔ مسلمانوں کو چاہیے کہ وہ مستند علماء اور مستند دارالافتاء سے براہِ راست رجوع کریں۔ واللہ اعلم بالصواب۔'
    },
    {
      q: 'سوال: مقررہ اوقاتِ کار کے بعد ملازم (اجیرِ خاص) کے لیے اپنا ذاتی کاروبار کرنے کا کیا حکم ہے؟',
      a: 'جواب: ملازم (جو کہ اجیرِ خاص کہلاتا ہے) ملازمت کے مقررہ اوقات کے دوران کوئی دوسرا کام یا ذاتی کاروبار کرنے کا مجاز نہیں ہے۔ البتہ، ملازمت کے اوقاتِ کار ختم ہو جانے کے بعد وہ اپنا ذاتی کاروبار یا کوئی دوسرا کام کرنے میں شرعاً آزاد ہے، بشرطیکہ اس کام سے اس کی ملازمت کی کارکردگی متاثر نہ ہو۔ واللہ اعلم بالصواب۔'
    }
  ]

  return (
    <PageContainer
      title="نئے سوالات و فتاویٰ"
      subtitle="دارالافتاء بنوری ٹاؤن کے تازہ ترین فتاویٰ اور شرعی مسائل کا حل"
    >
      <div className="space-y-8">
        <div className="bg-background border border-border p-6 rounded-sm">
          <h3 className="text-[20px] font-bold text-primary mb-4">آن لائن فتویٰ پوچھیں</h3>
          <p className="text-[16px] text-textSecondary mb-4">
            اگر آپ کو کوئی شرعی مسئلہ درپیش ہے، تو آپ نیچے دیے گئے بٹن پر کلک کر کے اپنا سوال براہِ راست دارالافتاء کے مفتیانِ کرام کو بھیج سکتے ہیں۔
          </p>
          <button
            onClick={() => setShowQuestionModal(true)}
            className="bg-primary text-white py-2 px-5 text-[16px] font-bold hover:bg-primary transition-colors cursor-pointer"
          >
            ✉️ اپنا سوال بھیجیں
          </button>
        </div>

        <h3 className="text-[22px] font-bold text-primary border-b pb-2">حالیہ فتاویٰ</h3>

        <div className="space-y-6">
          {fatawa.map((fatwa, i) => (
            <div key={i} className="bg-background border border-border p-6 rounded-sm shadow-sm space-y-3">
              <div className="font-bold text-accent text-[18px] leading-relaxed">
                {fatwa.q}
              </div>
              <div className="text-[16px] text-textSecondary leading-[2] bg-gray-50 p-4 border-r-4 border-primary">
                {fatwa.a}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation / Alert Box */}
      <ConfirmationBox
        isOpen={showQuestionModal}
        onClose={() => setShowQuestionModal(false)}
        title="آن لائن فتویٰ فارم"
        message="آن لائن فتویٰ فارم ابھی ڈیمو موڈ میں ہے اور جلد فعال کر دیا جائے گا۔"
        type="info"
        confirmText="ٹھیک ہے"
        showCancel={false}
      />
    </PageContainer>
  )
}

