import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const pageTitles = {
  '/': '약국 정보 관리',
  '/drugs': '약품 관리',
};

export default function Layout() {
  const { pathname } = useLocation();
  const isDrugDetail = pathname.startsWith('/drugs/');

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 ml-72">
        <header className="sticky top-0 z-30 glass border-b border-gray-200/50 px-10 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">
              {isDrugDetail ? '약품 상세' : (pageTitles[pathname] || '')}
            </p>
          </div>
          <div />
        </header>

        <main className="p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
