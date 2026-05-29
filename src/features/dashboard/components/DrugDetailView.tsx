import { useEffect, useRef, useState } from 'react';
import * as api from '../../../api';
import type { Medicine, Predict7dRes } from '../../../api';
import * as React from 'react';
import { CsvUploadErrorModal } from '../modals/CsvUploadErrorModal';
import { CsvUploadHelpMessageModal } from '../modals/CsvUploadHelpMessageModal.tsx';
import { DrugClimateCharts } from './drug-detail/DrugClimateCharts';
import { DrugDetailHeader } from './drug-detail/DrugDetailHeader';
import { DrugPredictionSummary } from './drug-detail/DrugPredictionSummary';
import type { DrugChart } from './drug-detail/types';

const CSV_UPLOAD_HELP_DISMISSED_KEY = 'csv-upload-help-dismissed';

// 선택한 약품의 7일 예측, CSV 업로드, 모델 학습 액션을 담당한다.
export function DrugDetailView({
	medicine,
	onBack,
}: {
	medicine: Medicine;
	onBack: () => void;
}) {
	const [data, setData] = useState<Predict7dRes | null>(null);
	const [loading, setLoading] = useState(true);
	const [trainStatus, setTrainStatus] = useState<
		'idle' | 'loading' | 'success' | 'error'
	>(
		medicine.pt_status === 'TRAINING'
			? 'loading'
			: medicine.pt_status === 'DONE'
				? 'success'
				: 'idle',
	);

	const [uploadStatus, setUploadStatus] = useState<
		'idle' | 'loading' | 'success' | 'error'
	>('idle');
	const [csvUploadErrorMessage, setCsvUploadErrorMessage] = useState('');

	const [showCsvUploadHelpModal, setShowCsvUploadHelpModal] = useState(false);
	const [doNotShowCsvHelpAgain, setDoNotShowCsvHelpAgain] = useState(
		localStorage.getItem(CSV_UPLOAD_HELP_DISMISSED_KEY) === 'true',
	);

	const csvInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		let cancelled = false;

		const run = async () => {
			try {
				const prediction = await api.predictNext7d(
					medicine.medicine_id,
				);
				if (!cancelled) setData(prediction);
			} catch {
				if (!cancelled) setData(null);
			} finally {
				if (!cancelled) setLoading(false);
			}
		};

		void run();

		return () => {
			cancelled = true;
		};
	}, [medicine.medicine_id]);

	// 선택된 약품의 사전학습을 요청하고 결과 상태를 버튼에 반영한다.
	const handlePretrain = async () => {
		setTrainStatus('loading');
		try {
			await api.pretrain(medicine.medicine_id);
			setTrainStatus('success');
			setTimeout(() => {
				setLoading(true);
				api.predictNext7d(medicine.medicine_id)
					.then(setData)
					.catch(() => setData(null))
					.finally(() => setLoading(false));
				setTrainStatus('idle');
			}, 3000);
		} catch {
			setTrainStatus('error');
			setTimeout(() => setTrainStatus('idle'), 3000);
		}
	};

	// CSV 판매 데이터를 업로드하고 입력 필드를 원상복구한다.
	const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setUploadStatus('loading');
		setCsvUploadErrorMessage('');
		try {
			await api.uploadSales(medicine.medicine_id, file);
			setUploadStatus('success');
			setTimeout(() => setUploadStatus('idle'), 3000);
		} catch (error) {
			setCsvUploadErrorMessage(
				api.getApiErrorDetail(error, 'CSV 업로드에 실패했습니다.'),
			);
			setUploadStatus('error');
			setTimeout(() => setUploadStatus('idle'), 3000);
		}

		if (csvInputRef.current) csvInputRef.current.value = '';
	};

	// 도움말 확인 후 기존 hidden file input을 열어 업로드 흐름을 이어간다.
	const handleConfirmCsvHelp = () => {
		if (doNotShowCsvHelpAgain) {
			localStorage.setItem(CSV_UPLOAD_HELP_DISMISSED_KEY, 'true');
		} else {
			localStorage.removeItem(CSV_UPLOAD_HELP_DISMISSED_KEY);
		}
		setShowCsvUploadHelpModal(false);
		csvInputRef.current?.click();
	};

	const handleOpenCsvUpload = () => {
		if (doNotShowCsvHelpAgain) {
			csvInputRef.current?.click();
			return;
		}
		setShowCsvUploadHelpModal(true);
	};

	if (loading)
		return (
			<p className="py-20 text-center text-sm text-(--text-muted)">
				데이터를 불러오는 중...
			</p>
		);

	const climateCharts = data
		? [
				{
					key: 'ta',
					label: '평균 기온',
					unit: '°C',
					color: '#5b9bd5',
					data: data.ta_7d,
				},
				{
					key: 'hm',
					label: '평균 습도',
					unit: '%',
					color: '#6ba5c7',
					data: data.hm_7d,
				},
				{
					key: 'rn',
					label: '강수량',
					unit: 'mm',
					color: '#6ba589',
					data: data.rn_7d,
				},
			]
		: [];

	return (
		<div>
			<DrugDetailHeader
				medicine={medicine}
				onBack={onBack}
				csvInputRef={csvInputRef}
				onCsvUpload={handleCsvUpload}
				onOpenCsvUpload={handleOpenCsvUpload}
				onOpenHelp={() => setShowCsvUploadHelpModal(true)}
				onPretrain={handlePretrain}
				uploadStatus={uploadStatus}
				trainStatus={trainStatus}
			/>

			{data && <DrugPredictionSummary data={data} />}

			{!data ? (
				<div className="rounded-2xl border border-(--border) bg-(--card) p-12 text-center shadow-(--shadow-sm)">
					<div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-(--bg-2)/50 text-(--text-muted)">
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round">
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
							<polyline points="17 8 12 3 7 8" />
							<line x1="12" y1="3" x2="12" y2="15" />
						</svg>
					</div>
					<p className="text-sm font-semibold text-(--text-h)">
						예측 데이터가 없습니다
					</p>
					<p className="mt-1 text-xs text-(--text-muted)">
						판매 데이터(CSV)를 업로드하고 사전학습을 실행하세요.
					</p>
				</div>
			) : (
				<DrugClimateCharts charts={climateCharts as DrugChart[]} />
			)}

			{showCsvUploadHelpModal && (
				<CsvUploadHelpMessageModal
					onClose={() => setShowCsvUploadHelpModal(false)}
					onConfirm={handleConfirmCsvHelp}
					doNotShowAgain={doNotShowCsvHelpAgain}
					onDoNotShowAgainChange={setDoNotShowCsvHelpAgain}
				/>
			)}
			{csvUploadErrorMessage && (
				<CsvUploadErrorModal
					message={csvUploadErrorMessage}
					onClose={() => setCsvUploadErrorMessage('')}
				/>
			)}
		</div>
	);
}
