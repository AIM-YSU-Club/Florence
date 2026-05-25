import type { CSSProperties } from 'react';

export const tooltipStyle: CSSProperties = {
	backgroundColor: 'rgba(15, 23, 42, 0.95)',
	border: 'none',
	borderRadius: '10px',
	color: '#f8fafc',
	padding: '8px 14px',
	fontSize: '12px',
	boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
};

export function formatNumber(n: number) {
	if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
	return Math.round(n).toLocaleString();
}
