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
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky to-sky-dark flex items-center justify-center text-white text-sm font-bold shadow-md shadow-sky/25 cursor-pointer">
              P
            </div>
          </div>
        </header>

        <main className="p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
