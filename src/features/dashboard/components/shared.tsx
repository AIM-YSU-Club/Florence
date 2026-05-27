import type { ReactNode } from 'react';
import { statusConfig, statusConfigLight } from './constants';

// 대시보드와 상세 화면에서 공통으로 쓰는 요약 수치 카드다.
export function StatCard({
	label,
	value,
	unit,
	delta,
	accent,
}: {
	label: string;
	value: string;
	unit: string;
	delta?: number;
	accent?: boolean;
}) {
	return (
		<div
			className={`rounded-xl border px-4 py-4 ${accent ? 'border-(--primary)/30 bg-linear-to-br from-(--primary)/5 to-(--secondary)/5' : 'border-(--border) bg-(--bg)'}`}>
			<p className="text-[11px] font-semibold text-(--text-muted)">
				{label}
			</p>
			<p className="mt-2 flex items-baseline gap-1">
				<span
					className={`text-2xl font-black ${
						delta !== undefined
							? delta >= 0
								? 'text-rose-500'
								: 'text-blue-500'
							: accent
								? 'text-(--primary)'
								: 'text-(--text-h)'
					}`}>
					{value}
				</span>
				<span className="text-xs font-medium text-(--text-muted)">
					{unit}
				</span>
			</p>
		</div>
	);
}

// 모델 학습 상태를 일관된 배지 스타일로 표현한다.
export function PtStatusBadge({
	status,
	variant = 'dark',
}: {
	status: keyof typeof statusConfig;
	variant?: 'dark' | 'light';
}) {
	const cfg =
		variant === 'dark' ? statusConfig[status] : statusConfigLight[status];
	return (
		<span
			className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${cfg.bg} ${cfg.text} ${variant === 'dark' ? 'backdrop-blur-sm' : ''}`}>
			<span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
			{cfg.label}
		</span>
	);
}

// 업로드/학습 버튼처럼 상태에 따라 라벨과 스타일이 바뀌는 액션 버튼이다.
export function ActionButton({
	onClick,
	disabled,
	status,
	labels,
	icon,
	variant,
}: {
	onClick: () => void;
	disabled: boolean;
	status: 'idle' | 'loading' | 'success' | 'error';
	labels: { idle: string; loading: string; success: string; error: string };
	icon: ReactNode;
	variant: 'primary' | 'secondary';
}) {
	const base =
		status === 'success'
			? 'bg-emerald-500 text-white'
			: status === 'error'
				? 'bg-rose-500 text-white'
				: status === 'loading'
					? 'bg-(--bg-2) text-(--text-muted)'
					: variant === 'primary'
						? 'bg-(--primary) text-white shadow-(--shadow-sm) hover:shadow-(--shadow)'
						: 'border border-(--border) bg-(--card) text-(--text) shadow-(--shadow-sm) hover:bg-(--bg-2)';

	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-bold transition-all ${base}`}>
			{status === 'loading' ? (
				<svg
					className="animate-spin"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2.5"
					strokeLinecap="round">
					<path d="M21 12a9 9 0 1 1-6.219-8.56" />
				</svg>
			) : status === 'idle' ? (
				icon
			) : null}
			{labels[status]}
		</button>
	);
}

// 약국 정보 폼에서 재사용하는 기본 텍스트 입력 필드다.
export function FormField({
	id,
	label,
	value,
	onChange,
}: {
	id: string;
	label: string;
	value: string;
	onChange: (v: string) => void;
}) {
	return (
		<div className="flex flex-col gap-1.5">
			<label
				htmlFor={id}
				className="text-[11px] font-bold tracking-wider text-(--text-muted) uppercase">
				{label}
			</label>
			<input
				id={id}
				type="text"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="rounded-lg border border-(--border) bg-(--bg) px-3.5 py-2.5 text-sm font-medium text-(--text-h) transition-all outline-none focus:border-(--primary) focus:shadow-[0_0_0_3px_var(--accent-bg)]"
			/>
		</div>
	);
}
