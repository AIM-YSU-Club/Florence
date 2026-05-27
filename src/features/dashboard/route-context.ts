import type { Medicine } from '../../api';

export type DashboardOutletContext = {
	medicines: Medicine[];
	isBootstrapping: boolean;
	pharmacyName: string;
	pharmacyAddress: string;
	saved: boolean;
	openAddDrugModal: () => void;
	deleteDrug: (id: string) => Promise<void>;
	updatePharmacyName: (value: string) => void;
	updatePharmacyAddress: (value: string) => void;
	savePharmacy: () => Promise<void>;
};
