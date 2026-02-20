import { X, Music } from 'lucide-react';
import { QORI_OPTIONS } from '../data/qoriOptions';

const MiniPlayer = ({ audioState, onClose, onOpen }) => {
  if (!audioState.surahData || audioState.currentAyatIdx === -1) return null;
  const currentAyat = audioState.surahData.ayat[audioState.currentAyatIdx];
  const qoriName = QORI_OPTIONS.find(q => q.id === audioState.qoriID)?.name || 'Qori';
  
  return (
    <div onClick={onOpen} className="fixed bottom-[74px] left-0 right-0 mx-auto w-full max-w-md px-4 z-40 transition-all duration-300 slide-up cursor-pointer active:scale-[0.98]">
      <div className="bg-slate-900/95 backdrop-blur-xl text-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-4 flex items-center justify-between border border-white/10 overflow-hidden relative">
        {/* Animated Glow Effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
        
        <div className="flex items-center gap-4 overflow-hidden relative">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-900/40 relative group">
            <Music size={20} className="text-white" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-emerald-600 rounded-full animate-ping"></div>
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[9px] font-black uppercase tracking-[0.1em] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">Sedang Memutar</span>
            </div>
            <h4 className="font-bold text-sm truncate text-white leading-tight">
              {audioState.surahData.namaLatin} <span className="text-slate-400 font-normal ml-1">Ayat {currentAyat?.nomorAyat}</span>
            </h4>
            <p className="text-[11px] text-slate-400 truncate mt-0.5 flex items-center gap-1">
              <span className="opacity-70">Qori:</span> <span className="text-emerald-300/90 font-medium">{qoriName}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="flex gap-1 items-end h-4 pb-1">
            <div className="w-1 bg-emerald-500 rounded-full animate-[bounce_1s_infinite] h-2"></div>
            <div className="w-1 bg-emerald-500 rounded-full animate-[bounce_1.2s_infinite] h-4"></div>
            <div className="w-1 bg-emerald-500 rounded-full animate-[bounce_0.8s_infinite] h-2.5"></div>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }} 
            className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-all active:rotate-90"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
