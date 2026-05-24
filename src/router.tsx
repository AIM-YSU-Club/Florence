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
			<div
				style={{
					minHeight: '100vh',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					background: '#f6f8fb',
				}}
			>
				<Login />
			</div>
		),
	},
]);
