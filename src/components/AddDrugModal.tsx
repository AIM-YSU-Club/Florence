import { useState, useRef } from 'react';

interface AddDrugModalProps {
	onClose: () => void;
	onSubmit: (name: string, file: File) => void;
}

export const AddDrugModal = ({ onClose, onSubmit }: AddDrugModalProps) => {
	const [name, setName] = useState('');
	const [file, setFile] = useState<File | null>(null);
	const [dragOver, setDragOver] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleSubmit = () => {
		if (!name.trim() || !file) return;
		onSubmit(name.trim(), file);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setDragOver(false);
		const dropped = e.dataTransfer.files[0];
		if (dropped?.name.endsWith('.csv')) setFile(dropped);
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[6px]"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div className="w-full max-w-md animate-[fadeIn_0.15s_ease-out] rounded-2xl border border-(--border) bg-(--card) p-7 shadow-[var(--shadow-lg)]">
				<div className="mb-6 flex items-center justify-between">
					<h3 className="text-lg font-black text-(--text-h)">
						새 약품 추가
					</h3>
					<button
						type="button"
						onClick={onClose}
						className="flex h-8 w-8 items-center justify-center rounded-lg text-(--text-muted) transition-colors hover:bg-(--bg-2) hover:text-(--text)"
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
						>
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
				</div>

				<div className="flex flex-col gap-5">
					<div className="flex flex-col gap-2">
						<label
							htmlFor="drug-name"
							className="text-xs font-bold tracking-wide text-(--text-muted) uppercase"
						>
							약품명
						</label>
						<input
							id="drug-name"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="예: 타이레놀, 판콜에이"
							className="rounded-xl border border-(--border) bg-(--bg) px-4 py-3 text-sm font-medium text-(--text-h) outline-none transition-all placeholder:text-(--text-muted) focus:border-(--primary) focus:shadow-[0_0_0_3px_var(--accent-bg)]"
						/>
					</div>

					<div className="flex flex-col gap-2">
						<label
							htmlFor="csv-upload"
							className="text-xs font-bold tracking-wide text-(--text-muted) uppercase"
						>
							판매 데이터 (CSV)
						</label>
						<input
							ref={fileInputRef}
							id="csv-upload"
							type="file"
							accept=".csv"
							onChange={(e) =>
								setFile(e.target.files?.[0] ?? null)
							}
							className="hidden"
						/>
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							onDragOver={(e) => {
								e.preventDefault();
								setDragOver(true);
							}}
							onDragLeave={() => setDragOver(false)}
							onDrop={handleDrop}
							className={`flex flex-col items-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-sm transition-all ${
								dragOver
									? 'border-(--primary) bg-(--accent-bg)'
									: file
										? 'border-(--primary)/40 bg-(--accent-bg)/50'
										: 'border-(--border) hover:border-(--primary)/50 hover:bg-(--bg-2)/40'
							}`}
						>
							{file ? (
								<>
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-(--primary)/15 text-(--primary)">
										<svg
											width="18"
											height="18"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<polyline points="20 6 9 17 4 12" />
										</svg>
									</div>
									<p className="font-semibold text-(--text-h)">
										{file.name}
									</p>
									<p className="text-xs text-(--text-muted)">
										{(file.size / 1024).toFixed(1)} KB
									</p>
								</>
							) : (
								<>
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-(--bg-2)/60 text-(--text-muted)">
										<svg
											width="18"
											height="18"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
											<polyline points="17 8 12 3 7 8" />
											<line
												x1="12"
												y1="3"
												x2="12"
												y2="15"
											/>
										</svg>
									</div>
									<p className="font-medium text-(--text)">
										클릭 또는 드래그하여 업로드
									</p>
									<p className="text-xs text-(--text-muted)">
										CSV 파일만 지원됩니다
									</p>
								</>
							)}
						</button>
					</div>
				</div>

				<div className="mt-7 flex justify-end gap-3">
					<button
						type="button"
						onClick={onClose}
						className="rounded-xl border border-(--border) px-5 py-2.5 text-sm font-semibold text-(--text) transition-all hover:bg-(--bg-2)"
					>
						취소
					</button>
					<button
						type="button"
						onClick={handleSubmit}
						disabled={!name.trim() || !file}
						className="rounded-xl bg-(--primary) px-5 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-sm)] transition-all hover:shadow-[var(--shadow)] disabled:cursor-not-allowed disabled:opacity-30"
					>
						약품 추가
					</button>
				</div>
			</div>
		</div>
	);
};
