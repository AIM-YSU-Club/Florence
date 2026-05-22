import { useState } from 'react';
import {
	CartesianGrid,
	Tooltip,
	XAxis,
	YAxis,
	Bar,
	BarChart,
	ResponsiveContainer,
	Area,
	AreaChart,
	Cell,
} from 'recharts';
import { AddDrugModal } from './AddDrugModal';

type Tab = 'info' | 'drugs';
type View = 'list' | 'detail';

interface Drug {
	id: string;
	name: string;
	category: string;
	registeredAt: string;
	sparkline: number[];
}

const initialDrugs: Drug[] = [
	{
		id: '1',
		name: '타이레놀',
		category: 'N02BE',
		registeredAt: '2025.04.12',
		sparkline: [80, 95, 110, 90, 120, 135, 125],
	},
	{
		id: '2',
		name: '판콜에이',
		category: 'R05CA',
		registeredAt: '2025.05.03',
		sparkline: [60, 75, 55, 90, 85, 100, 110],
	},
];

const dayLabels = ['6일 전', '5일 전', '4일 전', '3일 전', '2일 전', '어제', '오늘'];

const climateCharts = [
	{
		key: 'temp',
		label: '평균 기온',
		unit: '°C',
		color: '#5b9bd5',
		icon: (
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
				<path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
			</svg>
		),
		data: [18.2, 19.1, 20.3, 19.8, 21.5, 22.1, 21.7],
	},
	{
		key: 'humidity',
		label: '평균 습도',
		unit: '%',
		color: '#6ba5c7',
		icon: (
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
				<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
			</svg>
		),
		data: [55, 62, 58, 71, 65, 60, 68],
	},
	{
		key: 'rain',
		label: '강수량',
		unit: 'mm',
		color: '#6ba589',
		icon: (
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
				<path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" />
				<line x1="8" y1="16" x2="8.01" y2="16" /><line x1="8" y1="20" x2="8.01" y2="20" />
				<line x1="12" y1="18" x2="12.01" y2="18" /><line x1="12" y1="22" x2="12.01" y2="22" />
				<line x1="16" y1="16" x2="16.01" y2="16" /><line x1="16" y1="20" x2="16.01" y2="20" />
			</svg>
		),
		data: [0, 2.1, 0, 0.5, 3.2, 0, 1.1],
	},
	{
		key: 'wind',
		label: '평균 풍속',
		unit: 'm/s',
		color: '#c4915e',
		icon: (
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
				<path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
			</svg>
		),
		data: [3.2, 2.8, 4.1, 3.5, 2.9, 3.8, 4.5],
	},
];

const forecastLabels = ['월', '화', '수', '목', '금', '토', '일'];
const forecastSales = [120, 135, 110, 145, 160, 95, 80];
const forecastData = forecastLabels.map((day, i) => ({
	name: day,
	sales: forecastSales[i],
}));
const maxSales = Math.max(...forecastSales);
const minSales = Math.min(...forecastSales);

const climateData = climateCharts.map((chart) => ({
	...chart,
	points: dayLabels.map((name, i) => ({ name, value: chart.data[i] })),
	latest: chart.data[chart.data.length - 1],
	prev: chart.data[chart.data.length - 2],
	delta: +(
		chart.data[chart.data.length - 1] - chart.data[chart.data.length - 2]
	).toFixed(1),
	avg: +(chart.data.reduce((a, b) => a + b, 0) / chart.data.length).toFixed(1),
}));

const tooltipContent: React.CSSProperties = {
	backgroundColor: 'rgba(15, 23, 42, 0.95)',
	border: 'none',
	borderRadius: '10px',
	color: '#f8fafc',
	padding: '8px 14px',
	fontSize: '12px',
	boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
	backdropFilter: 'blur(8px)',
};

