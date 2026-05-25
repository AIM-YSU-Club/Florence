import { useState, useEffect, useCallback, useRef } from 'react';
import {
	CartesianGrid,
	Tooltip,
	XAxis,
	YAxis,
	ResponsiveContainer,
	Area,
	AreaChart,
} from 'recharts';
import { AddDrugModal } from './AddDrugModal';
import * as api from '../api';
import type { Medicine, Predict4wRes, Predict7dRes } from '../api';

type Tab = 'dashboard' | 'drugs' | 'info';
type DrugView = 'list' | 'detail';

/* ── ATC code options ── */
const atcOptions = [
	{ code: 'N02BE', label: '아닐리드계', group: 'N - 신경계' },
	{ code: 'R05CB', label: '점액용해제', group: 'R - 호흡기계' },
	{ code: 'R05FA', label: '기침감기 복합제', group: 'R - 호흡기계' },
	{ code: 'R05CA', label: '거담제', group: 'R - 호흡기계' },
	{ code: 'R06AX', label: '기타 항히스타민제', group: 'R - 호흡기계' },
	{ code: 'R06AE', label: '피페라진 유도체', group: 'R - 호흡기계' },
	{ code: 'R01BA', label: '교감신경흥분제', group: 'R - 호흡기계' },
	{ code: 'R05DB', label: '기타 진해제', group: 'R - 호흡기계' },
];

const weekLabels = ['4주 전', '3주 전', '2주 전', '1주 전'];
const dayLabels = ['6일 전', '5일 전', '4일 전', '3일 전', '2일 전', '어제', '오늘'];

const tooltipStyle: React.CSSProperties = {
	backgroundColor: 'rgba(15, 23, 42, 0.95)',
	border: 'none',
	borderRadius: '10px',
	color: '#f8fafc',
	padding: '8px 14px',
	fontSize: '12px',
	boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
};


/* ═══════════════════════════════════════
   Root
   ═══════════════════════════════════════ */

