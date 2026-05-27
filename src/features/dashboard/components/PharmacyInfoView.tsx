import { FormField } from './shared';

// 약국 프로필 요약과 수정 폼을 함께 보여주는 정보 관리 화면이다.
export function PharmacyInfoView({
	name,
	address,
	saved,
	onNameChange,
	onAddressChange,
	onSave,
}: {
	name: string;
	address: string;
	saved: boolean;
	onNameChange: (v: string) => void;
	onAddressChange: (v: string) => void;
	onSave: () => void;
}) {
	return (
		<div>
			<div className="mb-8">
				<h2 className="text-2xl font-black tracking-tight text-(--text-h)">
					약국 정보
				</h2>
				<p className="mt-1 text-sm text-(--text-muted)">
					약국의 기본 정보를 관리합니다.
				</p>
			</div>
			<div className="grid max-w-3xl grid-cols-1 gap-6 lg:grid-cols-5">
				<div className="flex flex-col items-center rounded-2xl border border-(--border) bg-(--card) p-6 shadow-[var(--shadow-sm)] lg:col-span-2">
					<div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-(--primary) to-(--secondary) text-white shadow-md">
						<svg
							width="32"
							height="32"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round">
							<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
							<polyline points="9 22 9 12 15 12 15 22" />
						</svg>
					</div>
					<p className="mt-4 text-lg font-black text-(--text-h)">
						{name || '임시TEXT'}
					</p>
					<p className="mt-1 text-xs text-(--text-muted)">
						{address || '임시TEXT'}
					</p>
				</div>
				<div className="rounded-2xl border border-(--border) bg-(--card) p-6 shadow-[var(--shadow-sm)] lg:col-span-3">
					<h3 className="mb-5 text-sm font-bold text-(--text-h)">
						정보 수정
					</h3>
					<div className="flex flex-col gap-5">
						<FormField
							id="p-name"
							label="약국 이름"
							value={name}
							onChange={onNameChange}
						/>
						<FormField
							id="p-addr"
							label="주소"
							value={address}
							onChange={onAddressChange}
						/>
					</div>
					<div className="mt-6 flex items-center justify-between border-t border-(--border) pt-5">
						<p className="text-[11px] text-(--text-muted)">
							변경사항은 저장 후 반영됩니다.
						</p>
						<button
							type="button"
							onClick={onSave}
							className={`rounded-lg px-5 py-2 text-sm font-bold text-white transition-all duration-200 ${saved ? 'bg-emerald-500' : 'bg-(--primary) shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow)]'}`}>
							{saved ? '✓ 저장됨' : '저장'}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
