import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 페이지 컴포넌트 임포트
import Home from './pages/Home';
import Elementary100 from './pages/Elementary100';
import Level1 from './pages/Level1';
import Level2 from './pages/Level2';
import Level3 from './pages/Level3';
import Level4 from './pages/Level4';
import Level5 from './pages/Level5';
import MyVoca from './pages/MyVoca'; // ✨ 새로 추가된 통합 오답 단어장 페이지

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 00. 홈 화면 */}
          <Route path="/" element={<Home />} />

          {/* 01. 나의 통합 오답 단어장 (최상단 메뉴) */}
          <Route path="/my-voca" element={<MyVoca />} />

          {/* 02. 초등 기초단어 100일 완성 */}
          <Route path="/elementary-100" element={<Elementary100 />} />

          {/* 03 ~ 07. 레벨별 학습 페이지 */}
          <Route path="/level-1" element={<Level1 />} />
          <Route path="/level-2" element={<Level2 />} />
          <Route path="/level-3" element={<Level3 />} />
          <Route path="/level-4" element={<Level4 />} />
          <Route path="/level-5" element={<Level5 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;