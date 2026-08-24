import React from 'react'
import PageContainer from '../../../components/PageContainer/PageContainer'
import { PRAYER_TIMES } from '../../../data/siteData'

export default function PrayerTimes() {
  return (
    <PageContainer
      title="نماز کے اوقات"
      subtitle="کراچی اور اس کے مضافات کے لیے یومیہ اوقاتِ نماز"
    >
      <div className="space-y-6">
        <div className="bg-primary text-white p-5 rounded-sm text-center">
          <p className="text-[18px] font-bold">{PRAYER_TIMES.date}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
          {PRAYER_TIMES.times.map((p, idx) => (
            <div key={idx} className="bg-background border border-border p-5 rounded text-center hover:shadow-md transition-shadow">
              <span className="text-[32px] block mb-2">{p.icon}</span>
              <span className="text-[20px] font-bold text-primary block">{p.name}</span>
              <span className="text-[24px] font-mono text-accent font-bold mt-1 block">{p.time}</span>
            </div>
          ))}
        </div>

        <div className="bg-background border-r-4 border-accent p-5 leading-relaxed">
          <h4 className="text-[19px] font-bold text-primary mb-2">ضروری ہدایت برائے وقتِ سحر و افطار</h4>
          <p className="text-[15px] text-textSecondary">
            احتیاط کا تقاضا یہ ہے کہ روزے کے معاملے میں سحری کا وقت ختم ہونے سے کم از کم 2 منٹ پہلے کھانے پینے سے ہاتھ روک لیا جائے، اور افطار کے وقت غروبِ آفتاب کا یقین ہونے کے بعد ہی روزہ افطار کیا جائے۔
          </p>
        </div>
      </div>
    </PageContainer>
  )
}
