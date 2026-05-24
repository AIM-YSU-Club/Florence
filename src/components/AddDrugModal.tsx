import { useState } from 'react';

interface AddDrugModalProps {
	onClose: () => void;
	onSubmit: (name: string, atc4: string) => void;
}

const atcSuggestions = [
	'N02BE', 'N02AA', 'N02AB', 'N02AJ', 'N02AX', 'N02BF', 'N02CC',
	'R05CA', 'R05CB', 'R05DA', 'R05DB', 'R06AB', 'R06AX', 'R01AD', 'R01BA',
];

export const AddDrugModal = ({ onClose, onSubmit }: AddDrugModalProps) => {
	const [name, setName] = useState('');
	const [atc4, setAtc4] = useState('');
	const [showSuggestions, setShowSuggestions] = useState(false);

	const handleSubmit = () => {
		if (!name.trim()) return;
		onSubmit(name.trim(), atc4.trim());
	};

	const filteredSuggestions = atcSuggestions.filter((s) =>
		s.toLowerCase().includes(atc4.toLowerCase()),
	);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[6px]"
			onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
			<div className="w-full max-w-md animate-[fadeIn_0.15s_ease-out] rounded-2xl border border-(--border) bg-(--card) p-7 shadow-[var(--shadow-lg)]">
				<div className="mb-6 flex items-center justify-between">
					<h3 className="text-lg font-black text-(--text-h)">새 약품 추가</h3>
					<button type="button" onClick={onClose}
						className="flex h-8 w-8 items-center justify-center rounded-lg text-(--text-muted) transition-colors hover:bg-(--bg-2) hover:text-(--text)">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
							<line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
				</div>

				<div className="flex flex-col gap-5">
					{/* Drug name */}
					<div className="flex flex-col gap-1.5">
						<label htmlFor="drug-name" className="text-[11px] font-bold tracking-wider text-(--text-muted) uppercase">약품명</label>
						<input id="drug-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
							placeholder="예: 타이레놀정 500mg"
							className="rounded-lg border border-(--border) bg-(--bg) px-3.5 py-2.5 text-sm font-medium text-(--text-h) outline-none transition-all placeholder:text-(--text-muted) focus:border-(--primary) focus:shadow-[0_0_0_3px_var(--accent-bg)]" />
					</div>

					{/* ATC code (optional) */}
					<div className="relative flex flex-col gap-1.5">
						<label htmlFor="atc-code" className="text-[11px] font-bold tracking-wider text-(--text-muted) uppercase">
							ATC 분류 코드 <span className="font-normal text-(--text-muted)">— 선택사항</span>
						</label>
						<input id="atc-code" type="text" value={atc4}
							onChange={(e) => { setAtc4(e.target.value); setShowSuggestions(true); }}
							onFocus={() => setShowSuggestions(true)}
							onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
							placeholder="예: N02BE"
							className="rounded-lg border border-(--border) bg-(--bg) px-3.5 py-2.5 text-sm font-medium text-(--text-h) outline-none transition-all placeholder:text-(--text-muted) focus:border-(--primary) focus:shadow-[0_0_0_3px_var(--accent-bg)]" />
						{showSuggestions && atc4 && filteredSuggestions.length > 0 && (
							<div className="absolute top-full left-0 z-10 mt-1 max-h-32 w-full overflow-y-auto rounded-lg border border-(--border) bg-(--card) py-1 shadow-[var(--shadow)]">
								{filteredSuggestions.map((s) => (
									<button key={s} type="button"
										onClick={() => { setAtc4(s); setShowSuggestions(false); }}
										className="w-full px-3 py-1.5 text-left text-xs font-semibold text-(--text) hover:bg-(--bg-2)">
										{s}
									</button>
								))}
							</div>
						)}
					</div>
				</div>

				<div className="mt-7 flex justify-end gap-3">
					<button type="button" onClick={onClose}
						className="rounded-lg border border-(--border) px-5 py-2 text-sm font-semibold text-(--text) transition-all hover:bg-(--bg-2)">
						취소
					</button>
					<button type="button" onClick={handleSubmit} disabled={!name.trim()}
						className="rounded-lg bg-(--primary) px-5 py-2 text-sm font-bold text-white shadow-[var(--shadow-sm)] transition-all hover:shadow-[var(--shadow)] disabled:cursor-not-allowed disabled:opacity-30">
						약품 추가
					</button>
				</div>
			</div>
		</div>
	);
};
