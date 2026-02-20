import { useState, useEffect, useRef } from 'react';
import { BookOpen, Calendar, Clock, Heart } from 'lucide-react';
import SholatView from './views/SholatView';
import QuranView from './views/QuranView';
import HijriCalendarView from './views/HijriCalendarView';
import DoaView from './views/DoaView';
import MiniPlayer from './components/MiniPlayer';
import NavBtn from './components/NavBtn';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [location, setLocation] = useState(null);
  const [activeSurah, setActiveSurah] = useState(null);
  const [jumpToAyat, setJumpToAyat] = useState(null);
  const [audioState, setAudioState] = useState({ surahData: null, currentAyatIdx: -1, qoriID: '05' });
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio();
    if ("geolocation" in navigator) navigator.geolocation.getCurrentPosition(
      (p) => setLocation({ latitude: p.coords.latitude, longitude: p.coords.longitude }),
      (e) => console.log(e)
    );
    return () => { if (audioRef.current) { audioRef.current.pause(); } };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioState.surahData || audioState.currentAyatIdx === -1) { if (audio) audio.pause(); return; }
    const ayatData = audioState.surahData.ayat[audioState.currentAyatIdx];
    const src = ayatData.audio[audioState.qoriID] || Object.values(ayatData.audio)[0];
    if (src) {
      audio.src = src;
      audio.play().catch(e => console.log("Play interrupted", e));
      const handleEnded = () => {
        setAudioState(prev => {
          if (prev.currentAyatIdx + 1 < prev.surahData.ayat.length) return { ...prev, currentAyatIdx: prev.currentAyatIdx + 1 };
          else return { ...prev, currentAyatIdx: -1 };
        });
      };
      audio.addEventListener('ended', handleEnded);
      return () => audio.removeEventListener('ended', handleEnded);
    }
  }, [audioState.surahData, audioState.currentAyatIdx, audioState.qoriID]);

  const handlePlayAudio = (surahData, ayatIdx, qoriID) => { setAudioState({ surahData, currentAyatIdx: ayatIdx, qoriID }); };
  const handleStopAudio = () => { setAudioState(prev => ({ ...prev, currentAyatIdx: -1 })); };
  const handleMiniPlayerClick = () => {
    if (audioState.surahData && audioState.currentAyatIdx !== -1) {
      const surahId = audioState.surahData.nomor;
      const ayatNum = audioState.surahData.ayat[audioState.currentAyatIdx].nomorAyat;
      setActiveTab('quran'); setActiveSurah(surahId); setJumpToAyat(ayatNum);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <SholatView location={location} setLocation={setLocation} />;
      case 'quran': return <QuranView audioState={audioState} onPlayAudio={handlePlayAudio} onStopAudio={handleStopAudio} activeSurah={activeSurah} setActiveSurah={setActiveSurah} jumpToAyat={jumpToAyat} setJumpToAyat={setJumpToAyat} />;
      case 'calendar': return <HijriCalendarView />;
      case 'dzikir': return <DoaView />;
      default: return <SholatView location={location} setLocation={setLocation} />;
    }
  };

  return (
    <div className="h-screen bg-slate-50 font-sans text-slate-900 flex justify-center">
      <div className="w-full max-w-md bg-white h-screen shadow-2xl relative flex flex-col overflow-hidden">
        <div className="h-2 w-full bg-emerald-600"></div>
        <main id="main-content" className="flex-1 overflow-y-auto scrollbar-hide">{renderContent()}</main>
        <MiniPlayer audioState={audioState} onClose={handleStopAudio} onOpen={handleMiniPlayerClick} />
        <nav className="bg-white border-t border-slate-200 fixed bottom-0 w-full max-w-md z-50 pb-safe">
          <div className="flex justify-around items-center h-16">
            <NavBtn active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Clock size={22} />} label="Sholat" />
            <NavBtn
              active={activeTab === 'quran'}
              onClick={() => {
                setActiveTab('quran');
                setActiveSurah(null);
                setJumpToAyat(null);
              }}
              icon={<BookOpen size={22} />}
              label="Quran"
            />
            <NavBtn active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} icon={<Calendar size={22} />} label="Kalender" />
            <NavBtn active={activeTab === 'dzikir'} onClick={() => setActiveTab('dzikir')} icon={<Heart size={22} />} label="Doa" />
          </div>
        </nav>
      </div>
    </div>
  );
};

export default App;
