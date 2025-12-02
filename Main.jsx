import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  RotateCcw, Copy, Check, Wallet, 
  Coins, Banknote, Minus, Plus,
  Lock, Unlock, LayoutGrid, Delete, 
  ArrowDown, Sparkles, CreditCard, Trash2, GripHorizontal
} from 'lucide-react';

// ==========================================
// 🔹 設定區
// ==========================================
const LOGO_URL = "https://i.ibb.co/1Yf4N9qy/pack-icon-20240802-010959-0000.png";

// ==========================================
// 0. 全局樣式 (CSS Injection)
// ==========================================
const GlobalStyles = () => (
  <style>{`
    @keyframes float {
      0% { transform: translate(0px, 0px) scale(1); }
      33% { transform: translate(30px, -50px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
      100% { transform: translate(0px, 0px) scale(1); }
    }
    .animate-blob { animation: float 10s infinite ease-in-out; }
    
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    /* 玻璃面板 (Light Mode) */
    .glass-panel {
      background: rgba(255, 255, 255, 0.65);
      backdrop-filter: blur(25px) saturate(180%);
      -webkit-backdrop-filter: blur(25px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.8);
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.08);
    }
    
    /* 玻璃按鈕 */
    .glass-button {
      background: rgba(255, 255, 255, 0.5);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.6);
      box-shadow: 0 2px 6px rgba(0,0,0,0.05);
      transition: all 0.15s ease;
    }
    .glass-button:active {
      background: rgba(255, 255, 255, 0.8);
      transform: scale(0.96);
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
    }

    /* 波浪邊緣 */
    .clip-scallop {
      clip-path: polygon(50% 0%, 61% 2%, 71% 7%, 80% 15%, 87% 24%, 92% 34%, 95% 45%, 95% 57%, 92% 67%, 86% 77%, 78% 85%, 68% 91%, 57% 95%, 45% 97%, 34% 96%, 23% 92%, 14% 85%, 7% 77%, 2% 66%, 0% 55%, 1% 43%, 5% 32%, 11% 22%, 19% 13%, 29% 6%, 40% 1%);
    }
  `}</style>
);

const LiquidBackground = () => (
  <div className="fixed inset-0 z-0 bg-[#F5F7FA] overflow-hidden pointer-events-none">
    <div className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vw] bg-blue-100/60 rounded-full blur-[100px] animate-blob mix-blend-multiply"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-[80vw] h-[80vw] bg-purple-100/60 rounded-full blur-[100px] animate-blob mix-blend-multiply" style={{animationDelay: '2s'}}></div>
    <div className="absolute top-[40%] left-[30%] w-[60vw] h-[60vw] bg-cyan-100/60 rounded-full blur-[100px] animate-blob mix-blend-multiply" style={{animationDelay: '4s'}}></div>
  </div>
);

// ==========================================
// 1. 基礎組件
// ==========================================

const AnimatedNumber = ({ value, className }) => (
  <span className={`transition-all duration-300 inline-block font-mono tracking-tight ${className}`}>
    ${value.toLocaleString(undefined, { minimumFractionDigits: value % 1 === 0 ? 0 : 1 })}
  </span>
);

const TotalBar = ({ total, label = "Total Assets", className="" }) => (
  <div className={`glass-panel rounded-[2rem] p-5 flex justify-between items-center w-full mb-4 ${className}`}>
    <div className="flex flex-col">
      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{label}</span>
      <AnimatedNumber value={total} className="text-5xl font-black text-gray-800" />
    </div>
    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center border border-white shadow-sm animate-pulse">
      <Wallet className="text-blue-600" size={28} />
    </div>
  </div>
);

