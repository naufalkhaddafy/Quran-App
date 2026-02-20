import { useState, useEffect } from 'react';
import { Search, Bookmark, ArrowRight, Volume2, Layers } from 'lucide-react';
import { JUZ_MAPPING } from '../data/juzMapping';
import LoadingSpinner from '../components/LoadingSpinner';
import SurahDetail from './SurahDetail';

const QuranView = ({ audioState, onPlayAudio, onStopAudio, activeSurah, setActiveSurah, jumpToAyat, setJumpToAyat }) => {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [lastRead, setLastRead] = useState(null);
  const [viewMode, setViewMode] = useState('surat');

  const refreshLastRead = () => {
    const saved = localStorage.getItem('quran_last_read');
    if (saved) setLastRead(JSON.parse(saved));
  };

  useEffect(() => {
    fetch('https://equran.id/api/v2/surat').then(res => res.json()).then(data => { setSurahs(data.data); setLoading(false); });
    refreshLastRead();
  }, []);

  useEffect(() => {
    if (!activeSurah) {
      const main = document.getElementById('main-content');
      if (main) main.scrollTop = 0;
      refreshLastRead();
    }
  }, [activeSurah]);

  const handleContinueReading = () => { if (lastRead) { setJumpToAyat(lastRead.ayat); setActiveSurah(lastRead.surah); } };
  const handleChangeSurah = (newNumber) => { if (newNumber < 1 || newNumber > 114) return; setJumpToAyat(null); setActiveSurah(newNumber); };
  const handleBack = () => { setActiveSurah(null); setJumpToAyat(null); };
  const handleJuzClick = (juz) => { setJumpToAyat(juz.ayat); setActiveSurah(juz.surah); };

  const filteredSurahs = surahs.filter(s => s.namaLatin.toLowerCase().includes(search.toLowerCase()));

  if (activeSurah) {
    return <SurahDetail surahNumber={activeSurah} initialAyat={jumpToAyat} onChangeSurah={handleChangeSurah} onBack={handleBack} audioState={audioState} onPlayAudio={onPlayAudio} onStopAudio={onStopAudio} />;
  }

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 bg-white z-10 pt-4 pb-3 px-4 space-y-3 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3">
          <img src="/favicon.svg" alt="Logo" className="w-8 h-8 rounded-lg shadow-sm" />
          <h2 className="text-2xl font-bold text-slate-800">Al-Quran</h2>
        </div>
        {lastRead && !search && (
          <div onClick={handleContinueReading} className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-3 text-white shadow-md cursor-pointer active:scale-[0.98] transition-transform">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-0.5"><Bookmark size={14} className="text-emerald-200" fill="currentColor" /><p className="text-[10px] font-medium text-emerald-100 uppercase tracking-wide">Terakhir Dibaca</p></div>
                <h3 className="font-bold text-lg leading-tight">{lastRead.namaSurat} <span className="font-normal text-sm opacity-80">— Ayat {lastRead.ayat}</span></h3>
              </div>
              <div className="bg-white/20 p-2 rounded-full"><ArrowRight size={20} /></div>
            </div>
          </div>
        )}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-slate-400" size={20} />
          <input type="text" placeholder="Cari surat..." className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button onClick={() => setViewMode('surat')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${viewMode === 'surat' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Surat</button>
          <button onClick={() => setViewMode('juz')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${viewMode === 'juz' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Juz</button>
        </div>
      </div>
      {loading ? <LoadingSpinner /> : (
        <div className="space-y-3 mt-2 pb-24 px-4">
          {viewMode === 'surat' && filteredSurahs.map((surah) => {
            const isPlayingThisSurah = audioState.surahData?.nomor === surah.nomor && audioState.currentAyatIdx !== -1;
            return (
              <div key={surah.nomor} onClick={() => setActiveSurah(surah.nomor)} className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100 active:scale-95 transition-transform cursor-pointer mx-1">
                <div className="w-10 h-10 flex items-center justify-center bg-emerald-50 text-emerald-700 font-bold rounded-full relative">
                  <span className="text-sm">{surah.nomor}</span>
                  {isPlayingThisSurah && <div className="absolute inset-0 border-2 border-emerald-500 rounded-full animate-ping opacity-20"></div>}
                  <div className="absolute inset-0 border-2 border-emerald-200 rounded-full rotate-45"></div>
                </div>
                <div className="flex-1"><h3 className={`font-bold ${isPlayingThisSurah ? 'text-emerald-600' : 'text-slate-800'}`}>{surah.namaLatin}</h3><p className="text-xs text-slate-500">{surah.arti} • {surah.jumlahAyat} Ayat</p></div>
                <div className="text-right">{isPlayingThisSurah ? <Volume2 size={20} className="text-emerald-500 animate-pulse" /> : <p className="font-serif text-xl text-emerald-800">{surah.nama}</p>}</div>
              </div>
            );
          })}
          {viewMode === 'juz' && (
            <div className="grid grid-cols-2 gap-3 px-1">
              {JUZ_MAPPING.map((item) => (
                <div key={item.juz} onClick={() => handleJuzClick(item)} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 active:scale-95 transition-transform cursor-pointer flex flex-col justify-between h-24 hover:border-emerald-200">
                  <div className="flex justify-between items-start"><span className="text-emerald-600 font-bold text-lg">Juz {item.juz}</span><Layers size={16} className="text-slate-300" /></div>
                  <p className="text-xs text-slate-500 font-medium">Mulai di:</p><p className="text-sm font-bold text-slate-700 truncate">{item.info}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuranView;
