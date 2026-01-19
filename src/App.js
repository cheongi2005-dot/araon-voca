import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 페이지 컴포넌트 임포트
import Home from './pages/Home';
import Elementary100 from './pages/Elementary100';
import Level1 from './pages/Level1';
import Level2 from './pages/Level2';
import Level3 from './pages/Level3';
import Level4 from './pages/Level4';
import Level5 from './pages/Level5'; // ✨ 새로 추가된 고등 심화 페이지

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 홈 화면 */}
          <Route path="/" element={<Home />} />

          {/* 초등 기초단어 100일 완성 */}
          <Route path="/elementary-100" element={<Elementary100 />} />

          {/* 레벨별 학습 페이지 */}
          <Route path="/level-1" element={<Level1 />} />
          <Route path="/level-2" element={<Level2 />} />
          <Route path="/level-3" element={<Level3 />} />
          <Route path="/level-4" element={<Level4 />} />
          
          {/* ✨ Level 5: 고등 심화 (Academic Mastery) ✨ */}
          <Route path="/level-5" element={<Level5 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;