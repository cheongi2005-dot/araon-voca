import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Elementary100 from './pages/Elementary100';
import Level1 from './pages/Level1';
import Level2 from './pages/Level2';
import Level3 from './pages/Level3';
import Level4 from './pages/Level4';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/elementary-100" element={<Elementary100 />} />
        <Route path="/level-1" element={<Level1 />} />
        <Route path="/level-2" element={<Level2 />} />
        <Route path="/level-3" element={<Level3 />} />
        <Route path="/level-4" element={<Level4 />} />
      </Routes>
    </Router>
  );
}

export default App;