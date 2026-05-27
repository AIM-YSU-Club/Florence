import type { ReactNode, RefObject } from 'react';
import type { Medicine } from '../../../../api';
import { ActionButton, PtStatusBadge } from '../shared';

export function DrugDetailHeader({
	medicine,
	onBack,
	csvInputRef,
	onCsvUpload,
	onOpenCsvUpload,
	onOpenHelp,
	onPretrain,
	uploadStatus,
	trainStatus,
}: {
	medicine: Medicine;
	onBack: () => void;
	csvInputRef: RefObject<HTMLInputElement | null>;
	onCsvUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onOpenCsvUpload: () => void;
	onOpenHelp: () => void;
	onPretrain: () => void;
	uploadStatus: 'idle' | 'loading' | 'success' | 'error';
	trainStatus: 'idle' | 'loading' | 'success' | 'error';
}) {
	return (
		<div className="mb-6 rounded-2xl border border-(--border) bg-(--card) p-6 shadow-(--shadow-sm)">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<button
						type="button"
						onClick={onBack}
						className="flex h-9 w-9 items-center justify-center rounded-lg border border-(--border) bg-(--bg) text-(--text-muted) transition-all hover:bg-(--bg-2) hover:text-(--text)">
						<svg
							width="15"
							height="15"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round">
							<polyline points="15 18 9 12 15 6" />
						</svg>
					</button>
					<div>
						<div className="flex items-center gap-2.5">
							<h2 className="text-2xl font-black tracking-tight text-(--text-h)">
								{medicine.name}
							</h2>
							<span className="rounded-md bg-(--primary)/12 px-2 py-0.5 text-[10px] font-bold tracking-wider text-(--primary)">
								{medicine.atc4 ?? '미분류'}
							</span>
							<PtStatusBadge
								status={medicine.pt_status}
								variant="light"
							/>
						</div>
						<p className="mt-1 text-xs text-(--text-muted)">
							기후 기반 7일 판매 예측
						</p>
					</div>
				</div>
				<div className="flex items-center gap-2.5">
					<input
						ref={csvInputRef}
						type="file"
						accept=".csv"
						onChange={onCsvUpload}
						className="hidden"
					/>
					<ActionButton
						onClick={onOpenCsvUpload}
						disabled={uploadStatus === 'loading'}
						status={uploadStatus}
						labels={{
							idle: 'CSV 업로드',
							loading: '업로드 중...',
							success: '✓ 업로드 완료',
							error: '업로드 실패',
						}}
						icon={<UploadIcon />}
						variant="secondary"
					/>
					<button
						type="button"
						onClick={onOpenHelp}
						className="flex h-9 w-9 items-center justify-center rounded-full border border-(--border) bg-(--card) text-(--text-muted) transition-all hover:bg-(--bg-2) hover:text-(--text)"
						aria-label="CSV 업로드 도움말 다시 보기"
						title="CSV 업로드 도움말">
						<HelpIcon />
					</button>
					<ActionButton
						onClick={onPretrain}
						disabled={trainStatus === 'loading'}
						status={trainStatus}
						labels={{
							idle: '모델 학습',
							loading: '학습 중...',
							success: '✓ 학습 완료',
							error: '학습 실패',
						}}
						icon={<TrainIcon />}
						variant="primary"
					/>
				</div>
			</div>
		</div>
	);
}

function UploadIcon(): ReactNode {
	return (
		<svg
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
			<polyline points="17 8 12 3 7 8" />
			<line x1="12" y1="3" x2="12" y2="15" />
		</svg>
	);
}

function HelpIcon(): ReactNode {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<circle cx="12" cy="12" r="9" />
			<path d="M9.09 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3" />
			<line x1="12" y1="17" x2="12.01" y2="17" />
		</svg>
	);
}

function TrainIcon(): ReactNode {
	return (
		<svg
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
			<polyline points="22 4 12 14.01 9 11.01" />
		</svg>
	);
}
