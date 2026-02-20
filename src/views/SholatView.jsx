import { useState, useEffect } from 'react';
import { Moon, Sun, MapPin, Edit3, Locate, LocateFixed } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const SholatView = ({ location, setLocation }) => {
  const [timings, setTimings] = useState(null);
  const [dateInfo, setDateInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [locationName, setLocationName] = useState('Sangatta, Kutai Timur');

  const DEFAULT_LAT = 0.5583;
  const DEFAULT_LNG = 117.5494;

  useEffect(() => {
    fetchTimings();
    if (location) {
      reverseGeocode(location.latitude, location.longitude);
    } else {
      setLocationName('Sangatta, Kutai Timur');
    }
  }, [location]);

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=id`);
      const data = await res.json();
      const city = data.city || data.locality || data.principalSubdivision || 'Lokasi Terdeteksi';
      setLocationName(city);
    } catch (e) {
      console.error("Geocoding failed", e);
      setLocationName(location?.source === 'manual' ? 'Lokasi Manual' : 'GPS Aktif');
    }
  };

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

  const handleAutoLocation = () => {
    if ("geolocation" in navigator) {
      setIsScanning(true);
      navigator.geolocation.getCurrentPosition(
        (p) => {
          setTimeout(() => {
            setLocation({ latitude: p.coords.latitude, longitude: p.coords.longitude, source: 'gps' });
            setIsScanning(false);
          }, 1500); // Artificial delay for "scanning" feel
        },
        (e) => {
          console.error(e);
          alert("Gagal memindai lokasi. Pastikan izin lokasi aktif.");
          setIsScanning(false);
        }
      );
    } else {
      alert("Browser tidak mendukung geolokasi.");
    }
  };

  const prayerNames = { Fajr: 'Subuh', Sunrise: 'Terbit', Dhuhr: 'Dzuhur', Asr: 'Ashar', Sunset: 'Terbenam', Maghrib: 'Maghrib', Isha: 'Isya', Imsak: 'Imsak' };

  if (loading && !timings) return <LoadingSpinner />;

  return (
    <div className="space-y-6 pb-20 p-4">
      <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-5 flex gap-2">
          <Moon size={120} />
        </div>
        
        {/* Scanning Animation Layer */}
        {isScanning && (
          <div className="absolute inset-0 bg-emerald-600/50 backdrop-blur-sm z-20 flex flex-col items-center justify-center animate-fade-in">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-emerald-200/20 border-t-emerald-200 rounded-full animate-spin"></div>
              <MapPin className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-100 animate-pulse" size={32} />
            </div>
            <p className="mt-4 font-bold text-emerald-50 tracking-widest text-xs uppercase animate-pulse">Memindai Map...</p>
          </div>
        )}

        <div className="relative z-10">
          <p className="text-emerald-100 text-sm font-medium">{dateInfo?.hijri?.day} {dateInfo?.hijri?.month.en} {dateInfo?.hijri?.year}</p>
          <h2 className="text-3xl font-bold mt-1">{dateInfo?.gregorian?.weekday?.en}</h2>
          <p className="text-lg opacity-90">{dateInfo?.readable}</p>
          
          <div className="mt-6 flex justify-between items-end">
            <div>
              <p className="text-emerald-200 text-xs uppercase tracking-wider">Sholat Berikutnya</p>
              <h1 className="text-4xl font-bold">{nextPrayer}</h1>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs bg-white/20 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <MapPin size={12} className={location?.source === 'gps' ? 'text-emerald-300' : 'text-white'} />
                  <span className="font-medium">{locationName}</span>
                </div>
                {location?.source === 'gps' && (
                  <span className="text-[10px] text-emerald-200 font-bold ml-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                    Lokasi Terdeteksi Otomatis
                  </span>
                )}
              </div>
              <button 
                onClick={handleAutoLocation} 
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${location?.source === 'gps' ? 'bg-white/10 text-white' : 'bg-white text-emerald-800 shadow-lg'}`}
              >
                <div className={isScanning ? 'animate-spin' : ''}>
                  {location?.source === 'gps' ? <LocateFixed size={16} /> : <Locate size={16} />}
                </div>
                {location?.source === 'gps' ? 'Pindai Ulang' : 'Pindai Map'}
              </button>
            </div>
          </div>
        </div>
      </div>


      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 font-semibold text-slate-700">Jadwal Sholat Hari Ini</div>
        <div className="divide-y divide-slate-100">
          {timings && Object.keys(prayerNames).map((key) => (
            <div key={key} className={`flex justify-between items-center p-4 ${key === 'Sunrise' || key === 'Sunset' ? 'bg-orange-50/50 text-slate-500' : ''}`}>
              <div className="flex items-center gap-3">
                {['Fajr', 'Maghrib', 'Isha'].includes(key) ? <Moon size={18} className="text-emerald-600" /> : <Sun size={18} className="text-orange-400" />}
                <span className={`font-medium ${['Sunrise', 'Sunset'].includes(key) ? 'text-sm' : 'text-slate-800'}`}>{prayerNames[key]}</span>
              </div>
              <span className="font-bold font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded">{timings[key]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SholatView;
