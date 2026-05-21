import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { drugs as initialDrugs } from '../mock';
import AddDrugModal from '../components/AddDrugModal';

const cardColors = [
  { from: 'from-blue-100', to: 'to-sky-light', accent: 'bg-blue-500', shadow: 'shadow-blue-200/40' },
  { from: 'from-emerald-100', to: 'to-teal-100', accent: 'bg-emerald-500', shadow: 'shadow-emerald-200/40' },
  { from: 'from-violet-100', to: 'to-purple-100', accent: 'bg-violet-500', shadow: 'shadow-violet-200/40' },
  { from: 'from-amber-100', to: 'to-orange-100', accent: 'bg-amber-500', shadow: 'shadow-amber-200/40' },
  { from: 'from-rose-100', to: 'to-pink-100', accent: 'bg-rose-500', shadow: 'shadow-rose-200/40' },
  { from: 'from-cyan-100', to: 'to-sky-100', accent: 'bg-cyan-500', shadow: 'shadow-cyan-200/40' },
];

const drugIcons = ['💊', '🩹', '🧪', '💉', '🌡️', '🩺'];

export default function DrugList() {
  const [drugList, setDrugList] = useState(initialDrugs);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleAdd = ({ name }) => {
    const newId = Math.max(...drugList.map((d) => d.id), 0) + 1;
    setDrugList([...drugList, { id: newId, name }]);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h1 className="text-[28px] font-extrabold text-gray-800 tracking-tight">약품 관리</h1>
          <p className="text-sm text-gray-400 mt-1.5">
            임시TEXT <span className="font-bold text-sky">{drugList.length}</span>
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-sky text-white font-bold text-sm shadow-lg shadow-sky/25 hover:bg-sky-dark hover:shadow-xl hover:shadow-sky/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          새 약품 추가
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {drugList.map((drug, i) => {
          const color = cardColors[i % cardColors.length];
          const icon = drugIcons[i % drugIcons.length];

          return (
            <button
              key={drug.id}
              onClick={() => navigate(`/drugs/${drug.id}`)}
              className={`group relative bg-gradient-to-br ${color.from} ${color.to} rounded-3xl p-6 pb-5 text-left transition-all duration-300 shadow-md ${color.shadow} hover:shadow-xl hover:-translate-y-1.5 cursor-pointer border border-white/60 overflow-hidden animate-slide-up stagger-${Math.min(i + 1, 5)}`}
            >
              <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/20 rounded-full transition-transform duration-500 group-hover:scale-150" />
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative">
                <div className="text-4xl mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                  {icon}
                </div>
                <p className="font-extrabold text-gray-700 text-lg tracking-tight">{drug.name}</p>
                <div className="flex items-center gap-1.5 mt-3 text-gray-500/70 text-xs font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <span>상세 보기</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${color.accent} opacity-60`} />
            </button>
          );
        })}

        <button
          onClick={() => setShowModal(true)}
          className="group relative rounded-3xl p-6 text-center transition-all duration-300 cursor-pointer border-2 border-dashed border-gray-200 hover:border-sky/50 hover:bg-sky-light/10 hover:shadow-lg hover:shadow-sky/10 hover:-translate-y-1.5 flex flex-col items-center justify-center min-h-[180px] animate-slide-up"
        >
          <div className="w-16 h-16 rounded-2xl bg-gray-100 group-hover:bg-sky-light/40 flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-gray-300 group-hover:text-sky transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <p className="font-bold text-gray-400 group-hover:text-sky transition-colors text-sm">새 약품 추가</p>
          <p className="text-xs text-gray-300 mt-1 group-hover:text-gray-400 transition-colors">임시TEXT</p>
        </button>
      </div>

      {showModal && (
        <AddDrugModal onClose={() => setShowModal(false)} onAdd={handleAdd} />
      )}
    </div>
  );
}
