import type { Predict7dRes } from '../../../../api';

export function DrugPredictionSummary({ data }: { data: Predict7dRes }) {
	return (
		<div className="mt-5 flex items-center gap-6 rounded-xl bg-linear-to-r from-(--primary)/8 to-(--secondary)/5 px-5 py-4">
			<div className="flex items-center gap-3">
				<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-(--primary)/15 text-(--primary)">
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round">
						<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
					</svg>
				</div>
				<div>
					<p className="text-[11px] font-semibold text-(--text-muted)">
						7일 예상 판매량
					</p>
					<p className="text-xl font-black text-(--primary)">
						{Math.round(data.predicted_value).toLocaleString()}
						<span className="ml-1 text-xs font-semibold text-(--text-muted)">
							건
						</span>
					</p>
				</div>
			</div>
			<div className="h-8 w-px bg-(--border)" />
			<div>
				<p className="text-[11px] font-semibold text-(--text-muted)">
					평균 판매량
				</p>
				<p className="text-xl font-black text-(--text-h)">
					{Math.round(data.mean_value).toLocaleString()}
					<span className="ml-1 text-xs font-semibold text-(--text-muted)">
						건
					</span>
				</p>
			</div>
			<div className="h-8 w-px bg-(--border)" />
			<div>
				<p className="text-[11px] font-semibold text-(--text-muted)">
					평균 대비 증감률
				</p>
				<p
					className={`text-xl font-black ${data.growth_rate >= 0 ? 'text-rose-500' : 'text-blue-500'}`}>
					{data.growth_rate >= 0 ? '+' : ''}
					{data.growth_rate.toFixed(1)}
					<span className="ml-0.5 text-xs font-semibold opacity-60">
						%
					</span>
				</p>
			</div>
		</div>
	);
}
