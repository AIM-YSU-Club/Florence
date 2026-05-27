import csvHelpImage from '../../../assets/img/csvHelp.png';

export function CsvUploadHelpMessageModal({
	onClose,
	onConfirm,
	doNotShowAgain,
	onDoNotShowAgainChange,
}: {
	onClose: () => void;
	onConfirm: () => void;
	doNotShowAgain: boolean;
	onDoNotShowAgainChange: (checked: boolean) => void;
}) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
			<div className="w-full max-w-md rounded-2xl bg-(--card) p-6 shadow-xl">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-bold">⚠️ 도움말</h2>
				</div>
				<div className="mt-4">
					<p className="mb-4 font-bold">
						CSV 파일 업로드 시 주의 하셔야 할 사항이 있어요!
					</p>
					<p>
						<ol className="mb-4 flex h-30 list-inside list-decimal flex-col justify-between">
							<li>
								컬럼(열) 이름을 date, saled 로
								바꿔주세요.(date는 날짜. saled는 판매량(갯수))
							</li>
							<li>
								date 열은 구분자 없이 YYYYMMDD 형식으로
								입력해주세요. (예: 20260101)
							</li>
							<li>saled 열은 쉼표 없는 0 이상의 숫자여야해요.</li>
						</ol>
					</p>
					<p className="text-sm">
						예시 이미지
						<img src={csvHelpImage} alt="도움말 이미지" />
					</p>
				</div>
				<label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-(--text)">
					<input
						type="checkbox"
						checked={doNotShowAgain}
						onChange={(e) =>
							onDoNotShowAgainChange(e.target.checked)
						}
						className="h-4 w-4 rounded border border-(--border)"
					/>
					다시 보지 않기
				</label>
				<div className="mt-4 flex justify-end">
					<button
						type="button"
						onClick={onClose}
						className="mr-2 h-10 w-27 rounded-xl border border-(--border) bg-(--card) text-(--text) transition-all duration-100 hover:bg-(--card-hover)">
						수정할게요..
					</button>
					<button
						type="button"
						onClick={onConfirm}
						className="h-10 w-27 rounded-xl border border-(--border) bg-(--card) text-(--text) transition-all duration-100 hover:bg-(--card-hover)">
						확인했어요!
					</button>
				</div>
			</div>
		</div>
	);
}