export const MainContent = () => {
	const [activeTab, setActiveTab] = useState<Tab>('dashboard');
	const [drugView, setDrugView] = useState<DrugView>('list');
	const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
	const [medicines, setMedicines] = useState<Medicine[]>([]);
	const [showModal, setShowModal] = useState(false);

	const [pharmacyName, setPharmacyName] = useState('');
	const [pharmacyAddress, setPharmacyAddress] = useState('');
	const [saved, setSaved] = useState(false);

	// Fetch data on mount
	const fetchMedicines = useCallback(async () => {
		if (!api.getToken()) return;
		try {
			const list = await api.getMedicines();
			setMedicines(list);
		} catch { /* not logged in or error */ }
	}, []);

	const fetchPharmacy = useCallback(async () => {
		if (!api.getToken()) return;
		try {
			const data = await api.getPharmacy();
			if (data.pharmacy_name) setPharmacyName(data.pharmacy_name);
			if (data.pharmacy_address) setPharmacyAddress(data.pharmacy_address);
		} catch { /* not logged in or error */ }
	}, []);

	useEffect(() => { fetchMedicines(); fetchPharmacy(); }, [fetchMedicines, fetchPharmacy]);

	const handleSavePharmacy = async () => {
		try {
			await api.updatePharmacy({ name: pharmacyName, address: pharmacyAddress });
			setSaved(true);
			setTimeout(() => setSaved(false), 2000);
		} catch { /* handle error */ }
	};

	const handleAddDrug = async (name: string, atc4: string) => {
		try {
			await api.addMedicine(name, atc4 || '');
			await fetchMedicines();
			setShowModal(false);
		} catch { /* handle error */ }
	};

	const handleDeleteDrug = async (id: string) => {
		try {
			await api.deleteMedicine(id);
			await fetchMedicines();
			if (selectedMedicine?.medicine_id === id) {
				setDrugView('list');
				setSelectedMedicine(null);
			}
		} catch { /* handle error */ }
	};

	const openDrug = (m: Medicine) => {
		setSelectedMedicine(m);
		setDrugView('detail');
	};

	return (
		<main className="flex min-h-[calc(100vh-64px)] w-full">
			{/* ── Sidebar ── */}
			<nav className="flex w-[232px] flex-shrink-0 flex-col bg-(--card) shadow-[1px_0_0_var(--border)]">
				<div className="border-b border-(--border) px-5 py-5">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-(--primary) to-(--secondary) text-white shadow-sm">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
							</svg>
						</div>
						<div className="min-w-0">
							<p className="truncate text-sm font-bold text-(--text-h)">{pharmacyName || '임시TEXT'}</p>
							<p className="truncate text-[11px] text-(--text-muted)">약국 관리 대시보드</p>
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-0.5 px-3 pt-5 pb-4">
					<p className="mb-2 px-3 text-[10px] font-extrabold tracking-[0.15em] text-(--text-muted) uppercase">관리</p>
					<SidebarItem active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); }}
						icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>}
						label="메인 대시보드" />
					<SidebarItem active={activeTab === 'drugs'} onClick={() => { setActiveTab('drugs'); setDrugView('list'); setSelectedMedicine(null); }}
						icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>}
						label="약품 관리" badge={medicines.length} />
					<SidebarItem active={activeTab === 'info'} onClick={() => { setActiveTab('info'); }}
						icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>}
						label="약국 정보" />
				</div>

				<div className="mt-auto px-4 pb-5">
					<div className="rounded-xl bg-gradient-to-br from-(--quaternary)/80 to-(--tertiary)/40 p-4">
						<div className="flex items-center justify-between">
							<p className="text-[10px] font-bold tracking-wider text-(--text-muted) uppercase">등록 현황</p>
							<span className="rounded-full bg-white/60 px-1.5 py-0.5 text-[10px] font-bold text-(--primary)">활성</span>
						</div>
						<p className="mt-1.5 text-2xl font-black text-(--text-h)">
							{medicines.length}<span className="ml-1 text-xs font-semibold text-(--text-muted)">약품</span>
						</p>
						<div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/50">
							<div className="h-full rounded-full bg-(--primary) transition-all duration-500" style={{ width: `${Math.min(medicines.length * 20, 100)}%` }} />
						</div>
					</div>
				</div>
			</nav>

			{/* ── Content ── */}
			<div className="flex-1 overflow-y-auto bg-(--bg)">
				<div key={`${activeTab}-${drugView}-${selectedMedicine?.medicine_id ?? ''}`} className="mx-auto max-w-[1080px] animate-[fadeIn_0.2s_ease-out] px-10 py-8">
					{activeTab === 'dashboard' && <DashboardView />}
					{activeTab === 'drugs' && drugView === 'list' && (
						<DrugGridView medicines={medicines} onCardClick={openDrug} onAddClick={() => setShowModal(true)} onDelete={handleDeleteDrug} />
					)}
					{activeTab === 'drugs' && drugView === 'detail' && selectedMedicine && (
						<DrugDetailView medicine={selectedMedicine} onBack={() => { setDrugView('list'); setSelectedMedicine(null); }} />
					)}
					{activeTab === 'info' && (
						<PharmacyInfoView name={pharmacyName} address={pharmacyAddress} saved={saved}
							onNameChange={setPharmacyName} onAddressChange={setPharmacyAddress} onSave={handleSavePharmacy} />
					)}
				</div>
			</div>

			{showModal && <AddDrugModal onClose={() => setShowModal(false)} onSubmit={handleAddDrug} />}
		</main>
	);
};

