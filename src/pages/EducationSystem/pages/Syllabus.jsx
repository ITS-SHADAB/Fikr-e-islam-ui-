import React from 'react'
import PageContainer from '../../../components/PageContainer/PageContainer'

export default function Syllabus() {
  const levels = [
    { name: 'ثانویہ عامہ (میٹرک مساوی)', duration: '۲ سال', subjects: 'بنیادی عربی گرامر (صرف و نحو)، ترجمہ قرآن، فارسی ادب، ابتدائی فقہ۔' },
    { name: 'ثانویہ خاصہ (انٹرمیڈیٹ مساوی)', duration: '۲ سال', subjects: 'فصاحت و بلاغت، اصولِ فقہ، منطق، ترجمہ و تفسیر قرآن، فقہ کی کتب (ہدایہ وغیرہ)۔' },
    { name: 'عالیہ (بی اے مساوی)', duration: '۲ سال', subjects: 'علمِ میراث، اصولِ حدیث، اصولِ تفسیر، ادیانِ باطلہ کا رد، کتبِ حدیث (شرح وقایہ، جلالین)۔' },
    { name: 'عالمیہ (دورہ حدیث - ایم اے مساوی)', duration: '۲ سال', subjects: 'صحاحِ ستہ (بخاری شریف، مسلم شریف، ترمذی، ابو داؤد، نسائی، ابن ماجہ) کا مکمل درس اور تفصیلی ابحاث۔' },
    { name: 'تخصص (ڈاکٹریٹ مساوی)', duration: '۱ تا ۲ سال', subjects: 'فقہ و افتاء (تخصص فی الافتاء) یا حدیث شریف (تخصص فی الحدیث) میں ریسرچ اور مقالہ نویسی۔' },
  ]

  return (
    <PageContainer
      title="نصاب تعلیم"
      subtitle="درسِ نظامی (عالمیہ کورس) کا مکمل نصاب اور تعلیمی مراحل"
    >
      <div className="space-y-6">
        <p>
          جامعہ العلوم الاسلامیہ بنوری ٹاؤن میں پڑھایا جانے والا تعلیمی نصاب روایتی دینی علوم کے ساتھ ساتھ وفاق المدارس العربیہ انڈیا کے مسلمہ فریم ورک کے مطابق مرتب کیا گیا ہے۔ درسِ نظامی کا مکمل کورس کل 8 سالوں پر محیط ہے۔
        </p>

        <h3 className="text-[22px] font-bold text-primary border-b pb-2">تعلیمی درجات کی تفصیل</h3>

        <div className="space-y-4 my-6">
          {levels.map((level, index) => (
            <div key={index} className="bg-background border border-border p-5 rounded-sm">
              <div className="flex justify-between items-center border-b pb-2 mb-2">
                <h4 className="text-[19px] font-bold text-accent">{level.name}</h4>
                <span className="bg-secondary text-primary px-3 py-1 text-[14px] rounded font-sans font-bold">
                  مدت: {level.duration}
                </span>
              </div>
              <p className="text-[16px] text-primary leading-relaxed">
                <strong>اہم مضامین:</strong> {level.subjects}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-background border-t-4 border-accent p-5">
          <p className="text-[15px] text-textSecondary leading-relaxed">
            * تمام تعلیمی مراحل کی کامیاب تکمیل کے بعد وفاق المدارس العربیہ انڈیا کی جانب سے ایم اے علومِ اسلامیہ و عربیہ کی مستند اور منظور شدہ ڈگری جاری کی جاتی ہے، جو ہائر ایجوکیشن کمیشن (HEC) انڈیا سے تسلیم شدہ ہے۔
          </p>
        </div>
      </div>
    </PageContainer>
  )
}
