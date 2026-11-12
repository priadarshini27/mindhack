import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Oath from './pages/Oath';
import Game from './pages/Game';
import Result from './pages/Result';
import Leaderboard from './pages/Leaderboard';
import Analysis from './pages/Analysis';

function App() {
  return (
    <GameProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/oath" element={<Oath />} />
            <Route path="/game" element={<Game />} />
            <Route path="/result" element={<Result />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </div>
      </Router>
    </GameProvider>
  );
}

export default App;
