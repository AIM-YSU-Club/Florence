import { Header } from '../components/Header.tsx';
import { MainContent } from '../components/MainContent.tsx';

export const Main = () => {
	return (
		<div className="h-full">
			<Header />
			<MainContent />
		</div>
	);
};
