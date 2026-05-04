import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrophy, FaArrowLeft } from 'react-icons/fa';
import { useGame } from '../context/GameContext';
import { api } from '../services/api';

const Leaderboard = () => {
  const { state } = useGame();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    api.leaderboard()
      .then((rows) => {
        if (!Array.isArray(rows)) {
          setPlayers([]);
          return;
        }

        const formatted = rows.map((row) => ({
          username: row.playerName,
          name: row.playerName,
          score: row.totalScore,
          rankCategory: row.rankName,
          streak: row.streak,
        }));

        setPlayers(formatted);
      })
      .catch(() => {
        setPlayers([]);
      });
  }, []);

  const topPlayers = players
    .slice()
    .sort((a, b) => b.score - a.score)
    .map((player, index) => ({
      ...player,
      rank: index + 1,
      displayName:
        player.username === state.user?.username
          ? `${player.name} (You)`
          : player.name,
    }));

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/dashboard" className="btn" style={{ padding: '0.5rem 1rem' }}>
          <FaArrowLeft /> Back
        </Link>

        <h1
          style={{
            color: 'var(--accent-color)',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <FaTrophy /> Global Leaderboard
        </h1>
      </div>

      <div className="card animate-fade-in" style={{ padding: '0' }}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Rank</th>
              <th style={styles.th}>Agent</th>
              <th style={styles.th}>Score</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Top Streak</th>
            </tr>
          </thead>

          <tbody>
            {topPlayers.length > 0 ? (
              topPlayers.map((player) => (
                <tr key={player.rank} style={styles.tableRow}>
                  <td style={styles.td}>
                    <span style={player.rank <= 3 ? styles.topRank : styles.rankBadge}>
                      #{player.rank}
                    </span>
                  </td>

                  <td style={{ ...styles.td, fontWeight: 'bold' }}>
                    {player.displayName}
                  </td>

                  <td
                    style={{
                      ...styles.td,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--accent-color)',
                    }}
                  >
                    {player.score}
                  </td>

                  <td style={styles.td}>{player.rankCategory}</td>
                  <td style={styles.td}>{player.streak}🔥</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    padding: '2rem',
                    textAlign: 'center',
                    color: 'var(--text-secondary)',
                  }}
                >
                  No leaderboard data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '3rem',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: 'var(--bg-color-lighter)',
    textAlign: 'left',
  },
  th: {
    padding: '1.2rem 1rem',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
  },
  tableRow: {
    borderBottom: '1px solid var(--bg-color-lighter)',
  },
  td: {
    padding: '1.2rem 1rem',
  },
  topRank: {
    backgroundColor: 'var(--accent-color)',
    color: 'var(--bg-color)',
    padding: '0.2rem 0.6rem',
    borderRadius: '4px',
    fontWeight: 'bold',
    fontFamily: 'var(--font-mono)',
  },
  rankBadge: {
    backgroundColor: 'var(--bg-color-lighter)',
    color: 'var(--text-main)',
    padding: '0.2rem 0.6rem',
    borderRadius: '4px',
    fontFamily: 'var(--font-mono)',
  },
};

export default Leaderboard;