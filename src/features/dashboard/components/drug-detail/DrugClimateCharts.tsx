import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import { dayLabels } from '../constants';
import { tooltipStyle } from '../utils';
import type { DrugChart } from './types';

export function DrugClimateCharts({ charts }: { charts: DrugChart[] }) {
	return (
		<section>
			<h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-(--text-h)">
				<span className="flex h-5 w-5 items-center justify-center rounded bg-(--primary)/12 text-(--primary)">
					<svg
						width="11"
						height="11"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.5"
						strokeLinecap="round"
						strokeLinejoin="round">
						<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
					</svg>
				</span>
				지난 7일간 기후 추이
			</h3>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				{charts.map((chart) => {
					const latest = chart.data[chart.data.length - 1];
					return (
						<div
							key={chart.key}
							className="rounded-xl border border-(--border) bg-(--card) p-4 shadow-(--shadow-sm)">
							<div className="mb-3 flex items-center justify-between">
								<p className="text-xs font-bold text-(--text)">
									{chart.label}{' '}
									<span className="text-(--text-muted)">
										({chart.unit})
									</span>
								</p>
								<p
									className="text-lg font-black"
									style={{ color: chart.color }}>
									{latest}
									<span className="ml-0.5 text-[10px] font-semibold opacity-60">
										{chart.unit}
									</span>
								</p>
							</div>
							<ResponsiveContainer width="100%" height={150}>
								<AreaChart
									data={chart.data.map((value, index) => ({
										name: dayLabels[index],
										value,
									}))}
									margin={{
										top: 4,
										right: 8,
										left: -14,
										bottom: 0,
									}}>
									<defs>
										<linearGradient
											id={`dg7-${chart.key}`}
											x1="0"
											y1="0"
											x2="0"
											y2="1">
											<stop
												offset="0%"
												stopColor={chart.color}
												stopOpacity={0.2}
											/>
											<stop
												offset="100%"
												stopColor={chart.color}
												stopOpacity={0.01}
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
										contentStyle={tooltipStyle}
										itemStyle={{ color: '#f8fafc' }}
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
										fill={`url(#dg7-${chart.key})`}
										dot={{
											r: 2.5,
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
		</section>
	);
}
