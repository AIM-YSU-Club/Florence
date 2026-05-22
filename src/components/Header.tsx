import { Link } from 'react-router';

export const Header = () => {
	return (
		<header className="relative flex h-16 items-center justify-between border-b border-(--border) bg-(--card)/80 px-6 backdrop-blur-md">
			<Link
				to="/"
				className="flex items-center gap-2.5"
				reloadDocument={true}
			>
				<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-(--primary) to-(--secondary) shadow-sm">
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="white"
						strokeWidth="2.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M12 2L2 7l10 5 10-5-10-5z" />
						<path d="M2 17l10 5 10-5" />
						<path d="M2 12l10 5 10-5" />
					</svg>
				</div>
				<span className="text-lg font-black tracking-tight text-(--text-h)">
					Florence
				</span>
				<span className="rounded-md bg-(--quaternary) px-1.5 py-0.5 text-[10px] font-bold text-(--text-muted)">
					BETA
				</span>
			</Link>
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-2 rounded-lg bg-(--bg-2)/50 px-3 py-1.5">
					<div className="h-2 w-2 rounded-full bg-emerald-400" />
					<span className="text-xs font-semibold text-(--text-muted)">
						서버 연결됨
					</span>
				</div>
				<button
					type="button"
					className="flex h-8 w-8 items-center justify-center rounded-lg border border-(--border) text-(--text-muted) transition hover:bg-(--bg-2) hover:text-(--text)"
				>
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
						<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
						<circle cx="12" cy="7" r="4" />
					</svg>
				</button>
			</div>
			<div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-(--primary)/30 to-transparent" />
		</header>
	);
};
