import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Calendar, Clock, ChevronLeft, ChevronRight, MapPin, 
  Moon, Sun, RefreshCw, Search, Play, Pause, Bookmark, 
  ArrowRight, ArrowLeft, Mic2, Volume2, StopCircle, Loader2, X, Music, Layers,
  Heart, CheckCircle, Edit3
} from 'lucide-react';

// --- DATA SET: DOA SEHARI-HARI ---
const DOA_DATA = [
  // --- KATEGORI: HARIAN (Makan, Tidur, WC) ---
  { id: 'd1', category: 'harian', title: 'Sebelum Makan', arab: 'بِسْمِ اللَّهِ', latin: 'Bismillah', arti: 'Dengan menyebut nama Allah.', target: 1 },
  { id: 'd2', category: 'harian', title: 'Sesudah Makan', arab: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ', latin: 'Alhamdulillahilladzi ath-amanaa wa saqaanaa wa ja-alanaa muslimiin.', arti: 'Segala puji bagi Allah yang telah memberi kami makan.', target: 1 },
  { id: 'd3', category: 'harian', title: 'Sebelum Tidur', arab: 'بِسْمِكَ اللّهُمَّ اَحْيَا وَ بِسْمِكَ اَمُوْتُ', latin: 'Bismika Allahumma ahyaa wa bismika amuut.', arti: 'Dengan nama-Mu ya Allah aku hidup, dan dengan nama-Mu aku mati.', target: 1 },
  { id: 'd4', category: 'harian', title: 'Bangun Tidur', arab: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ', latin: 'Alhamdullillahilladzi ahyaanaa bada maa amaatanaa wa ilaihin nushur.', arti: 'Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami.', target: 1 },
  { id: 'd5', category: 'harian', title: 'Masuk Kamar Mandi', arab: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ', latin: 'Allahumma inni a’udzu bika minal khubutsi wal khabaaits.', arti: 'Ya Allah, sesungguhnya aku berlindung kepada-Mu dari godaan setan laki-laki dan perempuan.', target: 1 },
  { id: 'd6', category: 'harian', title: 'Keluar Kamar Mandi', arab: 'غُفْرَانَكَ الْحَمْدُ ِللهِ الَّذِىْ اَذْهَبَ عَنِّى اْلاَذَى وَعَافَانِىْ', latin: 'Ghufraanaka. Alhamdulillaahil ladzii adzhaba ‘annil adzaa wa ‘aafaanii.', arti: 'Aku memohon ampunan-Mu. Segala puji bagi Allah yang telah menghilangkan kotoran dariku.', target: 1 },
  { id: 'd7', category: 'harian', title: 'Bercermin', arab: 'اَللَّهُمَّ كَمَا حَسَّنْتَ خَلْقِيْ فَحَسِّنْ خُلُقِيْ', latin: 'Allahumma kamaa hassanta khalqii fahassin khuluqii.', arti: 'Ya Allah, sebagaimana Engkau telah membaguskan penciptaanku, maka baguskanlah pula akhlakku.', target: 1 },
  { id: 'd8', category: 'harian', title: 'Memakai Pakaian', arab: 'الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ', latin: 'Alhamdulillahilladzi kasaanii hadzaa wa rozaqoniihi min ghoiri haulin minnii wa laa quwwatin.', arti: 'Segala puji bagi Allah yang telah memakaikan pakaian ini.', target: 1 },
  { id: 'r1', category: 'rumah', title: 'Keluar Rumah', arab: 'بِسْمِ اللَّهِ ، تَوَكَّلْتُ عَلَى اللَّهِ ، وَلا حَوْلَ وَلا قُوَّةَ إِلاَّ بِاللَّهِ', latin: 'Bismillahi, tawakkaltu ’alallah, laa haula wa laa quwwata illaa billaah.', arti: 'Dengan nama Allah, aku bertawakkal kepada Allah.', target: 1 },
  { id: 'r2', category: 'rumah', title: 'Masuk Rumah', arab: 'بِسْمِ اللهِ وَلَجْنَا، وَبِسْمِ اللهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا', latin: 'Bismillahi walajnaa wa bismillahi kharajnaa wa-alaa rabbinaa tawakkalnaa.', arti: 'Dengan nama Allah kami masuk, dan dengan nama Allah kami keluar.', target: 1 },
  { id: 'r3', category: 'rumah', title: 'Naik Kendaraan', arab: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ', latin: 'Subhanalladzi sakh-khara lanaa hadzaa wa maa kunnaa lahu muqriniin.', arti: 'Maha Suci Allah yang telah menundukkan kendaraan ini bagi kami.', target: 1 },
  { id: 'i1', category: 'ibadah', title: 'Setelah Wudhu', arab: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ', latin: 'Asyhadu an laa ilaaha illallahu wahdahu laa syariika lahu...', arti: 'Aku bersaksi bahwa tiada Tuhan selain Allah Yang Maha Esa.', target: 1 },
  { id: 'i2', category: 'ibadah', title: 'Masuk Masjid', arab: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ', latin: 'Allahummaftah lii abwaaba rahmatik.', arti: 'Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.', target: 1 },
  { id: 'i3', category: 'ibadah', title: 'Keluar Masjid', arab: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ', latin: 'Allahumma innii as-aluka min fadhlika.', arti: 'Ya Allah, sesungguhnya aku memohon keutamaan dari-Mu.', target: 1 },
];

const JUZ_MAPPING = [
  { juz: 1, surah: 1, ayat: 1, info: "Al-Fatihah 1" }, { juz: 2, surah: 2, ayat: 142, info: "Al-Baqarah 142" },
  { juz: 3, surah: 2, ayat: 253, info: "Al-Baqarah 253" }, { juz: 4, surah: 3, ayat: 93, info: "Ali 'Imran 93" },
  { juz: 5, surah: 4, ayat: 24, info: "An-Nisa' 24" }, { juz: 6, surah: 4, ayat: 148, info: "An-Nisa' 148" },
  { juz: 7, surah: 5, ayat: 82, info: "Al-Ma'idah 82" }, { juz: 8, surah: 6, ayat: 111, info: "Al-An'am 111" },
  { juz: 9, surah: 7, ayat: 88, info: "Al-A'raf 88" }, { juz: 10, surah: 8, ayat: 41, info: "Al-Anfal 41" },
  { juz: 11, surah: 9, ayat: 93, info: "At-Taubah 93" }, { juz: 12, surah: 11, ayat: 6, info: "Hud 6" },
  { juz: 13, surah: 12, ayat: 53, info: "Yusuf 53" }, { juz: 14, surah: 15, ayat: 1, info: "Al-Hijr 1" },
  { juz: 15, surah: 17, ayat: 1, info: "Al-Isra' 1" }, { juz: 16, surah: 18, ayat: 75, info: "Al-Kahfi 75" },
  { juz: 17, surah: 21, ayat: 1, info: "Al-Anbiya' 1" }, { juz: 18, surah: 23, ayat: 1, info: "Al-Mu'minun 1" },
  { juz: 19, surah: 25, ayat: 21, info: "Al-Furqan 21" }, { juz: 20, surah: 27, ayat: 56, info: "An-Naml 56" },
  { juz: 21, surah: 29, ayat: 46, info: "Al-Ankabut 46" }, { juz: 22, surah: 33, ayat: 31, info: "Al-Ahzab 31" },
  { juz: 23, surah: 36, ayat: 28, info: "Ya Sin 28" }, { juz: 24, surah: 39, ayat: 32, info: "Az-Zumar 32" },
  { juz: 25, surah: 41, ayat: 47, info: "Fussilat 47" }, { juz: 26, surah: 46, ayat: 1, info: "Al-Ahqaf 1" },
  { juz: 27, surah: 51, ayat: 31, info: "Az-Zariyat 31" }, { juz: 28, surah: 58, ayat: 1, info: "Al-Mujadilah 1" },
  { juz: 29, surah: 67, ayat: 1, info: "Al-Mulk 1" }, { juz: 30, surah: 78, ayat: 1, info: "An-Naba' 1" },
];

const QORI_OPTIONS = [
  { id: '05', name: 'Mishary Rashid Alafasy' },
  { id: '03', name: 'Abdurrahman As-Sudais' },
  { id: '01', name: 'Abdullah Al-Juhany' },
  { id: '02', name: 'Abdul Muhsin Al-Qasim' },
  { id: '04', name: 'Ibrahim Al-Dossari' },
];

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-40">
    <Loader2 className="animate-spin text-emerald-600" size={32} />
  </div>
);

// 1. SHOLAT VIEW (With Manual Location)
const SholatView = ({ location, setLocation }) => {
  const [timings, setTimings] = useState(null);
  const [dateInfo, setDateInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');

  // Default Sangatta
  const DEFAULT_LAT = 0.5583;
  const DEFAULT_LNG = 117.5494;

  useEffect(() => { fetchTimings(); }, [location]);

  const fetchTimings = async () => {
    setLoading(true);
    try {
      const date = new Date();
      const lat = location ? location.latitude : DEFAULT_LAT;
      const lng = location ? location.longitude : DEFAULT_LNG;
      const response = await fetch(`https://api.aladhan.com/v1/timings/${Math.floor(date.getTime() / 1000)}?latitude=${lat}&longitude=${lng}&method=20`);
      const data = await response.json();
      if (data.code === 200) {
        setTimings(data.data.timings);
        setDateInfo(data.data.date);
        determineNextPrayer(data.data.timings);
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const determineNextPrayer = (times) => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const prayerMap = [
      { name: 'Fajr', label: 'Subuh' }, { name: 'Dhuhr', label: 'Dzuhur' },
      { name: 'Asr', label: 'Ashar' }, { name: 'Maghrib', label: 'Maghrib' },
      { name: 'Isha', label: 'Isya' }
    ];
    let found = null;
    for (let p of prayerMap) {
      const [h, m] = times[p.name].split(':').map(Number);
      if ((h * 60 + m) > currentMinutes) { found = p; break; }
    }
    setNextPrayer(found ? found.label : 'Subuh'); 
  };

  const handleManualLocation = () => {
      if(manualLat && manualLng) {
          setLocation({
              latitude: parseFloat(manualLat),
              longitude: parseFloat(manualLng),
              source: 'manual'
          });
          setShowLocationInput(false);
      }
  };

  const prayerNames = { Fajr: 'Subuh', Sunrise: 'Terbit', Dhuhr: 'Dzuhur', Asr: 'Ashar', Sunset: 'Terbenam', Maghrib: 'Maghrib', Isha: 'Isya', Imsak: 'Imsak' };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-5"><Moon size={120} /></div>
        <div className="relative z-10">
          <p className="text-emerald-100 text-sm font-medium">{dateInfo?.hijri?.day} {dateInfo?.hijri?.month.en} {dateInfo?.hijri?.year}</p>
          <h2 className="text-3xl font-bold mt-1">{dateInfo?.gregorian?.weekday?.en}</h2>
          <p className="text-lg opacity-90">{dateInfo?.readable}</p>
          <div className="mt-6">
            <p className="text-emerald-200 text-xs uppercase tracking-wider">Sholat Berikutnya</p>
            <h1 className="text-4xl font-bold">{nextPrayer}</h1>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
             <div className="flex items-center gap-2 text-xs bg-white/20 w-fit px-3 py-1 rounded-full">
                <MapPin size={12} />
                <span>
                    {location ? (location.source === 'manual' ? "Lokasi Manual" : "GPS Aktif") : "Sangatta, Kutai Timur"}
                </span>
             </div>
             <button onClick={() => setShowLocationInput(!showLocationInput)} className="p-1 bg-white/20 rounded-full hover:bg-white/30"><Edit3 size={14}/></button>
          </div>

          {showLocationInput && (
              <div className="mt-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm animate-fade-in">
                  <div className="flex gap-2 mb-2">
                      <input type="text" placeholder="Lat (0.5583)" className="w-1/2 p-2 rounded text-slate-800 text-xs" value={manualLat} onChange={e => setManualLat(e.target.value)} />
                      <input type="text" placeholder="Lng (117.5494)" className="w-1/2 p-2 rounded text-slate-800 text-xs" value={manualLng} onChange={e => setManualLng(e.target.value)} />
                  </div>
                  <button onClick={handleManualLocation} className="w-full bg-emerald-500 hover:bg-emerald-400 py-1 rounded text-xs font-bold">Simpan Koordinat</button>
              </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 font-semibold text-slate-700">Jadwal Sholat Hari Ini</div>
        <div className="divide-y divide-slate-100">
          {timings && Object.keys(prayerNames).map((key) => (
            <div key={key} className={`flex justify-between items-center p-4 ${key === 'Sunrise' || key === 'Sunset' ? 'bg-orange-50/50 text-slate-500' : ''}`}>
              <div className="flex items-center gap-3">
                {['Fajr','Maghrib','Isha'].includes(key) ? <Moon size={18} className="text-emerald-600"/> : <Sun size={18} className="text-orange-400"/>}
                <span className={`font-medium ${['Sunrise','Sunset'].includes(key) ? 'text-sm' : 'text-slate-800'}`}>{prayerNames[key]}</span>
              </div>
              <span className="font-bold font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded">{timings[key]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 2. QURAN VIEW
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
    <div className="h-full pb-24 flex flex-col">
      <div className="sticky top-0 bg-white z-10 pt-2 pb-0 px-1">
         <h2 className="text-2xl font-bold text-slate-800 mb-4">Al-Quran</h2>
         <div className="relative mb-4">
            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
            <input type="text" placeholder="Cari surat..." className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={search} onChange={(e) => setSearch(e.target.value)} />
         </div>
         <div className="flex bg-slate-100 p-1 rounded-xl mb-2">
             <button onClick={() => setViewMode('surat')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${viewMode === 'surat' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Surat</button>
             <button onClick={() => setViewMode('juz')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${viewMode === 'juz' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Juz</button>
         </div>
      </div>
      {loading ? <LoadingSpinner /> : (
        <div className="space-y-3 mt-2 flex-1">
          {viewMode === 'surat' && lastRead && !search && (
            <div onClick={handleContinueReading} className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-4 text-white shadow-md mb-6 cursor-pointer active:scale-95 transition-transform mx-1">
              <div className="flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-2 mb-1"><Bookmark size={16} className="text-emerald-200" fill="currentColor"/><p className="text-xs font-medium text-emerald-100 uppercase tracking-wide">Terakhir Dibaca</p></div>
                    <h3 className="font-bold text-xl">{lastRead.namaSurat}</h3>
                    <p className="text-sm opacity-90">Ayat {lastRead.ayat}</p>
                </div>
                <div className="bg-white/20 p-2 rounded-full"><ArrowRight size={24} /></div>
              </div>
            </div>
          )}
          {viewMode === 'surat' && filteredSurahs.map((surah) => {
            const isPlayingThisSurah = audioState.surahData?.nomor === surah.nomor && audioState.currentAyatIdx !== -1;
            return (
                <div key={surah.nomor} onClick={() => setActiveSurah(surah.nomor)} className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100 active:scale-95 transition-transform cursor-pointer mx-1">
                <div className="w-10 h-10 flex items-center justify-center bg-emerald-50 text-emerald-700 font-bold rounded-full relative">
                    <span className="z-10 text-sm">{surah.nomor}</span>
                    {isPlayingThisSurah && <div className="absolute inset-0 border-2 border-emerald-500 rounded-full animate-ping opacity-20"></div>}
                    <div className="absolute inset-0 border-2 border-emerald-200 rounded-full rotate-45"></div>
                </div>
                <div className="flex-1"><h3 className={`font-bold ${isPlayingThisSurah ? 'text-emerald-600' : 'text-slate-800'}`}>{surah.namaLatin}</h3><p className="text-xs text-slate-500">{surah.arti} • {surah.jumlahAyat} Ayat</p></div>
                <div className="text-right">{isPlayingThisSurah ? <Volume2 size={20} className="text-emerald-500 animate-pulse"/> : <p className="font-serif text-xl text-emerald-800">{surah.nama}</p>}</div>
                </div>
            );
          })}
          {viewMode === 'juz' && (
              <div className="grid grid-cols-2 gap-3 px-1">
                  {JUZ_MAPPING.map((item) => (
                      <div key={item.juz} onClick={() => handleJuzClick(item)} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 active:scale-95 transition-transform cursor-pointer flex flex-col justify-between h-24 hover:border-emerald-200">
                          <div className="flex justify-between items-start"><span className="text-emerald-600 font-bold text-lg">Juz {item.juz}</span><Layers size={16} className="text-slate-300"/></div>
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

// SURAH DETAIL
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
      if(isAudioActive) onStopAudio(); 
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
                    <div className="flex gap-2"><span className={`text-xs font-bold w-8 h-8 flex items-center justify-center rounded-full shadow-sm transition-colors ${isActive ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800'}`}>{ayat.nomorAyat}</span><button onClick={() => isActive ? onStopAudio() : handlePlayAyat(idx)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>{isActive ? <Volume2 size={14} className="animate-pulse"/> : <Play size={14} className="ml-0.5"/>}</button></div>
                    <button onClick={() => saveBookmark(ayat.nomorAyat)} className={`p-2 rounded-full transition-all ${isBookmarked ? 'text-amber-500 bg-amber-100' : 'text-slate-300 hover:text-emerald-400'}`}><Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} /></button>
                </div>
                <p className={`font-serif text-3xl text-right leading-loose mb-4 transition-colors ${isActive ? 'text-emerald-900 font-medium' : 'text-slate-800'}`} style={{lineHeight: '2.5'}}>{ayat.teksArab}</p>
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

// 3. HIJRI CALENDAR VIEW
const HijriCalendarView = () => {
  const [viewDate, setViewDate] = useState(new Date());
  // State untuk penyesuaian tanggal manual (+/- hari)
  const [hijriOffset, setHijriOffset] = useState(0);

  // Helper untuk menambah/kurang hari pada tanggal Masehi sebelum dikonversi
  const getAdjustedDate = (baseDate, offset) => {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + offset);
      return d;
  };

  const getHijriDate = (date) => {
    const adjusted = getAdjustedDate(date, hijriOffset);
    return new Intl.DateTimeFormat('id-ID-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(adjusted);
  };

  const getHijriDay = (date) => {
    const adjusted = getAdjustedDate(date, hijriOffset);
    const parts = new Intl.DateTimeFormat('id-ID-u-ca-islamic', { day: 'numeric' }).formatToParts(adjusted);
    const day = parts.find(p => p.type === 'day');
    return day ? day.value : '';
  };

  const getMonthName = (date) => {
    return date.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
  };

  // Helper for grid generation
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    // 0 = Sunday, 1 = Monday, ... but we want Monday start usually or Sunday start
    // Standard calendar usually starts Sunday (0)
    return new Date(year, month, 1).getDay();
  };

  const prevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const days = ['Ming', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const daysInMonth = getDaysInMonth(viewDate);
  const firstDay = getFirstDayOfMonth(viewDate); // 0 (Sunday) to 6 (Saturday)
  
  const calendarCells = [];
  // Empty slots
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(<div key={`empty-${i}`} className="h-14"></div>);
  }
  
  const today = new Date();
  
  // Days
  for (let d = 1; d <= daysInMonth; d++) {
    const currentDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
    const isToday = today.getDate() === d && today.getMonth() === viewDate.getMonth() && today.getFullYear() === viewDate.getFullYear();
    // Gunakan fungsi getHijriDay yang sudah support offset
    const hijriDay = getHijriDay(currentDate);

    calendarCells.push(
      <div key={d} className={`h-14 flex flex-col items-center justify-center rounded-lg border border-slate-50 relative ${isToday ? 'bg-emerald-50 border-emerald-200' : 'hover:bg-slate-50'}`}>
        <span className={`text-sm font-bold ${isToday ? 'text-emerald-700' : 'text-slate-700'}`}>{d}</span>
        <span className="text-[10px] text-slate-400 mt-0.5">{hijriDay}</span>
        {isToday && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>}
      </div>
    );
  }

  // Hijri Header Info (Adjusted)
  const midMonthDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), 15);
  const adjustedMid = getAdjustedDate(midMonthDate, hijriOffset);
  const hijriMonthInfo = new Intl.DateTimeFormat('id-ID-u-ca-islamic', { month: 'long', year: 'numeric' }).format(adjustedMid);

  return (
    <div className="flex flex-col h-full pb-24 px-4 pt-4">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Kalender Hijriyah</h2>
      
      {/* Header Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 rounded-full hover:bg-slate-100 text-slate-600"><ChevronLeft size={20}/></button>
          <div className="text-center">
            <h3 className="font-bold text-slate-800 text-lg">{getMonthName(viewDate)}</h3>
            <p className="text-emerald-600 text-sm font-medium">{hijriMonthInfo}</p>
          </div>
          <button onClick={nextMonth} className="p-2 rounded-full hover:bg-slate-100 text-slate-600"><ChevronRight size={20}/></button>
        </div>

        {/* Grid Days Name */}
        <div className="grid grid-cols-7 text-center mb-2">
          {days.map(day => (
            <span key={day} className="text-xs font-bold text-slate-400 uppercase">{day}</span>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarCells}
        </div>
      </div>

      {/* Kontrol Koreksi Tanggal */}
      <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
          <span className="text-xs font-bold text-slate-500">Koreksi Tanggal Hijriyah:</span>
          <div className="flex items-center gap-2">
              <button 
                onClick={() => setHijriOffset(prev => prev - 1)}
                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg border border-slate-200 shadow-sm text-slate-600 hover:bg-slate-50 active:scale-95 text-xs font-bold"
              >
                  -1
              </button>
              <span className="text-xs font-mono font-bold w-6 text-center text-emerald-600">
                  {hijriOffset > 0 ? `+${hijriOffset}` : hijriOffset}
              </span>
              <button 
                onClick={() => setHijriOffset(prev => prev + 1)}
                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg border border-slate-200 shadow-sm text-slate-600 hover:bg-slate-50 active:scale-95 text-xs font-bold"
              >
                  +1
              </button>
          </div>
      </div>

      <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
        <div className="flex items-start gap-3">
          <div className="bg-white p-2 rounded-full shadow-sm text-emerald-600 mt-1">
            <Calendar size={20} />
          </div>
          <div>
            <h4 className="font-bold text-emerald-800 text-sm">Hari Ini</h4>
            <p className="text-slate-600 text-xs mt-1">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="text-emerald-700 font-bold text-sm mt-1">
              {getHijriDate(new Date())}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. DOA & DZIKIR VIEW
const DoaView = () => {
  const [activeCategory, setActiveCategory] = useState('harian');
  const [counts, setCounts] = useState({});
  const filteredDoa = DOA_DATA.filter(item => item.category === activeCategory);
  const handleCount = (id, target) => { setCounts(prev => { const current = prev[id] || 0; if (current < target) { if (navigator.vibrate) navigator.vibrate(20); return { ...prev, [id]: current + 1 }; } return prev; }); };
  const handleReset = (id) => { setCounts(prev => ({ ...prev, [id]: 0 })); };

  return (
    <div className="flex flex-col h-full pb-24">
      <div className="sticky top-0 bg-white z-10 pt-4 px-4 pb-2">
         <h2 className="text-2xl font-bold text-slate-800 mb-4">Kumpulan Doa</h2>
         <div className="flex bg-slate-100 p-1 rounded-xl">
             {['harian', 'rumah', 'ibadah'].map(cat => (
                 <button key={cat} onClick={() => setActiveCategory(cat)} className={`flex-1 py-2 text-sm font-bold rounded-lg capitalize transition-all ${activeCategory === cat ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{cat}</button>
             ))}
         </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredDoa.map((item) => {
              const currentCount = counts[item.id] || 0; const isDone = currentCount >= item.target; const progress = (currentCount / item.target) * 100;
              return (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 relative overflow-hidden">
                      <div className="flex justify-between items-start mb-3"><h3 className="font-bold text-slate-800">{item.title}</h3>{item.target > 1 && (<div className="flex items-center gap-2"><span className={`text-xs font-bold px-2 py-1 rounded-full ${isDone ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{currentCount}/{item.target}</span>{currentCount > 0 && (<button onClick={() => handleReset(item.id)} className="text-slate-400 hover:text-red-400"><RefreshCw size={14}/></button>)}</div>)}</div>
                      <p className="font-serif text-2xl text-right leading-loose text-slate-800 mb-3">{item.arab}</p>
                      <div className="bg-slate-50 rounded-lg p-3 mb-4"><p className="text-emerald-700 text-sm italic mb-1 font-medium">{item.latin}</p><p className="text-slate-600 text-xs">{item.arti}</p></div>
                      {item.target > 1 && (<button onClick={() => handleCount(item.id, item.target)} className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${isDone ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 active:bg-emerald-100'}`}>{isDone ? <><CheckCircle size={18}/> Selesai</> : "Hitung"}</button>)}
                      {item.target > 1 && (<div className="absolute bottom-0 left-0 h-1 bg-slate-100 w-full"><div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${progress}%` }}></div></div>)}
                  </div>
              );
          })}
          <div className="h-8"></div>
      </div>
    </div>
  );
};

// MINI PLAYER
const MiniPlayer = ({ audioState, onClose, onOpen }) => {
    if (!audioState.surahData || audioState.currentAyatIdx === -1) return null;
    const currentAyat = audioState.surahData.ayat[audioState.currentAyatIdx];
    return (
        <div onClick={onOpen} className="fixed bottom-[70px] left-0 right-0 mx-auto w-full max-w-md px-4 z-40 transition-all duration-300 slide-up cursor-pointer active:scale-[0.98]">
            <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-xl shadow-2xl p-3 flex items-center justify-between border border-slate-700">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center shrink-0 animate-pulse-slow"><Music size={18} /></div>
                    <div className="min-w-0"><h4 className="font-bold text-sm truncate">{audioState.surahData.namaLatin}</h4><p className="text-xs text-emerald-400 truncate">Ayat {currentAyat?.nomorAyat} • {QORI_OPTIONS.find(q => q.id === audioState.qoriID)?.name.split(' ')[0]}</p></div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <div className="h-4 w-8 flex gap-0.5 items-end justify-center"><div className="w-1 bg-emerald-500 animate-[bounce_1s_infinite] h-2"></div><div className="w-1 bg-emerald-500 animate-[bounce_1.2s_infinite] h-3"></div><div className="w-1 bg-emerald-500 animate-[bounce_0.8s_infinite] h-1.5"></div></div>
                    <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
                </div>
            </div>
        </div>
    );
};

// --- APP ROOT ---
const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [location, setLocation] = useState(null);
  const [activeSurah, setActiveSurah] = useState(null);
  const [jumpToAyat, setJumpToAyat] = useState(null);
  const [audioState, setAudioState] = useState({ surahData: null, currentAyatIdx: -1, qoriID: '05' });
  const audioRef = useRef(null);

  useEffect(() => {
      audioRef.current = new Audio();
      if ("geolocation" in navigator) navigator.geolocation.getCurrentPosition((p) => setLocation({ latitude: p.coords.latitude, longitude: p.coords.longitude }), (e) => console.log(e));
      return () => { if(audioRef.current) { audioRef.current.pause(); } };
  }, []);

  useEffect(() => {
      const audio = audioRef.current;
      if (!audio || !audioState.surahData || audioState.currentAyatIdx === -1) { if(audio) audio.pause(); return; }
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
      if(audioState.surahData && audioState.currentAyatIdx !== -1) {
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
      default: return <SholatView location={location} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex justify-center">
        <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative flex flex-col">
            <div className="h-2 w-full bg-emerald-600"></div>
            {/* Main Content with ID for Scroll Target */}
            <main id="main-content" className="flex-1 overflow-y-auto p-4 scrollbar-hide">{renderContent()}</main>
            <MiniPlayer audioState={audioState} onClose={handleStopAudio} onOpen={handleMiniPlayerClick} />
            <nav className="bg-white border-t border-slate-200 fixed bottom-0 w-full max-w-md z-50 pb-safe">
                <div className="flex justify-around items-center h-16">
                    <NavBtn active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Clock size={22} />} label="Sholat" />
                    <NavBtn 
                        active={activeTab === 'quran'} 
                        onClick={() => {
                            setActiveTab('quran');
                            // FORCE RESET VIEW
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

const NavBtn = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center w-full h-full ${active ? 'text-emerald-600' : 'text-slate-400'}`}>
    <div className={`mb-1 transition-transform ${active ? 'scale-110' : ''}`}>{icon}</div>
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default App;