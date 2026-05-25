import { useEffect, useState } from 'react';
import * as api from '../../api';
import type { Predict4wRes } from '../../api';
import { atcOptions, weekLabels } from './constants';
import { StatCard } from './shared';
import { formatNumber, tooltipStyle } from './utils';

// ATC 코드별 4주 예측과 기후 추이를 보여주는 메인 대시보드다.
export function DashboardView() {
	const [selectedAtc, setSelectedAtc] = useState<string[]>(['N02BE']);
	const [selectedGroup, setSelectedGroup] = useState<string>('all');
	const [results, setResults] = useState<Record<string, Predict4wRes>>({});
	const [loading, setLoading] = useState(true);


	// 선택한 ATC 코드를 토글해 비교 대상을 관리한다.
	const toggleAtc = (code: string) => {
		setSelectedAtc((prev) => {
			setLoading(next.length > 0);
			return next;
		});
	};

	useEffect(() => {
		if (!selectedAtc.length) return;

		let cancelled = false;

		const run = async () => {
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

				if (cancelled) return;

				const map: Record<string, Predict4wRes> = {};
				for (const entry of entries) {
					if (entry) map[entry[0]] = entry[1];
				}
				setResults(map);
			} finally {
				if (!cancelled) setLoading(false);
			}
		};

		void run();

		return () => {
			cancelled = true;
		};
	}, [selectedAtc]);

	return (
		<div>
			<div className="mb-6">
			</div>

			<div className="mb-8 rounded-2xl border border-(--border) bg-(--card) p-5 shadow-(--shadow-sm)">
				<div className="mb-3 flex flex-wrap gap-2">
					{groups.map((group) => (
						<button
							key={group}
							type="button"
							onClick={() => setSelectedGroup(group)}
							className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-all ${selectedGroup === group ? 'bg-(--primary) text-white shadow-sm' : 'bg-(--bg) text-(--text-muted) hover:text-(--text)'}`}
						>
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
								className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[12px] font-medium transition-all ${isSelected ? 'border-(--primary) bg-(--primary)/10 text-(--primary)' : 'border-(--border) text-(--text-muted) hover:border-(--primary)/40'}`}
							>
								<span
									className={`flex h-4 w-4 items-center justify-center rounded border text-[10px] ${isSelected ? 'border-(--primary) bg-(--primary) text-white' : 'border-(--border)'}`}
								>
									{isSelected && '✓'}
								</span>
								<span className="font-bold">{atc.code}</span>
							</button>
						);
					})}
				</div>
			</div>


			{!loading &&
				selectedAtc.map((code) => {
					const result = results[code];
					if (!result) return null;

					const atcInfo = atcOptions.find((a) => a.code === code);
					const climateCharts = [
					];

					return (
							<div className="mb-5 flex items-center justify-between">
								<div className="flex items-center gap-3">
								</div>
							</div>

							<div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
								<StatCard
									label="평균 대비 증감률"
									value={`${result.growth_rate >= 0 ? '+' : ''}${result.growth_rate.toFixed(1)}`}
									unit="%"
									delta={result.growth_rate}
								/>
							</div>

							<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
								{climateCharts.map((chart) => {
									return (
											<div className="mb-3 flex items-center justify-between">
												<p className="text-xs font-bold text-(--text)">
												</p>
													{latest}
												</p>
											</div>
												<AreaChart
												>
													<defs>
														</linearGradient>
													</defs>
													<Tooltip
													/>
													<Area
														type="monotone"
														dataKey="value"
														stroke={chart.color}
														strokeWidth={2}
														fill={`url(#dg-${code}-${chart.key})`}
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

		</div>
	);
}
