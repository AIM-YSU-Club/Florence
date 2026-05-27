import { useNavigate, useOutletContext, useParams } from 'react-router';
import { DrugDetailView } from '../components/DrugDetailView';
import type { DashboardOutletContext } from '../route-context';

export function DrugDetailPage() {
	const navigate = useNavigate();
	const { medicineId } = useParams();
	const { medicines, isBootstrapping } =
		useOutletContext<DashboardOutletContext>();
	const medicine = medicines.find((item) => item.medicine_id === medicineId);

	if (!medicine && isBootstrapping) {
		return (
			<p className="py-20 text-center text-sm text-(--text-muted)">
				약품 정보를 불러오는 중...
			</p>
		);
	}

	if (!medicine) {
		return (
			<div className="rounded-2xl border border-(--border) bg-(--card) p-12 text-center shadow-(--shadow-sm)">
				<p className="text-sm font-semibold text-(--text-h)">
					해당 약품을 찾을 수 없습니다.
				</p>
			</div>
		);
	}

	return (
		<DrugDetailView
			medicine={medicine}
			onBack={() => navigate('/dashboard/drugs')}
		/>
	);
}
