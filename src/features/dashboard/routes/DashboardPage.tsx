import { Header } from '../../../components/Header.tsx';
import { DashboardLayout } from '../layout/DashboardLayout.tsx';

export function DashboardPage() {
	return (
		<div className="h-full">
			<Header />
			<DashboardLayout />
		</div>
	);
}
