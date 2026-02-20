const NavBtn = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center w-full h-full cursor-pointer ${active ? 'text-emerald-600' : 'text-slate-400'}`}>
    <div className={`mb-1 transition-transform ${active ? 'scale-110' : ''}`}>{icon}</div>
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default NavBtn;
