import { createBrowserRouter, Navigate } from 'react-router';
import Login from './features/auth/LoginPage';
import { DashboardPage } from './features/dashboard/routes/DashboardPage.tsx';
import { DashboardIndexPage } from './features/dashboard/routes/DashboardIndexPage.tsx';
import { DrugDetailPage } from './features/dashboard/routes/DrugDetailPage.tsx';
import { DrugsPage } from './features/dashboard/routes/DrugsPage.tsx';
import { PharmacyInfoPage } from './features/dashboard/routes/PharmacyInfoPage.tsx';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <Navigate to="/dashboard" replace />,
	},
	{
		path: '/login',
		element: (
			<div className="flex min-h-screen items-center justify-center bg-[#f6f8fb]">
				<Login />
			</div>
		),
	},
	{
		path: '/dashboard',
		element: <DashboardPage />,
		children: [
			{
				index: true,
				element: <DashboardIndexPage />,
			},
			{
				path: 'drugs',
				element: <DrugsPage />,
			},
			{
				path: 'drugs/:medicineId',
				element: <DrugDetailPage />,
			},
			{
				path: 'info',
				element: <PharmacyInfoPage />,
			},
		],
	},
]);
