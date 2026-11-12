import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { api, setAuthToken } from '../services/api';

const LEADERBOARD_KEY = 'mindhack_leaderboard';
const AUTH_KEY = 'mindhack_auth';
const USER_STATS_PREFIX = 'mindhack_user_';

const defaultLeaderboard = [
  { username: 'cyberninja', name: 'CyberNinja', score: 3500, rankCategory: 'Cyber Defender Elite', streak: 15 },
  { username: 'alice_sec', name: 'Alice_sec', score: 2800, rankCategory: 'Cyber Defender Elite', streak: 12 },
  { username: 'bobhack', name: 'BobHack', score: 1950, rankCategory: 'Cyber Defender Elite', streak: 8 }
];

const initialState = {
  user: null, 
  sessionId: null,
  oathTaken: false,
  score: 0,
  bestScore: 0,
  bestStreak: 0,
  bestRank: 'Beginner',
  levelScores: [0, 0, 0, 0, 0], 
  lifelines: 3,
  currentLevel: 1, 
  streak: 0,
  gameStatus: 'idle', 
  rank: 'Beginner',
  actionHistory: [],
  leaderboard: defaultLeaderboard
};

const loadLeaderboard = () => {
  if (typeof window === 'undefined') return defaultLeaderboard;
  try {
    const stored = localStorage.getItem(LEADERBOARD_KEY);
    return stored ? JSON.parse(stored) : defaultLeaderboard;
  } catch {
    return defaultLeaderboard;
  }
};

const saveLeaderboardData = (leaderboard) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
  } catch {
  }
};

export const loadUserStats = (username) => {
  if (typeof window === 'undefined') return { bestScore: 0, bestStreak: 0, bestRank: 'Beginner', rank: 'Beginner' };
  try {
    const stored = localStorage.getItem(`${USER_STATS_PREFIX}${username}`);
    return stored ? JSON.parse(stored) : { bestScore: 0, bestStreak: 0, bestRank: 'Beginner', rank: 'Beginner' };
  } catch {
    return { bestScore: 0, bestStreak: 0, bestRank: 'Beginner', rank: 'Beginner' };
  }
};

