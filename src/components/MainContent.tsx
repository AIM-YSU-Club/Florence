import { useEffect, useState } from 'react';
import * as api from '../api';
import type { Medicine } from '../api';
import { AddDrugModal } from './AddDrugModal';
import type { DrugView, Tab } from './main-content/constants';
import { DashboardView } from './main-content/DashboardView';
import { DrugDetailView } from './main-content/DrugDetailView';
import { DrugGridView } from './main-content/DrugGridView';
import { PharmacyInfoView } from './main-content/PharmacyInfoView';
import { Sidebar } from './main-content/Sidebar';

export const MainContent = () => {
	const [activeTab, setActiveTab] = useState<Tab>('dashboard');
	const [drugView, setDrugView] = useState<DrugView>('list');
	const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
	const [medicines, setMedicines] = useState<Medicine[]>([]);
	const [showModal, setShowModal] = useState(false);

	const [pharmacyName, setPharmacyName] = useState('');
	const [pharmacyAddress, setPharmacyAddress] = useState('');
	const [saved, setSaved] = useState(false);

	// 약품 목록을 다시 불러와 현재 탭에서 사용하는 기준 데이터를 동기화한다.
	useEffect(() => {
		if (!api.getToken()) return;

		let cancelled = false;

		const run = async () => {
			try {
				const [list, pharmacy] = await Promise.all([api.getMedicines(), api.getPharmacy()]);
				if (cancelled) return;

				setMedicines(list);
				if (pharmacy.pharmacy_name) setPharmacyName(pharmacy.pharmacy_name);
				if (pharmacy.pharmacy_address) setPharmacyAddress(pharmacy.pharmacy_address);
			} catch {
				/* not logged in or error */
			}
		};

		void run();

		return () => {
			cancelled = true;
		};
	}, []);

	// 약국 정보를 저장하고 잠깐 저장 완료 상태를 노출한다.
	const handleSavePharmacy = async () => {
		try {
			await api.updatePharmacy({ name: pharmacyName, address: pharmacyAddress });
			setSaved(true);
			setTimeout(() => setSaved(false), 2000);
		} catch {
			/* handle error */
		}
	};

	// 새 약품 등록 후 목록을 갱신하고 모달을 닫는다.
	const handleAddDrug = async (name: string, atc4: string) => {
		try {
			await api.addMedicine(name, atc4 || '');
			const list = await api.getMedicines();
			setMedicines(list);
			setShowModal(false);
		} catch {
			/* handle error */
		}
	};

	// 약품 삭제 후 목록과 선택 상태를 함께 정리한다.
	const handleDeleteDrug = async (id: string) => {
		try {
			await api.deleteMedicine(id);
			const list = await api.getMedicines();
			setMedicines(list);
			if (selectedMedicine?.medicine_id === id) {
				setDrugView('list');
				setSelectedMedicine(null);
			}
		} catch {
			/* handle error */
		}
	};

	// 탭 전환 시 필요한 하위 화면 상태도 함께 초기화한다.
	const handleSelectTab = (tab: Tab) => {
		setActiveTab(tab);
		if (tab === 'drugs') {
			setDrugView('list');
			setSelectedMedicine(null);
		}
	};

	// 목록에서 선택한 약품을 상세 화면 컨텍스트로 승격한다.
	const openDrug = (medicine: Medicine) => {
		setSelectedMedicine(medicine);
		setDrugView('detail');
	};

	return (
		<main className="flex min-h-[calc(100vh-64px)] w-full">
			<Sidebar
				activeTab={activeTab}
				medicinesCount={medicines.length}
				pharmacyName={pharmacyName}
				onSelectTab={handleSelectTab}
			/>

			<div className="flex-1 overflow-y-auto bg-(--bg)">
				<div key={`${activeTab}-${drugView}-${selectedMedicine?.medicine_id ?? ''}`} className="mx-auto max-w-270 animate-[fadeIn_0.2s_ease-out] px-10 py-8">
					{activeTab === 'dashboard' && <DashboardView />}
					{activeTab === 'drugs' && drugView === 'list' && (
						<DrugGridView medicines={medicines} onCardClick={openDrug} onAddClick={() => setShowModal(true)} onDelete={handleDeleteDrug} />
					)}
					{activeTab === 'drugs' && drugView === 'detail' && selectedMedicine && (
						<DrugDetailView
							medicine={selectedMedicine}
							onBack={() => {
								setDrugView('list');
								setSelectedMedicine(null);
							}}
						/>
					)}
					{activeTab === 'info' && (
						<PharmacyInfoView
							name={pharmacyName}
							address={pharmacyAddress}
							saved={saved}
							onNameChange={setPharmacyName}
							onAddressChange={setPharmacyAddress}
							onSave={handleSavePharmacy}
						/>
					)}
				</div>
			</div>

			{showModal && <AddDrugModal onClose={() => setShowModal(false)} onSubmit={handleAddDrug} />}
		</main>
	);
};
