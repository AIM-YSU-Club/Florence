import { useState } from 'react';
import { pharmacyInfo } from '../mock';

export default function PharmacyInfo() {
  const [name, setName] = useState(pharmacyInfo.name);
  const [address, setAddress] = useState(pharmacyInfo.address);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-10">
        <h1 className="text-[28px] font-extrabold text-gray-800 tracking-tight">약국 정보 관리</h1>
        <p className="text-sm text-gray-400 mt-1.5">임시TEXT</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-slide-up">
          <div className="flex items-center gap-3 mb-7 pb-6 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-sky-light/60 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-sky-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-gray-700 text-[15px]">임시TEXT</h2>
              <p className="text-xs text-gray-400">임시TEXT</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="group">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                약국 이름
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-sky transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-gray-800 bg-gray-50/40 focus:outline-none focus:ring-2 focus:ring-sky/30 focus:border-sky focus:bg-white transition-all text-[15px]"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                주소
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-sky transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-gray-800 bg-gray-50/40 focus:outline-none focus:ring-2 focus:ring-sky/30 focus:border-sky focus:bg-white transition-all text-[15px]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={handleSave}
                className={`flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer ${
                  saved
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200/50 scale-[1.02]'
                    : 'bg-sky text-white shadow-lg shadow-sky/25 hover:bg-sky-dark hover:shadow-xl hover:shadow-sky/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]'
                }`}
              >
                {saved ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    저장 완료
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    저장하기
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
