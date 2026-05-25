import type { ReactNode } from 'react';
import type { Tab } from './constants';

// 사이드바 메뉴 한 줄의 선택 상태와 배지를 공통 형태로 렌더링한다.
function SidebarItem({
	active,
	onClick,
	icon,
	label,
	badge,
}: {
	active: boolean;
	onClick: () => void;
	icon: ReactNode;
	label: string;
	badge?: number;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`group relative flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition-all duration-150 ${active ? 'bg-(--primary)/12 text-(--primary)' : 'text-(--text) hover:bg-(--bg)/80'}`}
		>
			{active && (
				<span className="absolute top-1/2 left-0 h-5 w-0.75 -translate-y-1/2 rounded-r-full bg-(--primary)" />
			)}
			<span
				className={`flex h-7 w-7 items-center justify-center rounded-md transition-all ${active ? 'bg-(--primary) text-white shadow-sm' : 'bg-(--bg-2)/60 text-(--text-muted) group-hover:text-(--text)'}`}
			>
				{icon}
			</span>
			<span className="flex-1 text-left">{label}</span>
			{badge !== undefined && (
				<span
					className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${active ? 'bg-(--primary)/20 text-(--primary)' : 'bg-(--bg-2)/60 text-(--text-muted)'}`}
				>
					{badge}
				</span>
			)}
		</button>
	);
}

// 메인 화면의 전역 이동과 약품 현황 요약을 담당하는 사이드바다.
export function Sidebar({
	activeTab,
	medicinesCount,
	pharmacyName,
	onSelectTab,
}: {
	activeTab: Tab;
	medicinesCount: number;
	pharmacyName: string;
	onSelectTab: (tab: Tab) => void;
}) {
	return (
		<nav className="flex w-58 shrink-0 flex-col bg-(--card) shadow-[1px_0_0_var(--border)]">
			<div className="border-b border-(--border) px-5 py-5">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-(--primary) to-(--secondary) text-white shadow-sm">
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
							<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
							<polyline points="9 22 9 12 15 12 15 22" />
						</svg>
					</div>
					<div className="min-w-0">
						<p className="truncate text-sm font-bold text-(--text-h)">
							{pharmacyName || '임시TEXT'}
						</p>
						<p className="truncate text-[11px] text-(--text-muted)">
							약국 관리 대시보드
						</p>
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-0.5 px-3 pt-5 pb-4">
				<p className="mb-2 px-3 text-[10px] font-extrabold tracking-[0.15em] text-(--text-muted) uppercase">
					관리
				</p>
				<SidebarItem
					active={activeTab === 'dashboard'}
					onClick={() => onSelectTab('dashboard')}
					icon={
						<svg
							width="15"
							height="15"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
						</svg>
					}
					label="메인 대시보드"
				/>
				<SidebarItem
					active={activeTab === 'drugs'}
					onClick={() => onSelectTab('drugs')}
					icon={
						<svg
							width="15"
							height="15"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<rect x="3" y="3" width="7" height="7" rx="1.5" />
							<rect x="14" y="3" width="7" height="7" rx="1.5" />
							<rect x="3" y="14" width="7" height="7" rx="1.5" />
							<rect x="14" y="14" width="7" height="7" rx="1.5" />
						</svg>
					}
					label="약품 관리"
					badge={medicinesCount}
				/>
				<SidebarItem
					active={activeTab === 'info'}
					onClick={() => onSelectTab('info')}
					icon={
						<svg
							width="15"
							height="15"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
							<polyline points="9 22 9 12 15 12 15 22" />
						</svg>
					}
					label="약국 정보"
				/>
			</div>

			<div className="mt-auto px-4 pb-5">
				<div className="rounded-xl bg-linear-to-br from-(--quaternary)/80 to-(--tertiary)/40 p-4">
					<div className="flex items-center justify-between">
						<p className="text-[10px] font-bold tracking-wider text-(--text-muted) uppercase">
							등록 현황
						</p>
						<span className="rounded-full bg-white/60 px-1.5 py-0.5 text-[10px] font-bold text-(--primary)">
							활성
						</span>
					</div>
					<p className="mt-1.5 text-2xl font-black text-(--text-h)">
						{medicinesCount}
						<span className="ml-1 text-xs font-semibold text-(--text-muted)">
							약품
						</span>
					</p>
					<div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/50">
						<div
							className="h-full rounded-full bg-(--primary) transition-all duration-500"
							style={{
								width: `${Math.min(medicinesCount * 20, 100)}%`,
							}}
						/>
					</div>
				</div>
			</div>
		</nav>
	);
}
