import { Link } from 'react-router';

export const Header = () => {
	return (
		<header className="h-25 flex items-center">
			<Link
				to="/"
				className="text-4xl font-black font-mono ml-5 text-gray-200"
				reloadDocument={true}
			>
				Florence
			</Link>
		</header>
	);
};
