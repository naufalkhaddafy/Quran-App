import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const HijriCalendarView = () => {
  const [viewDate, setViewDate] = useState(new Date());
  const [hijriOffset, setHijriOffset] = useState(0);

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

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
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
  const firstDay = getFirstDayOfMonth(viewDate);

  const calendarCells = [];
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(<div key={`empty-${i}`} className="h-14"></div>);
  }

  const today = new Date();

  for (let d = 1; d <= daysInMonth; d++) {
    const currentDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
    const isToday = today.getDate() === d && today.getMonth() === viewDate.getMonth() && today.getFullYear() === viewDate.getFullYear();
    const hijriDay = getHijriDay(currentDate);

    calendarCells.push(
      <div key={d} className={`h-14 flex flex-col items-center justify-center rounded-lg border border-slate-50 relative ${isToday ? 'bg-emerald-50 border-emerald-200' : 'hover:bg-slate-50'}`}>
        <span className={`text-sm font-bold ${isToday ? 'text-emerald-700' : 'text-slate-700'}`}>{d}</span>
        <span className="text-[10px] text-slate-400 mt-0.5">{hijriDay}</span>
        {isToday && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>}
      </div>
    );
  }

  const midMonthDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), 15);
  const adjustedMid = getAdjustedDate(midMonthDate, hijriOffset);
  const hijriMonthInfo = new Intl.DateTimeFormat('id-ID-u-ca-islamic', { month: 'long', year: 'numeric' }).format(adjustedMid);

  return (
    <div className="flex flex-col h-full pb-24 px-4 pt-4">
      <div className="flex items-center justify-center gap-3 mb-6">
        <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-lg shadow-sm" />
        <h2 className="text-2xl font-bold text-slate-800 text-center">Kalender Hijriyah</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 rounded-full hover:bg-slate-100 text-slate-600"><ChevronLeft size={20} /></button>
          <div className="text-center">
            <h3 className="font-bold text-slate-800 text-lg">{getMonthName(viewDate)}</h3>
            <p className="text-emerald-600 text-sm font-medium">{hijriMonthInfo}</p>
          </div>
          <button onClick={nextMonth} className="p-2 rounded-full hover:bg-slate-100 text-slate-600"><ChevronRight size={20} /></button>
        </div>

        <div className="grid grid-cols-7 text-center mb-2">
          {days.map(day => (
            <span key={day} className="text-xs font-bold text-slate-400 uppercase">{day}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarCells}
        </div>
      </div>

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

export default HijriCalendarView;
