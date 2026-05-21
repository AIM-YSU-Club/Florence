import { NavLink, useLocation } from 'react-router-dom';

const navItems = [
  {
    to: '/',
    end: true,
    label: '약국 정보 관리',
    desc: '기본 정보 수정',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    to: '/drugs',
    label: '약품 관리',
    desc: '약품 목록 및 분석',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="w-72 fixed top-0 left-0 h-screen bg-sidebar-bg border-r border-gray-200/60 flex flex-col z-40">
      <div className="px-7 pt-7 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky to-sky-dark flex items-center justify-center shadow-lg shadow-sky/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <h1 className="font-extrabold text-[17px] text-gray-800 tracking-tight leading-tight">임시TEXT</h1>
            <p className="text-[11px] text-gray-400 font-medium">임시TEXT</p>
          </div>
        </div>
      </div>

      <div className="px-5 mb-2">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      <nav className="flex-1 px-4 py-3 flex flex-col gap-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">메뉴</p>
        {navItems.map((item) => {
          const isActive = item.end
            ? pathname === item.to
            : pathname.startsWith(item.to);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={() =>
                `flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-sky text-white shadow-lg shadow-sky/25'
                    : 'text-gray-500 hover:bg-cream/70 hover:text-gray-700'
                }`
              }
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                isActive ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-cream-dark/50'
              }`}>
                {item.icon}
              </div>
              <div>
                <p className="font-semibold text-[13px] leading-tight">{item.label}</p>
                <p className={`text-[11px] mt-0.5 ${isActive ? 'text-white/70' : 'text-gray-400'}`}>{item.desc}</p>
              </div>
              {isActive && (
                <div className="absolute right-3 w-1.5 h-6 rounded-full bg-white/40" />
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-5 mt-auto">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      <div className="px-5 py-5">
        <div className="bg-gradient-to-br from-cream to-peach rounded-2xl p-4">
          <p className="text-xs font-semibold text-amber-700">임시TEXT</p>
          <p className="text-[11px] text-amber-600/70 mt-1 leading-relaxed">임시TEXT</p>
          <div className="mt-3 w-full h-1.5 bg-amber-200/50 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-amber-400 rounded-full" />
          </div>
        </div>
      </div>
    </aside>
  );
}