/* ── Sidebar Item ── */
function SidebarItem({ active, onClick, icon, label, badge }: {
	active: boolean; onClick: () => void; icon: React.ReactNode; label: string; badge?: number;
}) {
	return (
		<button type="button" onClick={onClick}
			className={`group relative flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition-all duration-150 ${active ? 'bg-(--primary)/12 text-(--primary)' : 'text-(--text) hover:bg-(--bg)/80'}`}>
			{active && <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-(--primary)" />}
			<span className={`flex h-7 w-7 items-center justify-center rounded-md transition-all ${active ? 'bg-(--primary) text-white shadow-sm' : 'bg-(--bg-2)/60 text-(--text-muted) group-hover:text-(--text)'}`}>{icon}</span>
			<span className="flex-1 text-left">{label}</span>
			{badge !== undefined && (
				<span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${active ? 'bg-(--primary)/20 text-(--primary)' : 'bg-(--bg-2)/60 text-(--text-muted)'}`}>{badge}</span>
			)}
		</button>
	);
}

/* ═══════════════════════════════════════
   Main Dashboard — predict_next_4w
   ═══════════════════════════════════════ */

function DashboardView() {
	const [selectedAtc, setSelectedAtc] = useState<string[]>(['N02BE']);
	const [selectedGroup, setSelectedGroup] = useState<string>('all');
	const [results, setResults] = useState<Record<string, Predict4wRes>>({});
	const [loading, setLoading] = useState(false);

	const groups = ['all', ...Array.from(new Set(atcOptions.map((a) => a.group)))];
	const filteredAtc = selectedGroup === 'all' ? atcOptions : atcOptions.filter((a) => a.group === selectedGroup);

	const toggleAtc = (code: string) => {
		setSelectedAtc((prev) => prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]);
	};

	const fetchPredictions = useCallback(async () => {
		if (!selectedAtc.length) return;
		setLoading(true);
		try {
			const entries = await Promise.all(
				selectedAtc.map(async (code) => {
					try {
						const data = await api.predictNext4w(code);
						return [code, data] as const;
					} catch {
						return null;
					}
				}),
			);
			const map: Record<string, Predict4wRes> = {};
			for (const e of entries) if (e) map[e[0]] = e[1];
			setResults(map);
		} finally {
			setLoading(false);
		}
	}, [selectedAtc]);

	useEffect(() => { fetchPredictions(); }, [fetchPredictions]);

	return (
		<div>
			<div className="mb-6">
				<h2 className="text-2xl font-black tracking-tight text-(--text-h)">메인 대시보드</h2>
				<p className="mt-1 text-sm text-(--text-muted)">ATC 분류 코드별 향후 4주간 수요 예측을 확인합니다.</p>
			</div>

			{/* Search / Filter Section */}
			<div className="mb-8 rounded-2xl border border-(--border) bg-(--card) p-5 shadow-[var(--shadow-sm)]">
				<p className="mb-3 text-xs font-bold tracking-wider text-(--text-muted) uppercase">분류 필터</p>
				{/* Group tabs */}
				<div className="mb-3 flex flex-wrap gap-2">
					{groups.map((g) => (
						<button key={g} type="button" onClick={() => setSelectedGroup(g)}
							className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-all ${selectedGroup === g ? 'bg-(--primary) text-white shadow-sm' : 'bg-(--bg) text-(--text-muted) hover:text-(--text)'}`}>
							{g === 'all' ? '전체' : g}
						</button>
					))}
				</div>
				{/* ATC chips */}
				<div className="flex flex-wrap gap-2">
					{filteredAtc.map((atc) => {
						const on = selectedAtc.includes(atc.code);
						return (
							<button key={atc.code} type="button" onClick={() => toggleAtc(atc.code)}
								className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[12px] font-medium transition-all ${on ? 'border-(--primary) bg-(--primary)/10 text-(--primary)' : 'border-(--border) text-(--text-muted) hover:border-(--primary)/40'}`}>
								<span className={`flex h-4 w-4 items-center justify-center rounded border text-[10px] ${on ? 'border-(--primary) bg-(--primary) text-white' : 'border-(--border)'}`}>
									{on && '✓'}
								</span>
								<span className="font-bold">{atc.code}</span>
								<span className="text-(--text-muted)">{atc.label}</span>
							</button>
						);
					})}
				</div>
			</div>

			{/* Results */}
			{loading && <p className="py-12 text-center text-sm text-(--text-muted)">예측 데이터를 불러오는 중...</p>}

			{!loading && selectedAtc.map((code) => {
				const r = results[code];
				if (!r) return null;
				const atcInfo = atcOptions.find((a) => a.code === code);
				const climateCharts = [
					{ key: 'ta', label: '평균 기온', unit: '°C', color: '#5b9bd5', data: r.ta_4w },
					{ key: 'hm', label: '평균 습도', unit: '%', color: '#6ba5c7', data: r.hm_4w },
					{ key: 'rn', label: '강수량', unit: 'mm', color: '#6ba589', data: r.rn_4w },
				];

				return (
					<div key={code} className="mb-10 rounded-2xl border border-(--border) bg-(--card) p-6 shadow-[var(--shadow-sm)]">
						{/* Section header */}
						<div className="mb-5 flex items-center justify-between">
							<div className="flex items-center gap-3">
								<span className="rounded-lg bg-(--primary)/12 px-2.5 py-1 text-xs font-bold tracking-wide text-(--primary)">{code}</span>
								<h3 className="text-lg font-bold text-(--text-h)">{atcInfo?.label ?? code}</h3>
								<span className="text-xs text-(--text-muted)">{atcInfo?.group}</span>
							</div>
						</div>

						{/* Prediction summary */}
						<div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
							<StatCard label="예상 사용량 (4주)" value={formatNumber(r.predicted_value)} unit="건" accent />
							<StatCard label="3년 평균 사용량" value={formatNumber(r.mean_value)} unit="건" />
							<StatCard label="평균 대비 증감률" value={`${r.growth_rate >= 0 ? '+' : ''}${r.growth_rate.toFixed(1)}`} unit="%" delta={r.growth_rate} />
						</div>

						{/* Climate charts row */}
						<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
							{climateCharts.map((chart) => {
							const latest = chart.data[chart.data.length - 1];
							return (
								<div key={chart.key} className="rounded-xl border border-(--border) bg-(--bg) p-4">
									<div className="mb-3 flex items-center justify-between">
										<p className="text-xs font-bold text-(--text)">{chart.label} <span className="text-(--text-muted)">({chart.unit})</span></p>
										<p className="text-lg font-black" style={{ color: chart.color }}>
											{latest}<span className="ml-0.5 text-[10px] font-semibold opacity-60">{chart.unit}</span>
										</p>
									</div>
									<ResponsiveContainer width="100%" height={140}>
										<AreaChart data={chart.data.map((v, i) => ({ name: weekLabels[i], value: v }))} margin={{ top: 4, right: 8, left: -14, bottom: 0 }}>
											<defs>
												<linearGradient id={`dg-${code}-${chart.key}`} x1="0" y1="0" x2="0" y2="1">
													<stop offset="0%" stopColor={chart.color} stopOpacity={0.2} />
													<stop offset="100%" stopColor={chart.color} stopOpacity={0.01} />
												</linearGradient>
											</defs>
											<CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.4} />
											<XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
											<YAxis width={38} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
											<Tooltip formatter={(value) => [`${value} ${chart.unit}`, chart.label]} contentStyle={tooltipStyle} itemStyle={{ color: '#f8fafc' }} labelStyle={{ color: '#94a3b8', fontWeight: 700, fontSize: 11 }} />
											<Area type="monotone" dataKey="value" stroke={chart.color} strokeWidth={2} fill={`url(#dg-${code}-${chart.key})`}
												dot={{ r: 3, fill: chart.color, strokeWidth: 0 }} activeDot={{ r: 5, stroke: chart.color, strokeWidth: 2, fill: 'white' }} />
										</AreaChart>
									</ResponsiveContainer>
								</div>
							);
						})}
						</div>
					</div>
				);
			})}

			{!loading && !selectedAtc.length && (
				<p className="py-16 text-center text-sm text-(--text-muted)">위 필터에서 ATC 코드를 선택하세요.</p>
			)}
		</div>
	);
}

