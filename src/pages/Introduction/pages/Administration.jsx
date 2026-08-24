import React from 'react'
import PageContainer from '../../../components/PageContainer/PageContainer'

export default function Administration() {
  return (
    <PageContainer
      title="جامعہ کا نظم و نسق"
      subtitle="انتظامی ڈھانچہ، مجلسِ شوریٰ اور تعلیمی کمیٹیاں"
    >
      <div className="space-y-6">
        <p>
          جامعہ العلوم الاسلامیہ بنوری ٹاؤن کا انتظام و انصرام ایک منظم اور مربوط آئینی فریم ورک کے تحت چلایا جاتا ہے۔ اس کا بنیادی ڈھانچہ درج ذیل اہم شعبوں پر مشتمل ہے:
        </p>

        <h3 className="text-[22px] font-bold text-primary border-b pb-2">۱. مجلسِ شوریٰ (اعلیٰ پالیسی ساز ادارہ)</h3>
        <p>
          جامعہ کا سب سے بااختیار ادارہ مجلسِ شوریٰ ہے، جس میں ملک کے جید علماء، ماہرینِ قانون اور معزز علمی شخصیات شامل ہیں۔ یہ مجلس تعلیمی و انتظامی پالیسیاں ترتیب دیتی ہے اور بجٹ کی منظوری دیتی ہے۔
        </p>

        <h3 className="text-[22px] font-bold text-primary border-b pb-2">۲. مجلسِ عاملہ</h3>
        <p>
          شوریٰ کے فیصلوں پر عمل درآمد کرانے اور روزمرہ کے انتظامی امور کی نگرانی کے لیے مجلسِ عاملہ کام کرتی ہے۔ اس کے سربراہ جامعہ کے رئیس اور مہتمم ہوتے ہیں۔
        </p>

        <h3 className="text-[22px] font-bold text-primary border-b pb-2">۳. شعبہ تعلیمی نگرانی</h3>
        <p>
          طلبہ کی تعلیمی کارکردگی، امتحانات، حاضری، اور درسی کتب کے معیار کو جانچنے کے لیے ناظمِ تعلیمات کی سربراہی میں ایک خصوصی کمیٹی مسلسل سرگرم رہتی ہے۔
        </p>

        <div className="border border-border rounded-sm overflow-hidden my-6">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-primary text-white">
                <th className="p-3 border-l border-accent">انتظامی عہدہ</th>
                <th className="p-3">ذمہ داری</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="p-3 font-bold border-l border-border">رئیس الجامعہ / مہتمم</td>
                <td className="p-3">کل وقتی انتظامی و تعلیمی نگرانی اور نمائندگی</td>
              </tr>
              <tr className="border-b border-border bg-gray-50">
                <td className="p-3 font-bold border-l border-border">ناظمِ تعلیمات</td>
                <td className="p-3">نصاب، تدریس، اور امتحانی امور کا انتظام</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 font-bold border-l border-border">ناظمِ امتحانات</td>
                <td className="p-3">سالانہ و ششماہی امتحانات کا شیڈول اور رزلٹ کی تیاری</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 font-bold border-l border-border">ناظمِ دارالاقامہ</td>
                <td className="p-3">ہاسٹل، طعام، اور طلبہ کی رہائش کے انتظامات</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  )
}
