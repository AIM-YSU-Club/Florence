export function CsvUploadErrorModal({
	message,
	onClose,
}: {
	message: string;
	onClose: () => void;
}) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
			<div className="w-full max-w-md rounded-2xl bg-(--card) p-6 shadow-xl">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-bold">CSV 업로드 실패</h2>
				</div>
				<p className="mt-4 rounded-xl border border-(--border) bg-(--bg) p-4 text-sm font-medium whitespace-pre-line text-(--text)">
					{message}
				</p>
				<div className="mt-4 flex justify-end">
					<button
						type="button"
						onClick={onClose}
						className="h-10 rounded-xl border border-(--border) bg-(--card) px-4 text-sm font-bold text-(--text) transition-all duration-100 hover:bg-(--card-hover)">
						확인
					</button>
				</div>
			</div>
		</div>
	);
}
