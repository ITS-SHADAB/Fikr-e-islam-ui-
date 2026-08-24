import React, { useState } from 'react'
import PageContainer from '../../../components/PageContainer/PageContainer'
import { ConfirmationBox } from '@/components'

export default function QurbaniAbroad() {
  const [showBookingModal, setShowBookingModal] = useState(false);

  return (
    <PageContainer
      title="بیرون ملک سے گیا انڈیا میں قربانی"
      subtitle="دوسرے ملک میں رہنے والوں کا گیا انڈیا میں قربانی کرنے کے شرعی مسائل اور طریقہ کار"
    >
      <div className="space-y-6">
        <div className="bg-background border-r-4 border-accent p-5">
          <h4 className="text-[19px] font-bold text-primary mb-2">شرعی مسئلہ کیا ہے؟</h4>
          <p className="text-[16px] text-textSecondary leading-relaxed">
            مسئلہ یہ ہے کہ جو شخص بیرونِ ملک مقیم ہو، اس کے لیے گیا انڈیا میں اپنی قربانی کا حصہ کرانا شرعاً بالکل جائز ہے، بشرطیکہ ذبح کے وقت کا اعتبار اس مقام کے مطابق کیا جائے جہاں جانور ذبح ہو رہا ہو، نہ کہ اس مقام کا جہاں قربانی کرانے والا شخص مقیم ہو۔
          </p>
        </div>

        <h3 className="text-[22px] font-bold text-primary border-b pb-2">اہم شرائط و ضوابط</h3>
        <ul className="list-decimal list-inside space-y-3 pr-4 text-[17px]">
          <li><strong>وقت کا تعین:</strong> گیا انڈیا میں عید الاضحیٰ کی نماز ہو جانے کے بعد ہی بیرون ملک مقیم شخص کی طرف سے ذبح جائز ہوگا۔ اگر ذبح کرنے والے مقام پر عید کی نماز سے پہلے جانور ذبح کر دیا جائے تو قربانی باطل ہوگی۔</li>
          <li><strong>اجازت و وکالت:</strong> جانور ذبح کرنے والے کو زبانی یا تحریری طور پر وکیل بنانا لازمی ہے تاکہ وہ آپ کی طرف سے نیت کر کے جانور ذبح کر سکے۔</li>
          <li><strong>قیمت کی ادائیگی:</strong> قربانی کا حصہ بھیجنے والے کے لیے لازم ہے کہ وہ عید کے پہلے دن ذبح ہونے سے قبل رقم وکیل تک پہنچا دے۔</li>
        </ul>

        <div className="bg-gray-50 border border-border p-6 rounded-sm my-6">
          <h4 className="text-[19px] font-bold text-accent mb-3 text-center">جامعہ بنوری ٹاؤن قربانی سروس</h4>
          <p className="text-[16px] text-primary text-center mb-4 leading-relaxed">
            جامعہ ہر سال بیرونِ ملک مقیم بھائیوں کی طرف سے شرعی حدود و قیود کا پورا خیال رکھتے ہوئے اجتماعی قربانی کا خصوصی انتظام کرتا ہے اور گوشت مستحقینِ گیا میں تقسیم کیا جاتا ہے۔
          </p>
          <div className="text-center">
            <button
              onClick={() => setShowBookingModal(true)}
              className="bg-primary text-white py-2.5 px-6 font-bold hover:bg-primary transition-colors rounded shadow cursor-pointer"
            >
              🐏 قربانی کے حصوں کی بکنگ معلوم کریں
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation / Alert Box */}
      <ConfirmationBox
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="قربانی بکنگ کی تفصیلات"
        message="اجتماعی قربانی کے لیے بکنگ کا عمل عید الاضحیٰ سے ایک ماہ قبل شروع ہو جاتا ہے۔"
        type="info"
        confirmText="ٹھیک ہے"
        showCancel={false}
      />
    </PageContainer>
  )
}


