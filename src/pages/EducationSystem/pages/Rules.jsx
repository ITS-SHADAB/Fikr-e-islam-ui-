import React from 'react'
import PageContainer from '../../../components/PageContainer/PageContainer'

export default function Rules() {
  const rules = [
    { title: 'حاضری اور پابندیِ وقت', desc: 'تمام طلبہ کے لیے نمازِ پنجگانہ باجماعت اور تعلیمی گھنٹوں میں کلاس میں صد فیصد حاضری لازمی ہے۔ بلا عذر غیر حاضری پر تادیبی کارروائی کی جائے گی۔' },
    { title: 'اخلاق و کردار اور لباس', desc: 'طلبہ کے لیے سنت کے مطابق داڑھی رکھنا، شلوار قمیض اور ٹوپی پہننا لازم ہے۔ کسی بھی قسم کے فیشن ایبل لباس یا غیر شرعی وضع قطع کی اجازت نہیں دی جائے گی۔' },
    { title: 'موبائل فون کا استعمال', desc: 'جامعہ کی حدود خصوصاً درسگاہوں اور ہاسٹل میں اینڈرائیڈ اور اسمارٹ موبائل فون کا استعمال قطعی ممنوع ہے۔ خلاف ورزی پر موبائل ضبط کر لیا جائے گا اور طالب علم کا اخراج بھی ہو سکتا ہے۔' },
    { title: 'امتحانی ضوابط', desc: 'سال میں دو مرتبہ (ششماہی اور سالانہ) امتحانات منعقد کیے جاتے ہیں۔ کسی بھی قسم کی بدعنوانی یا نقل کرتے پکڑے جانے پر طالب علم کا داخلہ منسوخ کر دیا جائے گا۔' },
    { title: 'سرپرستوں کے لیے ہدایات', desc: 'سرپرستوں سے گزارش ہے کہ وہ ماہانہ بنیادوں پر جامعہ تشریف لا کر اپنے بچوں کے تعلیمی رزلٹ اور اخلاقی رویے کے متعلق ناظمِ تعلیمات سے معلومات حاصل کریں۔' },
  ]

  return (
    <PageContainer
      title="طلبہ اور ان کے سرپرستوں کے لیے ضروری ہدایات"
      subtitle="جامعہ العلوم الاسلامیہ بنوری ٹاؤن کے قواعد و ضوابط اور ضابطہ اخلاق"
    >
      <div className="space-y-6">
        <div className="bg-red-50/50 border-r-4 border-red-500 p-5 my-4">
          <p className="font-bold text-red-700 text-[18px] mb-1">اہم نوٹ برائے داخلہ و رہائش</p>
          <p className="text-[15px] text-red-800 leading-relaxed">
            قواعد و ضوابط کی خلاف ورزی کرنے والے کسی بھی طالب علم کو جامعہ میں برقرار نہیں رکھا جائے گا۔ سرپرستِ اعلیٰ کا فیصلہ حتمی اور ناقابلِ چیلنج تصور کیا جائے گا۔
          </p>
        </div>

        <div className="space-y-5 mt-6">
          {rules.map((rule, index) => (
            <div key={index} className="bg-background border border-border p-5 rounded-sm">
              <h4 className="text-[19px] font-bold text-accent border-b border-dashed pb-2 mb-2">
                {index + 1}. {rule.title}
              </h4>
              <p className="text-[16px] text-primary leading-relaxed">{rule.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  )
}
