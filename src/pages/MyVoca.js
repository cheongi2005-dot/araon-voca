import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// ✨ 데이터 임포트 (각 파일에서 export const DATA_BY_DAY 처리가 되어 있어야 합니다)
import { DATA_BY_DAY as E_DATA } from './Elementary100';
import { DATA_BY_DAY as L1_DATA } from './Level1';
import { DATA_BY_DAY as L2_DATA } from './Level2';
import { DATA_BY_DAY as L3_DATA } from './Level3';
import { DATA_BY_DAY as L4_DATA } from './Level4';
import { DATA_BY_DAY as L5_DATA } from './Level5';

const MASTER_MAP = {
  'araon_voca_elementary_100': E_DATA,
  'araon_voca_level_1': L1_DATA,
  'araon_voca_level_2': L2_DATA,
  'araon_voca_level_3': L3_DATA,
  'araon_voca_level_4': L4_DATA,
  'araon_voca_level_5': L5_DATA,
};

const MyVoca = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('list'); 
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [voices, setVoices] = useState([]);
  
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0); // ✨ 결과창에서 활용
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // ✨ 퀴즈 버튼 스타일 결정

  const themeColor = "#70011D"; // 버건디

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.body.style.backgroundColor = isDark ? '#0A0A0B' : '#F8F9FA';
  }, [isDark]);

  useEffect(() => {
    const load = () => setVoices(window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en')));
    load(); window.speechSynthesis.onvoiceschanged = load;
  }, []);

  // ✨ 저장소에서 오답과 뜻 매칭하여 가져오기
  const getMistakesWithMeanings = () => {
    return Object.keys(MASTER_MAP).map(key => {
      const saved = JSON.parse(localStorage.getItem(key) || '{}');
      const uniqueWords = new Set();
      Object.values(saved).forEach(day => {
        if (day.attempts) day.attempts.flat().forEach(w => uniqueWords.add(w));
      });

      const levelStaticData = MASTER_MAP[key];
      const detailedWords = Array.from(uniqueWords).map(word => {
        let meaning = "뜻 없음";
        for (let day in levelStaticData) {
          const found = levelStaticData[day].find(item => item.word === word);
          if (found) { meaning = found.meaning; break; }
        }
        return { word, meaning };
      });

      const label = key.replace('araon_voca_', '').replace('_', ' ').toUpperCase().replace('ELEMENTARY 100', '초등 기초 100');
      return { key, label, words: detailedWords };
    }).filter(l => l.words.length > 0);
  };

  const [mistakesGroup, setMistakesGroup] = useState(getMistakesWithMeanings());
  const totalCount = useMemo(() => mistakesGroup.reduce((a, b) => a + b.words.length, 0), [mistakesGroup]);

  // ✨ 퀴즈 시작 (4지선다 생성)
  const startQuiz = () => {
    let pool = [];
    mistakesGroup.forEach(group => {
      const levelStaticData = MASTER_MAP[group.key];
      const allWordsInLevel = Object.values(levelStaticData).flat();

      group.words.forEach(item => {
        const distractors = allWordsInLevel
          .filter(v => v.word !== item.word)
          .sort(() => Math.random() - 0.5).slice(0, 3);
        const options = [item, ...distractors].sort(() => Math.random() - 0.5);
        pool.push({ ...item, options, levelKey: group.key });
      });
    });

    setQuizQuestions(pool.sort(() => Math.random() - 0.5).slice(0, 20));
    setCurrentIndex(0); setScore(0); setView('quiz'); setShowFeedback(false); setSelectedAnswer(null);
  };

  // ✨ 정답 체크 및 나의 단어장 삭제 로직
  const handleAnswer = (option) => {
    if (showFeedback) return;
    setSelectedAnswer(option);
    setShowFeedback(true);
    
    const currentQ = quizQuestions[currentIndex];
    const isCorrect = option.word === currentQ.word;

    if (isCorrect) {
      setScore(prev => prev + 1);
      // ✅ LocalStorage 오답 기록에서만 삭제 (원본 데이터는 유지)
      const saved = JSON.parse(localStorage.getItem(currentQ.levelKey) || '{}');
      Object.keys(saved).forEach(day => {
        if (saved[day].attempts) {
          saved[day].attempts = saved[day].attempts.map(arr => arr.filter(w => w !== currentQ.word)).filter(arr => arr.length > 0);
        }
      });
      localStorage.setItem(currentQ.levelKey, JSON.stringify(saved));
      speak(currentQ.word);
    }

    setTimeout(() => {
      if (currentIndex < quizQuestions.length - 1) {
        setCurrentIndex(c => c + 1); setShowFeedback(false); setSelectedAnswer(null);
      } else {
        setMistakesGroup(getMistakesWithMeanings()); // 리스트 최신화
        setView('result');
      }
    }, 1100);
  };

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    const voiceIdx = parseInt(localStorage.getItem('araon_voca_voice_idx') || '0');
    if (voices[voiceIdx]) msg.voice = voices[voiceIdx];
    msg.lang = 'en-US'; msg.rate = 0.85;
    window.speechSynthesis.speak(msg);
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto transition-all duration-300 font-sans">
      <header className="sticky top-0 z-20 flex flex-col transition-colors border-b border-black/10 shadow-sm" 
              style={{ backgroundColor: themeColor, paddingTop: 'env(safe-area-inset-top)', minHeight: 'calc(64px + env(safe-area-inset-top))' }}>
        <div className="flex-1 flex items-center px-4 justify-between w-full h-16">
          <button onClick={() => view === 'quiz' ? setView('list') : navigate('/')} className="p-2 text-white active:opacity-70"><i className="ph-bold ph-caret-left text-2xl"></i></button>
          <img src="/Araon_logo_b.png" alt="ARAON" className="h-6 w-auto invert brightness-200" />
          <button onClick={() => setIsDark(!isDark)} className="p-2 text-white active:opacity-70"><i className={`ph-bold ${isDark ? 'ph-sun' : 'ph-moon'} text-2xl`}></i></button>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-y-auto">
        {view === 'list' && (
          <div className="animate__animated animate__fadeIn">
            {/* 심플 상단 카드 */}
            <div className="p-8 rounded-[2.2rem] text-white shadow-xl mb-10 relative overflow-hidden" style={{ backgroundColor: themeColor }}>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Personal Collection</p>
              <h2 className="text-2xl font-black mb-6">나의 단어장 <span className="ml-2 text-sm opacity-50">{totalCount}개</span></h2>
              <button onClick={startQuiz} disabled={totalCount === 0}
                      className="w-full py-4 bg-white rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all"
                      style={{ color: themeColor }}>
                오답 퀴즈 (20문항)
              </button>
            </div>

            <div className="space-y-10 pb-10">
              {mistakesGroup.map(group => (
                <section key={group.key}>
                  <div className="flex items-center gap-3 mb-4 px-1 border-l-4 ml-1 pl-3" style={{ borderColor: themeColor }}>
                    <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest">{group.label}</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {group.words.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-5 bg-white dark:bg-[#1E1E1E] rounded-[1.8rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                        <div className="flex-1">
                          <p className="text-xl font-black dark:text-white mb-1">{item.word}</p>
                          <p className="text-sm font-bold text-zinc-400 leading-none">{item.meaning}</p>
                        </div>
                        <button onClick={() => speak(item.word)} className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-zinc-400 active:text-[#70011D] transition-colors">
                          <i className="ph-bold ph-speaker-high text-xl"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        )}

        {view === 'quiz' && (
          <div className="animate__animated animate__fadeIn">
            <div className="flex justify-between items-center mb-10">
               <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: themeColor }}>{currentIndex + 1} / {quizQuestions.length}</span>
               <div className="flex-1 mx-4 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                 <div className="h-full transition-all duration-500" style={{ width: `${((currentIndex + 1) / quizQuestions.length) * 100}%`, backgroundColor: themeColor }}></div>
               </div>
            </div>

            <div className="text-center py-16 mb-10">
              <h3 className="text-5xl font-black dark:text-white italic tracking-tighter break-keep leading-tight px-4">{quizQuestions[currentIndex].word}</h3>
              <button onClick={() => speak(quizQuestions[currentIndex].word)} className="mt-8 text-zinc-300"><i className="ph-bold ph-speaker-high text-3xl"></i></button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {quizQuestions[currentIndex].options.map((opt, i) => {
                const isCorrect = opt.word === quizQuestions[currentIndex].word;
                const isSelected = selectedAnswer === opt;
                let btnStyle = "bg-white dark:bg-[#1E1E1E] border-slate-100 dark:border-slate-800 dark:text-slate-300";
                
                if (showFeedback) {
                  if (isCorrect) btnStyle = "bg-emerald-600 border-emerald-500 text-white shadow-lg scale-[1.02]";
                  else if (isSelected) btnStyle = "bg-[#70011D] border-[#70011D] text-white";
                  else btnStyle = "opacity-20";
                }

                return (
                  <button key={i} disabled={showFeedback} onClick={() => handleAnswer(opt)}
                          className={`p-6 rounded-[2.2rem] font-bold text-lg border-2 transition-all active:scale-[0.98] ${btnStyle}`}>
                    {opt.meaning}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {view === 'result' && (
          <div className="animate__animated animate__fadeIn text-center py-16 px-4">
            <div className="w-24 h-24 text-white rounded-[2.2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl" style={{ backgroundColor: themeColor }}>
                <i className="ph-fill ph-crown text-6xl"></i>
            </div>
            <h2 className="text-3xl font-black dark:text-white mb-3">훈련 종료</h2>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm text-center break-keep mb-12 leading-relaxed">
               이번 세션에서 <span className="text-emerald-500 font-black">{score}개</span>의 단어를 정복했습니다.<br/>맞춘 단어는 단어장에서 자동으로 삭제되었습니다.
            </p>
            <button onClick={() => setView('list')} className="w-full p-6 text-white rounded-[2rem] font-black text-xl shadow-xl active:scale-95 transition-all" style={{ backgroundColor: themeColor }}>리스트로 돌아가기</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyVoca;