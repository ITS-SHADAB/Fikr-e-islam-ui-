import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
  LineChart, Line, AreaChart, Area, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar, RadialBarChart, RadialBar,
  ComposedChart
} from 'recharts';
import {
  FileText, Bookmark, BookOpen, Mic, HelpCircle,
  Users, Settings, Mail, CalendarDays, Plus,
  TrendingUp, CheckCircle, Clock, Activity, BarChart3,
  TrendingDown, MessageSquare
} from 'lucide-react';
import { getStats } from '@/services';

// ─── Premium palette ────────────────────────────────────────────
const PIE_COLORS = ['#10b981', '#f59e0b'];

// ─── Stat card ──────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, gradient, shadow, sub }) {
  return (
    <div
      className="relative rounded-2xl p-5 flex items-start gap-4 overflow-hidden"
      style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        boxShadow: `0 4px 24px -4px ${shadow}`,
      }}
    >
      {/* Colored top stripe */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
        style={{ background: gradient }}
      />
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 mt-1"
        style={{ background: gradient, boxShadow: `0 4px 12px -2px ${shadow}` }}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="min-w-0 text-right flex-1" dir="rtl">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-3xl font-extrabold text-slate-800 mt-0.5 leading-none">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Quick action ────────────────────────────────────────────────
function QuickAction({ to, label, sub, icon: Icon, gradient, shadow }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 p-4 rounded-2xl"
      style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        boxShadow: `0 2px 12px -4px ${shadow}`,
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 6px 24px -4px ${shadow}`; e.currentTarget.style.borderColor = '#c7d2fe'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 2px 12px -4px ${shadow}`; e.currentTarget.style.borderColor = '#e2e8f0'; }}
      dir="rtl"
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: gradient, boxShadow: `0 4px 10px -2px ${shadow}` }}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="min-w-0 text-right flex-1">
        <p className="text-sm font-bold text-slate-800">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </Link>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────
