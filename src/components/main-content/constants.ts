export type Tab = 'dashboard' | 'drugs' | 'info';
export type DrugView = 'list' | 'detail';

export const atcOptions = [
	{ code: 'N02BE', label: '아닐리드계', group: 'N - 신경계' },
	{ code: 'R05CB', label: '점액용해제', group: 'R - 호흡기계' },
	{ code: 'R05FA', label: '기침감기 복합제', group: 'R - 호흡기계' },
	{ code: 'R05CA', label: '거담제', group: 'R - 호흡기계' },
	{ code: 'R06AX', label: '기타 항히스타민제', group: 'R - 호흡기계' },
	{ code: 'R06AE', label: '피페라진 유도체', group: 'R - 호흡기계' },
	{ code: 'R01BA', label: '교감신경흥분제', group: 'R - 호흡기계' },
	{ code: 'R05DB', label: '기타 진해제', group: 'R - 호흡기계' },
];

export const weekLabels = ['4주 전', '3주 전', '2주 전', '1주 전'];
export const dayLabels = ['6일 전', '5일 전', '4일 전', '3일 전', '2일 전', '어제', '오늘'];

export const cardGradients = [
	{ from: '#5b9bd5', to: '#8cc0eb' },
	{ from: '#4a8aba', to: '#7eb8d0' },
	{ from: '#3d7da8', to: '#6ba5c7' },
	{ from: '#356f96', to: '#5a90b5' },
];

export const statusConfig = {
	DONE: { bg: 'bg-emerald-400/20', text: 'text-emerald-100', dot: 'bg-emerald-300', label: '학습 완료' },
	TRAINING: { bg: 'bg-amber-400/20', text: 'text-amber-100', dot: 'bg-amber-300 animate-pulse', label: '학습 중' },
	FAILED: { bg: 'bg-rose-400/20', text: 'text-rose-100', dot: 'bg-rose-300', label: '학습 실패' },
	NONE: { bg: 'bg-white/10', text: 'text-white/60', dot: 'bg-white/40', label: '학습 필요' },
} as const;

export const statusConfigLight = {
	DONE: { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-400', label: '학습 완료' },
	TRAINING: { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-400 animate-pulse', label: '학습 중' },
	FAILED: { bg: 'bg-rose-50', text: 'text-rose-600', dot: 'bg-rose-400', label: '학습 실패' },
	NONE: { bg: 'bg-(--bg-2)', text: 'text-(--text-muted)', dot: 'bg-(--text-muted)/40', label: '학습 필요' },
} as const;
