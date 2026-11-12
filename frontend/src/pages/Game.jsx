import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { FaHeart, FaLightbulb, FaForward, FaShieldAlt, FaSignOutAlt } from 'react-icons/fa';

import Level1Inbox from '../components/levels/Level1Inbox';
import Level2Chat from '../components/levels/Level2Chat';
import Level3Bomb from '../components/levels/Level3Bomb';
import Level4Breach from '../components/levels/Level4Breach';
import Level5Escape from '../components/levels/Level5Escape';
import { api } from '../services/api';

const Game = () => {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();

  const [hintUsed, setHintUsed] = React.useState(false);
  const [skipUsed, setSkipUsed] = React.useState(false);
  const [shieldActive, setShieldActive] = React.useState(false);
  const [shieldUsed, setShieldUsed] = React.useState(false);
  // Bumped to remount the current level so the player can retry after a mistake.
  const [attempt, setAttempt] = React.useState(0);
  const startedAt = React.useRef(Date.now());

  useEffect(() => {
    if (!state.oathTaken) {
      navigate('/oath');
    }
    if (state.gameStatus === 'idle') {
      dispatch({ type: 'START_GAME' });
      startedAt.current = Date.now();
    }
    if (state.gameStatus === 'playing' && !state.sessionId) {
      if (state.user?.id) {
        api.startGame(state.user.id)
          .then((session) => dispatch({ type: 'SET_SESSION', payload: session }))
          .catch(() => {});
      }
    }
    if (state.gameStatus === 'completed' || state.gameStatus === 'failed') {
      navigate('/result');
    }
  }, [state.oathTaken, state.gameStatus, state.sessionId, state.user?.id, navigate, dispatch]);

  const getWeaknessCategory = (level) => {
    return {
      1: 'Phishing detection',
      2: 'Social engineering',
      3: 'Urgency handling',
      4: 'Website spoofing',
      5: 'Decision timing'
    }[level] || `Level ${level} decision`;
  };

  const syncAction = (currentLevel, isCorrect, points, decisionTimeMs, isLevelComplete, shielded) => {
    const weaknessCategory = isCorrect ? 'none' : getWeaknessCategory(currentLevel);
    if (state.user?.id && state.sessionId) {
      const success = `LEVEL_${currentLevel}_SUCCESS`;
      api.action({
        userId: state.user.id,
        playerName: state.user.username,
        sessionId: state.sessionId,
        levelId: currentLevel,
        action: isCorrect ? success : `LEVEL_${currentLevel}_RISK`,
        expectedAction: success,
        weaknessCategory,
        scoreDelta: points,
        decisionTimeMs,
        levelComplete: isLevelComplete,
        shielded,
      })
        .then((session) => dispatch({ type: 'SYNC_BACKEND_GAME', payload: session }))
        .catch(() => {});
    }

    dispatch({
      type: 'RECORD_ACTION',
      payload: {
        levelId: currentLevel,
        correct: isCorrect,
        weaknessCategory,
        decisionTimeMs,
      }
    });
  };

  const handleAction = (isCorrect, points, isLevelComplete = true) => {
    const currentLevel = state.currentLevel;
    const decisionTimeMs = Date.now() - startedAt.current;
    const willLoseLife = !isCorrect && !shieldActive;
    const willFail = willLoseLife && state.lifelines - 1 <= 0;

    syncAction(currentLevel, isCorrect, points, decisionTimeMs, isLevelComplete, !isCorrect && shieldActive);
    if (isCorrect) {
      dispatch({ type: 'ANSWER_CORRECT', payload: { points } });
    } else {
      if (shieldActive) {
        setShieldActive(false);
        alert("Shield Activated! Your lifeline was protected.");
      } else {
        dispatch({ type: 'ANSWER_WRONG' });
      }
    }

    if (isLevelComplete || willFail) {
      if (willFail) {
        dispatch({ type: 'END_GAME', payload: { completedAll: false } });
      } else {
        setTimeout(() => {
          if (currentLevel === 5) {
            dispatch({ type: 'END_GAME', payload: { completedAll: true } });
          } else {
            startedAt.current = Date.now();
            dispatch({ type: 'NEXT_LEVEL', payload: { currentLevel: currentLevel + 1 } });
          }
        }, 1500);
      }
    } else if (!isCorrect && currentLevel !== 1) {
      // Levels 2-5 lock after a wrong decision; restart the level after the feedback is shown.
      // Level 1 handles each email independently, so it keeps going on its own.
      setTimeout(() => {
        startedAt.current = Date.now();
        setAttempt((n) => n + 1);
      }, 1500);
    }
  };

  const consumeLifeline = () => {
    dispatch({ type: 'USE_LIFELINE' });
    if (state.sessionId) {
      api.useLifeline(state.sessionId).catch(() => {});
    }
  };

  const handleExitGame = () => {
    dispatch({ type: 'END_GAME', payload: { completedAll: false } });
  };

  const handleHint = () => {
    if (state.lifelines > 0 && !hintUsed) {
      consumeLifeline();
      setHintUsed(true);
      const hints = [
        "Check the sender's email address carefully for misspellings.",
        "Look at the tone of the message. Is it creating false urgency?",
        "Inspect the URL before clicking. Does it lead where it claims?",
        "Don't provide personal info if you didn't initiate the request.",
        "When in doubt, use an alternate channel to verify."
      ];
      alert("Hint: " + hints[state.currentLevel - 1]);
    }
  };

  const handleSkip = () => {
    if (state.lifelines > 0 && !skipUsed) {
      consumeLifeline();
      setSkipUsed(true);
      if (state.currentLevel === 5) {
        // Skipping the final level still finishes the simulation.
        dispatch({ type: 'END_GAME', payload: { completedAll: true } });
      } else {
        startedAt.current = Date.now();
        dispatch({ type: 'NEXT_LEVEL' });
      }
    }
  };

  const handleShield = () => {
    if (state.lifelines > 0 && !shieldUsed) {
      consumeLifeline();
      setShieldUsed(true);
      setShieldActive(true);
      alert("Shield activated! Your next mistake will not cost a lifeline.");
    }
  };

  const renderLevel = () => {
    const key = `${state.currentLevel}-${attempt}`;
    switch (state.currentLevel) {
      case 1: return <Level1Inbox key={key} onAction={handleAction} />;
      case 2: return <Level2Chat key={key} onAction={handleAction} />;
      case 3: return <Level3Bomb key={key} onAction={handleAction} />;
      case 4: return <Level4Breach key={key} onAction={handleAction} />;
      case 5: return <Level5Escape key={key} onAction={handleAction} />;
      default: return <div>Loading...</div>;
    }
  };

  if (!state.oathTaken || state.gameStatus === 'idle') return null;

  return (
    <div style={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
        <button className="btn btn-danger" onClick={handleExitGame} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
          <FaSignOutAlt /> Exit Game
        </button>
      </div>
      <div style={styles.header}>
        <div style={styles.headerSection}>
          <span style={styles.label}>LEVEL</span>
          <span style={styles.value}>{state.currentLevel} / 5</span>
        </div>
        
        <div style={styles.headerSection}>
          <span style={styles.label}>SCORE</span>
          <span style={{...styles.value, color: 'var(--accent-color)'}}>{state.score}</span>
        </div>
        
        <div style={styles.headerSection}>
          <span style={styles.label}>STREAK</span>
          <span style={{...styles.value, color: 'orange'}}>{state.streak}🔥</span>
        </div>

        <div style={styles.lifelineContainer}>
          {[...Array(3)].map((_, i) => (
            <FaHeart 
              key={i} 
              size={24} 
              color={i < state.lifelines ? 'var(--danger)' : 'var(--text-secondary)'} 
              style={{ margin: '0 4px', transition: 'all 0.3s' }}
            />
          ))}
        </div>
      </div>

      <div style={styles.lifelineButtons}>
        <button 
          className="btn" 
          onClick={handleHint} 
          disabled={hintUsed || state.lifelines <= 0}
          style={hintUsed ? { opacity: 0.5 } : {}}
        >
          <FaLightbulb /> Hint
        </button>
        <button 
          className="btn" 
          onClick={handleSkip} 
          disabled={skipUsed || state.lifelines <= 0}
          style={skipUsed ? { opacity: 0.5 } : {}}
        >
          <FaForward /> Skip
        </button>
        <button 
          className="btn" 
          onClick={handleShield} 
          disabled={shieldUsed || state.lifelines <= 0}
          style={shieldUsed || shieldActive ? { opacity: 0.5, borderColor: shieldActive ? 'var(--accent-color)' : '' } : {}}
        >
          <FaShieldAlt /> Shield
        </button>
      </div>

      <div style={styles.gameArea}>
        {renderLevel()}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    padding: '1rem',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'var(--bg-color-light)',
    padding: '1rem 2rem',
    borderRadius: '8px',
    border: '1px solid var(--bg-color-lighter)',
    marginBottom: '1rem',
  },
  headerSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  label: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-mono)',
    marginBottom: '4px',
  },
  value: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    fontFamily: 'var(--font-mono)',
  },
  lifelineContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  lifelineButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '2rem',
  },
  gameArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  }
};

export default Game;