// 硬幣繪製
const HKDCoin = React.memo(({ value, label, size }) => {
  if (value === 10) {
    return (
      <div className={`${size} rounded-full border-[3px] border-gray-300 bg-gray-200 shadow-md flex items-center justify-center relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-400" />
        <div className="absolute inset-[15%] rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 border border-yellow-700/20 flex items-center justify-center shadow-inner">
           <span className="relative z-10 font-black text-yellow-900 text-xs">{label}</span>
        </div>
      </div>
    );
  }
  if (value === 2 || value === 0.2) {
    const bg = value === 2 ? "from-yellow-100 to-yellow-400" : "from-yellow-600 to-yellow-800";
    const txt = value === 2 ? "text-yellow-900" : "text-yellow-100";
    return (
      <div className={`${size} flex items-center justify-center drop-shadow-md`}>
        <div className={`w-full h-full clip-scallop bg-gradient-to-br ${bg} flex items-center justify-center shadow-inner`}>
           <div className="absolute inset-[1px] clip-scallop border border-black/5"></div>
           <span className={`font-black ${txt} text-[60%] relative z-10`}>{label}</span>
        </div>
      </div>
    );
  }
  const bg = (value >= 1 && value < 10) ? "from-gray-100 to-gray-300" : "from-yellow-600 to-yellow-800";
  const txt = (value >= 1 && value < 10) ? "text-gray-700" : "text-yellow-100";
  return (
    <div className={`${size} rounded-full bg-gradient-to-br ${bg} border-2 border-white/40 shadow-md flex items-center justify-center overflow-hidden`}>
       <span className={`font-black ${txt} text-xs relative z-10`}>{label}</span>
    </div>
  );
});

const NOTE_DATA = [
  { value: 1000, label: '1000', color: 'text-yellow-800', bg: 'bg-gradient-to-r from-yellow-300 to-yellow-500', border: 'border-yellow-500/50', width:'w-36', height:'h-16' },
  { value: 500, label: '500', color: 'text-amber-900', bg: 'bg-gradient-to-r from-amber-600 to-amber-800', border: 'border-amber-700/50', width:'w-36', height:'h-16' },
  { value: 100, label: '100', color: 'text-red-900', bg: 'bg-gradient-to-r from-red-400 to-red-600', border: 'border-red-500/50', width:'w-36', height:'h-16' },
  { value: 50, label: '50', color: 'text-emerald-900', bg: 'bg-gradient-to-r from-emerald-400 to-emerald-600', border: 'border-emerald-500/50', width:'w-36', height:'h-16' },
  { value: 20, label: '20', color: 'text-blue-900', bg: 'bg-gradient-to-r from-blue-400 to-blue-600', border: 'border-blue-500/50', width:'w-36', height:'h-16' },
  { value: 10, label: '10', color: 'text-purple-900', bg: 'bg-gradient-to-r from-purple-400 to-purple-600', border: 'border-purple-500/50', width:'w-36', height:'h-16' },
];

const COIN_DATA = [
  { value: 10, label: '$10', isCoin: true, size: 'w-14 h-14' },
  { value: 5, label: '$5', isCoin: true, size: 'w-12 h-12' },
  { value: 2, label: '$2', isCoin: true, size: 'w-11 h-11' },
  { value: 1, label: '$1', isCoin: true, size: 'w-10 h-10' },
  { value: 0.5, label: '50', isCoin: true, size: 'w-9 h-9' },
  { value: 0.2, label: '20', isCoin: true, size: 'w-8 h-8' },
  { value: 0.1, label: '10', isCoin: true, size: 'w-8 h-8' },
];

// ==========================================
// 2. 標準面板 (StandardPanel)
// ==========================================
const StandardPanel = ({ denoms, title, isVisible }) => {
  const DATA_SET = useMemo(() => denoms.map(d => ({ ...d, id: d.isCoin ? `c${d.value}` : `n${d.value}` })), [denoms]);
  const [counts, setCounts] = useState({});
  const [locks, setLocks] = useState({});
  const [total, setTotal] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => { const i = {}; DATA_SET.forEach(d => i[d.id] = ''); setCounts(i); }, [DATA_SET]);
  useEffect(() => {
    let t = 0; DATA_SET.forEach(d => t += (parseInt(counts[d.id]) || 0) * d.value); setTotal(t);
  }, [counts, DATA_SET]);

  const toggleLock = (id) => setLocks(prev => ({ ...prev, [id]: !prev[id] }));
  
  const updateCount = (id, delta) => {
    if (locks[id]) return;
    setCounts(prev => {
      const val = parseInt(prev[id]) || 0;
      const newVal = Math.max(0, val + delta);
      return { ...prev, [id]: newVal === 0 ? '' : newVal };
    });
  };

  const handleInput = (id, val) => {
    if (locks[id]) return;
    if (val === '') { setCounts(prev => ({ ...prev, [id]: '' })); return; }
    const intVal = parseInt(val);
    if (!isNaN(intVal) && intVal >= 0) { setCounts(prev => ({ ...prev, [id]: intVal })); }
  };

  const handleReset = (e) => {
    e.stopPropagation(); 
    if(window.confirm("重置未鎖定項目？(鎖定項目將保留)")) {
      setCounts(prev => {
        const next = { ...prev };
        DATA_SET.forEach(d => { if (!locks[d.id]) next[d.id] = ''; });
        return next;
      });
    }
  };

  const handleClearAll = (e) => {
    e.stopPropagation();
    if(window.confirm("確定要全部清除嗎？(這會清空所有數據)")) {
      const initialCounts = {};
      DATA_SET.forEach(d => initialCounts[d.id] = '');
      setCounts(initialCounts);
    }
  };

  const handleCopy = () => {
    let text = `【${title}】\n`;
    DATA_SET.forEach(d => {
      const c = parseInt(counts[d.id]) || 0;
      if(c > 0) text += `${d.label} x ${c} = $${(c*d.value).toLocaleString()}\n`;
    });
    text += `Total: $${total.toLocaleString()}`;
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try { document.execCommand('copy'); setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); } catch (err) {}
    document.body.removeChild(textArea);
  };

  if (!isVisible) return null;

  return (
    <div className="flex flex-col h-full">
      {/* 操作列 - 極簡透明 */}
      <div className="flex-none px-4 pt-4 pb-2 z-40 relative pointer-events-auto">
         <div className="glass-panel rounded-[1.5rem] px-4 py-3 flex justify-between items-center relative z-50 bg-white/40 border border-white/50 shadow-sm">
            <div className="flex gap-2 w-full">
                <button 
                  onClick={handleCopy} 
                  className={`glass-button h-10 flex-1 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all active:scale-95 ${isCopied ? 'bg-green-500 text-white border-transparent' : 'bg-white/60 text-gray-600 hover:bg-white'}`}
                >
                  {isCopied ? <Check size={16} /> : <Copy size={16} />} {isCopied ? 'COPIED' : 'COPY'}
                </button>
                <button 
                  onClick={handleReset} 
                  className="glass-button h-10 flex-1 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-amber-600 bg-amber-50/50 border-amber-200 hover:bg-amber-100/80 active:scale-95 z-50"
                >
                  <RotateCcw size={18} /> RESET
                </button>
                <button 
                  onClick={handleClearAll} 
                  className="glass-button h-10 flex-1 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-rose-600 bg-rose-50/50 border-rose-200 hover:bg-rose-100/80 active:scale-95 z-50"
                >
                  <Trash2 size={18} /> CLEAR
                </button>
            </div>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-32 space-y-3 pt-2 no-scrollbar relative z-10">
        {DATA_SET.map((d) => {
           const count = parseInt(counts[d.id]) || 0;
           const isLocked = locks[d.id];
           const isActive = count > 0;
           return (
            <div 
              key={d.id} 
              className={`relative rounded-[1.5rem] border transition-all duration-300 overflow-hidden group
                ${isActive 
                  ? 'bg-white/80 border-blue-200 shadow-lg backdrop-blur-xl scale-[1.01]' 
                  : 'bg-white/40 border-white/60 backdrop-blur-md hover:bg-white/60'}
                ${isLocked ? 'opacity-50 grayscale bg-gray-100/50' : ''}
              `}
            >
              <div className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-4">
                      <div className="w-20 flex justify-center items-center flex-shrink-0 drop-shadow-md">
                        {d.isCoin ? (
                          <HKDCoin value={d.value} label={d.label} size="w-12 h-12" />
                        ) : (
                          <div className={`flex items-center justify-center font-bold rounded-2xl w-16 h-10 text-xl border shadow-md ${d.bg} ${d.border} ${d.color}`}>{d.label}</div>
                        )}
                      </div>
                      
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Subtotal</span>
                        <span className={`text-xl font-mono font-bold ${isActive ? 'text-gray-800' : 'text-gray-400'}`}>
                          ${((parseInt(counts[d.id])||0)*d.value).toLocaleString()}
                        </span>
                      </div>
                   </div>

                   <div className="flex items-center gap-2 bg-gray-50/50 rounded-xl p-1 border border-gray-200/30">
                      <button onClick={() => toggleLock(d.id)} className={`p-2 rounded-lg transition-colors ${isLocked ? 'text-rose-500' : 'text-gray-400 hover:text-gray-600'}`}>{isLocked ? <Lock size={16}/> : <Unlock size={16}/>}</button>
                      <input 
                        type="number" 
                        value={counts[d.id]} 
                        readOnly={isLocked} 
                        onChange={(e) => handleInput(d.id, e.target.value)} 
                        className={`w-16 bg-transparent text-center text-xl font-mono font-bold outline-none ${isLocked ? 'text-gray-400' : 'text-gray-800'} placeholder-gray-300`}
                        placeholder="0"
                      />
                   </div>
                </div>

                <div className={`grid grid-cols-4 gap-2 transition-opacity duration-300 ${isLocked ? 'pointer-events-none opacity-20' : ''}`}>
                  <button onClick={() => updateCount(d.id, -1)} className="glass-button h-10 rounded-xl flex items-center justify-center text-gray-500 hover:bg-white hover:text-rose-500"><Minus size={18}/></button>
                  <button onClick={() => updateCount(d.id, 1)} className="glass-button h-10 rounded-xl font-bold text-blue-600 bg-blue-50/50 border-blue-100 hover:bg-blue-100">+1</button>
                  <button onClick={() => updateCount(d.id, 5)} className="glass-button h-10 rounded-xl font-bold text-indigo-600 bg-indigo-50/50 border-indigo-100 hover:bg-indigo-100">+5</button>
                  <button onClick={() => updateCount(d.id, 10)} className="glass-button h-10 rounded-xl font-bold text-purple-600 bg-purple-50/50 border-purple-100 hover:bg-purple-100">+10</button>
                </div>
              </div>
            </div>
           )
        })}
      </div>
      
      <div className="absolute bottom-0 left-0 w-full z-40 px-4 pb-6 pt-12 bg-gradient-to-t from-white/90 via-white/50 to-transparent pointer-events-none">
         <TotalBar total={total} />
      </div>
    </div>
  );
};

// ==========================================
// 3. 鍵盤面板 (CalculatorPanel)
// ==========================================

const CalculatorPanel = ({ denoms, title, isVisible }) => {
  const [counts, setCounts] = useState({});
  const [total, setTotal] = useState(0);
  const [activeId, setActiveId] = useState('n1000');
  const [locks, setLocks] = useState({});
  const [kpHeight, setKpHeight] = useState(window.innerHeight * 0.35);
  const isDrag = useRef(false);

  useEffect(() => { 
    const i={}; denoms.forEach(d=>i[`n${d.value}`]=''); setCounts(i); 
  }, [denoms]);
  
  useEffect(() => {
    let t=0; denoms.forEach(d => t += (parseInt(counts[`n${d.value}`]) || 0) * d.value); setTotal(t);
  }, [counts, denoms]);

  const activeItem = denoms.find(d => `n${d.value}` === activeId) || denoms[0];
  const isLocked = locks[activeId];

  const handleDrag = useCallback((e) => {
    if(!isDrag.current) return;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    setKpHeight(Math.max(250, window.innerHeight - y));
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleDrag); window.addEventListener('mouseup', ()=>isDrag.current=false);
    window.addEventListener('touchmove', handleDrag); window.addEventListener('touchend', ()=>isDrag.current=false);
    return () => { window.removeEventListener('mousemove', handleDrag); window.removeEventListener('touchmove', handleDrag); }
  }, [handleDrag]);

  const numClick = (n) => { if(!isLocked) setCounts(p => ({...p, [activeId]: (p[activeId]||'') + n})) };
  const delClick = () => { if(!isLocked) setCounts(p => ({...p, [activeId]: (p[activeId]||'').slice(0,-1)})) };
  const clearClick = () => { if(!isLocked) setCounts(p => ({...p, [activeId]: ''})) };
  const nextClick = () => {
     const idx = denoms.findIndex(d => `n${d.value}` === activeId);
     const next = denoms[(idx + 1) % denoms.length];
     setActiveId(`n${next.value}`);
     document.getElementById(`row-n${next.value}`)?.scrollIntoView({behavior:'smooth', block:'center'});
  };

  if (!isVisible) return null;

  return (
    <div className="flex flex-col h-full relative z-10">
      <div className="flex-1 overflow-y-auto px-4 pt-24 pb-4 space-y-2 no-scrollbar" style={{paddingBottom: kpHeight + 20}}>
        {denoms.map(d => {
           const id = `n${d.value}`;
           const active = activeId === id;
           return (
             <div key={id} id={`row-${id}`} onClick={()=>setActiveId(id)} 
               className={`glass-panel rounded-2xl p-3 flex justify-between items-center transition-all ${active ? 'bg-white border-blue-300 shadow-lg scale-[1.02]' : 'bg-white/40'} ${locks[id] ? 'opacity-60 grayscale' : ''}`}>
                <div className="flex items-center gap-4">
                   <div className={`w-16 h-9 rounded-lg flex items-center justify-center font-bold text-white shadow-md ${d.bg}`}>{d.label}</div>
                   <span className={`text-2xl font-mono font-bold ${active ? 'text-gray-900' : 'text-gray-400'}`}>{counts[id] || 0}</span>
                </div>
                <div className="flex items-center gap-3">
                   <span className="font-mono text-gray-500">${((parseInt(counts[id])||0)*d.value).toLocaleString()}</span>
                   <button onClick={(e)=>{e.stopPropagation();setLocks(p=>({...p,[id]:!p[id]}))}} className={`p-2 rounded-full ${locks[id]?'text-rose-500 bg-rose-100':'text-gray-400 hover:text-gray-600'}`}>{locks[id]?<Lock size={16}/>:<Unlock size={16}/>}</button>
                </div>
             </div>
           )
        })}
      </div>

      <div className="fixed bottom-0 w-full glass-panel border-t border-white/50 rounded-t-[2rem] z-30 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.1)]" style={{height: kpHeight, background: 'rgba(255,255,255,0.85)'}}>
        <div className="w-full h-8 flex justify-center items-center cursor-ns-resize touch-none" onMouseDown={()=>isDrag.current=true} onTouchStart={()=>isDrag.current=true}>
           <div className="w-12 h-1.5 bg-gray-300 rounded-full"/>
        </div>
        <div className="px-6 pb-2 flex justify-between items-center border-b border-gray-200/50">
           <span className="text-xs font-bold text-gray-400 uppercase">Editing: <span className="text-blue-600">{activeItem.label}</span> {isLocked && <Lock size={12}/>}</span>
           <span className="text-xl font-mono font-black text-gray-800">${total.toLocaleString()}</span>
        </div>
        <div className="flex-1 grid grid-cols-4 gap-2 p-3 pb-safe">
           {[7,8,9].map(n => <button key={n} onClick={()=>numClick(n)} disabled={isLocked} className="glass-button rounded-xl text-2xl font-bold text-gray-
