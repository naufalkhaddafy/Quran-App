import { useState, useEffect } from 'react';
import {
  ChevronLeft, Play, Bookmark, ArrowRight, ArrowLeft,
  Mic2, Volume2, StopCircle
} from 'lucide-react';
import { QORI_OPTIONS } from '../data/qoriOptions';
import LoadingSpinner from '../components/LoadingSpinner';

const SurahDetail = ({ surahNumber, onBack, initialAyat, onChangeSurah, audioState, onPlayAudio, onStopAudio }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarkedAyat, setBookmarkedAyat] = useState(null);
  const [selectedQori, setSelectedQori] = useState(audioState.qoriID || '05');
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  useEffect(() => {
    setLoading(true);
    const savedQori = localStorage.getItem('preferred_qori');
    if (savedQori) setSelectedQori(savedQori);

    const saved = localStorage.getItem('quran_last_read');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.surah === surahNumber) {
        setBookmarkedAyat(parsed.ayat);
      } else {
        setBookmarkedAyat(null);
      }
    } else {
      setBookmarkedAyat(null);
    }

    fetch(`https://equran.id/api/v2/surat/${surahNumber}`).then(res => res.json()).then(data => {
      setDetail(data.data); setLoading(false);
      if (initialAyat) {
        setTimeout(() => {
          const element = document.getElementById(`ayat-${initialAyat}`);
          if (element) { element.scrollIntoView({ behavior: 'smooth', block: 'center' }); element.classList.add('bg-emerald-50'); setTimeout(() => element.classList.remove('bg-emerald-50'), 2000); }
        }, 600);
      }
    });
  }, [surahNumber, initialAyat]);

  const isAudioActive = audioState.surahData?.nomor === surahNumber && audioState.currentAyatIdx !== -1;
  const currentAyatIdx = isAudioActive ? audioState.currentAyatIdx : -1;

  useEffect(() => {
    if (isAudioActive && currentAyatIdx !== -1 && detail && !loading) {
      const activeAyatNum = detail.ayat[currentAyatIdx]?.nomorAyat;
      if (activeAyatNum) {
        const element = document.getElementById(`ayat-${activeAyatNum}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [currentAyatIdx, isAudioActive, detail, loading]);

  const onTouchStart = (e) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => { if (!touchStart || !touchEnd) return; const distance = touchStart - touchEnd; if (distance > 50) onChangeSurah(surahNumber + 1); if (distance < -50) onChangeSurah(surahNumber - 1); };

  const handlePlayAyat = (idx) => { onPlayAudio(detail, idx, selectedQori); };
  const handleGlobalPlay = () => { isAudioActive ? onStopAudio() : onPlayAudio(detail, 0, selectedQori); };

  const handleQoriChange = (e) => {
    const newQori = e.target.value;
    setSelectedQori(newQori);
    localStorage.setItem('preferred_qori', newQori);
    if (isAudioActive) onStopAudio();
  };

  const saveBookmark = (ayatNum) => { const data = { surah: surahNumber, namaSurat: detail.namaLatin, ayat: ayatNum, timestamp: new Date().getTime() }; localStorage.setItem('quran_last_read', JSON.stringify(data)); setBookmarkedAyat(ayatNum); };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="pb-32 min-h-screen" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      <div className="sticky top-0 bg-white/95 backdrop-blur z-30 border-b border-slate-100 shadow-sm py-3 px-2 mb-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full"><ChevronLeft size={24} /></button><div><h3 className="font-bold text-slate-800 leading-tight">{detail.namaLatin}</h3><p className="text-[10px] text-slate-500 uppercase tracking-wide">{detail.arti}</p></div></div>
          <button onClick={handleGlobalPlay} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${isAudioActive ? 'bg-red-50 text-red-600 ring-1 ring-red-200' : 'bg-emerald-600 text-white shadow-md shadow-emerald-200'}`}>{isAudioActive ? <StopCircle size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}{isAudioActive ? "STOP" : "PUTAR"}</button>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100"><Mic2 size={16} className="text-slate-400 ml-1" /><select value={selectedQori} onChange={handleQoriChange} className="bg-transparent text-xs font-medium text-slate-600 w-full outline-none cursor-pointer">{QORI_OPTIONS.map(q => <option key={q.id} value={q.id}>{q.name}</option>)}</select></div>
      </div>
      {surahNumber !== 9 && <div className="text-center py-6 bg-emerald-50 rounded-2xl mb-6 mx-2 border border-emerald-100"><p className="font-serif text-2xl text-emerald-800">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p></div>}
      <div className="space-y-4 px-2">
        {detail.ayat.map((ayat, idx) => {
          const isActive = currentAyatIdx === idx;
          const isBookmarked = bookmarkedAyat === ayat.nomorAyat;
          return (
            <div key={ayat.nomorAyat} id={`ayat-${ayat.nomorAyat}`} className={`relative rounded-xl transition-all duration-500 p-4 border-b border-slate-100 last:border-0 ${isActive ? 'bg-emerald-50 border-l-4 border-emerald-500 shadow-sm transform scale-[1.01]' : 'hover:bg-slate-50 border-l-4 border-transparent'} ${isBookmarked ? 'bg-amber-50/50' : ''}`}>
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2"><span className={`text-xs font-bold w-8 h-8 flex items-center justify-center rounded-full shadow-sm transition-colors ${isActive ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800'}`}>{ayat.nomorAyat}</span><button onClick={() => isActive ? onStopAudio() : handlePlayAyat(idx)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>{isActive ? <Volume2 size={14} className="animate-pulse" /> : <Play size={14} className="ml-0.5" />}</button></div>
                <button onClick={() => saveBookmark(ayat.nomorAyat)} className={`p-2 rounded-full transition-all ${isBookmarked ? 'text-amber-500 bg-amber-100' : 'text-slate-300 hover:text-emerald-400'}`}><Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} /></button>
              </div>
              <p className={`font-serif text-3xl text-right leading-loose mb-4 transition-colors ${isActive ? 'text-emerald-900 font-medium' : 'text-slate-800'}`} style={{ lineHeight: '2.5' }}>{ayat.teksArab}</p>
              <div className={`text-sm transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-80'}`}><p className="text-emerald-700 italic mb-1.5 font-medium">{ayat.teksLatin}</p><p className="text-slate-600 leading-relaxed">{ayat.teksIndonesia}</p></div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between px-4 mt-8 pt-4 border-t border-slate-100">
        <button onClick={() => onChangeSurah(surahNumber - 1)} disabled={surahNumber <= 1} className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 disabled:opacity-30 hover:bg-slate-100"><ArrowLeft size={16} /> Sebelumnya</button>
        <button onClick={() => onChangeSurah(surahNumber + 1)} disabled={surahNumber >= 114} className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 disabled:opacity-30 hover:bg-slate-100">Selanjutnya <ArrowRight size={16} /></button>
      </div>
    </div>
  );
};

export default SurahDetail;
