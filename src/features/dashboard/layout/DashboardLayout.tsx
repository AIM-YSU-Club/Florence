import { Outlet } from 'react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as api from '../../../api';
import type { Medicine } from '../../../api';
import { Sidebar } from '../components/Sidebar';
import type { DashboardOutletContext } from '../route-context';
import { AddDrugModal } from '../modals/AddDrugModal.tsx';
import { RequireLoginModal } from '../modals/RequireLoginModal.tsx';

export const DashboardLayout = () => {
	const [medicines, setMedicines] = useState<Medicine[]>([]);
	const [showModal, setShowModal] = useState(false);
	const [isBootstrapping, setIsBootstrapping] = useState(
		Boolean(api.getToken()),
	);

	const [pharmacyName, setPharmacyName] = useState('');
	const [pharmacyAddress, setPharmacyAddress] = useState('');
	const [saved, setSaved] = useState(false);

	/**
	 * api.isLoggin() 사용해서 로그인 상태 반환
	 */
	const [showRequireLoginModal, setShowRequireLoginModal] = useState(
		api.isNotLoggedIn(),
	);

	// 약품 목록을 다시 불러와 현재 탭에서 사용하는 기준 데이터를 동기화한다.
	useEffect(() => {
		if (!api.getToken()) return;

		let cancelled = false;

		const run = async () => {
			try {
				const [list, pharmacy] = await Promise.all([
					api.getMedicines(),
					api.getPharmacy(),
				]);
				if (cancelled) return;

				setMedicines(list);
				if (pharmacy.pharmacy_name)
					setPharmacyName(pharmacy.pharmacy_name);
				if (pharmacy.pharmacy_address)
					setPharmacyAddress(pharmacy.pharmacy_address);
			} catch {
				/* not logged in or error */
			} finally {
				if (!cancelled) setIsBootstrapping(false);
			}
		};

		void run();

		return () => {
			cancelled = true;
		};
	}, []);

	// 약국 정보를 저장하고 잠깐 저장 완료 상태를 노출한다.
	const handleSavePharmacy = useCallback(async () => {
		try {
			await api.updatePharmacy({
				name: pharmacyName,
				address: pharmacyAddress,
			});
			setSaved(true);
			setTimeout(() => setSaved(false), 2000);
		} catch {
			/* handle error */
		}
	}, [pharmacyAddress, pharmacyName]);

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
	const handleDeleteDrug = useCallback(async (id: string) => {
		try {
			await api.deleteMedicine(id);
			const list = await api.getMedicines();
			setMedicines(list);
		} catch {
			/* handle error */
		}
	}, []);

	const outletContext = useMemo<DashboardOutletContext>(
		() => ({
			medicines,
			isBootstrapping,
			pharmacyName,
			pharmacyAddress,
			saved,
			openAddDrugModal: () => setShowModal(true),
			deleteDrug: handleDeleteDrug,
			updatePharmacyName: setPharmacyName,
			updatePharmacyAddress: setPharmacyAddress,
			savePharmacy: handleSavePharmacy,
		}),
		[
			medicines,
			isBootstrapping,
			pharmacyName,
			pharmacyAddress,
			saved,
			handleDeleteDrug,
			handleSavePharmacy,
		],
	);

	return (
		<main className="flex min-h-[calc(100vh-64px)] w-full">
			<Sidebar
				medicinesCount={medicines.length}
				pharmacyName={pharmacyName}
			/>

			<div className="flex-1 overflow-y-auto bg-(--bg)">
				<div className="mx-auto max-w-270 animate-[fadeIn_0.2s_ease-out] px-10 py-8">
					<Outlet context={outletContext} />
				</div>
			</div>

			{showModal && (
				<AddDrugModal
					onClose={() => setShowModal(false)}
					onSubmit={handleAddDrug}
				/>
			)}
			{showRequireLoginModal && (
				<RequireLoginModal
					onClose={() => setShowRequireLoginModal(false)}
				/>
			)}
		</main>
	);
};