function MiniSparkline({ data, color, width = 80, height = 28 }: { data: number[]; color: string; width?: number; height?: number }) {
	const max = Math.max(...data);
	const min = Math.min(...data);
	const range = max - min || 1;
	const padding = 2;
	const points = data
		.map((v, i) => {
			const x = padding + (i / (data.length - 1)) * (width - padding * 2);
			const y = padding + (1 - (v - min) / range) * (height - padding * 2);
			return `${x},${y}`;
		})
		.join(' ');

	return (
		<svg width={width} height={height} className="overflow-visible">
			<defs>
				<linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor={color} stopOpacity={0.3} />
					<stop offset="100%" stopColor={color} stopOpacity={0} />
				</linearGradient>
			</defs>
			<polygon
				points={`${padding},${height} ${points} ${width - padding},${height}`}
				fill={`url(#spark-${color.replace('#', '')})`}
			/>
			<polyline
				points={points}
				fill="none"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<circle
				cx={padding + ((data.length - 1) / (data.length - 1)) * (width - padding * 2)}
				cy={padding + (1 - (data[data.length - 1] - min) / range) * (height - padding * 2)}
				r="2.5"
				fill={color}
			/>
		</svg>
	);
}

export const MainContent = () => {
	const [activeTab, setActiveTab] = useState<Tab>('drugs');
	const [view, setView] = useState<View>('list');
	const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
	const [drugs, setDrugs] = useState<Drug[]>(initialDrugs);
	const [showModal, setShowModal] = useState(false);

	const [pharmacyName, setPharmacyName] = useState('Florence 약국');
	const [pharmacyAddress, setPharmacyAddress] = useState(
		'서울특별시 강남구 테헤란로 123',
	);
	const [pharmacyPhone, setPharmacyPhone] = useState('02-1234-5678');
	const [saved, setSaved] = useState(false);

	const handleSave = () => {
		setSaved(true);
		setTimeout(() => setSaved(false), 2000);
	};

	const handleAddDrug = (name: string, _file: File) => {
		setDrugs((prev) => [
			...prev,
			{
				id: String(Date.now()),
				name,
				category: 'NEW',
				registeredAt: new Date().toLocaleDateString('ko-KR'),
				sparkline: [50, 60, 55, 70, 65, 80, 75],
			},
		]);
		setShowModal(false);
	};

	const openDrug = (drug: Drug) => {
		setSelectedDrug(drug);
		setView('detail');
	};

	const backToList = () => {
		setView('list');
		setSelectedDrug(null);
	};

	return (
		<main className="flex min-h-[calc(100vh-64px)] w-full">
			{/* ── Sidebar ── */}
			<nav className="flex w-[232px] flex-shrink-0 flex-col bg-(--card) shadow-[1px_0_0_var(--border)]">
				{/* Pharmacy quick info */}
				<div className="border-b border-(--border) px-5 py-5">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-(--primary) to-(--secondary) text-white shadow-sm">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
								<polyline points="9 22 9 12 15 12 15 22" />
							</svg>
						</div>
						<div className="min-w-0">
							<p className="truncate text-sm font-bold text-(--text-h)">
								{pharmacyName}
							</p>
							<p className="truncate text-[11px] text-(--text-muted)">
								약국 관리 대시보드
							</p>
						</div>
					</div>
				</div>

				{/* Nav items */}
				<div className="flex flex-col gap-0.5 px-3 pt-5 pb-4">
					<p className="mb-2 px-3 text-[10px] font-extrabold tracking-[0.15em] text-(--text-muted) uppercase">
						관리
					</p>

					<SidebarItem
						active={activeTab === 'info'}
						onClick={() => { setActiveTab('info'); setView('list'); }}
						icon={
							<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
								<polyline points="9 22 9 12 15 12 15 22" />
							</svg>
						}
						label="약국 정보"
					/>
					<SidebarItem
						active={activeTab === 'drugs'}
						onClick={() => { setActiveTab('drugs'); setView('list'); setSelectedDrug(null); }}
						icon={
							<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<rect x="3" y="3" width="7" height="7" rx="1.5" />
								<rect x="14" y="3" width="7" height="7" rx="1.5" />
								<rect x="3" y="14" width="7" height="7" rx="1.5" />
								<rect x="14" y="14" width="7" height="7" rx="1.5" />
							</svg>
						}
						label="약품 관리"
						badge={drugs.length}
					/>
				</div>

				{/* Bottom stat */}
				<div className="mt-auto px-4 pb-5">
					<div className="rounded-xl bg-gradient-to-br from-(--quaternary)/80 to-(--tertiary)/40 p-4">
						<div className="flex items-center justify-between">
							<p className="text-[10px] font-bold tracking-wider text-(--text-muted) uppercase">
								등록 현황
							</p>
							<span className="rounded-full bg-white/60 px-1.5 py-0.5 text-[10px] font-bold text-(--primary)">
								활성
							</span>
						</div>
						<p className="mt-1.5 text-2xl font-black text-(--text-h)">
							{drugs.length}
							<span className="ml-1 text-xs font-semibold text-(--text-muted)">
								약품
							</span>
						</p>
						<div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/50">
							<div
								className="h-full rounded-full bg-(--primary) transition-all duration-500"
								style={{ width: `${Math.min(drugs.length * 20, 100)}%` }}
							/>
						</div>
					</div>
				</div>
			</nav>

			{/* ── Content ── */}
			<div className="flex-1 overflow-y-auto bg-(--bg)">
				<div
					key={`${activeTab}-${view}-${selectedDrug?.id ?? ''}`}
					className="mx-auto max-w-[1080px] animate-[fadeIn_0.2s_ease-out] px-10 py-8"
				>
					{activeTab === 'info' && (
						<PharmacyInfoView
							name={pharmacyName}
							address={pharmacyAddress}
							phone={pharmacyPhone}
							saved={saved}
							onNameChange={setPharmacyName}
							onAddressChange={setPharmacyAddress}
							onPhoneChange={setPharmacyPhone}
							onSave={handleSave}
						/>
					)}

					{activeTab === 'drugs' && view === 'list' && (
						<DrugGridView
							drugs={drugs}
							onCardClick={openDrug}
							onAddClick={() => setShowModal(true)}
						/>
					)}

					{activeTab === 'drugs' && view === 'detail' && selectedDrug && (
						<DrugDetailView drug={selectedDrug} onBack={backToList} />
					)}
				</div>
			</div>

			{showModal && (
				<AddDrugModal
					onClose={() => setShowModal(false)}
					onSubmit={handleAddDrug}
				/>
			)}
		</main>
	);
};