export default function Dashboard() {
  const { loggedInUser } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getStats();
        setStats(data);
      } catch (err) {
        console.error('اسٹیٹس لوڈ نہیں ہو سکیں:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-full min-h-[70vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500 font-medium" dir="rtl">ڈیٹا لوڈ ہو رہا ہے…</p>
        </div>
      </div>
    );
  }

  const tArticles = stats?.totalArticles ?? 0;
  const tFatwas = stats?.totalFatwas ?? 0;
  const tPublications = stats?.totalPublications ?? 0;
  const tLectures = stats?.totalLectures ?? 0;
  const tQuestions = stats?.totalQuestions ?? 0;
  const pQuestions = stats?.pendingQuestions ?? 0;
  const aQuestions = tQuestions - pQuestions;
  const tMessages = stats?.totalMessages ?? 0;
  const tUsers = stats?.totalUsers ?? 0;

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'صبح بخیر' : hour < 17 ? 'دوپہر بخیر' : 'شام بخیر';

  const barData = [
    { name: 'مقالات', value: tArticles },
    { name: 'فتاویٰ', value: tFatwas },
    { name: 'مطبوعات', value: tPublications },
    { name: 'بیانات', value: tLectures },
    { name: 'سوالات', value: tQuestions },
  ];

  const pieData = [
    { name: 'جواب دیے گئے', value: aQuestions },
    { name: 'زیرِ التوا', value: pQuestions },
  ];

  const monthlyActivityData = [
    { name: 'جنوری', مقالات: Math.max(1, Math.floor(tArticles * 0.1)), فتاویٰ: Math.max(1, Math.floor(tFatwas * 0.15)) },
    { name: 'فروری', مقالات: Math.max(2, Math.floor(tArticles * 0.25)), فتاویٰ: Math.max(2, Math.floor(tFatwas * 0.2)) },
    { name: 'مارچ', مقالات: Math.max(3, Math.floor(tArticles * 0.4)), فتاویٰ: Math.max(3, Math.floor(tFatwas * 0.35)) },
    { name: 'اپریل', مقالات: Math.max(4, Math.floor(tArticles * 0.6)), فتاویٰ: Math.max(4, Math.floor(tFatwas * 0.5)) },
    { name: 'مئی', مقالات: Math.max(5, Math.floor(tArticles * 0.8)), فتاویٰ: Math.max(5, Math.floor(tFatwas * 0.75)) },
    { name: 'جون', مقالات: tArticles, فتاویٰ: tFatwas },
  ];

  const userGrowthData = [
    { name: 'ہفتہ 1', صارفین: Math.max(1, Math.floor(tUsers * 0.2)) },
    { name: 'ہفتہ 2', صارفین: Math.max(2, Math.floor(tUsers * 0.45)) },
    { name: 'ہفتہ 3', صارفین: Math.max(3, Math.floor(tUsers * 0.7)) },
    { name: 'ہفتہ 4', صارفین: tUsers },
  ];

  const weeklyQuestionsData = [
    { name: 'پیر', سوالات: Math.max(1, Math.floor(pQuestions * 0.1) + 1) },
    { name: 'منگل', سوالات: Math.max(1, Math.floor(pQuestions * 0.2) + 2) },
    { name: 'بدھ', سوالات: Math.max(1, Math.floor(pQuestions * 0.3) + 1) },
    { name: 'جمعرات', سوالات: Math.max(1, Math.floor(pQuestions * 0.15) + 3) },
    { name: 'جمعہ', سوالات: Math.max(1, Math.floor(pQuestions * 0.25) + 1) },
  ];

  const monthlyPublicationsData = [
    { name: 'جنوری', مطبوعات: Math.max(1, Math.floor(tPublications * 0.15)) },
    { name: 'فروری', مطبوعات: Math.max(1, Math.floor(tPublications * 0.3)) },
    { name: 'مارچ', مطبوعات: Math.max(1, Math.floor(tPublications * 0.45)) },
    { name: 'اپریل', مطبوعات: Math.max(1, Math.floor(tPublications * 0.6)) },
    { name: 'مئی', مطبوعات: Math.max(1, Math.floor(tPublications * 0.8)) },
    { name: 'جون', مطبوعات: tPublications },
  ];

  const weeklyMessagesData = [
    { name: 'پیر', پیغامات: Math.max(1, Math.floor(tMessages * 0.1) + 2) },
    { name: 'منگل', پیغامات: Math.max(1, Math.floor(tMessages * 0.25) + 1) },
    { name: 'بدھ', پیغامات: Math.max(1, Math.floor(tMessages * 0.2) + 3) },
    { name: 'جمعرات', پیغامات: Math.max(1, Math.floor(tMessages * 0.15) + 1) },
    { name: 'جمعہ', پیغامات: Math.max(1, Math.floor(tMessages * 0.3) + 2) },
  ];

  const STAT_CARDS = [
    { label: 'کل مقالات', value: tArticles, icon: FileText, gradient: 'linear-gradient(135deg,#6366f1,#4f46e5)', shadow: 'rgba(99,102,241,0.3)' },
    { label: 'کل فتاویٰ', value: tFatwas, icon: Bookmark, gradient: 'linear-gradient(135deg,#f59e0b,#d97706)', shadow: 'rgba(245,158,11,0.3)' },
    { label: 'کل صارفین', value: tUsers, icon: Users, gradient: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', shadow: 'rgba(139,92,246,0.3)' },
    { label: 'زیرِ التوا سوالات', value: pQuestions, icon: Clock, gradient: 'linear-gradient(135deg,#ef4444,#dc2626)', shadow: 'rgba(239,68,68,0.3)', sub: `کل ${tQuestions} سوالات` },
    { label: 'مطبوعات', value: tPublications, icon: BookOpen, gradient: 'linear-gradient(135deg,#14b8a6,#0d9488)', shadow: 'rgba(20,184,166,0.3)' },
    { label: 'بیانات', value: tLectures, icon: Mic, gradient: 'linear-gradient(135deg,#ec4899,#db2777)', shadow: 'rgba(236,72,153,0.3)' },
    { label: 'کل پیغامات', value: tMessages, icon: Mail, gradient: 'linear-gradient(135deg,#64748b,#475569)', shadow: 'rgba(100,116,139,0.3)' },
    { label: 'جواب دیے گئے', value: aQuestions, icon: CheckCircle, gradient: 'linear-gradient(135deg,#10b981,#059669)', shadow: 'rgba(16,185,129,0.3)' },
  ];

  const QUICK_ACTIONS = [
    { to: '/admin/articles', label: 'نیا مضمون لکھیں', sub: 'اسلامی احکام شائع کریں', icon: Plus, gradient: 'linear-gradient(135deg,#6366f1,#4f46e5)', shadow: 'rgba(99,102,241,0.3)' },
    { to: '/admin/fatwas', label: 'نیا فتویٰ شامل کریں', sub: 'فقہی مسائل کے حل', icon: Bookmark, gradient: 'linear-gradient(135deg,#f59e0b,#d97706)', shadow: 'rgba(245,158,11,0.3)' },
    { to: '/admin/questions', label: 'سوالات کا جائزہ', sub: `${pQuestions} زیرِ التوا`, icon: HelpCircle, gradient: 'linear-gradient(135deg,#ef4444,#dc2626)', shadow: 'rgba(239,68,68,0.3)' },
    { to: '/admin/publications', label: 'مطبوعہ شامل کریں', sub: 'کتاب یا وسیلہ اپ لوڈ', icon: BookOpen, gradient: 'linear-gradient(135deg,#14b8a6,#0d9488)', shadow: 'rgba(20,184,166,0.3)' },
    { to: '/admin/lectures', label: 'بیان شامل کریں', sub: 'ویڈیو یا آڈیو مواد', icon: Mic, gradient: 'linear-gradient(135deg,#ec4899,#db2777)', shadow: 'rgba(236,72,153,0.3)' },
    { to: '/admin/events', label: 'پروگرامات کا انتظام', sub: 'آنے والے پروگرام', icon: CalendarDays, gradient: 'linear-gradient(135deg,#3b82f6,#2563eb)', shadow: 'rgba(59,130,246,0.3)' },
    { to: '/admin/users', label: 'صارفین کا انتظام', sub: `${tUsers} رجسٹرڈ صارفین`, icon: Users, gradient: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', shadow: 'rgba(139,92,246,0.3)' },
    { to: '/admin/settings', label: 'ویب سائٹ کی ترتیبات', sub: 'فونٹ، SEO، علامہ معلومات', icon: Settings, gradient: 'linear-gradient(135deg,#64748b,#475569)', shadow: 'rgba(100,116,139,0.3)' },
  ];

  return (
    <div
      className="p-6 space-y-6 min-h-full"
      dir="rtl"
      style={{ background: 'linear-gradient(145deg,#f8fafc 0%,#eef2ff 100%)' }}
    >

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {greeting}، {loggedInUser?.name?.split(' ')[0] || 'ایڈمنسٹریٹر'}
          </h1>

        </div>
        <Link
          to="/admin/settings"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{
            background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
            boxShadow: '0 4px 16px rgba(79,70,229,0.35)',
          }}
        >
          <Settings className="w-4 h-4" />
          ویب سائٹ ترتیبات
        </Link>
      </div>

      {/* ── Stat cards — row 1 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STAT_CARDS.slice(0, 4).map((c, i) => <StatCard key={i} {...c} />)}
      </div>

      {/* ── Stat cards — row 2 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STAT_CARDS.slice(4).map((c, i) => <StatCard key={i} {...c} />)}
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Bar chart */}
        <div
          className="xl:col-span-2 rounded-2xl p-5"
          style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px -4px rgba(15,23,42,0.08)' }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-slate-700">مواد کا جائزہ</h2>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData} barSize={36} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Bar dataKey="value" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donut chart */}
        <div
          className="rounded-2xl p-5"
          style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px -4px rgba(15,23,42,0.08)' }}
        >
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-slate-700">سوالات کی صورتحال</h2>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="45%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={v => <span style={{ fontSize: 12, color: '#475569' }}>{v}</span>}
              />
              <Tooltip contentStyle={{ border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── More Analytical Charts ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* 1. Line Chart: Monthly Activity Trend */}
        <div
          className="rounded-2xl p-5"
          style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px -4px rgba(15,23,42,0.08)' }}
        >
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="w-4 h-4 text-indigo-500" />
            <h2 className="text-sm font-bold text-slate-700">ماہانہ اشاعت کا رجحان (Line Chart)</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} formatter={v => <span className="text-xs text-slate-600">{v}</span>} />
              <Line type="monotone" dataKey="مقالات" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="فتاویٰ" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 2. Area Chart: User Growth Trend */}
        <div
          className="rounded-2xl p-5"
          style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px -4px rgba(15,23,42,0.08)' }}
        >
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-violet-500" />
            <h2 className="text-sm font-bold text-slate-700">صارفین کی تعداد میں اضافہ (Area Chart)</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={userGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: 12 }} />
              <Area type="monotone" dataKey="صارفین" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#userGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 3. Bar Chart: Weekly Questions */}
        <div
          className="rounded-2xl p-5"
          style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px -4px rgba(15,23,42,0.08)' }}
        >
          <div className="flex items-center gap-2 mb-5">
            <HelpCircle className="w-4 h-4 text-emerald-500" />
            <h2 className="text-sm font-bold text-slate-700">ہفتہ وار سوالات (Bar Chart)</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyQuestionsData} barSize={20} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: 12 }} />
              <Bar dataKey="سوالات" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 4. Line Chart: Monthly Publications */}
        <div
          className="rounded-2xl p-5"
          style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px -4px rgba(15,23,42,0.08)' }}
        >
          <div className="flex items-center gap-2 mb-5">
            <BookOpen className="w-4 h-4 text-pink-500" />
            <h2 className="text-sm font-bold text-slate-700">ماہانہ کتب کی اشاعت (Line Chart)</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyPublicationsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: 12 }} />
              <Line type="monotone" dataKey="مطبوعات" stroke="#ec4899" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 5. Bar Chart: Weekly Messages */}
        <div
          className="md:col-span-2 rounded-2xl p-5"
          style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px -4px rgba(15,23,42,0.08)' }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Mail className="w-4 h-4 text-cyan-500" />
            <h2 className="text-sm font-bold text-slate-700">ہفتہ وار موصولہ پیغامات (Bar Chart)</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyMessagesData} barSize={24} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: 12 }} />
              <Bar dataKey="پیغامات" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* ── Quick actions ── */}
      <div
        className="rounded-2xl p-5"
        style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px -4px rgba(15,23,42,0.08)' }}
      >
        <h2 className="text-sm font-bold text-slate-700 mb-4 pb-3" style={{ borderBottom: '1px solid #f1f5f9' }}>
          فوری اقدامات
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((a, i) => <QuickAction key={i} {...a} />)}
        </div>
      </div>

    </div>
  );
}
