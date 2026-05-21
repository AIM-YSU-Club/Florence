import { Link } from 'react-router';

export const Header = () => {
	return (
		<header className="h-25 flex items-center justify-between border-b">
			<Link
				to="/"
				className="text-4xl font-black font-mono ml-5 text-gray-200"
				reloadDocument={true}
			>
				Florence
			</Link>
			<Link
				to="#"
				className="mr-5 font-semibold disabled:text-gray-500"
				aria-disabled={true}
			>
				로그인
			</Link>
		</header>
	);
};