const saveUserStats = (username, stats) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${USER_STATS_PREFIX}${username}`, JSON.stringify(stats));
  } catch {
  }
};

const updateLeaderboardEntry = (username, score, rankCategory, streak) => {
  const current = loadLeaderboard().filter((entry) => entry.username !== username);
  const updated = [
    ...current,
    { username, name: username, score, rankCategory, streak }
  ].sort((a, b) => b.score - a.score);
  saveLeaderboardData(updated);
  return updated;
};

// The logged-in user is kept in localStorage so a page refresh doesn't log them out.
const loadAuth = () => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const saveAuth = (auth) => {
  if (typeof window === 'undefined') return;
  try {
    if (auth) localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    else localStorage.removeItem(AUTH_KEY);
  } catch {
  }
};

const getInitialState = () => {
  const base = { ...initialState, leaderboard: loadLeaderboard() };
  const auth = loadAuth();
  if (!auth?.user?.token) return base;
  setAuthToken(auth.user.token);
  return { ...base, ...auth };
};

const normalizeLevelScores = (levelScores, fallback) => {
  if (!Array.isArray(levelScores) || levelScores.length === 0) return fallback;
  return Array.from({ length: 5 }, (_, index) => Number(levelScores[index] ?? fallback[index] ?? 0));
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: {
          id: action.payload.id,
          username: action.payload.username,
          email: action.payload.email,
          token: action.payload.token
        },
        oathTaken: action.payload.oathTaken ?? false,
        bestScore: action.payload.bestScore ?? 0,
        bestStreak: action.payload.bestStreak ?? 0,
        bestRank: action.payload.bestRank ?? 'Beginner',
        rank: action.payload.rank ?? 'Beginner',
        score: 0,
        streak: 0,
        lifelines: 3,
        currentLevel: 1,
        levelScores: [0, 0, 0, 0, 0],
        actionHistory: [],
        gameStatus: 'idle'
      };
    case 'SET_SESSION':
      return {
        ...state,
        sessionId: action.payload?.id ?? null,
        score: action.payload?.totalScore ?? state.score,
        lifelines: action.payload?.lifelines ?? state.lifelines,
        streak: action.payload?.streak ?? state.streak,
        currentLevel: Math.min(5, action.payload?.currentLevel ?? state.currentLevel),
        levelScores: normalizeLevelScores(action.payload?.levelScores, state.levelScores),
      };
    case 'TAKE_OATH':
      return { ...state, oathTaken: true };
    case 'START_GAME':
      return { ...state, sessionId: null, gameStatus: 'playing', score: 0, lifelines: 3, currentLevel: 1, streak: 0, levelScores: [0, 0, 0, 0, 0], actionHistory: [] };
    case 'ANSWER_CORRECT': {
      const newScore = state.score + action.payload.points;
      const newStreak = state.streak + 1;
      const newLevelScores = [...state.levelScores];
      newLevelScores[state.currentLevel - 1] += action.payload.points;
      const newBestScore = Math.max(state.bestScore, newScore);
      const newBestRank = newBestScore > state.bestScore ? calculateRank(newBestScore) : state.bestRank;
      return {
        ...state,
        score: newScore,
        streak: newStreak,
        bestStreak: Math.max(state.bestStreak, newStreak),
        bestScore: newBestScore,
        bestRank: newBestRank,
        levelScores: newLevelScores,
        rank: calculateRank(newScore)
      };
    }
    case 'ANSWER_WRONG':
      return {
        ...state,
        lifelines: Math.max(0, state.lifelines - 1),
        streak: 0,
        gameStatus: state.lifelines - 1 <= 0 ? 'failed' : 'playing'
      };
    case 'USE_LIFELINE':
      return {
        ...state,
        lifelines: Math.max(0, state.lifelines - 1)
      };
    case 'NEXT_LEVEL':
      return {
        ...state,
        currentLevel: Math.min(5, action.payload?.currentLevel ?? state.currentLevel + 1)
      };
    case 'END_GAME': {
      const isCompletedAll = action.payload?.completedAll;
      let finalScore = state.score;
      let newLevelScores = [...state.levelScores];
      
      if (!isCompletedAll) {
        finalScore = state.score - state.levelScores[state.currentLevel - 1];
        newLevelScores[state.currentLevel - 1] = 0;
      }
      
      return {
        ...state,
        score: Math.max(0, finalScore),
        levelScores: newLevelScores,
        gameStatus: isCompletedAll ? 'completed' : 'failed'
      };
    }

    case 'RECORD_ACTION':
      return {
        ...state,
        actionHistory: [...state.actionHistory, action.payload]
      };
    case 'SYNC_BACKEND_GAME':
      // Responses arrive asynchronously, often after later local actions (or END_GAME)
      // have already updated the state, so copying score/lifelines from them would
      // roll the game back. The local reducer is the source of truth during play.
      return {
        ...state,
        sessionId: action.payload?.id ?? state.sessionId,
      };
    case 'SET_LEADERBOARD':
      return {
        ...state,
        leaderboard: action.payload
      };
    case 'LOGOUT':
      return { ...initialState, leaderboard: state.leaderboard, actionHistory: [] };
    default:
      return state;
  }
};

// Keep in sync with ScoreService.rank in score-service, which is the source of truth on the server.
const calculateRank = (score) => {
  if (score >= 650) return 'Cyber Defender Elite';
  if (score >= 450) return 'Expert';
  if (score >= 250) return 'Intermediate';
  return 'Beginner';
};

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState, getInitialState);

  // Persist the login (and token for API calls) whenever it changes.
  useEffect(() => {
    setAuthToken(state.user?.token);
    saveAuth(state.user ? {
      user: state.user,
      oathTaken: state.oathTaken,
      bestScore: state.bestScore,
      bestStreak: state.bestStreak,
      bestRank: state.bestRank,
      rank: state.rank,
    } : null);
  }, [state.user, state.oathTaken, state.bestScore, state.bestStreak, state.bestRank, state.rank]);

  // A restored token may have been replaced by a login elsewhere; drop it if the server rejects it.
  useEffect(() => {
    if (!state.user?.token) return;
    api.me().catch((err) => {
      if (err.response?.status === 401) dispatch({ type: 'LOGOUT' });
    });
    // Only check once per token.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.user?.token]);

  useEffect(() => {
    if (!state.user) return;
    saveUserStats(state.user.username, {
      bestScore: state.bestScore,
      bestStreak: state.bestStreak,
      bestRank: state.bestRank,
      rank: state.rank
    });

    const updatedLeaderboard = updateLeaderboardEntry(
      state.user.username,
      state.bestScore,
      state.bestRank,
      state.bestStreak
    );

    if (JSON.stringify(updatedLeaderboard) !== JSON.stringify(state.leaderboard)) {
      dispatch({ type: 'SET_LEADERBOARD', payload: updatedLeaderboard });
    }
  }, [state.user?.username, state.bestScore, state.bestStreak, state.bestRank, state.rank]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
