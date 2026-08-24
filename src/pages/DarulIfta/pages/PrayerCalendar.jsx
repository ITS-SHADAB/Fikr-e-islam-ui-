import React, { useState } from 'react'
import PageContainer from '../../../components/PageContainer/PageContainer'

export default function PrayerCalendar() {
  const [selectedMonth, setSelectedMonth] = useState('شوال')

  const months = ['محرم', 'صفر', 'ربیع الاول', 'ربیع الثانی', 'جمادی الاول', 'جمادی الثانی', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذی القعدہ', 'ذی الحجہ']

  const calendarData = [
    { date: '۱ شوال', sehri: '04:18', fajar: '04:30', ishraq: '06:05', zohal: '12:28', asar: '17:05', maghrib: '19:10', isha: '20:30' },
    { date: '۲ شوال', sehri: '04:17', fajar: '04:29', ishraq: '06:04', zohal: '12:28', asar: '17:05', maghrib: '19:11', isha: '20:31' },
    { date: '۳ شوال', sehri: '04:16', fajar: '04:28', ishraq: '06:03', zohal: '12:28', asar: '17:06', maghrib: '19:11', isha: '20:32' },
    { date: '۴ شوال', sehri: '04:15', fajar: '04:27', ishraq: '06:02', zohal: '12:28', asar: '17:06', maghrib: '19:12', isha: '20:33' },
    { date: '۵ شوال', sehri: '04:14', fajar: '04:26', ishraq: '06:01', zohal: '12:28', asar: '17:07', maghrib: '19:12', isha: '20:34' },
  ]

  return (
    <PageContainer
      title="دائمی نقشہ اوقاتِ نماز"
      subtitle="کراچی اور مضافات کے لیے سالانہ و دائمی کیلنڈر برائے نماز و روزہ"
    >
      <div className="space-y-6">
        <p>
          نیچے دیے گئے مینو سے اسلامی قمری مہینہ منتخب کر کے آپ اس مہینے کے دائمی اوقات معلوم کر سکتے ہیں:
        </p>

        {/* Selection bar */}
        <div className="flex items-center justify-center gap-4 bg-gray-50 p-4 border border-border rounded-sm">
          <label className="font-bold text-primary text-[18px]">اسلامی مہینہ منتخب کریں:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border border-border p-2 bg-white text-primary font-bold text-[16px] outline-none min-w-[150px]"
          >
            {months.map((m, idx) => (
              <option key={idx} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <h3 className="text-[20px] font-bold text-accent text-center my-4">
          نقشہ اوقات برائے ماہِ {selectedMonth} (کراچی)
        </h3>

        {/* Calendar table */}
        <div className="border border-border rounded-sm overflow-x-auto">
          <table className="w-full text-center border-collapse min-w-[600px] text-[15px] md:text-[17px]">
            <thead>
              <tr className="bg-primary text-white">
                <th className="p-3 border-l border-accent">تاریخ</th>
                <th className="p-3 border-l border-accent">سحری آخری وقت</th>
                <th className="p-3 border-l border-accent">فجر اول وقت</th>
                <th className="p-3 border-l border-accent">اشراق</th>
                <th className="p-3 border-l border-accent">زوال</th>
                <th className="p-3 border-l border-accent">عصر اول وقت</th>
                <th className="p-3 border-l border-accent">غروب / افطار</th>
                <th className="p-3">عشاء اول وقت</th>
              </tr>
            </thead>
            <tbody>
              {calendarData.map((row, idx) => (
                <tr key={idx} className={`border-b border-border ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="p-3 font-bold border-l border-border text-accent">{row.date}</td>
                  <td className="p-3 border-l border-border font-mono">{row.sehri}</td>
                  <td className="p-3 border-l border-border font-mono">{row.fajar}</td>
                  <td className="p-3 border-l border-border font-mono">{row.ishraq}</td>
                  <td className="p-3 border-l border-border font-mono">{row.zohal}</td>
                  <td className="p-3 border-l border-border font-mono">{row.asar}</td>
                  <td className="p-3 border-l border-border font-mono text-red-600 font-bold">{row.maghrib}</td>
                  <td className="p-3 font-mono">{row.isha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  )
}
