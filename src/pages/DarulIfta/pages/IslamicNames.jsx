import React from 'react'
import PageContainer from '../../../components/PageContainer/PageContainer'

export default function IslamicNames() {
  const boyNames = [
    { name: 'محمد', meaning: 'جس کی بہت زیادہ تعریف کی گئی ہو (حضور اکرم ﷺ کا نامِ نامی)۔' },
    { name: 'عبد اللہ', meaning: 'اللہ کا بندہ (اللہ کے پسندیدہ ترین ناموں میں سے ایک)۔' },
    { name: 'احمد', meaning: 'بہت زیادہ تعریف کرنے والا۔' },
    { name: 'انس', meaning: 'محبت کرنے والا، انسیت رکھنے والا (مشہور صحابی کا نام)۔' },
    { name: 'حسان', meaning: 'نیک، خوبصورت، بھلائی کرنے والا۔' },
  ]

  const girlNames = [
    { name: 'فاطمہ', meaning: 'پرہیزگار، عفت مآب (حضور ﷺ کی پیاری بیٹی کا نام)۔' },
    { name: 'عائشہ', meaning: 'آرام پانے والی، خوشحال زندگی گزارنے والی۔' },
    { name: 'مریم', meaning: 'پاکدامن، عابدہ، زاہدہ (حضرت عیسیٰ علیہ السلام کی والدہ ماجدہ)۔' },
    { name: 'زینب', meaning: 'سخاوت کرنے والی، خوشبودار پھول۔' },
    { name: 'خدیجہ', meaning: 'وقت سے پہلے پیدا ہونے والی، معزز خاتون۔' },
  ]

  return (
    <PageContainer
      title="اسلامی ناموں کا ڈائریکٹری"
      subtitle="بچوں کے خوبصورت اور بامعنی اسلامی نام اور ان کا شرعی انتخاب"
    >
      <div className="space-y-6">
        <div className="bg-background border-r-4 border-accent p-5">
          <h4 className="text-[19px] font-bold text-primary mb-2">نام رکھنے کے بنیادی شرعی احکام</h4>
          <p className="text-[16px] text-textSecondary leading-relaxed">
            اولاد کا اچھا اور بامعنی نام رکھنا والدین کی اہم ذمہ داری ہے۔ شریعتِ مطہرہ میں انبیاء علیہ السلام، صحابہ کرام رضی اللہ عنہم اور نیک بندوں کے ناموں پر نام رکھنے کی ترغیب دی گئی ہے، اور ایسے ناموں سے منع کیا گیا ہے جن کے معانی برے ہوں یا جن میں شرک و غرور کا پہلو نکلتا ہو۔
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Boys Names */}
          <div className="bg-white border border-border p-6 rounded-sm">
            <h3 className="text-[21px] font-bold text-accent border-b pb-2 mb-4 text-center">لڑکوں کے نام</h3>
            <div className="space-y-3">
              {boyNames.map((n, i) => (
                <div key={i} className="flex justify-between border-b pb-2">
                  <span className="font-bold text-primary text-[18px]">{n.name}</span>
                  <span className="text-[15px] text-textSecondary">{n.meaning}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Girls Names */}
          <div className="bg-white border border-border p-6 rounded-sm">
            <h3 className="text-[21px] font-bold text-primary border-b pb-2 mb-4 text-center">لڑکیوں کے نام</h3>
            <div className="space-y-3">
              {girlNames.map((n, i) => (
                <div key={i} className="flex justify-between border-b pb-2">
                  <span className="font-bold text-primary text-[18px]">{n.name}</span>
                  <span className="text-[15px] text-textSecondary">{n.meaning}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
