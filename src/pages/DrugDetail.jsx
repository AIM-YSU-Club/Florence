import { useParams, useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { drugs, generateClimateData, generateSalesForecast } from '../mock';
import { useMemo } from 'react';

const chartConfigs = [
  { key: 'temperature', label: '기온', unit: '°C', color: '#ef4444', lightColor: '#fee2e2', icon: '🌡️', bg: 'from-red-50 to-rose-50', border: 'border-red-100' },
  { key: 'humidity', label: '습도', unit: '%', color: '#3b82f6', lightColor: '#dbeafe', icon: '💧', bg: 'from-blue-50 to-indigo-50', border: 'border-blue-100' },
  { key: 'pm25', label: '미세먼지', unit: 'µg/m³', color: '#8b5cf6', lightColor: '#ede9fe', icon: '🌫️', bg: 'from-violet-50 to-purple-50', border: 'border-violet-100' },
  { key: 'uv', label: '자외선', unit: 'UV', color: '#f59e0b', lightColor: '#fef3c7', icon: '☀️', bg: 'from-amber-50 to-yellow-50', border: 'border-amber-100' },
];

function StatCard({ label, value, unit, icon, color, bg, border, index }) {
  return (
    <div className={`bg-gradient-to-br ${bg} rounded-2xl p-5 border ${border} animate-slide-up stagger-${index + 1} hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-white/60 px-2 py-0.5 rounded-md">Today</span>
      </div>
      <p className="text-2xl font-extrabold tracking-tight" style={{ color }}>{value}</p>
      <p className="text-xs text-gray-400 mt-1">{label} ({unit})</p>
    </div>
  );
}

function ChartCard({ config, data }) {
  const { key, label, color, lightColor, icon } = config;
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <span className="text-lg">{icon}</span>
          <h3 className="text-sm font-bold text-gray-600">{label}</h3>
        </div>
        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">7 Days</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`g-${key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.2} />
              <stop offset="100%" stopColor={lightColor} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#bbb' }} axisLine={false} tickLine={false} dy={8} />
          <YAxis tick={{ fontSize: 11, fill: '#bbb' }} axisLine={false} tickLine={false} width={30} />
          <Tooltip
            formatter={(v) => [`${v} ${config.unit}`, label]}
            contentStyle={{
              borderRadius: '14px', fontSize: '12px', border: 'none',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: '10px 14px',
            }}
          />
          <Area
            type="monotone"
            dataKey={key}
            stroke={color}
            strokeWidth={2.5}
            fill={`url(#g-${key})`}
            dot={{ r: 0 }}
            activeDot={{ r: 5, fill: 'white', stroke: color, strokeWidth: 2.5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function DrugDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const drug = drugs.find((d) => d.id === Number(id));

  const climateData = useMemo(() => generateClimateData(), [id]);
  const salesData = useMemo(() => generateSalesForecast(), [id]);

  if (!drug) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-300 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="font-bold text-lg text-gray-500">임시TEXT</p>
        <button onClick={() => navigate('/drugs')} className="mt-4 text-sm text-sky hover:underline cursor-pointer">
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  const todayData = climateData[climateData.length - 1];
  const totalSales = salesData.reduce((s, d) => s + d.predicted, 0);
  const avgSales = Math.round(totalSales / salesData.length);

  return (
    <div className="animate-fade-in">
      <button
        onClick={() => navigate('/drugs')}
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-sky font-medium mb-8 transition-colors cursor-pointer group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        약품 목록으로
      </button>

      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-light to-sky flex items-center justify-center text-3xl shadow-lg shadow-sky/20">
            💊
          </div>
          <div>
            <h1 className="text-[28px] font-extrabold text-gray-800 tracking-tight">{drug.name}</h1>
            <p className="text-sm text-gray-400 mt-0.5">임시TEXT</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 border border-gray-100 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-gray-500">임시TEXT</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {chartConfigs.map((c, i) => (
          <StatCard
            key={c.key}
            label={c.label}
            value={todayData[c.key]}
            unit={c.unit}
            icon={c.icon}
            color={c.color}
            bg={c.bg}
            border={c.border}
            index={i}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-br from-sky-light/30 to-sky/10 rounded-2xl p-5 border border-sky/20 animate-slide-up stagger-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">주간 예상 총 판매량</p>
          <p className="text-3xl font-extrabold text-sky-dark">{totalSales}<span className="text-base font-bold text-gray-400 ml-1">개</span></p>
        </div>
        <div className="bg-gradient-to-br from-peach/30 to-cream/30 rounded-2xl p-5 border border-amber-200/30 animate-slide-up stagger-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">일 평균 예상 판매량</p>
          <p className="text-3xl font-extrabold text-amber-600">{avgSales}<span className="text-base font-bold text-gray-400 ml-1">개/일</span></p>
        </div>
      </div>

      <section className="mb-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-6 rounded-full bg-sky" />
          <h2 className="text-lg font-extrabold text-gray-700">지난 7일간 기후 데이터</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {chartConfigs.map((config) => (
            <ChartCard key={config.key} config={config} data={climateData} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-6 rounded-full bg-emerald-400" />
          <h2 className="text-lg font-extrabold text-gray-700">다음 주 예상 판매량</h2>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={salesData} barCategoryGap="25%">
              <defs>
                <linearGradient id="salesG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8CC0EB" stopOpacity={1} />
                  <stop offset="100%" stopColor="#BFDDF0" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#bbb' }} axisLine={false} tickLine={false} dy={8} />
              <YAxis tick={{ fontSize: 11, fill: '#bbb' }} axisLine={false} tickLine={false} width={35} />
              <Tooltip
                formatter={(v) => [`${v}개`, '예상 판매량']}
                contentStyle={{
                  borderRadius: '14px', fontSize: '12px', border: 'none',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: '10px 14px',
                }}
                cursor={{ fill: 'rgba(140,192,235,0.08)', radius: 8 }}
              />
              <Bar dataKey="predicted" fill="url(#salesG)" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
