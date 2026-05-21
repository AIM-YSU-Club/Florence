import {
	CartesianGrid,
	Line,
	LineChart,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

const labels = ['3주 전', '2주 전', '1주 전', '어제'];

const chartGroups = [
	{
		key: 'ta',
		label: '지난 4주간 평균 기온',
		unit: '섭씨',
		color: 'var(--primary)',
		data: [14.4, 14.1, 15.1, 19.4],
	},
	{
		key: 'hm',
		label: '지난 4주간 평균 습도',
		unit: '%',
		color: 'var(--secondary)',
		data: [52.2, 68.4, 59, 70.5],
	},
	{
		key: 'rn',
		label: '지난 4주간 평균 강수량',
		unit: 'mm',
		color: 'var(--tertiary)',
		data: [0, 1.65, 0.57, 1.14],
	},
];

const chartData = chartGroups.map((group) => ({
	...group,
	points: labels.map((name, index) => ({
		name,
		value: group.data[index],
	})),
}));

export default function Charts01() {
	return (
		<div
			style={{
				display: 'flex',
				flexWrap: 'wrap',
				justifyContent: 'center',
				gap: '16px',
				width: '100%',
			}}
			className="mr-6 font-mono"
		>
			{chartData.map((chart) => (
				<div
					key={chart.key}
					style={{
						flex: '0 1 28%',
						minWidth: '240px',
						maxWidth: '320px',
						minHeight: '220px',
					}}
				>
					<h3
						style={{
							marginBottom: '8px',
							fontSize: '0.9rem',
							fontWeight: 700,
							lineHeight: 1.4,
							textAlign: 'center',
						}}
					>
						{chart.label} ({chart.unit})
					</h3>
					<LineChart
						style={{
							width: '100%',
							height: '100%',
							maxHeight: '240px',
							aspectRatio: 1.2,
						}}
						responsive
						data={chart.points}
						margin={{ top: 5, right: 8, left: 0, bottom: 0 }}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="name" tick={{ fontSize: 11 }} />
						<YAxis width={36} tick={{ fontSize: 11 }} />
						<Tooltip
							formatter={(value) => [
								`${value ?? ''} ${chart.unit}`,
								chart.label,
							]}
							contentStyle={{
								backgroundColor: '#1f2937',
								border: '1px solid #374151',
								borderRadius: '8px',
								color: '#f9fafb',
							}}
							itemStyle={{ color: '#f9fafb' }}
							labelStyle={{ color: '#93c5fd', fontWeight: 700 }}
							cursor={{ stroke: chart.color, strokeWidth: 1 }}
						/>

						<Line
							type="monotone"
							dataKey="value"
							name={chart.label}
							stroke={chart.color}
							strokeWidth={2}
							dot={{ r: 3 }}
						/>
					</LineChart>
				</div>
			))}
		</div>
	);
}
