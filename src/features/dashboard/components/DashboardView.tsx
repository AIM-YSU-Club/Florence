import { useEffect, useState } from 'react';
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import * as api from '../../../api';
import type { Predict4wRes } from '../../../api';
import { atcOptions, weekLabels } from './constants';
import { StatCard } from './shared';
import { formatNumber, tooltipStyle } from './utils';

// ATC 코드별 4주 예측과 기후 추이를 보여주는 메인 대시보드다.
export function DashboardView() {
	const [selectedAtc, setSelectedAtc] = useState<string[]>(['N02BE']);
	const [selectedGroup, setSelectedGroup] = useState<string>('all');
	const [results, setResults] = useState<Record<string, Predict4wRes>>({});
	const [loading, setLoading] = useState(!api.isNotLoggedIn());
	const [hasServerError, setHasServerError] = useState(false);

	const groups = [
		'all',
		...Array.from(new Set(atcOptions.map((atc) => atc.group))),
	];
	const filteredAtc =
		selectedGroup === 'all'
			? atcOptions
			: atcOptions.filter((atc) => atc.group === selectedGroup);

	// 선택한 ATC 코드를 토글해 비교 대상을 관리한다.
	const toggleAtc = (code: string) => {
		setSelectedAtc((prev) => {
			const next = prev.includes(code)
				? prev.filter((selectedCode) => selectedCode !== code)
				: [...prev, code];
			setLoading(next.length > 0 && !api.isNotLoggedIn());
			setHasServerError(false);
			return next;
		});
	};

	useEffect(() => {
		if (api.isNotLoggedIn() || !selectedAtc.length) return;

		let cancelled = false;

		const run = async () => {
			setHasServerError(false);

			try {
				const entries = await Promise.all(
					selectedAtc.map(async (code) => {
						try {
							const data = await api.predictNext4w(code);
							return [code, data] as const;
						} catch (error) {
							if (!cancelled) {
								console.error(
									`predictNext4w failed for ${code}`,
									error,
								);
								setHasServerError(true);
							}
							return null;
						}
					}),
				);

				if (cancelled) return;

				const nextResults: Record<string, Predict4wRes> = {};
				for (const entry of entries) {
					if (entry) nextResults[entry[0]] = entry[1];
				}
				setResults(nextResults);
			} finally {
				if (!cancelled) setLoading(false);
			}
		};

		void run();

		return () => {
			cancelled = true;
		};
	}, [selectedAtc]);

	if (api.isNotLoggedIn()) {
		return (
			<div>
				<div className="mb-6">
					<h2 className="text-2xl font-black tracking-tight text-(--text-h)">
						메인 대시보드
					</h2>
					<p className="mt-1 text-sm text-(--text-muted)">
						로그인 후 ATC 분류 코드별 향후 4주 수요 예측을 확인할 수
						있습니다.
					</p>
				</div>
				<div className="rounded-2xl border border-(--border) bg-(--card) p-12 text-center shadow-(--shadow-sm)">
					<p className="text-sm font-semibold text-(--text-h)">
						예측 데이터는 로그인 후 조회할 수 있습니다.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div>
			<div className="mb-6">
				<h2 className="text-2xl font-black tracking-tight text-(--text-h)">
					메인 대시보드
				</h2>
				<p className="mt-1 text-sm text-(--text-muted)">
					ATC 분류 코드별 향후 4주간 수요 예측을 확인합니다.
				</p>
			</div>

			<div className="mb-8 rounded-2xl border border-(--border) bg-(--card) p-5 shadow-(--shadow-sm)">
				<p className="mb-3 text-xs font-bold tracking-wider text-(--text-muted) uppercase">
					분류 필터
				</p>
				<div className="mb-3 flex flex-wrap gap-2">
					{groups.map((group) => (
						<button
							key={group}
							type="button"
							onClick={() => setSelectedGroup(group)}
							className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-all ${
								selectedGroup === group
									? 'bg-(--primary) text-white shadow-sm'
									: 'bg-(--bg) text-(--text-muted) hover:text-(--text)'
							}`}>
							{group === 'all' ? '전체' : group}
						</button>
					))}
				</div>
				<div className="flex flex-wrap gap-2">
					{filteredAtc.map((atc) => {
						const isSelected = selectedAtc.includes(atc.code);
						return (
							<button
								key={atc.code}
								type="button"
								onClick={() => toggleAtc(atc.code)}
								className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[12px] font-medium transition-all ${
									isSelected
										? 'border-(--primary) bg-(--primary)/10 text-(--primary)'
										: 'border-(--border) text-(--text-muted) hover:border-(--primary)/40'
								}`}>
								<span
									className={`flex h-4 w-4 items-center justify-center rounded border text-[10px] ${
										isSelected
											? 'border-(--primary) bg-(--primary) text-white'
											: 'border-(--border)'
									}`}>
									{isSelected && '✓'}
								</span>
								<span className="font-bold">{atc.code}</span>
								<span className="text-(--text-muted)">
									{atc.label}
								</span>
							</button>
						);
					})}
				</div>
			</div>

			{loading && (
				<p className="py-12 text-center text-sm text-(--text-muted)">
					예측 데이터를 불러오는 중...
				</p>
			)}

			{!loading && hasServerError && (
				<div className="mb-8 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-(--shadow-sm)">
					일부 예측 데이터를 불러오지 못했습니다. 현재 서버에서 `500
					Internal Server Error` 를 반환하고 있을 가능성이 큽니다.
				</div>
			)}

			{!loading &&
				selectedAtc.map((code) => {
					const result = results[code];
					if (!result) return null;

					const atcInfo = atcOptions.find((atc) => atc.code === code);
					const climateCharts = [
						{
							key: 'ta',
							label: '평균 기온',
							unit: '°C',
							color: '#5b9bd5',
							data: result.ta_4w,
						},
						{
							key: 'hm',
							label: '평균 습도',
							unit: '%',
							color: '#6ba5c7',
							data: result.hm_4w,
						},
						{
							key: 'rn',
							label: '강수량',
							unit: 'mm',
							color: '#6ba589',
							data: result.rn_4w,
						},
					];

					return (
						<div
							key={code}
							className="mb-10 rounded-2xl border border-(--border) bg-(--card) p-6 shadow-(--shadow-sm)">
							<div className="mb-5 flex items-center justify-between">
								<div className="flex items-center gap-3">
									<span className="rounded-lg bg-(--primary)/12 px-2.5 py-1 text-xs font-bold tracking-wide text-(--primary)">
										{code}
									</span>
									<h3 className="text-lg font-bold text-(--text-h)">
										{atcInfo?.label ?? code}
									</h3>
									<span className="text-xs text-(--text-muted)">
										{atcInfo?.group}
									</span>
								</div>
							</div>

							<div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
								<StatCard
									label="예상 사용량 (4주)"
									value={formatNumber(result.predicted_value)}
									unit="건"
									accent
								/>
								<StatCard
									label="3년 평균 사용량"
									value={formatNumber(result.mean_value)}
									unit="건"
								/>
								<StatCard
									label="평균 대비 증감률"
									value={`${result.growth_rate >= 0 ? '+' : ''}${result.growth_rate.toFixed(1)}`}
									unit="%"
									delta={result.growth_rate}
								/>
							</div>

							<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
								{climateCharts.map((chart) => {
									const latest =
										chart.data[chart.data.length - 1];
									return (
										<div
											key={chart.key}
											className="rounded-xl border border-(--border) bg-(--bg) p-4">
											<div className="mb-3 flex items-center justify-between">
												<p className="text-xs font-bold text-(--text)">
													{chart.label}{' '}
													<span className="text-(--text-muted)">
														({chart.unit})
													</span>
												</p>
												<p
													className="text-lg font-black"
													style={{
														color: chart.color,
													}}>
													{latest}
													<span className="ml-0.5 text-[10px] font-semibold opacity-60">
														{chart.unit}
													</span>
												</p>
											</div>
											<ResponsiveContainer
												width="100%"
												height={140}>
												<AreaChart
													data={chart.data.map(
														(value, index) => ({
															name: weekLabels[
																index
															],
															value,
														}),
													)}
													margin={{
														top: 4,
														right: 8,
														left: -14,
														bottom: 0,
													}}>
													<defs>
														<linearGradient
															id={`dg-${code}-${chart.key}`}
															x1="0"
															y1="0"
															x2="0"
															y2="1">
															<stop
																offset="0%"
																stopColor={
																	chart.color
																}
																stopOpacity={
																	0.2
																}
															/>
															<stop
																offset="100%"
																stopColor={
																	chart.color
																}
																stopOpacity={
																	0.01
																}
															/>
														</linearGradient>
													</defs>
													<CartesianGrid
														strokeDasharray="3 3"
														stroke="var(--border)"
														strokeOpacity={0.4}
													/>
													<XAxis
														dataKey="name"
														tick={{
															fontSize: 10,
															fill: 'var(--text-muted)',
														}}
														axisLine={false}
														tickLine={false}
													/>
													<YAxis
														width={38}
														tick={{
															fontSize: 10,
															fill: 'var(--text-muted)',
														}}
														axisLine={false}
														tickLine={false}
													/>
													<Tooltip
														formatter={(value) => [
															`${value} ${chart.unit}`,
															chart.label,
														]}
														contentStyle={
															tooltipStyle
														}
														itemStyle={{
															color: '#f8fafc',
														}}
														labelStyle={{
															color: '#94a3b8',
															fontWeight: 700,
															fontSize: 11,
														}}
													/>
													<Area
														type="monotone"
														dataKey="value"
														stroke={chart.color}
														strokeWidth={2}
														fill={`url(#dg-${code}-${chart.key})`}
														dot={{
															r: 3,
															fill: chart.color,
															strokeWidth: 0,
														}}
														activeDot={{
															r: 5,
															stroke: chart.color,
															strokeWidth: 2,
															fill: 'white',
														}}
													/>
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
				<p className="py-16 text-center text-sm text-(--text-muted)">
					위 필터에서 ATC 코드를 선택하세요.
				</p>
			)}

			{!loading &&
				!hasServerError &&
				selectedAtc.length > 0 &&
				Object.keys(results).length === 0 && (
					<p className="py-16 text-center text-sm text-(--text-muted)">
						표시할 예측 데이터가 없습니다.
					</p>
				)}
		</div>
	);
}
