import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [voices, setVoices] = useState([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(() => 
    parseInt(localStorage.getItem('araon_voca_voice_idx') || '0')
  );

  // 테마 적용 로직 (Pearl White & Eerie Black)
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) { 
      root.classList.add('dark'); 
      localStorage.setItem('theme', 'dark'); 
    } else { 
      root.classList.remove('dark'); 
      localStorage.setItem('theme', 'light'); 
    }
  }, [isDark]);

  // TTS 성우 목록 로드
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
    if (window.confirm('모든 학습 기록과 오답 노트를 초기화할까요? 이 작업은 되돌릴 수 없습니다.')) {
      const keys = [
        'araon_voca_elementary_100',
        'araon_voca_level_1',
        'araon_voca_level_2',
        'araon_voca_level_3',
        'araon_voca_level_4'
      ];
      keys.forEach(key => localStorage.removeItem(key));
      alert('모든 데이터가 성공적으로 초기화되었습니다.');
      window.location.reload();
    }
  };

  // 각 레벨별 명품 브랜드 포인트 컬러 배정
  const menus = [
    { id: "01", name: "Foundation Mastery", sub: "초등 기초단어 100", path: "/elementary-100", color: "#FFD000" }, // Sky Blue
    { id: "02", name: "Essential Mastery", sub: "Level 1 (초등 필수)", path: "/level-1", color: "#E29526" },     // Fendi Yellow
    { id: "03", name: "Intermediate Mastery", sub: "Level 2 (중등 기초)", path: "/level-2", color: "#9CAF88" },  // Sage Green
    { id: "04", name: "Advanced Mastery", sub: "Level 3 (중등 심화)", path: "/level-3", color: "#006039" },      // Rolex Green
    { id: "05", name: "Expert Mastery", sub: "Level 4 (고등 기초)", path: "/level-4", color: "#151E3D" },        // Indigo Blue
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#121212] text-[#1A1A1A] dark:text-[#E0E0E0] p-8 pb-24 transition-colors duration-500 font-sans">
      <div className="max-w-md mx-auto flex flex-col min-h-[calc(100vh-6rem)]">
        
        {/* Header: 공식 로고 및 다크모드 대응 */}
        <header className="flex justify-between items-start mb-16">
          <div className="flex flex-col">
            {/* 보내주신 검은색 로고 이미지 파일명에 맞춰 경로를 지정하세요 */}
            <img 
              src="/Araon_logo_b.png" 
              alt="ARAON SCHOOL" 
              className={`h-9 w-auto object-contain select-none mb-1 transition-all duration-500 ${isDark ? 'invert brightness-200' : ''}`}
              onError={(e) => { e.target.style.display = 'none'; }} 
            />
            <p className="text-[10px] font-black uppercase tracking-[0.45em] text-indigo-500/80 ml-1">
              Vocabulary System
            </p>
          </div>
          <button 
            onClick={() => setIsDark(!isDark)} 
            className="p-3 rounded-2xl bg-white dark:bg-[#1E1E1E] shadow-sm border border-zinc-100 dark:border-zinc-800 text-zinc-400 active:scale-90 transition-transform"
          >
            <i className={`ph-bold ${isDark ? 'ph-sun' : 'ph-moon'} text-xl`}></i>
          </button>
        </header>

        {/* Level Navigation 카드 리스트 */}
        <nav className="flex-1 space-y-5 animate__animated animate__fadeInUp">
          {menus.map((m) => (
            <Link key={m.id} to={m.path} className="group block">
              <div className="flex items-center justify-between bg-white dark:bg-[#1E1E1E] p-6 rounded-[2.2rem] border border-transparent group-hover:border-zinc-200 dark:group-hover:border-zinc-700 shadow-sm transition-all duration-300">
                <div className="flex items-center gap-6">
                  <span className="text-[10px] font-black text-zinc-200 dark:text-zinc-800 transition-colors group-hover:text-zinc-300">{m.id}</span>
                  <div>
                    <h3 className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: m.color }}>
                      {m.name}
                    </h3>
                    <p className="text-xl font-bold tracking-tight group-hover:translate-x-1 transition-transform">{m.sub}</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" style={{ backgroundColor: `${m.color}15` }}>
                  <i className="ph-bold ph-caret-right text-lg" style={{ color: m.color }}></i>
                </div>
              </div>
            </Link>
          ))}
        </nav>

        {/* Footer: 설정 및 초기화 */}
        <footer className="mt-16 pt-8 border-t border-zinc-100 dark:border-zinc-800 space-y-6">
          <div className="bg-white dark:bg-[#1E1E1E] p-5 rounded-[2.2rem] shadow-sm border border-zinc-50 dark:border-zinc-900">
            <div className="flex items-center justify-between mb-4 px-1">
              <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <i className="ph-fill ph-megaphone text-sm"></i> Voice Settings
              </p>
            </div>
            <select 
              value={selectedVoiceIndex} 
              onChange={(e) => handleVoiceChange(parseInt(e.target.value))}
              className="w-full p-3.5 bg-[#F8F9FA] dark:bg-[#121212] rounded-2xl text-xs font-bold outline-none border-none cursor-pointer appearance-none text-center"
            >
              {voices.length > 0 ? voices.map((v, i) => (
                <option key={i} value={i}>{v.name}</option>
              )) : <option>Loading voices...</option>}
            </select>
          </div>
          
          <button 
            onClick={resetAllData}
            className="w-full p-4 bg-[#70011D] text-white rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.25em] shadow-lg shadow-rose-900/10 transition-all active:scale-[0.98] hover:brightness-110"
          >
            Reset Application Data
          </button>
          <p className="text-center text-[9px] font-medium text-zinc-300 dark:text-zinc-700 uppercase tracking-widest">
            © Araon School Coaching System
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Home;