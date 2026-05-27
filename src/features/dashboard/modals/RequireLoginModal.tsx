import { useNavigate } from 'react-router';

export function RequireLoginModal({ onClose }: { onClose: () => void }) {
	const navigate = useNavigate();

	function redirectToLogin() {
		navigate('/login');
		onClose();
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
			<div className="w-full max-w-md rounded-2xl bg-(--card) p-6 shadow-xl">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-bold">❌ 로그인이 필요해요!</h2>
				</div>
				<div className="mt-4">
					서비스를 이용하시려면 로그인이 필수예요 !
				</div>
				<div className="mt-4 flex justify-end">
					<button
						onClick={redirectToLogin}
						className="h-10 w-27 rounded-xl border border-(--border) bg-(--card) text-(--text) transition-all duration-100 hover:bg-(--card-hover)">
						로그인하기
					</button>
				</div>
			</div>
		</div>
	);
}
