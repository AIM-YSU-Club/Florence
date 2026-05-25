import { createBrowserRouter } from 'react-router';
import { Main } from './pages/Main';
import Login from './pages/Login';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <Main />,
	},
	{
		path: '/login',
		element: (
			<div className="flex min-h-screen items-center justify-center bg-[#f6f8fb]">
				<Login />
			</div>
		),
	},
]);