/* ── Stat Card ── */
function StatCard({ label, value, unit, delta, accent }: { label: string; value: string; unit: string; delta?: number; accent?: boolean }) {
	return (
		<div className={`rounded-xl border px-4 py-4 ${accent ? 'border-(--primary)/30 bg-gradient-to-br from-(--primary)/5 to-(--secondary)/5' : 'border-(--border) bg-(--bg)'}`}>
			<p className="text-[11px] font-semibold text-(--text-muted)">{label}</p>
			<p className="mt-2 flex items-baseline gap-1">
				<span className={`text-2xl font-black ${
					delta !== undefined ? (delta >= 0 ? 'text-rose-500' : 'text-blue-500') :
					accent ? 'text-(--primary)' : 'text-(--text-h)'
				}`}>{value}</span>
				<span className="text-xs font-medium text-(--text-muted)">{unit}</span>
			</p>
		</div>
	);
}

function formatNumber(n: number) {
	if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
	return Math.round(n).toLocaleString();
}

/* ═══════════════════════════════════════
   Drug Grid
   ═══════════════════════════════════════ */

const cardGradients = [
	{ from: '#5b9bd5', to: '#8cc0eb' },
	{ from: '#4a8aba', to: '#7eb8d0' },
	{ from: '#3d7da8', to: '#6ba5c7' },
	{ from: '#356f96', to: '#5a90b5' },
];

