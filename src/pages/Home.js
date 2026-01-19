import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [voices, setVoices] = useState([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(() => 
    parseInt(localStorage.getItem('araon_voca_voice_idx') || '0')
  );

  // ✨ 배경색 및 시스템 설정 동기화 ✨
  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body; 
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');

    if (isDark) { 
      root.classList.add('dark'); 
      localStorage.setItem('theme', 'dark'); 
      body.style.backgroundColor = '#0A0A0B'; 
      if (metaThemeColor) metaThemeColor.setAttribute('content', '#0A0A0B');
    } else { 
      root.classList.remove('dark'); 
      localStorage.setItem('theme', 'light'); 
      body.style.backgroundColor = '#F8F9FA'; 
      if (metaThemeColor) metaThemeColor.setAttribute('content', '#F8F9FA');
    }
  }, [isDark]);

  useEffect(() => {
    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
      setVoices(available);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handleVoiceChange = (index) => {
    setSelectedVoiceIndex(index);
    localStorage.setItem('araon_voca_voice_idx', index);
  };

  const resetAllData = () => {
    if (window.confirm('모든 학습 기록과 오답 노트를 초기화할까요?')) {
      // ✨ Level 5 저장 키 추가 ✨
      const keys = [
        'araon_voca_elementary_100', 
        'araon_voca_level_1', 
        'araon_voca_level_2', 
        'araon_voca_level_3', 
        'araon_voca_level_4',
        'araon_voca_level_5'
      ];
      keys.forEach(key => localStorage.removeItem(key));
      window.location.reload();
    }
  };

  const menus = [
    { id: "01", name: "Foundation Mastery", sub: "초등 기초단어 100", path: "/elementary-100", color: "#FFD000" }, 
    { id: "02", name: "Essential Mastery", sub: "Level 1 (초등 필수)", path: "/level-1", color: "#E29526" },     
    { id: "03", name: "Intermediate Mastery", sub: "Level 2 (중등 기초)", path: "/level-2", color: "#9CAF88" },  
    { id: "04", name: "Advanced Mastery", sub: "Level 3 (중등 심화)", path: "/level-3", color: "#006039" },      
    { id: "05", name: "Expert Mastery", sub: "Level 4 (고등 기초)", path: "/level-4", color: "#151E3D" },
    // ✨ 06번 Level 5: 고등 심화 추가 ✨
    { id: "06", name: "Academic Mastery", sub: "Level 5 (고등 심화)", path: "/level-5", color: "#32127A" },        
  ];

  return (
    <div className="min-h-screen transition-colors duration-500 font-sans pt-24">
      <div className="max-w-md mx-auto flex flex-col px-8 pb-24">
        
        <header className="flex justify-between items-start mb-16">
          <div className="flex flex-col">
            <img 
              src="/Araon_logo_b.png" 
              alt="ARAON SCHOOL" 
              className={`h-9 w-auto object-contain select-none mb-1 transition-all duration-500 ${isDark ? 'invert brightness-200' : ''}`}
            />
            <p className="text-[10px] font-black uppercase tracking-[0.45em] text-indigo-500/80 ml-1">
              Vocabulary System
            </p>
          </div>
          <button 
            onClick={() => setIsDark(!isDark)} 
            className="p-3 rounded-2xl bg-white dark:bg-[#1E1E1E] shadow-md border border-zinc-100 dark:border-zinc-800 text-zinc-400 active:scale-90 transition-transform"
          >
            <i className={`ph-bold ${isDark ? 'ph-sun' : 'ph-moon'} text-xl`}></i>
          </button>
        </header>

        <nav className="flex-1 space-y-5 animate__animated animate__fadeInUp">
          {menus.map((m) => (
            <Link key={m.id} to={m.path} className="group block">
              <div className="flex items-center justify-between bg-white dark:bg-[#1E1E1E] p-6 rounded-[2.2rem] shadow-sm border border-transparent group-hover:border-zinc-200 dark:group-hover:border-zinc-700 transition-all">
                <div className="flex items-center gap-6">
                  <span className="text-[10px] font-black text-zinc-200 dark:text-zinc-800">{m.id}</span>
                  <div>
                    <h3 className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: m.color }}>{m.name}</h3>
                    <p className="text-xl font-bold tracking-tight dark:text-white">{m.sub}</p>
                  </div>
                </div>
                <i className="ph-bold ph-caret-right text-zinc-300"></i>
              </div>
            </Link>
          ))}
        </nav>

        <footer className="mt-16 pt-8 border-t border-zinc-100 dark:border-zinc-800 space-y-6">
          <div className="bg-white dark:bg-[#1E1E1E] p-5 rounded-[2.2rem] shadow-sm">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 px-1">Voice Settings</p>
            <select 
              value={selectedVoiceIndex} 
              onChange={(e) => handleVoiceChange(parseInt(e.target.value))}
              className="w-full p-3.5 bg-[#F8F9FA] dark:bg-[#0A0A0B] rounded-2xl text-xs font-bold outline-none appearance-none text-center dark:text-white"
            >
              {voices.length > 0 ? voices.map((v, i) => (
                <option key={i} value={i}>{v.name}</option>
              )) : <option>Loading voices...</option>}
            </select>
          </div>
          <button onClick={resetAllData} className="w-full p-4 bg-[#70011D] text-white rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.25em] active:scale-[0.98]">
            Reset Application Data
          </button>
        </footer>
      </div>
    </div>
  );
}

export default Home;