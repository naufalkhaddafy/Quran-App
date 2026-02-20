import { useState, useEffect } from 'react';
import { Moon, Sun, MapPin, Edit3 } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const SholatView = ({ location, setLocation }) => {
  const [timings, setTimings] = useState(null);
  const [dateInfo, setDateInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');

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
    if (manualLat && manualLng) {
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
    <div className="space-y-6 pb-20 p-4">
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
            <button onClick={() => setShowLocationInput(!showLocationInput)} className="p-1 bg-white/20 rounded-full hover:bg-white/30"><Edit3 size={14} /></button>
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