const statusConfig = {
	DONE: { bg: 'bg-emerald-400/20', text: 'text-emerald-100', dot: 'bg-emerald-300', label: '학습 완료' },
	TRAINING: { bg: 'bg-amber-400/20', text: 'text-amber-100', dot: 'bg-amber-300 animate-pulse', label: '학습 중' },
	FAILED: { bg: 'bg-rose-400/20', text: 'text-rose-100', dot: 'bg-rose-300', label: '학습 실패' },
	NONE: { bg: 'bg-white/10', text: 'text-white/60', dot: 'bg-white/40', label: '학습 필요' },
} as const;

const statusConfigLight = {
	DONE: { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-400', label: '학습 완료' },
	TRAINING: { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-400 animate-pulse', label: '학습 중' },
	FAILED: { bg: 'bg-rose-50', text: 'text-rose-600', dot: 'bg-rose-400', label: '학습 실패' },
	NONE: { bg: 'bg-(--bg-2)', text: 'text-(--text-muted)', dot: 'bg-(--text-muted)/40', label: '학습 필요' },
} as const;

function PtStatusBadge({ status, variant = 'dark' }: { status: keyof typeof statusConfig; variant?: 'dark' | 'light' }) {
	const cfg = variant === 'dark' ? statusConfig[status] : statusConfigLight[status];
	return (
		<span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${cfg.bg} ${cfg.text} ${variant === 'dark' ? 'backdrop-blur-sm' : ''}`}>
			<span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
			{cfg.label}
		</span>
	);
}

function DrugGridView({ medicines, onCardClick, onAddClick, onDelete }: {
	medicines: Medicine[]; onCardClick: (m: Medicine) => void; onAddClick: () => void; onDelete: (id: string) => void;
}) {
	return (
		<div>
			<div className="mb-8 flex items-end justify-between">
				<div>
					<h2 className="text-2xl font-black tracking-tight text-(--text-h)">약품 관리</h2>
					<p className="mt-1 text-sm text-(--text-muted)">약품을 선택하면 기후 데이터 기반 판매 예측을 확인할 수 있습니다.</p>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{/* Add card first */}
				<button type="button" onClick={onAddClick}
					className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-(--border) transition-all duration-200 hover:border-(--primary)/60 hover:bg-(--accent-bg)/50"
					style={{ minHeight: '200px' }}>
					<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-(--bg-2)/50 text-(--text-muted) transition-all group-hover:bg-(--primary)/12 group-hover:text-(--primary)">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
							<line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
						</svg>
					</div>
					<span className="mt-3 text-sm font-bold text-(--text-muted) group-hover:text-(--primary)">새 약품 추가</span>
					<span className="mt-1 text-[11px] text-(--text-muted)/60">약품을 등록하세요</span>
				</button>

				{medicines.map((med, idx) => {
					const pal = cardGradients[idx % cardGradients.length];
					return (
						<div key={med.medicine_id} className="group relative overflow-hidden rounded-2xl shadow-[var(--shadow)] transition-all duration-250 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lg)]"
							style={{ background: `linear-gradient(145deg, ${pal.from}, ${pal.to})`, minHeight: '200px' }}>
							{/* Delete button */}
							<button type="button" onClick={(e) => { e.stopPropagation(); onDelete(med.medicine_id); }}
								className="absolute right-3 top-3 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-black/20 text-white/70 opacity-0 backdrop-blur-sm transition-all hover:bg-red-500 hover:text-white group-hover:opacity-100">
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
							</button>
							<button type="button" onClick={() => onCardClick(med)}
								className="flex h-full w-full flex-col justify-between p-5 text-left text-white">
								<div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/[0.07] transition-transform duration-500 group-hover:scale-150" />
								<div className="relative z-10 flex items-center gap-2">
									<span className="rounded-md bg-white/15 px-2 py-0.5 text-[10px] font-bold tracking-widest backdrop-blur-sm">
										{med.atc4 ?? '미분류'}
									</span>
								</div>
								<div className="relative z-10 mt-auto">
									<p className="text-lg font-black leading-tight">{med.name}</p>
									<div className="mt-2">
										<PtStatusBadge status={med.pt_status} variant="dark" />
									</div>
								</div>
							</button>
						</div>
					);
				})}
			</div>
		</div>
	);
}

/* ═══════════════════════════════════════
   Drug Detail — predict_next_7d
   ═══════════════════════════════════════ */

function DrugDetailView({ medicine, onBack }: { medicine: Medicine; onBack: () => void }) {
	const [data, setData] = useState<Predict7dRes | null>(null);
	const [loading, setLoading] = useState(true);
	const [trainStatus, setTrainStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
		medicine.pt_status === 'TRAINING' ? 'loading' :
		medicine.pt_status === 'DONE' ? 'success' : 'idle'
	);
	const [uploadStatus, setUploadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
	const csvInputRef = useRef<HTMLInputElement>(null);

	const fetchPrediction = useCallback(() => {
		setLoading(true);
		api.predictNext7d(medicine.medicine_id)
			.then(setData)
			.catch(() => setData(null))
			.finally(() => setLoading(false));
	}, [medicine.medicine_id]);

	useEffect(() => { fetchPrediction(); }, [fetchPrediction]);

	const handlePretrain = async () => {
		setTrainStatus('loading');
		try {
			await api.pretrain(medicine.medicine_id);
			setTrainStatus('success');
			setTimeout(() => {
				fetchPrediction();
				setTrainStatus('idle');
			}, 3000);
		} catch {
			setTrainStatus('error');
			setTimeout(() => setTrainStatus('idle'), 3000);
		}
	};

	const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploadStatus('loading');
		try {
			await api.uploadSales(medicine.medicine_id, file);
			setUploadStatus('success');
			setTimeout(() => setUploadStatus('idle'), 3000);
		} catch {
			setUploadStatus('error');
			setTimeout(() => setUploadStatus('idle'), 3000);
		}
		if (csvInputRef.current) csvInputRef.current.value = '';
	};

	if (loading) return <p className="py-20 text-center text-sm text-(--text-muted)">데이터를 불러오는 중...</p>;

	const climateCharts = data ? [
		{ key: 'ta', label: '평균 기온', unit: '°C', color: '#5b9bd5', data: data.ta_7d },
		{ key: 'hm', label: '평균 습도', unit: '%', color: '#6ba5c7', data: data.hm_7d },
		{ key: 'rn', label: '강수량', unit: 'mm', color: '#6ba589', data: data.rn_7d },
	] : [];

	return (
		<div>
			{/* Header */}
			<div className="mb-6 rounded-2xl border border-(--border) bg-(--card) p-6 shadow-[var(--shadow-sm)]">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<button type="button" onClick={onBack}
							className="flex h-9 w-9 items-center justify-center rounded-lg border border-(--border) bg-(--bg) text-(--text-muted) transition-all hover:bg-(--bg-2) hover:text-(--text)">
							<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
						</button>
						<div>
							<div className="flex items-center gap-2.5">
								<h2 className="text-2xl font-black tracking-tight text-(--text-h)">{medicine.name}</h2>
								<span className="rounded-md bg-(--primary)/12 px-2 py-0.5 text-[10px] font-bold tracking-wider text-(--primary)">{medicine.atc4 ?? '미분류'}</span>
								<PtStatusBadge status={medicine.pt_status} variant="light" />
							</div>
							<p className="mt-1 text-xs text-(--text-muted)">기후 기반 7일 판매 예측</p>
						</div>
					</div>
					<div className="flex items-center gap-2.5">
						{/* CSV Upload */}
						<input ref={csvInputRef} type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
						<ActionButton
							onClick={() => csvInputRef.current?.click()}
							disabled={uploadStatus === 'loading'}
							status={uploadStatus}
							labels={{ idle: 'CSV 업로드', loading: '업로드 중...', success: '✓ 업로드 완료', error: '업로드 실패' }}
							icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>}
							variant="secondary"
						/>
						{/* Pretrain */}
						<ActionButton
							onClick={handlePretrain}
							disabled={trainStatus === 'loading'}
							status={trainStatus}
							labels={{ idle: '모델 학습', loading: '학습 중...', success: '✓ 학습 완료', error: '학습 실패' }}
							icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>}
							variant="primary"
						/>
					</div>
				</div>

				{/* Predicted value highlight */}
				{data && (
					<div className="mt-5 flex items-center gap-6 rounded-xl bg-gradient-to-r from-(--primary)/8 to-(--secondary)/5 px-5 py-4">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-(--primary)/15 text-(--primary)">
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
							</div>
							<div>
								<p className="text-[11px] font-semibold text-(--text-muted)">7일 예상 판매량</p>
								<p className="text-xl font-black text-(--primary)">{Math.round(data.predicted_value).toLocaleString()}<span className="ml-1 text-xs font-semibold text-(--text-muted)">건</span></p>
							</div>
						</div>
						<div className="h-8 w-px bg-(--border)" />
						<div>
							<p className="text-[11px] font-semibold text-(--text-muted)">평균 판매량</p>
							<p className="text-xl font-black text-(--text-h)">{Math.round(data.mean_value).toLocaleString()}<span className="ml-1 text-xs font-semibold text-(--text-muted)">건</span></p>
						</div>
						<div className="h-8 w-px bg-(--border)" />
						<div>
							<p className="text-[11px] font-semibold text-(--text-muted)">평균 대비 증감률</p>
							<p className={`text-xl font-black ${data.growth_rate >= 0 ? 'text-rose-500' : 'text-blue-500'}`}>
								{data.growth_rate >= 0 ? '+' : ''}{data.growth_rate.toFixed(1)}<span className="ml-0.5 text-xs font-semibold opacity-60">%</span>
							</p>
						</div>
					</div>
				)}
			</div>

			{!data ? (
				<div className="rounded-2xl border border-(--border) bg-(--card) p-12 text-center shadow-[var(--shadow-sm)]">
					<div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-(--bg-2)/50 text-(--text-muted)">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
						</svg>
					</div>
					<p className="text-sm font-semibold text-(--text-h)">예측 데이터가 없습니다</p>
					<p className="mt-1 text-xs text-(--text-muted)">판매 데이터(CSV)를 업로드하고 사전학습을 실행하세요.</p>
				</div>
			) : (
				<>
					{/* Climate charts */}
					<section>
						<h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-(--text-h)">
							<span className="flex h-5 w-5 items-center justify-center rounded bg-(--primary)/12 text-(--primary)">
								<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
							</span>
							지난 7일간 기후 추이
						</h3>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
							{climateCharts.map((chart) => {
								const latest7 = chart.data[chart.data.length - 1];
								return (
								<div key={chart.key} className="rounded-xl border border-(--border) bg-(--card) p-4 shadow-[var(--shadow-sm)]">
									<div className="mb-3 flex items-center justify-between">
										<p className="text-xs font-bold text-(--text)">{chart.label} <span className="text-(--text-muted)">({chart.unit})</span></p>
										<p className="text-lg font-black" style={{ color: chart.color }}>
											{latest7}<span className="ml-0.5 text-[10px] font-semibold opacity-60">{chart.unit}</span>
										</p>
									</div>
									<ResponsiveContainer width="100%" height={150}>
										<AreaChart data={chart.data.map((v, i) => ({ name: dayLabels[i], value: v }))} margin={{ top: 4, right: 8, left: -14, bottom: 0 }}>
											<defs>
												<linearGradient id={`dg7-${chart.key}`} x1="0" y1="0" x2="0" y2="1">
													<stop offset="0%" stopColor={chart.color} stopOpacity={0.2} />
													<stop offset="100%" stopColor={chart.color} stopOpacity={0.01} />
												</linearGradient>
											</defs>
											<CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.4} />
											<XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
											<YAxis width={38} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
											<Tooltip formatter={(value) => [`${value} ${chart.unit}`, chart.label]} contentStyle={tooltipStyle} itemStyle={{ color: '#f8fafc' }} labelStyle={{ color: '#94a3b8', fontWeight: 700, fontSize: 11 }} />
											<Area type="monotone" dataKey="value" stroke={chart.color} strokeWidth={2} fill={`url(#dg7-${chart.key})`}
												dot={{ r: 2.5, fill: chart.color, strokeWidth: 0 }} activeDot={{ r: 5, stroke: chart.color, strokeWidth: 2, fill: 'white' }} />
										</AreaChart>
									</ResponsiveContainer>
								</div>
								);
							})}
						</div>
					</section>
				</>
			)}
		</div>
	);
}

