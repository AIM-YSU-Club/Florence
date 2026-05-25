import { Link, useNavigate } from 'react-router';
import * as api from '../api';

export const Header = () => {
	const navigate = useNavigate();
	const loggedIn = !!api.getToken();

	const handleLogout = () => {
		api.logout();
		window.location.reload();
	};

	return (
		<header className="relative flex h-16 items-center justify-between border-b border-(--border) bg-(--card)/80 px-6 backdrop-blur-md">
			<Link
				to="/"
				className="flex items-center gap-2.5"
				reloadDocument={true}
			>
				<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-(--primary) to-(--secondary) shadow-sm">
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
			<div className="flex items-center gap-3">
				{loggedIn ? (
					<>
						<div className="flex items-center gap-2 rounded-lg bg-(--bg-2)/50 px-3 py-1.5">
							<div className="h-2 w-2 rounded-full bg-emerald-400" />
							<span className="text-xs font-semibold text-(--text-muted)">
								연결됨
							</span>
						</div>
						<button
							type="button"
							onClick={handleLogout}
							className="rounded-lg border border-(--border) px-3 py-1.5 text-xs font-semibold text-(--text-muted) transition hover:bg-(--bg-2) hover:text-(--text)"
						>
							로그아웃
						</button>
					</>
				) : (
					<button
						type="button"
						onClick={() => navigate('/login')}
						className="rounded-lg bg-(--primary) px-4 py-1.5 text-xs font-bold text-white shadow-sm transition hover:shadow-md"
					>
						로그인
					</button>
				)}
			</div>
			<div className="absolute right-0 bottom-0 left-0 h-px bg-linear-to-r from-transparent via-(--primary)/30 to-transparent" />
		</header>
	);
};
