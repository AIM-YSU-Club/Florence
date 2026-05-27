import { useNavigate, useOutletContext } from 'react-router';
import type { Medicine } from '../../../api';
import { DrugGridView } from '../components/DrugGridView';
import type { DashboardOutletContext } from '../route-context';

export function DrugsPage() {
	const navigate = useNavigate();
	const { medicines, openAddDrugModal, deleteDrug } =
		useOutletContext<DashboardOutletContext>();

	const openDrug = (medicine: Medicine) => {
		navigate(`/dashboard/drugs/${medicine.medicine_id}`);
	};

	return (
		<DrugGridView
			medicines={medicines}
			onCardClick={openDrug}
			onAddClick={openAddDrugModal}
			onDelete={deleteDrug}
		/>
	);
}
