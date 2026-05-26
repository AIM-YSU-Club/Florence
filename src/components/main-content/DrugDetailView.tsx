import { useEffect, useRef, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import * as api from '../../api';
import type { Medicine, Predict7dRes } from '../../api';
import { dayLabels } from './constants';
import { ActionButton, PtStatusBadge } from './shared';
import { tooltipStyle } from './utils';

// 선택한 약품의 7일 예측, CSV 업로드, 모델 학습 액션을 담당한다.
export function DrugDetailView({ medicine, onBack }: { medicine: Medicine; onBack: () => void }) {
	const [data, setData] = useState<Predict7dRes | null>(null);
	const [loading, setLoading] = useState(true);
	const [trainStatus, setTrainStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
		medicine.pt_status === 'TRAINING' ? 'loading' : medicine.pt_status === 'DONE' ? 'success' : 'idle',
	);

	const [uploadStatus, setUploadStatus] = useState<
		'idle' | 'loading' | 'success' | 'error'
	>('idle');

	const [showCsvUploadHelpModal, setShowCsvUploadHelpModal] = useState(false);
	const [doNotShowCsvHelpAgain, setDoNotShowCsvHelpAgain] = useState(
		localStorage.getItem(CSV_UPLOAD_HELP_DISMISSED_KEY) === 'true',
	);

	const csvInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		let cancelled = false;

		const run = async () => {
			try {
				const prediction = await api.predictNext7d(medicine.medicine_id);
				if (!cancelled) setData(prediction);
			} catch {
				if (!cancelled) setData(null);
			} finally {
				if (!cancelled) setLoading(false);
			}
		};

		void run();

		return () => {
			cancelled = true;
		};
	}, [medicine.medicine_id]);

	// 선택된 약품의 사전학습을 요청하고 결과 상태를 버튼에 반영한다.
	const handlePretrain = async () => {
		setTrainStatus('loading');
		try {
			await api.pretrain(medicine.medicine_id);
			setTrainStatus('success');
			setTimeout(() => {
				setLoading(true);
				api
					.predictNext7d(medicine.medicine_id)
					.then(setData)
					.catch(() => setData(null))
					.finally(() => setLoading(false));
				setTrainStatus('idle');
			}, 3000);
		} catch {
			setTrainStatus('error');
			setTimeout(() => setTrainStatus('idle'), 3000);
		}
	};

	// CSV 판매 데이터를 업로드하고 입력 필드를 원상복구한다.
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

	// 도움말 확인 후 기존 hidden file input을 열어 업로드 흐름을 이어간다.
	const handleConfirmCsvHelp = () => {
		if (doNotShowCsvHelpAgain) {
			localStorage.setItem(CSV_UPLOAD_HELP_DISMISSED_KEY, 'true');
		} else {
			localStorage.removeItem(CSV_UPLOAD_HELP_DISMISSED_KEY);
		}
		setShowCsvUploadHelpModal(false);
		csvInputRef.current?.click();
	};

	const handleOpenCsvUpload = () => {
		if (doNotShowCsvHelpAgain) {
			csvInputRef.current?.click();
			return;
		}
		setShowCsvUploadHelpModal(true);
	};

	if (loading)
		return (
			<p className="py-20 text-center text-sm text-(--text-muted)">
				데이터를 불러오는 중...
			</p>
		);

	const climateCharts = data
		? [
				{ key: 'ta', label: '평균 기온', unit: '°C', color: '#5b9bd5', data: data.ta_7d },
				{ key: 'hm', label: '평균 습도', unit: '%', color: '#6ba5c7', data: data.hm_7d },
				{ key: 'rn', label: '강수량', unit: 'mm', color: '#6ba589', data: data.rn_7d },
			]
		: [];

	return (
		<div>
			<div className="mb-6 rounded-2xl border border-(--border) bg-(--card) p-6 shadow-(--shadow-sm)">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<button
							type="button"
							onClick={onBack}
							className="flex h-9 w-9 items-center justify-center rounded-lg border border-(--border) bg-(--bg) text-(--text-muted) transition-all hover:bg-(--bg-2) hover:text-(--text)"
						>
							<svg
								width="15"
								height="15"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<polyline points="15 18 9 12 15 6" />
							</svg>
						</button>
						<div>
							<div className="flex items-center gap-2.5">
								<h2 className="text-2xl font-black tracking-tight text-(--text-h)">{medicine.name}</h2>
								<span className="rounded-md bg-(--primary)/12 px-2 py-0.5 text-[10px] font-bold tracking-wider text-(--primary)">
									{medicine.atc4 ?? '미분류'}
								</span>
								<PtStatusBadge status={medicine.pt_status} variant="light" />
							</div>
							<p className="mt-1 text-xs text-(--text-muted)">기후 기반 7일 판매 예측</p>
						</div>
					</div>
					<div className="flex items-center gap-2.5">
						<input
							ref={csvInputRef}
							type="file"
							accept=".csv"
							onChange={handleCsvUpload}
							className="hidden"
						/>
						<ActionButton
							onClick={handleOpenCsvUpload}
							disabled={uploadStatus === 'loading'}
							status={uploadStatus}
							labels={{ idle: 'CSV 업로드', loading: '업로드 중...', success: '✓ 업로드 완료', error: '업로드 실패' }}
							icon={
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
									<polyline points="17 8 12 3 7 8" />
									<line x1="12" y1="3" x2="12" y2="15" />
								</svg>
							}
							variant="secondary"
						/>
						<button
							type="button"
							onClick={() => setShowCsvUploadHelpModal(true)}
							className="flex h-9 w-9 items-center justify-center rounded-full border border-(--border) bg-(--card) text-(--text-muted) transition-all hover:bg-(--bg-2) hover:text-(--text)"
							aria-label="CSV 업로드 도움말 다시 보기"
							title="CSV 업로드 도움말"
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<circle cx="12" cy="12" r="9" />
								<path d="M9.09 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3" />
								<line x1="12" y1="17" x2="12.01" y2="17" />
							</svg>
						</button>
						<ActionButton
							onClick={handlePretrain}
							disabled={trainStatus === 'loading'}
							status={trainStatus}
							labels={{ idle: '모델 학습', loading: '학습 중...', success: '✓ 학습 완료', error: '학습 실패' }}
							icon={
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
									<polyline points="22 4 12 14.01 9 11.01" />
								</svg>
							}
							variant="primary"
						/>
					</div>
				</div>

				{data && (
					<div className="mt-5 flex items-center gap-6 rounded-xl bg-gradient-to-r from-(--primary)/8 to-(--secondary)/5 px-5 py-4">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-(--primary)/15 text-(--primary)">
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
								</svg>
							</div>
							<div>
								<p className="text-[11px] font-semibold text-(--text-muted)">7일 예상 판매량</p>
								<p className="text-xl font-black text-(--primary)">
									{Math.round(data.predicted_value).toLocaleString()}
									<span className="ml-1 text-xs font-semibold text-(--text-muted)">건</span>
								</p>
							</div>
						</div>
						<div className="h-8 w-px bg-(--border)" />
						<div>
							<p className="text-[11px] font-semibold text-(--text-muted)">평균 판매량</p>
							<p className="text-xl font-black text-(--text-h)">
								{Math.round(data.mean_value).toLocaleString()}
								<span className="ml-1 text-xs font-semibold text-(--text-muted)">건</span>
							</p>
						</div>
						<div className="h-8 w-px bg-(--border)" />
						<div>
							<p className="text-[11px] font-semibold text-(--text-muted)">평균 대비 증감률</p>
							<p className={`text-xl font-black ${data.growth_rate >= 0 ? 'text-rose-500' : 'text-blue-500'}`}>
								{data.growth_rate >= 0 ? '+' : ''}
								{data.growth_rate.toFixed(1)}
								<span className="ml-0.5 text-xs font-semibold opacity-60">%</span>
							</p>
						</div>
					</div>
				)}
			</div>

			{!data ? (
				<div className="rounded-2xl border border-(--border) bg-(--card) p-12 text-center shadow-(--shadow-sm)">
					<div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-(--bg-2)/50 text-(--text-muted)">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
							<polyline points="17 8 12 3 7 8" />
							<line x1="12" y1="3" x2="12" y2="15" />
						</svg>
					</div>
					<p className="text-sm font-semibold text-(--text-h)">예측 데이터가 없습니다</p>
					<p className="mt-1 text-xs text-(--text-muted)">판매 데이터(CSV)를 업로드하고 사전학습을 실행하세요.</p>
				</div>
			) : (
				<section>
					<h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-(--text-h)">
						<span className="flex h-5 w-5 items-center justify-center rounded bg-(--primary)/12 text-(--primary)">
							<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
								<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
							</svg>
						</span>
						지난 7일간 기후 추이
					</h3>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
						{climateCharts.map((chart) => {
							const latest = chart.data[chart.data.length - 1];
							return (
								<div key={chart.key} className="rounded-xl border border-(--border) bg-(--card) p-4 shadow-(--shadow-sm)">
									<div className="mb-3 flex items-center justify-between">
										<p className="text-xs font-bold text-(--text)">
											{chart.label} <span className="text-(--text-muted)">({chart.unit})</span>
										</p>
										<p className="text-lg font-black" style={{ color: chart.color }}>
											{latest}
											<span className="ml-0.5 text-[10px] font-semibold opacity-60">{chart.unit}</span>
										</p>
									</div>
									<ResponsiveContainer width="100%" height={150}>
										<AreaChart
											data={chart.data.map((value, index) => ({ name: dayLabels[index], value }))}
											margin={{ top: 4, right: 8, left: -14, bottom: 0 }}
										>
											<defs>
												<linearGradient id={`dg7-${chart.key}`} x1="0" y1="0" x2="0" y2="1">
													<stop offset="0%" stopColor={chart.color} stopOpacity={0.2} />
													<stop offset="100%" stopColor={chart.color} stopOpacity={0.01} />
												</linearGradient>
											</defs>
											<CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.4} />
											<XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
											<YAxis width={38} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
											<Tooltip
												formatter={(value) => [`${value} ${chart.unit}`, chart.label]}
												contentStyle={tooltipStyle}
												itemStyle={{ color: '#f8fafc' }}
												labelStyle={{ color: '#94a3b8', fontWeight: 700, fontSize: 11 }}
											/>
											<Area
												type="monotone"
												dataKey="value"
												stroke={chart.color}
												strokeWidth={2}
												fill={`url(#dg7-${chart.key})`}
												dot={{ r: 2.5, fill: chart.color, strokeWidth: 0 }}
												activeDot={{ r: 5, stroke: chart.color, strokeWidth: 2, fill: 'white' }}
											/>
										</AreaChart>
									</ResponsiveContainer>
								</div>
							);
						})}
					</div>
				</section>
			)}

			{showCsvUploadHelpModal && (
				<CsvUploadHelpMessageModal
					onClose={() => setShowCsvUploadHelpModal(false)}
					onConfirm={handleConfirmCsvHelp}
					doNotShowAgain={doNotShowCsvHelpAgain}
					onDoNotShowAgainChange={setDoNotShowCsvHelpAgain}
				/>
			)}
		</div>
	);
}