/* ── Action Button (reusable) ── */
function ActionButton({ onClick, disabled, status, labels, icon, variant }: {
	onClick: () => void;
	disabled: boolean;
	status: 'idle' | 'loading' | 'success' | 'error';
	labels: { idle: string; loading: string; success: string; error: string };
	icon: React.ReactNode;
	variant: 'primary' | 'secondary';
}) {
	const base = status === 'success' ? 'bg-emerald-500 text-white' :
		status === 'error' ? 'bg-rose-500 text-white' :
		status === 'loading' ? 'bg-(--bg-2) text-(--text-muted)' :
		variant === 'primary'
			? 'bg-(--primary) text-white shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow)]'
			: 'border border-(--border) bg-(--card) text-(--text) shadow-[var(--shadow-sm)] hover:bg-(--bg-2)';

	return (
		<button type="button" onClick={onClick} disabled={disabled}
			className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-bold transition-all ${base}`}>
			{status === 'loading' ? (
				<svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
					<path d="M21 12a9 9 0 1 1-6.219-8.56" />
				</svg>
			) : status === 'idle' ? icon : null}
			{labels[status]}
		</button>
	);
}

/* ═══════════════════════════════════════
   Pharmacy Info
   ═══════════════════════════════════════ */

function FormField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (v: string) => void }) {
	return (
		<div className="flex flex-col gap-1.5">
			<label htmlFor={id} className="text-[11px] font-bold tracking-wider text-(--text-muted) uppercase">{label}</label>
			<input id={id} type="text" value={value} onChange={(e) => onChange(e.target.value)}
				className="rounded-lg border border-(--border) bg-(--bg) px-3.5 py-2.5 text-sm font-medium text-(--text-h) outline-none transition-all focus:border-(--primary) focus:shadow-[0_0_0_3px_var(--accent-bg)]" />
		</div>
	);
}

function PharmacyInfoView({ name, address, saved, onNameChange, onAddressChange, onSave }: {
	name: string; address: string; saved: boolean;
	onNameChange: (v: string) => void; onAddressChange: (v: string) => void; onSave: () => void;
}) {
	return (
		<div>
			<div className="mb-8">
				<h2 className="text-2xl font-black tracking-tight text-(--text-h)">약국 정보</h2>
				<p className="mt-1 text-sm text-(--text-muted)">약국의 기본 정보를 관리합니다.</p>
			</div>
			<div className="grid max-w-3xl grid-cols-1 gap-6 lg:grid-cols-5">
				{/* Profile card */}
				<div className="flex flex-col items-center rounded-2xl border border-(--border) bg-(--card) p-6 shadow-[var(--shadow-sm)] lg:col-span-2">
					<div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-(--primary) to-(--secondary) text-white shadow-md">
						<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
							<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
						</svg>
					</div>
					<p className="mt-4 text-lg font-black text-(--text-h)">{name || '임시TEXT'}</p>
					<p className="mt-1 text-xs text-(--text-muted)">{address || '임시TEXT'}</p>
				</div>
				{/* Edit form */}
				<div className="rounded-2xl border border-(--border) bg-(--card) p-6 shadow-[var(--shadow-sm)] lg:col-span-3">
					<h3 className="mb-5 text-sm font-bold text-(--text-h)">정보 수정</h3>
					<div className="flex flex-col gap-5">
						<FormField id="p-name" label="약국 이름" value={name} onChange={onNameChange} />
						<FormField id="p-addr" label="주소" value={address} onChange={onAddressChange} />
					</div>
					<div className="mt-6 flex items-center justify-between border-t border-(--border) pt-5">
						<p className="text-[11px] text-(--text-muted)">변경사항은 저장 후 반영됩니다.</p>
						<button type="button" onClick={onSave}
							className={`rounded-lg px-5 py-2 text-sm font-bold text-white transition-all duration-200 ${saved ? 'bg-emerald-500' : 'bg-(--primary) shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow)]'}`}>
							{saved ? '✓ 저장됨' : '저장'}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
