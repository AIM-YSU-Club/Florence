import { useOutletContext } from 'react-router';
import { PharmacyInfoView } from '../components/PharmacyInfoView';
import type { DashboardOutletContext } from '../route-context';

export function PharmacyInfoPage() {
	const {
		pharmacyName,
		pharmacyAddress,
		saved,
		updatePharmacyName,
		updatePharmacyAddress,
		savePharmacy,
	} = useOutletContext<DashboardOutletContext>();

	return (
		<PharmacyInfoView
			name={pharmacyName}
			address={pharmacyAddress}
			saved={saved}
			onNameChange={updatePharmacyName}
			onAddressChange={updatePharmacyAddress}
			onSave={savePharmacy}
		/>
	);
}
