import React from 'react'
import PageContainer from '../../../components/PageContainer/PageContainer'

export default function Expenses() {
  return (
    <PageContainer
      title="جامعہ کے مصارف"
      subtitle="مالیاتی نظام، مصارفِ طلبہ اور آڈٹ و شفافیت"
    >
      <div className="space-y-6">
        <p>
          جامعہ العلوم الاسلامیہ بنوری ٹاؤن ایک غیر سرکاری اور خود مختار عوامی دینی تعلیمی ادارہ ہے۔ جامعہ کا تمام تر بجٹ مسلمانوں کے زکاۃ، صدقات اور عطیات کی مدد سے پورا کیا جاتا ہے۔
        </p>

        <h3 className="text-[22px] font-bold text-primary border-b pb-2">طلبہ کو فراہم کردہ مفت سہولیات</h3>
        <p>
          جامعہ میں زیرِ تعلیم ہزاروں ملکی و غیر ملکی طلبہ کو تعلیمی اخراجات کے ساتھ ساتھ درج ذیل سہولیات بالکل مفت فراہم کی جاتی ہیں:
        </p>

        <ul className="list-disc list-inside space-y-2 pr-4 text-[17px]">
          <li><strong>مفت رہائش:</strong> طلبہ کے رہنے کے لیے ہاسٹل کی بہترین رہائش فراہم کی جاتی ہے۔</li>
          <li><strong>مفت طعام:</strong> تمام مقیم طلبہ کو دونوں وقت کا متوازن اور معیاری کھانا دیا جاتا ہے۔</li>
          <li><strong>کتب کی فراہمی:</strong> نصابی کتابیں پڑھنے کے لیے مفت مستعار دی جاتی ہیں۔</li>
          <li><strong>علاج و معالجہ:</strong> ہسپتال اور ڈاکٹر کی سہولیات جامعہ کی طرف سے مفت مہیا کی جاتی ہیں۔</li>
          <li><strong>وظائف:</strong> نادار اور غریب مستحق طلبہ کو تعلیمی وظائف اور جیب خرچ دیا جاتا ہے۔</li>
        </ul>

        <div className="bg-background border-r-4 border-accent p-5 my-6">
          <h4 className="text-[20px] font-bold text-primary mb-2">مالی شفافیت اور آڈٹ</h4>
          <p className="text-[16px] text-textSecondary leading-relaxed">
            جامعہ کی مالیاتی آمد و خرچ کا مکمل اور باقاعدہ حساب کتاب (بک کیپنگ) رکھا جاتا ہے۔ ہر سال ایک مصدقہ چارٹرڈ اکاؤنٹنٹ فرم کے ذریعے جامعہ کے کھاتوں کا مکمل اور تفصیلی آڈٹ کروایا جاتا ہے، تاکہ عوام الناس اور اللہ کی بارگاہ میں امانت داری قائم رہے۔
          </p>
        </div>

        <p className="text-center font-bold text-accent mt-4">
          آپ کی زکاۃ اور صدقات مستحق طلبہ کے روشن مستقبل اور تبلیغِ دین کی محنت میں براہِ راست حصہ بنتے ہیں۔
        </p>
      </div>
    </PageContainer>
  )
}
