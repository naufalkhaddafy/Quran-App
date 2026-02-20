import { X, Music } from 'lucide-react';
import { QORI_OPTIONS } from '../data/qoriOptions';

const MiniPlayer = ({ audioState, onClose, onOpen }) => {
  if (!audioState.surahData || audioState.currentAyatIdx === -1) return null;
  const currentAyat = audioState.surahData.ayat[audioState.currentAyatIdx];
  return (
    <div onClick={onOpen} className="fixed bottom-[70px] left-0 right-0 mx-auto w-full max-w-md px-4 z-40 transition-all duration-300 slide-up cursor-pointer active:scale-[0.98]">
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-xl shadow-2xl p-3 flex items-center justify-between border border-slate-700">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center shrink-0 animate-pulse-slow"><Music size={18} /></div>
          <div className="min-w-0">
            <h4 className="font-bold text-sm truncate">{audioState.surahData.namaLatin}</h4>
            <p className="text-xs text-emerald-400 truncate">Ayat {currentAyat?.nomorAyat} • {QORI_OPTIONS.find(q => q.id === audioState.qoriID)?.name.split(' ')[0]}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="h-4 w-8 flex gap-0.5 items-end justify-center">
            <div className="w-1 bg-emerald-500 animate-[bounce_1s_infinite] h-2"></div>
            <div className="w-1 bg-emerald-500 animate-[bounce_1.2s_infinite] h-3"></div>
            <div className="w-1 bg-emerald-500 animate-[bounce_0.8s_infinite] h-1.5"></div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
