import { useState, useEffect, useRef } from 'react';
import { BookOpen, Calendar, Clock, Heart } from 'lucide-react';
import SholatView from './views/SholatView';
import QuranView from './views/QuranView';
import HijriCalendarView from './views/HijriCalendarView';
import DoaView from './views/DoaView';
import MiniPlayer from './components/MiniPlayer';
import NavBtn from './components/NavBtn';
import { QORI_OPTIONS } from './data/qoriOptions';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [location, setLocation] = useState(() => {
    const saved = localStorage.getItem('user_location');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeSurah, setActiveSurah] = useState(null);
  const [jumpToAyat, setJumpToAyat] = useState(null);
  const [audioState, setAudioState] = useState({ surahData: null, currentAyatIdx: -1, qoriID: '05' });
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio();
    // Only auto-detect if no location is saved
    if (!location && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (p) => {
          const newLoc = { latitude: p.coords.latitude, longitude: p.coords.longitude, source: 'gps' };
          setLocation(newLoc);
          localStorage.setItem('user_location', JSON.stringify(newLoc));
        },
        (e) => console.log("Location denied or error", e)
      );
    }
    return () => { if (audioRef.current) { audioRef.current.pause(); } };
  }, []);

  useEffect(() => {
    if (location) {
      localStorage.setItem('user_location', JSON.stringify(location));
    }
  }, [location]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioState.surahData || audioState.currentAyatIdx === -1) { if (audio) audio.pause(); return; }
    const ayatData = audioState.surahData.ayat[audioState.currentAyatIdx];
    const src = ayatData.audio[audioState.qoriID] || Object.values(ayatData.audio)[0];
    if (src) {
      audio.src = src;
      audio.play().catch(e => console.log("Play interrupted", e));

      // Update Lock Screen Metadata
      if ('mediaSession' in navigator) {
        const qoriName = QORI_OPTIONS.find(q => q.id === audioState.qoriID)?.name || 'Qori';
        navigator.mediaSession.metadata = new MediaMetadata({
          title: `${audioState.surahData.namaLatin} - Ayat ${ayatData.nomorAyat}`,
          artist: qoriName,
          album: 'Quran Digital',
          artwork: [
            { src: '/favicon.svg', sizes: '96x96', type: 'image/svg+xml' },
            { src: '/favicon.svg', sizes: '128x128', type: 'image/svg+xml' },
            { src: '/favicon.svg', sizes: '192x192', type: 'image/svg+xml' },
            { src: '/favicon.svg', sizes: '256x256', type: 'image/svg+xml' },
            { src: '/favicon.svg', sizes: '384x384', type: 'image/svg+xml' },
            { src: '/favicon.svg', sizes: '512x512', type: 'image/svg+xml' },
          ]
        });

        navigator.mediaSession.setActionHandler('play', () => audio.play());
        navigator.mediaSession.setActionHandler('pause', () => audio.pause());
        navigator.mediaSession.setActionHandler('stop', handleStopAudio);
      }

      const handleEnded = () => {
        const isLastAyat = audioState.currentAyatIdx + 1 >= audioState.surahData.ayat.length;
        const isNotAnNas = audioState.surahData.nomor < 114;

        if (!isLastAyat) {
          setAudioState(prev => ({ ...prev, currentAyatIdx: prev.currentAyatIdx + 1 }));
        } else if (isNotAnNas) {
          // Surah finished, fetch next surah
          const nextNum = audioState.surahData.nomor + 1;
          fetch(`https://equran.id/api/v2/surat/${nextNum}`)
            .then(res => res.json())
            .then(data => {
              if (data.code === 200) {
                setAudioState(prev => ({
                  ...prev,
                  surahData: data.data,
                  currentAyatIdx: 0
                }));
              }
            });
        } else {
          // Finished An-Nas or no more surahs
          handleStopAudio();
        }
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
