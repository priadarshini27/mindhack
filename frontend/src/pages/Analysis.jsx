import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRobot, FaChartLine, FaLightbulb, FaShieldAlt, FaCircleNotch } from 'react-icons/fa';
import { useGame } from '../context/GameContext';
import { api } from '../services/api';

const sampleActionHistory = [
  { levelId: 1, correct: false, weaknessCategory: 'Phishing detection', decisionTimeMs: 4200 },
  { levelId: 2, correct: false, weaknessCategory: 'Social engineering', decisionTimeMs: 3800 },
  { levelId: 3, correct: true, weaknessCategory: 'none', decisionTimeMs: 3100 },
  { levelId: 4, correct: false, weaknessCategory: 'Website spoofing', decisionTimeMs: 2200 },
  { levelId: 5, correct: false, weaknessCategory: 'Decision timing', decisionTimeMs: 1400 },
];

const Analysis = () => {
  const { state } = useGame();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [source, setSource] = useState('custom');

  const actionHistory = state.actionHistory && state.actionHistory.length > 0 ? state.actionHistory : sampleActionHistory;

  const normalizeAnalysisResult = (result) => {
    if (!result) {
      return {
        riskScore: 0,
        riskLevel: 'Moderate',
        weakestCategory: { name: 'Unknown', reason: 'No weakness data returned.' },
        recommendedTraining: ['No improvement recommendations available.'],
        coachingSummary: 'AI coach has no summary to show.'
      };
    }

    return {
      riskScore: result.riskScore ?? 0,
      riskLevel: result.riskLevel ?? 'Moderate',
      weakestCategory: result.weakestCategory ?? { name: 'Unknown', reason: 'No weakness data returned.' },
      recommendedTraining: result.recommendedTraining ?? [],
      coachingSummary: result.coachingSummary ?? 'AI coach has no summary to show.'
    };
  };

  const fetchAnalysis = async () => {
    setLoading(true);
    setError('');
    setAnalysis(null);
    const hasSessionActions = !!(state.actionHistory && state.actionHistory.length > 0);
    setSource(hasSessionActions ? 'custom' : 'sample');

    try {
      const payload = {
        userId: state.user?.id ?? 1,
        actions: actionHistory,
      };
      const result = await api.analyzeFeedback(payload);
      setAnalysis(normalizeAnalysisResult(result));
    } catch (err) {
      console.error(err);
      setError('AI analysis failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
        <div style={styles.hero}>
        <div style={styles.heroHeader}>
          <h1 style={styles.heroTitle}>AI-Based Improvement Analysis</h1>
          <p style={styles.heroDesc}>
            AI reviews your simulation decisions, detects repeated mistakes, highlights your weakest security habits, and recommends what to practice next.
          </p>

          <div style={styles.ctaRow}>
            <button className="btn btn-primary" onClick={fetchAnalysis} disabled={loading}>
              {loading ? <><FaCircleNotch className="spin" /> Running analysis</> : 'Run AI Analysis'}
            </button>

            <Link to="/dashboard" className="btn">
              Back to Dashboard
            </Link>
        </div>
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.analysisContainer}>
        <div style={styles.card}>
          <h2>Analysis Summary</h2>
          <p style={{ opacity: 0.85 }}>
            {state.actionHistory && state.actionHistory.length > 0
              ? 'This report is built from your latest simulation session. Review the AI coach output and improve the weak spots detected in the scenario.'
              : 'No session actions found. A fallback analysis is shown from a representative training run so you can explore the AI coaching flow.'}
          </p>
          <div style={styles.detailRow}>
            <span>Source</span>
            <strong>{source === 'custom' ? 'Last run data' : 'Sample training profile'}</strong>
          </div>
          <div style={styles.detailRow}>
            <span>Actions reviewed</span>
            <strong>{actionHistory.length}</strong>
          </div>
        </div>

        {analysis ? (
          <>
            <div style={styles.grid}>
              <div style={styles.highlightCard}>
                <h3>Coaching Summary</h3>
                <p>{analysis.coachingSummary}</p>
              </div>

              <div style={styles.card}>
                <h3>Risk score</h3>
                <div style={styles.riskPanel}>
                  <div>
                    <div style={styles.riskScore}>{analysis.riskScore}</div>
                    <div style={styles.riskLevel}>{analysis.riskLevel}</div>
                  </div>
                  <div style={styles.weakestCategory}>
                    <strong>{analysis.weakestCategory?.name ?? 'Unknown'}</strong>
                    <p>{analysis.weakestCategory?.reason ?? 'No weakness reason provided.'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.grid}>
              <div style={styles.card}>
                <h3>Recommended training</h3>
                <ul style={styles.trainingList}>
                  {(analysis.recommendedTraining ?? []).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div style={styles.card}>
                <h3>Action history</h3>
                <div style={styles.categoryList}>
                  {actionHistory.map((action, index) => (
                    <div key={`${action.levelId}-${index}`} style={styles.categoryRow}>
                      <span>Level {action.levelId}</span>
                      <strong>{action.correct ? 'Correct' : 'Incorrect'}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={styles.placeholder}>
            <p>Click the button to generate your interactive AI improvement report.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  hero: {
  marginBottom: '2rem',
},

heroHeader: {
  background: 'rgba(0, 229, 255, 0.06)',
  border: '1px solid rgba(0, 229, 255, 0.18)',
  borderRadius: '18px',
  padding: '2rem',
},

heroTitle: {
  margin: 0,
  fontSize: '2.3rem',
  fontWeight: 800,
  color: '#00E5FF',
  textAlign: 'left',
},

heroDesc: {
  marginTop: '0.8rem',
  marginBottom: 0,
  maxWidth: '760px',
  lineHeight: 1.6,
  color: 'var(--text-secondary)',
  textAlign: 'left',
},

ctaRow: {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  marginTop: '1.5rem',
  flexWrap: 'wrap',
},
  analysisContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  card: {
    background: 'var(--bg-color-light)',
    borderRadius: '16px',
    padding: '1.75rem',
    border: '1px solid var(--bg-color-lighter)',
  },
  highlightCard: {
    background: 'linear-gradient(135deg, rgba(63, 94, 251, 0.12), rgba(81, 213, 169, 0.12))',
    borderRadius: '16px',
    padding: '1.75rem',
    border: '1px solid rgba(81, 213, 169, 0.14)',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1rem',
    opacity: 0.9,
  },
  riskPanel: {
    display: 'grid',
    gap: '1rem',
    paddingTop: '0.5rem',
  },
  riskScore: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: 'var(--text-main)',
    lineHeight: 1,
  },
  riskLevel: {
    marginTop: '0.25rem',
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--accent-color)',
  },
  weakestCategory: {
    background: 'rgba(81, 213, 169, 0.08)',
    border: '1px solid rgba(81, 213, 169, 0.15)',
    borderRadius: '14px',
    padding: '1rem',
    color: 'var(--text-main)',
  },
  trainingList: {
    marginTop: '1rem',
    paddingLeft: '1.2rem',
    color: 'var(--text-main)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    marginTop: '1rem',
  },
  tag: {
    background: 'var(--bg-color)',
    border: '1px solid var(--bg-color-lighter)',
    padding: '0.65rem 1rem',
    borderRadius: '999px',
    fontSize: '0.95rem',
  },
  categoryList: {
    display: 'grid',
    gap: '1rem',
    marginTop: '1rem',
  },
  categoryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.85rem 1rem',
    backgroundColor: 'var(--bg-color)',
    borderRadius: '12px',
    border: '1px solid var(--bg-color-lighter)',
  },
  placeholder: {
    background: 'var(--bg-color)',
    borderRadius: '16px',
    padding: '2rem',
    textAlign: 'center',
    color: 'var(--text-secondary)',
  },
  error: {
    background: 'rgba(255, 80, 80, 0.12)',
    border: '1px solid rgba(255, 80, 80, 0.2)',
    color: 'var(--danger)',
    borderRadius: '12px',
    padding: '1rem 1.25rem',
    marginBottom: '1rem',
  }
};

export default Analysis;
