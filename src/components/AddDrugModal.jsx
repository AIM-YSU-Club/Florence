import { useState, useRef, useEffect } from 'react';

export default function AddDrugModal({ onClose, onAdd }) {
  const [name, setName] = useState('');
  const inputRef = useRef();
  const backdropRef = useRef();

  useEffect(() => {
    inputRef.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim() });
    onClose();
  };

  const handleBackdrop = (e) => {
    if (e.target === backdropRef.current) onClose();
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdrop}
      className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50"
      style={{ animation: 'fadeIn 0.2s ease-out' }}
    >
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 animate-slide-up overflow-hidden">
        <div className="bg-gradient-to-r from-sky-light/40 to-peach/30 px-8 pt-7 pb-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-sky-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-gray-800">새 약품 추가</h2>
                <p className="text-xs text-gray-400 mt-0.5">임시TEXT</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-gray-100/80 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-7 flex flex-col gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
              약품명 <span className="text-rose-400">*</span>
            </label>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="약품 이름"
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 bg-gray-50/40 text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-sky/30 focus:border-sky focus:bg-white transition-all text-[15px]"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100 mt-1 -mx-8 px-8 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold bg-sky text-white shadow-lg shadow-sky/25 hover:bg-sky-dark hover:shadow-xl disabled:opacity-30 disabled:shadow-none disabled:cursor-not-allowed disabled:hover:bg-sky transition-all cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              추가하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