/* ── Sidebar Item ── */

function SidebarItem({ active, onClick, icon, label, badge }: {
	active: boolean;
	onClick: () => void;
	icon: React.ReactNode;
	label: string;
	badge?: number;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`group relative flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition-all duration-150 ${
				active
					? 'bg-(--primary)/12 text-(--primary)'
					: 'text-(--text) hover:bg-(--bg)/80'
			}`}
		>
			{active && (
				<span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-(--primary)" />
			)}
			<span className={`flex h-7 w-7 items-center justify-center rounded-md transition-all ${
				active
					? 'bg-(--primary) text-white shadow-sm'
					: 'bg-(--bg-2)/60 text-(--text-muted) group-hover:text-(--text)'
			}`}>
				{icon}
			</span>
			<span className="flex-1 text-left">{label}</span>
			{badge !== undefined && (
				<span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
					active ? 'bg-(--primary)/20 text-(--primary)' : 'bg-(--bg-2)/60 text-(--text-muted)'
				}`}>
					{badge}
				</span>
			)}
		</button>
	);
}

/* ═══════════════════════════════════════
   Pharmacy Info
   ═══════════════════════════════════════ */

function PharmacyInfoView({
	name, address, phone, saved,
	onNameChange, onAddressChange, onPhoneChange, onSave,
}: {
	name: string; address: string; phone: string; saved: boolean;
	onNameChange: (v: string) => void;
	onAddressChange: (v: string) => void;
	onPhoneChange: (v: string) => void;
	onSave: () => void;
}) {
	return (
		<div>
			<div className="mb-8">
				<h2 className="text-2xl font-black tracking-tight text-(--text-h)">
					약국 정보
				</h2>
				<p className="mt-1 text-sm text-(--text-muted)">
					약국의 기본 정보를 관리합니다.
				</p>
			</div>

			<div className="grid max-w-3xl grid-cols-1 gap-6 lg:grid-cols-5">
				{/* Profile card */}
				<div className="flex flex-col items-center rounded-2xl border border-(--border) bg-(--card) p-6 shadow-[var(--shadow-sm)] lg:col-span-2">
					<div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-(--primary) to-(--secondary) text-white shadow-md">
						<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
							<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
							<polyline points="9 22 9 12 15 12 15 22" />
						</svg>
					</div>
					<p className="mt-4 text-lg font-black text-(--text-h)">{name}</p>
					<p className="mt-1 text-xs text-(--text-muted)">{address}</p>
					<div className="mt-5 flex w-full flex-col gap-2.5 border-t border-(--border) pt-5">
						<div className="flex items-center gap-2.5 text-xs">
							<span className="flex h-6 w-6 items-center justify-center rounded-md bg-(--bg-2)/60 text-(--text-muted)">
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
								</svg>
							</span>
							<span className="text-(--text)">{phone}</span>
						</div>
						<div className="flex items-center gap-2.5 text-xs">
							<span className="flex h-6 w-6 items-center justify-center rounded-md bg-(--bg-2)/60 text-(--text-muted)">
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
									<circle cx="12" cy="10" r="3" />
								</svg>
							</span>
							<span className="text-(--text) leading-snug">{address}</span>
						</div>
					</div>
				</div>

				{/* Edit form */}
				<div className="rounded-2xl border border-(--border) bg-(--card) p-6 shadow-[var(--shadow-sm)] lg:col-span-3">
					<h3 className="mb-5 text-sm font-bold text-(--text-h)">정보 수정</h3>
					<div className="flex flex-col gap-5">
						<FormField id="p-name" label="약국 이름" value={name} onChange={onNameChange} />
						<FormField id="p-addr" label="주소" value={address} onChange={onAddressChange} />
						<FormField id="p-phone" label="전화번호" value={phone} onChange={onPhoneChange} />
					</div>
					<div className="mt-6 flex items-center justify-between border-t border-(--border) pt-5">
						<p className="text-[11px] text-(--text-muted)">변경사항은 저장 후 반영됩니다.</p>
						<button
							type="button"
							onClick={onSave}
							className={`rounded-lg px-5 py-2 text-sm font-bold text-white transition-all duration-200 ${
								saved
									? 'bg-emerald-500'
									: 'bg-(--primary) shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow)]'
							}`}
						>
							{saved ? '✓ 저장됨' : '저장'}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

function FormField({ id, label, value, onChange }: {
	id: string; label: string; value: string; onChange: (v: string) => void;
}) {
	return (
		<div className="flex flex-col gap-1.5">
			<label htmlFor={id} className="text-[11px] font-bold tracking-wider text-(--text-muted) uppercase">
				{label}
			</label>
			<input
				id={id}
				type="text"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="rounded-lg border border-(--border) bg-(--bg) px-3.5 py-2.5 text-sm font-medium text-(--text-h) outline-none transition-all focus:border-(--primary) focus:shadow-[0_0_0_3px_var(--accent-bg)]"
			/>
		</div>
	);
}

/* ═══════════════════════════════════════
   Drug Card Grid
   ═══════════════════════════════════════ */

const cardGradients = [
	{ from: '#5b9bd5', to: '#8cc0eb' },
	{ from: '#4a8aba', to: '#7eb8d0' },
	{ from: '#3d7da8', to: '#6ba5c7' },
	{ from: '#356f96', to: '#5a90b5' },
];

function DrugGridView({
	drugs, onCardClick, onAddClick,
}: {
	drugs: Drug[];
	onCardClick: (drug: Drug) => void;
	onAddClick: () => void;
}) {
	return (
		<div>
			<div className="mb-8 flex items-end justify-between">
				<div>
					<h2 className="text-2xl font-black tracking-tight text-(--text-h)">
						약품 관리
					</h2>
					<p className="mt-1 text-sm text-(--text-muted)">
						약품을 선택하면 기후 데이터 기반 판매 예측을 확인할 수 있습니다.
					</p>
				</div>
				<button
					type="button"
					onClick={onAddClick}
					className="flex items-center gap-2 rounded-lg bg-(--primary) px-4 py-2.5 text-[13px] font-bold text-white shadow-[var(--shadow-sm)] transition-all hover:shadow-[var(--shadow)]"
				>
					<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
						<line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
					</svg>
					새 약품 추가
				</button>
			</div>

			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{drugs.map((drug, idx) => {
					const pal = cardGradients[idx % cardGradients.length];
					return (
						<button
							key={drug.id}
							type="button"
							onClick={() => onCardClick(drug)}
							className="group relative flex flex-col justify-between overflow-hidden rounded-2xl p-5 text-left text-white shadow-[var(--shadow)] transition-all duration-250 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lg)]"
							style={{
								background: `linear-gradient(145deg, ${pal.from}, ${pal.to})`,
								minHeight: '200px',
							}}
						>
							{/* Decorative shapes */}
							<div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/[0.07] transition-transform duration-500 group-hover:scale-150" />
							<div className="absolute right-10 bottom-[-10px] h-20 w-20 rounded-full bg-white/[0.05]" />

							{/* Top row */}
							<div className="relative z-10 flex items-start justify-between">
								<span className="rounded-md bg-white/15 px-2 py-0.5 text-[10px] font-bold tracking-widest backdrop-blur-sm">
									{drug.category}
								</span>
								<div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:opacity-100">
									<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
										<polyline points="9 18 15 12 9 6" />
									</svg>
								</div>
							</div>

							{/* Sparkline */}
							<div className="relative z-10 mt-auto mb-1 opacity-60">
								<MiniSparkline data={drug.sparkline} color="rgba(255,255,255,0.8)" width={100} height={24} />
							</div>

							{/* Bottom info */}
							<div className="relative z-10">
								<p className="text-lg font-black leading-tight">
									{drug.name}
								</p>
								<div className="mt-1 flex items-center gap-2 text-[11px] text-white/50">
									<span>등록 {drug.registeredAt}</span>
									<span>·</span>
									<span>최근 7일 판매 추이</span>
								</div>
							</div>
						</button>
					);
				})}

				{/* Add card */}
				<button
					type="button"
					onClick={onAddClick}
					className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-(--border) transition-all duration-200 hover:border-(--primary)/60 hover:bg-(--accent-bg)/50"
					style={{ minHeight: '200px' }}
				>
					<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-(--bg-2)/50 text-(--text-muted) transition-all group-hover:bg-(--primary)/12 group-hover:text-(--primary)">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
							<line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
						</svg>
					</div>
					<span className="mt-3 text-sm font-bold text-(--text-muted) group-hover:text-(--primary)">
						새 약품 추가
					</span>
					<span className="mt-1 text-[11px] text-(--text-muted)/60">
						CSV 업로드로 등록
					</span>
				</button>
			</div>
		</div>
	);
}

/* ═══════════════════════════════════════
   Drug Detail
   ═══════════════════════════════════════ */

function DrugDetailView({ drug, onBack }: { drug: Drug; onBack: () => void }) {
	const totalForecast = forecastData.reduce((s, d) => s + d.sales, 0);
	const avgForecast = Math.round(totalForecast / forecastData.length);

	return (
		<div>
			{/* Header */}
			<div className="mb-8 flex items-center justify-between">
				<div className="flex items-center gap-4">
					<button
						type="button"
						onClick={onBack}
						className="flex h-9 w-9 items-center justify-center rounded-lg border border-(--border) bg-(--card) text-(--text-muted) transition-all hover:bg-(--bg-2) hover:text-(--text)"
					>
						<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<polyline points="15 18 9 12 15 6" />
						</svg>
					</button>
					<div>
						<div className="flex items-center gap-2.5">
							<h2 className="text-2xl font-black tracking-tight text-(--text-h)">
								{drug.name}
							</h2>
							<span className="rounded-md bg-(--primary)/12 px-2 py-0.5 text-[10px] font-bold tracking-wider text-(--primary)">
								{drug.category}
							</span>
						</div>
						<p className="mt-0.5 text-xs text-(--text-muted)">
							등록일 {drug.registeredAt} · 기후 기반 판매 분석
						</p>
					</div>
				</div>
			</div>

			{/* Stat summary */}
			<div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
				{climateData.map((c) => (
					<div
						key={c.key}
						className="group rounded-xl border border-(--border) bg-(--card) p-4 shadow-[var(--shadow-sm)] transition-all hover:shadow-[var(--shadow)]"
					>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-1.5">
								<span className="flex h-6 w-6 items-center justify-center rounded-md text-(--text-muted)" style={{ backgroundColor: `${c.color}15` }}>
									<span style={{ color: c.color }}>{c.icon}</span>
								</span>
								<p className="text-[11px] font-semibold text-(--text-muted)">{c.label}</p>
							</div>
							<span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
								c.delta >= 0
									? 'bg-rose-50 text-rose-500'
									: 'bg-blue-50 text-blue-500'
							}`}>
								{c.delta >= 0 ? '+' : ''}{c.delta}
							</span>
						</div>
						<div className="mt-3 flex items-end justify-between">
							<p className="text-2xl font-black leading-none text-(--text-h)">
								{c.latest}
								<span className="ml-0.5 text-xs font-medium text-(--text-muted)">{c.unit}</span>
							</p>
							<MiniSparkline data={c.data} color={c.color} width={60} height={22} />
						</div>
						<p className="mt-2 text-[10px] text-(--text-muted)">
							7일 평균 <span className="font-semibold text-(--text)">{c.avg}{c.unit}</span>
						</p>
					</div>
				))}
			</div>

			{/* Climate charts */}
			<section className="mb-8">
				<h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-(--text-h)">
					<span className="flex h-5 w-5 items-center justify-center rounded bg-(--primary)/12 text-(--primary)">
						<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
							<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
						</svg>
					</span>
					지난 7일간 기후 추이
				</h3>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{climateData.map((chart) => (
						<div
							key={chart.key}
							className="rounded-xl border border-(--border) bg-(--card) p-5 shadow-[var(--shadow-sm)]"
						>
							<div className="mb-4 flex items-center justify-between">
								<div className="flex items-center gap-2">
									<span className="flex h-5 w-5 items-center justify-center rounded" style={{ backgroundColor: `${chart.color}15`, color: chart.color }}>
										{chart.icon}
									</span>
									<p className="text-xs font-bold text-(--text)">
										{chart.label}
									</p>
								</div>
								<span className="text-[10px] text-(--text-muted)">최근 7일</span>
							</div>
							<ResponsiveContainer width="100%" height={160}>
								<AreaChart data={chart.points} margin={{ top: 4, right: 8, left: -14, bottom: 0 }}>
									<defs>
										<linearGradient id={`grad-${chart.key}`} x1="0" y1="0" x2="0" y2="1">
											<stop offset="0%" stopColor={chart.color} stopOpacity={0.2} />
											<stop offset="100%" stopColor={chart.color} stopOpacity={0.01} />
										</linearGradient>
									</defs>
									<CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.4} />
									<XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
									<YAxis width={38} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
									<Tooltip
										formatter={(value) => [`${value} ${chart.unit}`, chart.label]}
										contentStyle={tooltipContent}
										itemStyle={{ color: '#f8fafc' }}
										labelStyle={{ color: '#94a3b8', fontWeight: 700, fontSize: 11 }}
									/>
									<Area
										type="monotone"
										dataKey="value"
										stroke={chart.color}
										strokeWidth={2}
										fill={`url(#grad-${chart.key})`}
										dot={{ r: 2.5, fill: chart.color, strokeWidth: 0 }}
										activeDot={{ r: 5, stroke: chart.color, strokeWidth: 2, fill: 'white' }}
									/>
								</AreaChart>
							</ResponsiveContainer>
						</div>
					))}
				</div>
			</section>

			{/* Forecast */}
			<section>
				<div className="mb-4 flex items-center justify-between">
					<h3 className="flex items-center gap-2 text-sm font-bold text-(--text-h)">
						<span className="flex h-5 w-5 items-center justify-center rounded bg-(--tertiary)/40 text-(--text-muted)">
							<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
								<rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
							</svg>
						</span>
						다음 주 예상 판매량
					</h3>
					<div className="flex items-center gap-4 text-xs text-(--text-muted)">
						<span>주간 총 <span className="font-bold text-(--text-h)">{totalForecast}</span>개</span>
						<span>일 평균 <span className="font-bold text-(--text-h)">{avgForecast}</span>개</span>
					</div>
				</div>

				<div className="rounded-xl border border-(--border) bg-(--card) p-5 shadow-[var(--shadow-sm)]">
					<ResponsiveContainer width="100%" height={220}>
						<BarChart data={forecastData} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
							<defs>
								<linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stopColor="#5b9bd5" stopOpacity={0.85} />
									<stop offset="100%" stopColor="#8cc0eb" stopOpacity={0.55} />
								</linearGradient>
								<linearGradient id="barMax" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stopColor="#3d7da8" stopOpacity={0.95} />
									<stop offset="100%" stopColor="#5b9bd5" stopOpacity={0.7} />
								</linearGradient>
								<linearGradient id="barMin" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stopColor="#bfddf0" stopOpacity={0.7} />
									<stop offset="100%" stopColor="#dceef7" stopOpacity={0.5} />
								</linearGradient>
							</defs>
							<CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.4} vertical={false} />
							<XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-muted)', fontWeight: 600 }} axisLine={false} tickLine={false} />
							<YAxis width={38} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
							<Tooltip
								formatter={(value) => [`${value}개`, '예상 판매량']}
								contentStyle={tooltipContent}
								itemStyle={{ color: '#f8fafc' }}
								labelStyle={{ color: '#94a3b8', fontWeight: 700, fontSize: 11 }}
								cursor={{ fill: 'var(--accent-bg)', radius: 6 }}
							/>
							<Bar dataKey="sales" radius={[6, 6, 0, 0]} maxBarSize={44}>
								{forecastData.map((entry) => (
									<Cell
										key={entry.name}
										fill={
											entry.sales === maxSales
												? 'url(#barMax)'
												: entry.sales === minSales
													? 'url(#barMin)'
													: 'url(#barGrad)'
										}
									/>
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
					<div className="mt-3 flex items-center justify-center gap-5 border-t border-(--border) pt-3 text-[11px] text-(--text-muted)">
						<span className="flex items-center gap-1.5">
							<span className="h-2 w-2 rounded-full bg-[#3d7da8]" /> 최고 판매일
						</span>
						<span className="flex items-center gap-1.5">
							<span className="h-2 w-2 rounded-full bg-[#bfddf0]" /> 최저 판매일
						</span>
					</div>
				</div>
			</section>
		</div>
	);
}
