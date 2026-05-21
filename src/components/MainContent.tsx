import Charts01 from './Charts01.tsx';
import { useState } from 'react';

const medicineGroups = [
	{
		id: 'all',
		label: '전체',
		medicines: [
			{ code: 'R05CA', name: '거담제' },
			{ code: 'R05CB', name: '점액용해제' },
			{ code: 'R05DA', name: '아편 알칼로이 및 유도체' },
			{ code: 'R05DB', name: '기타 진해제' },
			{ code: 'R05FA', name: '아편 유도체 및 거담제' },
			{ code: 'R06AB', name: '치환 알킬아민계 항하스타민제' },
			{ code: 'R06AE', name: '피페라진 유도제' },
			{ code: 'R06AX', name: '기타 전신용 항히스타민제' },
			{ code: 'R01AD', name: '코르티코스테로이드' },
			{ code: 'R01BA', name: '교감신경흥분제' },
			{ code: 'N02AA', name: '천연 아편 알칼로이드' },
			{ code: 'N02AB', name: '페닐피페리딘 유도체' },
			{ code: 'N02AJ', name: '비마약성 진통제와의 복합 오피오이드' },
			{ code: 'N02AX', name: '기타 오피오이드' },
			{ code: 'N02BE', name: '아닐리드계' },
			{ code: 'N02BF', name: '가바펜티노이드' },
			{ code: 'N02CC', name: '선택적 세로토닌(5-HT1) 작용제' },
		],
	},
	{
		id: 'respiratory',
		label: 'R - 호흡기계',
		medicines: [
			{ code: 'R05CA', name: '거담제' },
			{ code: 'R05CB', name: '점액용해제' },
			{ code: 'R05DA', name: '아편 알칼로이 및 유도체' },
			{ code: 'R05DB', name: '기타 진해제' },
			{ code: 'R05FA', name: '아편 유도체 및 거담제' },
			{ code: 'R06AB', name: '치환 알킬아민계 항하스타민제' },
			{ code: 'R06AE', name: '피페라진 유도제' },
			{ code: 'R06AX', name: '기타 전신용 항히스타민제' },
			{ code: 'R01AD', name: '코르티코스테로이드' },
			{ code: 'R01BA', name: '교감신경흥분제' },
		],
	},
	{
		id: 'nervous',
		label: 'N - 신경계',
		medicines: [
			{ code: 'N02AA', name: '천연 아편 알칼로이드' },
			{ code: 'N02AB', name: '페닐피페리딘 유도체' },
			{ code: 'N02AJ', name: '비마약성 진통제와의 복합 오피오이드' },
			{ code: 'N02AX', name: '기타 오피오이드' },
			{ code: 'N02BE', name: '아닐리드계' },
			{ code: 'N02BF', name: '가바펜티노이드' },
			{ code: 'N02CC', name: '선택적 세로토닌(5-HT1) 작용제' },
		],
	},
] as const;

export const MainContent = () => {
	const [selectedGroup, setSelectedGroup] = useState('all');
	const [selected, setSelected] = useState('N02AA');
	const [searchTerm, setSearchTerm] = useState('');
	const activeGroup =
		medicineGroups.find((group) => group.id === selectedGroup) ??
		medicineGroups[0];
	const normalizedKeyword = searchTerm.trim().toLowerCase();
	const filteredMedicines = activeGroup.medicines.filter((medicine) => {
		if (!normalizedKeyword) {
			return true;
		}

		return (
			medicine.code.toLowerCase().includes(normalizedKeyword) ||
			medicine.name.toLowerCase().includes(normalizedKeyword)
		);
	});

	return (
		<main className="flex h-max min-h-[85vh] w-full flex-row">
			{/* Side Navigation Section */}
			<nav className="basis-1/4 border-r pr-6 pl-6">
				<div className="mt-10 flex flex-col">
					<label className="mb-4 text-sm font-bold tracking-wide text-(--text-h)">
						의약품 선택
					</label>
					<div className="mb-6 flex flex-wrap gap-2">
						{medicineGroups.map((group) => (
							<button
								key={group.id}
								type="button"
								onClick={() => setSelectedGroup(group.id)}
								className={`rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${
									selectedGroup === group.id
										? 'border-(--primary) bg-(--primary) text-(--text-h)'
										: 'border-(--border) bg-transparent text-(--text)'
								}`}
							>
								{group.label}
							</button>
						))}
					</div>
					<input
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="약 코드 또는 이름 검색"
						className="mb-4 rounded-xl border border-(--border) bg-(--bg)/70 px-3 py-2 text-sm text-(--text-h) transition duration-100 outline-none focus:border-(--primary)"
					/>
					<div className="flex flex-col gap-2 rounded-2xl border border-(--border) bg-(--bg-2)/40 p-4">
						<p className="text-xs font-semibold tracking-wide text-(--text)">
							{activeGroup.label}
						</p>
						<div className="flex flex-col gap-2">
							{filteredMedicines.map((medicine) => (
								<button
									key={medicine.code}
									type="button"
									onClick={() => setSelected(medicine.code)}
									className={`rounded-xl border px-3 py-3 text-left transition-colors ${
										selected === medicine.code
											? 'border-(--primary) bg-(--accent-bg) text-(--text-h)'
											: 'border-(--border) bg-transparent text-(--text)'
									}`}
								>
									<p className="text-sm font-bold">
										{medicine.code}
									</p>
									<p className="text-xs opacity-80">
										{medicine.name}
									</p>
								</button>
							))}
							{filteredMedicines.length === 0 ? (
								<p className="rounded-xl border border-dashed border-(--border) px-3 py-4 text-sm text-(--text)">
									검색 결과가 없습니다.
								</p>
							) : null}
						</div>
					</div>
				</div>
			</nav>
			{/* Main Contents Section */}
			<div className="mt-10 basis-3/4 pl-6">
				<p className="mb-4 text-sm font-semibold text-(--text)">
					선택된 의약품 분류:{' '}
					<span className="text-(--text-h)">{selected}</span>
				</p>
				<Charts01 />
			</div>
		</main>
	);
};
