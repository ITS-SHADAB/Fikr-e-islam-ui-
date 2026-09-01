import React from 'react'
import PageContainer from '../../../components/PageContainer/PageContainer'

export default function MasnoonDuas() {
  const duas = [
    {
      title: 'صبح و شام کی دعا',
      arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ۔',
      translation: 'ترجمہ: اے اللہ! تیرے ہی حکم سے ہم نے صبح کی اور تیرے ہی حکم سے ہم نے شام کی، اور تیرے ہی حکم سے ہم جیتے ہیں اور تیرے ہی حکم سے ہم مرتے ہیں اور تیری ہی طرف دوبارہ اٹھ کھڑا ہونا ہے۔'
    },
    {
      title: 'بیمار کی عیادت کے وقت کی دعا',
      arabic: 'لَا بَأْسَ طَهُورٌ إِنْ شَاءَ اللَّهُ۔',
      translation: 'ترجمہ: کوئی بات نہیں، اللہ نے چاہا تو یہ بیماری گناہوں سے پاک کرنے والی بن جائے گی۔'
    },
    {
      title: 'گھر سے نکلتے وقت کی دعا',
      arabic: 'بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ۔',
      translation: 'ترجمہ: اللہ کے نام کے ساتھ (میں نکلتا ہوں)، میں نے اللہ پر بھروسہ کیا، اور گناہوں سے بچنے اور نیک کام کرنے کی طاقت صرف اللہ ہی کی مدد سے ملتی ہے۔'
    }
  ]

  return (
    <PageContainer
      title="مسنون و ماثور دعائیں"
      subtitle="روزمرہ زندگی کے لیے پیارے نبی ﷺ کی پیاری دعائیں"
    >
      <div className="space-y-6">
        <p>
          نبی اکرم ﷺ نے ہمیں زندگی کے ہر موڑ پر اللہ تبارک و تعالیٰ سے لو لگانے اور دعائیں مانگنے کی تلقین فرمائی ہے۔ احادیثِ مبارکہ میں منقول چند اہم مسنون دعائیں درج ذیل ہیں:
        </p>

        <div className="space-y-6 mt-6">
          {duas.map((dua, i) => (
            <div key={i} className="bg-background border border-border p-6 rounded-sm shadow-sm">
              <h4 className="text-[20px] font-bold text-accent border-b pb-2 mb-3">{dua.title}</h4>
              <p className="text-[24px] quran-font text-primary text-center my-4 leading-normal select-all">
                {dua.arabic}
              </p>
              <p className="text-[16px] text-textSecondary leading-relaxed bg-gray-50 p-3.5 border-r-4 border-accent mt-2">
                {dua.translation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  )
}
