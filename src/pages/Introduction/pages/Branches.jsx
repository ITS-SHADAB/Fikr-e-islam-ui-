import React from 'react'
import PageContainer from '../../../components/PageContainer/PageContainer'

export default function Branches() {
  const branchesList = [
    { name: 'شاخِ گلشن اقبال (مدرسہ معاذ بن جبل)', desc: 'گلشن اقبال بلاک 13، کراچی — ناظرہ، حفظِ قرآن اور ابتدائی عربی درجات۔' },
    { name: 'شاخِ نارتھ ناظم آباد (مدرسہ سید احمد شہید)', desc: 'نارتھ ناظم آباد، کراچی — بچیوں کے لیے تجوید و حفظ اور دینیات کا خصوصی مرکز۔' },
    { name: 'شاخِ ملیر (مدرسہ انور شاہ کشمیری)', desc: 'ملیر ہالٹ، کراچی — بالغان کے لیے شام کے اوقات میں قرآن فہمی اور بنیادی عربی گرامر۔' },
    { name: 'شاخِ ہاکس بے (مدرسہ یوسف بنوری ساحلی مرکز)', desc: 'ہاکس بے گوٹھ، کراچی — غریب اور ماہی گیر بچوں کے لیے مفت تعلیمی و فلاحی سرگرمیوں کا مرکز۔' },
  ]

  return (
    <PageContainer
      title="جامعہ کی شاخیں و شعبہ جات"
      subtitle="کراچی بھر میں پھیلا ہوا تعلیمی و تربیتی نیٹ ورک"
    >
      <div className="space-y-6">
        <p>
          جامعہ العلوم الاسلامیہ بنوری ٹاؤن کے زیرِ نگرانی کراچی کے مختلف علاقوں میں کئی شاخیں مصروفِ عمل ہیں، جہاں ہزاروں طلبہ و طالبات علمِ دین حاصل کر رہے ہیں۔ ان کا مقصد مرکزی کیمپس کے تعلیمی بوجھ کو بانٹنا اور دیگر علاقوں کے لوگوں کو ان کے گھر کے قریب دینی تعلیم فراہم کرنا ہے۔
        </p>

        <h3 className="text-[22px] font-bold text-primary border-b pb-2">نمایاں شاخیں</h3>

        <div className="space-y-4 my-6">
          {branchesList.map((branch, i) => (
            <div key={i} className="bg-background border border-border p-5 rounded-sm hover:border-accent transition-all">
              <h4 className="text-[19px] font-bold text-accent mb-1">{branch.name}</h4>
              <p className="text-[16px] text-textSecondary">{branch.desc}</p>
            </div>
          ))}
        </div>

        <h3 className="text-[22px] font-bold text-primary border-b pb-2">شعبہ جاتِ خدمات</h3>
        <p>
          تعلیم کے علاوہ، مرکزی جامعہ میں دیگر سماجی اور علمی شعبے بھی قائم ہیں:
        </p>

        <ul className="list-disc list-inside space-y-2 pr-4 text-[17px]">
          <li><strong>شعبہ نشر و اشاعت:</strong> کتب کی طباعت اور ماہنامہ بینات کی اشاعت۔</li>
          <li><strong>مجلس علمی:</strong> ائمہ اربعہ اور سلف صالحین کے فکری تحفظ پر ریسرچ۔</li>
          <li><strong>کمپیوٹر سینٹر:</strong> طلبہ کو کمپیوٹر، گرافک ڈیزائننگ اور آئی ٹی کورسز کی جدید تعلیم۔</li>
        </ul>
      </div>
    </PageContainer>
  )
}
