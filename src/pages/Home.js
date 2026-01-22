import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_KEYS = [
  'araon_voca_elementary_100', 'araon_voca_level_1', 'araon_voca_level_2',
  'araon_voca_level_3', 'araon_voca_level_4', 'araon_voca_level_5'
];

function Home() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [voices, setVoices] = useState([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(() => parseInt(localStorage.getItem('araon_voca_voice_idx') || '0'));

  useEffect(() => {
    const isDarkTheme = isDark;
    document.documentElement.classList.toggle('dark', isDarkTheme);
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    document.body.style.backgroundColor = isDarkTheme ? '#0A0A0B' : '#F8F9FA';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', isDarkTheme ? '#0A0A0B' : '#F8F9FA');
  }, [isDark]);

  useEffect(() => {
    const load = () => setVoices(window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en')));
    load(); window.speechSynthesis.onvoiceschanged = load;
  }, []);

  // ✨ 수정된 로직: 레벨별 오답 수를 각각 합산하여 상세 페이지와 숫자를 맞춤 ✨
  const totalMistakes = useMemo(() => {
    let count = 0;
    STORAGE_KEYS.forEach(k => {
      const data = JSON.parse(localStorage.getItem(k) || '{}');
      const levelWords = new Set(); // 레벨 내부에서만 중복 제거
      Object.values(data).forEach(d => d.attempts?.flat().forEach(w => levelWords.add(w)));
      count += levelWords.size; // 각 레벨의 오답 수를 더함
    });
    return count;
  }, []);

  const menus = [
    { id: "01", name: "Foundation", sub: "초등 기초 100", path: "/elementary-100", color: "#FFD000" },
    { id: "02", name: "Essential", sub: "Level 1 (초등 필수)", path: "/level-1", color: "#E29526" },
    { id: "03", name: "Intermediate", sub: "Level 2 (중등 기초)", path: "/level-2", color: "#9CAF88" },
    { id: "04", name: "Advanced", sub: "Level 3 (중등 심화)", path: "/level-3", color: "#006039" },
    { id: "05", name: "Expert", sub: "Level 4 (고등 기초)", path: "/level-4", color: "#151E3D" },
    { id: "06", name: "Academic", sub: "Level 5 (고등 심화)", path: "/level-5", color: "#32127A" },
  ];

  return (
    <div className="min-h-screen transition-colors duration-500 font-sans pt-20 pb-10">
      <div className="max-w-md mx-auto px-8">
        
        <header className="flex justify-between items-center mb-10">
          <div className="flex flex-col">
            <img src="/Araon_logo_b.png" alt="ARAON" className={`h-8 w-auto ${isDark ? 'invert brightness-200' : ''}`} />
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-500/80 ml-0.5">Voca System</p>
          </div>
          <button onClick={() => setIsDark(!isDark)} className="p-3 rounded-2xl bg-white dark:bg-[#1E1E1E] shadow-sm border border-zinc-100 dark:border-zinc-800 text-zinc-400 active:scale-90">
            <i className={`ph-bold ${isDark ? 'ph-sun' : 'ph-moon'} text-xl`}></i>
          </button>
        </header>

        <Link to="/my-voca" className="group block mb-6">
          <div className="flex items-center justify-between bg-white dark:bg-[#1E1E1E] p-6 rounded-[2.2rem] shadow-xl border-2 border-[#70011D]/20 active:scale-[0.98] transition-all">
            <div className="flex items-center gap-5">
              <div className="w-11 h-11 bg-[#70011D] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#70011D]/30"><i className="ph-fill ph-star text-xl"></i></div>
              <div>
                <h3 className="text-[9px] font-black uppercase tracking-widest text-[#70011D]">Personal Collection</h3>
                <p className="text-xl font-black dark:text-white">나의 단어장 <span className="ml-2 text-xs px-2 py-0.5 bg-[#70011D] text-white rounded-full font-black">{totalMistakes}</span></p>
              </div>
            </div>
            <i className="ph-bold ph-caret-right text-[#70011D]/40 group-hover:text-[#70011D] transition-colors"></i>
          </div>
        </Link>

        <nav className="space-y-4">
          {menus.map((m) => (
            <Link key={m.id} to={m.path} className="group block">
              <div className="flex items-center justify-between bg-white dark:bg-[#1E1E1E] p-5 rounded-[2.2rem] shadow-sm border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800 transition-all">
                <div className="flex items-center gap-5">
                  <span className="text-[10px] font-black text-zinc-200 dark:text-zinc-800">{m.id}</span>
                  <div>
                    <h3 className="text-[9px] font-black uppercase tracking-widest mb-0.5" style={{ color: m.color }}>{m.name}</h3>
                    <p className="text-lg font-bold tracking-tight dark:text-white">{m.sub}</p>
                  </div>
                </div>
                <i className="ph-bold ph-caret-right text-zinc-200 group-hover:text-zinc-400"></i>
              </div>
            </Link>
          ))}
        </nav>

        <footer className="mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-800 space-y-5">
          <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-[2rem] shadow-sm flex items-center">
            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest px-2 mr-4 border-r border-zinc-100 dark:border-zinc-800">Voice</p>
            <select value={selectedVoiceIndex} onChange={(e) => { setSelectedVoiceIndex(parseInt(e.target.value)); localStorage.setItem('araon_voca_voice_idx', e.target.value); }} className="flex-1 bg-transparent text-xs font-bold outline-none dark:text-white">
              {voices.map((v, i) => (<option key={i} value={i}>{v.name}</option>))}
            </select>
          </div>
          <button onClick={() => { if(window.confirm('기록을 초기화할까요?')) { STORAGE_KEYS.forEach(k => localStorage.removeItem(k)); window.location.reload(); } }} className="w-full p-4 bg-[#70011D] text-white rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#70011D]/20 active:scale-[0.98]">Reset All Progress</button>
        </footer>
      </div>
    </div>
  );
}

export default Home;