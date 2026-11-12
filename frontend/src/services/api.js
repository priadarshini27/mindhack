import axios from 'axios';

const ports = {
  user: 8050,
  game: 8051,
  score: 8055,
  feedback: 8056,
};

const base = (service) =>
  import.meta.env[`VITE_${service.toUpperCase()}_URL`] || `http://localhost:${ports[service]}`;

const emailForAgent = (username) => (username.includes('@') ? username : `${username}@mindhack.local`);

// Session token sent as a Bearer header on authenticated calls. Set by GameContext on login/restore.
let authToken = null;
export const setAuthToken = (token) => {
  authToken = token || null;
};
const authHeaders = () => (authToken ? { headers: { Authorization: `Bearer ${authToken}` } } : {});

export const api = {
  me: () => axios.get(`${base('user')}/users/me`, authHeaders()).then((res) => res.data),

  signup: ({ username, password }) =>
    axios
      .post(`${base('user')}/users/signup`, {
        name: username,
        email: emailForAgent(username),
        password,
      })
      .then((res) => res.data),

  login: ({ username, password }) =>
    axios
      .post(`${base('user')}/users/login`, {
        email: emailForAgent(username),
        password,
      })
      .then((res) => res.data),

  oath: (userId, pledges) =>
    axios.post(`${base('user')}/users/${userId}/oath`, { pledges }, authHeaders()).then((res) => res.data),

  startGame: (userId) => axios.post(`${base('game')}/game/start/${userId}`, null, authHeaders()).then((res) => res.data),

  action: (payload) => axios.post(`${base('game')}/game/action`, payload, authHeaders()).then((res) => res.data),

  useLifeline: (sessionId) =>
    axios.post(`${base('game')}/game/${sessionId}/lifeline`, null, authHeaders()).then((res) => res.data),

  analyzeFeedback: (payload) => axios.post(`${base('feedback')}/feedback/analyze`, payload).then((res) => res.data),

  leaderboard: () => axios.get(`${base('score')}/score/leaderboard`).then((res) => res.data),

  rank: (score) => axios.get(`${base('score')}/score/rank/${score}`).then((res) => res.data),
};

export function authToGameUser(auth, fallbackUsername) {
  return {
    id: auth.user.id,
    username: auth.user.name || fallbackUsername,
    email: auth.user.email,
    oathTaken: auth.user.oathCompleted,
    bestScore: auth.user.bestScore ?? 0,
    bestStreak: auth.user.bestStreak ?? 0,
    bestRank: auth.user.latestRank ?? 'Beginner',
    rank: auth.user.latestRank ?? 'Beginner',
    token: auth.token,
  };
}
