import { useState } from 'react';
import { RefreshCw, CheckCircle } from 'lucide-react';
import { DOA_DATA } from '../data/doaData';

const DoaView = () => {
  const [activeCategory, setActiveCategory] = useState('harian');
  const [counts, setCounts] = useState({});
  const filteredDoa = DOA_DATA.filter(item => item.category === activeCategory);

  const handleCount = (id, target) => {
    setCounts(prev => {
      const current = prev[id] || 0;
      if (current < target) {
        if (navigator.vibrate) navigator.vibrate(20);
        return { ...prev, [id]: current + 1 };
      }
      return prev;
    });
  };

  const handleReset = (id) => { setCounts(prev => ({ ...prev, [id]: 0 })); };

  return (
    <div className="flex flex-col h-full pb-24">
      <div className="sticky top-0 bg-white z-10 pt-4 px-4 pb-2">
        <div className="flex items-center gap-3 mb-4">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-lg shadow-sm" />
          <h2 className="text-2xl font-bold text-slate-800">Kumpulan Doa</h2>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {['harian', 'rumah', 'ibadah'].map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`flex-1 py-2 text-sm font-bold rounded-lg capitalize transition-all ${activeCategory === cat ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{cat}</button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredDoa.map((item) => {
          const currentCount = counts[item.id] || 0;
          const isDone = currentCount >= item.target;
          const progress = (currentCount / item.target) * 100;
          return (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 relative overflow-hidden">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-slate-800">{item.title}</h3>
                {item.target > 1 && (
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${isDone ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{currentCount}/{item.target}</span>
                    {currentCount > 0 && (
                      <button onClick={() => handleReset(item.id)} className="text-slate-400 hover:text-red-400"><RefreshCw size={14} /></button>
                    )}
                  </div>
                )}
              </div>
              <p className="font-serif text-2xl text-right leading-loose text-slate-800 mb-3">{item.arab}</p>
              <div className="bg-slate-50 rounded-lg p-3 mb-4">
                <p className="text-emerald-700 text-sm italic mb-1 font-medium">{item.latin}</p>
                <p className="text-slate-600 text-xs">{item.arti}</p>
              </div>
              {item.target > 1 && (
                <button onClick={() => handleCount(item.id, item.target)} className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${isDone ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 active:bg-emerald-100'}`}>
                  {isDone ? <><CheckCircle size={18} /> Selesai</> : "Hitung"}
                </button>
              )}
              {item.target > 1 && (
                <div className="absolute bottom-0 left-0 h-1 bg-slate-100 w-full">
                  <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
              )}
            </div>
          );
        })}
        <div className="h-8"></div>
      </div>
    </div>
  );
};

export default DoaView;
