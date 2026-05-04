import React, { createContext, useReducer, useContext, useEffect } from 'react';

const LEADERBOARD_KEY = 'mindhack_leaderboard';
const USER_STATS_PREFIX = 'mindhack_user_';

const defaultLeaderboard = [
  { username: 'cyberninja', name: 'CyberNinja', score: 3500, rankCategory: 'Cyber Defender Elite', streak: 15 },
  { username: 'alice_sec', name: 'Alice_sec', score: 2800, rankCategory: 'Cyber Defender Elite', streak: 12 },
  { username: 'bobhack', name: 'BobHack', score: 1950, rankCategory: 'Expert', streak: 8 }
];

const initialState = {
  user: null, // User details from login
  sessionId: null,
  oathTaken: false,
  score: 0,
  bestScore: 0,
  bestStreak: 0,
  bestRank: 'Beginner',
  levelScores: [0, 0, 0, 0, 0], // Scores per level
  lifelines: 3,
  currentLevel: 1, // 1 to 5
  streak: 0,
  gameStatus: 'idle', // idle, playing, completed, failed
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
    // ignore write failure
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
    // ignore write failure
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

const getInitialState = () => ({ ...initialState, leaderboard: loadLeaderboard() });

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
        levelScores: action.payload?.levelScores?.length ? action.payload.levelScores : state.levelScores,
      };
    case 'TAKE_OATH':
      return { ...state, oathTaken: true };
    case 'START_GAME':
      return { ...state, sessionId: null, gameStatus: 'playing', score: 0, lifelines: 3, currentLevel: 1, streak: 0, levelScores: [0, 0, 0, 0, 0], actionHistory: [] };
    case 'ANSWER_CORRECT': {
      // current streak increments for each correct decision; bestStreak records the longest run.
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
        currentLevel: Math.min(5, state.currentLevel + 1)
      };
    case 'END_GAME': {
      const isCompletedAll = action.payload?.completedAll;
      let finalScore = state.score;
      let newLevelScores = [...state.levelScores];
      
      if (!isCompletedAll) {
        // Subtract current level's score since it's incomplete
        finalScore = state.score - state.levelScores[state.currentLevel - 1];
        // Zero out the current level score so it doesn't show in the scorecard
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
      return {
        ...state,
        sessionId: action.payload?.id ?? state.sessionId,
        score: action.payload?.totalScore ?? state.score,
        lifelines: action.payload?.lifelines ?? state.lifelines,
        streak: action.payload?.streak ?? state.streak,
        currentLevel: Math.min(5, action.payload?.currentLevel ?? state.currentLevel),
        levelScores: action.payload?.levelScores?.length ? action.payload.levelScores : state.levelScores,
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

const calculateRank = (score) => {
  if (score < 500) return 'Beginner';
  if (score < 1000) return 'Intermediate';
  if (score < 2000) return 'Expert';
  return 'Cyber Defender Elite';
};

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState, getInitialState);

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
