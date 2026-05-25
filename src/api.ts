import axios from 'axios';

// Dev: Vite proxy "/api" → "http://175.210.157.48:8000"
// Prod: 직접 호출 (백엔드 CORS 설정 필요)
const BASE = import.meta.env.DEV ? '/api' : 'http://175.210.157.48:8000';

const api = axios.create({ baseURL: BASE });

// Attach JWT token to every request
api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

/* ── Auth ── */

export async function register(email: string, password: string) {
	const res = await api.post('/auth/register', { email, password });
	return res.data;
}

export async function login(email: string, password: string) {
	const formData = new FormData();
	formData.append('username', email);
	formData.append('password', password);
	const res = await api.post('/auth/login', formData);
	const { access_token } = res.data;
	localStorage.setItem('token', access_token);
	return access_token as string;
}

export function logout() {
	localStorage.removeItem('token');
}

export function getToken() {
	return localStorage.getItem('token');
}

/**
 * 현재 로그인이 되어있는지 안되어있는지 확인하여 **True** or **False**로 반환합니다.
 * @returns {boolean} - 로그인이 되어있다면 true 반환
 */
export function isNotLoggedIn(): boolean {
	// console.log(getToken() === null);
	return getToken() === null;
}

/* ── Dashboard / Pharmacy ── */

export interface PharmacyUpdateReq {
	name: string;
	address: string;
}

export interface PharmacyUpdateRes {
	user_id: string;
	pharmacy_name: string | null;
	pharmacy_address: string | null;
}

export async function getPharmacy() {
	const res = await api.get<PharmacyUpdateRes>('/dashboard/pharmacy');
	return res.data;
}

export async function updatePharmacy(data: PharmacyUpdateReq) {
	const res = await api.put<PharmacyUpdateRes>('/dashboard/pharmacy', data);
	return res.data;
}

/* ── Dashboard / Medicines ── */

export type PtStatus = 'NONE' | 'DONE' | 'TRAINING' | 'FAILED';

export interface Medicine {
	medicine_id: string;
	name: string;
	atc4: string | null;
	pt_status: PtStatus;
}

export interface MedicineListRes {
	medicine_list: Medicine[];
}

export async function getMedicines() {
	const res = await api.get<MedicineListRes>('/dashboard/get_medicines');
	return res.data.medicine_list;
}

export interface MedicineAddRes {
	medicine_id: string;
	user_id: string;
	name: string;
	atc4: string | null;
}

export async function addMedicine(name: string, atc4: string) {
	const res = await api.post<MedicineAddRes>('/dashboard/add_medicine', {
		name,
		atc4,
	});
	return res.data;
}

export async function deleteMedicine(medicineId: string) {
	const res = await api.delete('/dashboard/delete_medicine', {
		params: { medicine_id: medicineId },
	});
	return res.data;
}

export interface SalesUploadRes {
	message: string;
	medicine_id: string;
	total_rows_inserted: number;
	total_rows_updated: number;
}

export async function uploadSales(medicineId: string, file: File) {
	const formData = new FormData();
	formData.append('file', file);
	const res = await api.post<SalesUploadRes>(
		'/dashboard/upload_sales',
		formData,
		{
			params: { medicine_id: medicineId },
		},
	);
	return res.data;
}

export async function pretrain(medicineId: string) {
	const res = await api.post('/dashboard/pretrain', null, {
		params: { medicine_id: medicineId },
	});
	return res.data;
}

/* ── Predict ── */

export interface Predict4wRes {
	status: string;
	ta_4w: number[];
	hm_4w: number[];
	rn_4w: number[];
	predicted_value: number;
	mean_value: number;
	growth_rate: number;
}

export async function predictNext4w(target: string) {
	const res = await api.get<Predict4wRes>('/predict/predict_next_4w', {
		params: { target },
	});
	return res.data;
}

export interface Predict7dRes {
	status: string;
	ta_7d: number[];
	hm_7d: number[];
	rn_7d: number[];
	predicted_value: number;
	mean_value: number;
	growth_rate: number;
}

export async function predictNext7d(medicineId: string) {
	const res = await api.get<Predict7dRes>('/predict/predict_next_7d', {
		params: { medicine_id: medicineId },
	});
	return res.data;
}
