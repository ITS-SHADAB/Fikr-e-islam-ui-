import React from 'react'
import PageContainer from '../../../components/PageContainer/PageContainer'

export default function AimsObjectives() {
  const objectives = [
    { num: '۱', text: 'قرآن کریم اور سنت نبویہ کی تعلیمات کا تحفظ اور ان کی تدریس و ترویج کا انتظام کرنا۔' },
    { num: '۲', text: 'ایسے پختہ کار علماء، فقہاء اور مفسرین تیار کرنا جو عصرِ حاضر کے چیلنجز کا علمی بنیادوں پر مقابلہ کر سکیں۔' },
    { num: '۳', text: 'عوام الناس کے عقائد و اعمال کی درستگی کے لیے افتاء، وعظ و تبلیغ اور اصلاحِ معاشرہ کے شعبہ جات کو مضبوط بنانا۔' },
    { num: '۴', text: 'جدید باطل افکار اور فکری گمراہیوں کا تعاقب اور تحریری و تقریری رد پیش کرنا۔' },
    { num: '۵', text: 'اسلامی ممالک اور بین الاقوامی سطح پر علمی و ثقافتی روابط کو مستحکم کرنا۔' },
    { num: '۶', text: 'دینی کتب کی تالیف، ترجمہ اور طباعت کا اعلیٰ معیار قائم کرنا تاکہ مستند لٹریچر ہر طبقے تک پہنچ سکے۔' },
  ]

  return (
    <PageContainer
      title="جامعہ کے اغراض و مقاصد"
      subtitle="جامعہ العلوم الاسلامیہ کے بنیادی اہداف اور مشن"
    >
      <div className="space-y-6">
        <p className="text-[18px]">
          جامعہ العلوم الاسلامیہ بنوری ٹاؤن کے قیام کے بنیادی اغراض و مقاصد درج ذیل ہیں جن پر شروع دن سے کام کیا جا رہا ہے:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {objectives.map((obj) => (
            <div key={obj.num} className="bg-background border border-border p-5 rounded-sm flex gap-4 hover:shadow-md transition-shadow">
              <span className="text-[28px] font-bold text-accent select-none leading-none pt-1">
                {obj.num}
              </span>
              <p className="text-[17px] text-primary leading-relaxed">
                {obj.text}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-background border-t-4 border-accent p-6 mt-8">
          <h4 className="text-[20px] font-bold text-primary mb-2">منشورِ جامعہ</h4>
          <p className="text-[16px] text-textSecondary leading-relaxed">
            ہمارا مشن ایک سچے، پرامن، اور مستند اسلامی معاشرے کے قیام کے لیے علمی اور فکری قیادت فراہم کرنا ہے۔ ہم مسلکی اعتدال، علمی گہرائی اور اخلاقی طہارت پر مبنی تعلیمات کو عام کرنے کے پابند ہیں۔
          </p>
        </div>
      </div>
    </PageContainer>
  )
}
