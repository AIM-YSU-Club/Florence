import type { Medicine } from '../../../api';
import { cardGradients } from './constants';
import { PtStatusBadge } from './shared';

// 약품 목록, 추가 카드, 삭제 액션을 한 화면에서 보여주는 그리드 뷰다.
export function DrugGridView({
	medicines,
	onCardClick,
	onAddClick,
	onDelete,
}: {
	medicines: Medicine[];
	onCardClick: (m: Medicine) => void;
	onAddClick: () => void;
	onDelete: (id: string) => void;
}) {
	return (
		<div>
			<div className="mb-8 flex items-end justify-between">
				<div>
					<h2 className="text-2xl font-black tracking-tight text-(--text-h)">
						약품 관리
					</h2>
					<p className="mt-1 text-sm text-(--text-muted)">
						약품을 선택하면 기후 데이터 기반 판매 예측을 확인할 수
						있습니다.
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
				<button
					type="button"
					onClick={onAddClick}
					className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-(--border) transition-all duration-200 hover:border-(--primary)/60 hover:bg-(--accent-bg)/50"
					style={{ minHeight: '200px' }}>
					<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-(--bg-2)/50 text-(--text-muted) transition-all group-hover:bg-(--primary)/12 group-hover:text-(--primary)">
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round">
							<line x1="12" y1="5" x2="12" y2="19" />
							<line x1="5" y1="12" x2="19" y2="12" />
						</svg>
					</div>
					<span className="mt-3 text-sm font-bold text-(--text-muted) group-hover:text-(--primary)">
						새 약품 추가
					</span>
					<span className="mt-1 text-[11px] text-(--text-muted)/60">
						약품을 등록하세요
					</span>
				</button>

				{medicines.map((medicine, index) => {
					const palette = cardGradients[index % cardGradients.length];
					return (
						<div
							key={medicine.medicine_id}
							className="group relative overflow-hidden rounded-2xl shadow-[var(--shadow)] transition-all duration-250 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lg)]"
							style={{
								background: `linear-gradient(145deg, ${palette.from}, ${palette.to})`,
								minHeight: '200px',
							}}>
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									onDelete(medicine.medicine_id);
								}}
								className="absolute top-3 right-3 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-black/20 text-white/70 opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 hover:bg-red-500 hover:text-white">
								<svg
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
									strokeLinecap="round">
									<line x1="18" y1="6" x2="6" y2="18" />
									<line x1="6" y1="6" x2="18" y2="18" />
								</svg>
							</button>
							<button
								type="button"
								onClick={() => onCardClick(medicine)}
								className="flex h-full w-full flex-col justify-between p-5 text-left text-white">
								<div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/[0.07] transition-transform duration-500 group-hover:scale-150" />
								<div className="relative z-10 flex items-center gap-2">
									<span className="rounded-md bg-white/15 px-2 py-0.5 text-[10px] font-bold tracking-widest backdrop-blur-sm">
										{medicine.atc4 ?? '미분류'}
									</span>
								</div>
								<div className="relative z-10 mt-auto">
									<p className="text-lg leading-tight font-black">
										{medicine.name}
									</p>
									<div className="mt-2">
										<PtStatusBadge
											status={medicine.pt_status}
											variant="dark"
										/>
									</div>
								</div>
							</button>
						</div>
					);
				})}
			</div>
		</div>
	);
}
