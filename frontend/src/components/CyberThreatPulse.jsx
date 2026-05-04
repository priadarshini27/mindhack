import React, { useState, useEffect } from 'react';
import {
  FaShieldAlt,
  FaChevronLeft,
  FaChevronRight,
  FaBullseye,
  FaEnvelopeOpenText,
  FaNewspaper,
  FaLightbulb,
} from 'react-icons/fa';

const fallbackData = {
  stats: [
    {
      label: 'Phishing Attacks',
      value: 12450,
      detail: 'This week',
      accent: '#00e5ff',
    },
    {
      label: 'Social Engineering',
      value: 1380,
      detail: 'Reported incidents',
      accent: '#7c4dff',
    },
    {
      label: 'Online Fraud Losses',
      value: '$4.7M',
      detail: 'Estimated exposure',
      accent: '#00ff88',
    },
    {
      label: 'Top Channel',
      value: 'Email',
      detail: 'Most targeted',
      accent: '#ff5ae0',
    },
  ],
  threatDistribution: [
    {
      label: 'Phishing',
      value: 42,
      color: 'rgba(0, 229, 255, 0.8)',
    },
    {
      label: 'Malware',
      value: 28,
      color: 'rgba(124, 77, 255, 0.8)',
    },
    {
      label: 'BEC',
      value: 18,
      color: 'rgba(0, 255, 136, 0.8)',
    },
    {
      label: 'Social',
      value: 12,
      color: 'rgba(255, 90, 224, 0.8)',
    },
  ],
  news: [
    {
      title:
        'APWG warns of surge in invoice phishing campaigns targeting finance teams.',
    },
    {
      title:
        'SANS finds credential harvesting attacks up 31% across enterprise email.',
    },
    {
      title:
        'FTC alerts on fake customer support chat scams stealing account access.',
    },
  ],
  tips: [
    {
      text: 'Hover before you click: inspect links and sender details.',
    },
    {
      text: 'Verify unexpected requests via separate channels.',
    },
    {
      text: 'Enable MFA on email and corporate messaging tools.',
    },
    {
      text: 'Report suspicious communications immediately.',
    },
  ],
};

const CyberThreatPulse = () => {
  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState([]);
  const [bars, setBars] = useState([]);
  const [headlines, setHeadlines] = useState([]);
  const [tips, setTips] = useState([]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'auto';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/cyber-data.json');
        const data = await res.json();

        setStats(data.stats || fallbackData.stats);
        setBars(data.threatDistribution || fallbackData.threatDistribution);
        setHeadlines(data.news || fallbackData.news);
        setTips(data.tips || fallbackData.tips);
      } catch (error) {
        console.error('Failed to load cyber data:', error);

        setStats(fallbackData.stats);
        setBars(fallbackData.threatDistribution);
        setHeadlines(fallbackData.news);
        setTips(fallbackData.tips);
      }
    };

    loadData();
  }, []);

  return (
    <div style={styles.wrapper}>
      <button
        style={{ ...styles.toggleButton, ...(open ? styles.toggleButtonOpen : {}) }}
        onClick={() => setOpen(!open)}
        aria-label="Toggle Cyber Threat Pulse"
      >
        <FaShieldAlt size={18} />
        <span style={styles.toggleLabel}>
          {open ? 'Hide Cyber Threat Pulse' : 'Cyber Threat Pulse'}
        </span>
        {open ? <FaChevronLeft size={14} /> : <FaChevronRight size={14} />}
      </button>

      <div
        style={
          open
            ? { ...styles.panel, ...styles.panelOpen }
            : { ...styles.panel, ...styles.panelClosed }
        }
      >
        <div style={styles.panelHeader}>
          <div>
            <h2 style={styles.panelTitle}>
              Live cybersecurity trends, Scam alerts and Awareness insights
            </h2>
          </div>

          <button
            style={styles.closeButton}
            onClick={() => setOpen(false)}
            aria-label="Close Cyber Threat Pulse"
          >
            <FaChevronRight size={14} />
          </button>
        </div>

        <div style={styles.contentArea}>
          <div style={styles.rowSection}>
            <div style={styles.sectionPanel}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitle}>Real-time awareness snapshot</div>
              </div>

              <div style={styles.statGrid}>
                {stats.map((item) => (
                  <div key={item.label} style={styles.statCard}>
                    <div
                      style={{
                        ...styles.statAccent,
                        background: item.accent,
                      }}
                    />
                    <div style={styles.statValue}>
                      {typeof item.value === 'number'
                        ? item.value.toLocaleString()
                        : item.value}
                    </div>
                    <div style={styles.statLabel}>{item.label}</div>
                    <div style={styles.statDetail}>{item.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.sectionPanel}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitle}>Threat category distribution</div>
                <FaBullseye color="var(--accent-color)" />
              </div>

              <div style={styles.chart}>
                {bars.map((bar) => (
                  <div key={bar.label} style={styles.barRow}>
                    <div style={styles.barLabel}>{bar.label}</div>

                    <div style={styles.barTrack}>
                      <div
                        style={{
                          ...styles.barFill,
                          width: `${bar.value}%`,
                          background: bar.color,
                        }}
                      />
                    </div>

                    <div style={styles.barValue}>{bar.value}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={styles.rowSection}>
            <div style={styles.sectionPanel}>
              <div style={{ ...styles.sectionHeader, marginBottom: '0.75rem' }}>
                <div style={styles.sectionTitle}>Latest Cyber News</div>
                <FaNewspaper color="var(--accent-color)" />
              </div>

              <div style={styles.newsList}>
                {headlines.map((headline, index) => (
                  <div key={index} style={styles.newsItem}>
                    <FaEnvelopeOpenText
                      size={14}
                      color="var(--accent-color)"
                      style={{ marginRight: '0.6rem' }}
                    />
                    <span>{headline.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.sectionPanel}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitle}>Awareness Tips</div>
                <FaLightbulb color="var(--accent-color)" />
              </div>

              <div style={styles.tipGrid}>
                {tips.map((tip, index) => (
                  <div key={index} style={styles.tipCard}>
                    {tip.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    position: 'relative',
    width: '100%',
    marginBottom: '2rem',
  },
  toggleButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.85rem 1rem',
    borderRadius: '999px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(10, 18, 32, 0.95)',
    color: 'var(--text-main)',
    boxShadow: '0 18px 50px rgba(0, 0, 0, 0.25)',
    cursor: 'pointer',
    zIndex: 12,
    transition: 'transform 0.2s ease, background 0.2s ease',
    backdropFilter: 'blur(12px)',
  },
  toggleButtonOpen: {
    transform: 'translateX(-12px)',
  },
  toggleLabel: {
    fontSize: '0.95rem',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  panel: {
    position: 'fixed',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    width: '100vw',
    height: '100vh',
    padding: '2rem',
    background:
      'linear-gradient(180deg, rgba(17, 34, 64, 0.96) 0%, rgba(8, 18, 40, 0.98) 100%)',
    borderRadius: 0,
    backdropFilter: 'blur(24px)',
    overflow: 'hidden',
    transition: 'transform 0.35s ease',
    zIndex: 999,
    display: 'flex',
    flexDirection: 'column',
  },
  panelOpen: {
    transform: 'translateX(0%)',
  },
  panelClosed: {
    transform: 'translateX(100%)',
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
  },
  panelEyebrow: {
    fontSize: '0.8rem',
    color: 'var(--accent-color)',
    textTransform: 'uppercase',
    letterSpacing: '0.16em',
    marginBottom: '0.35rem',
  },
  panelTitle: {
    fontSize: '1.35rem',
    color: 'var(--accent-color)',
    margin: 0,
    lineHeight: 1.25,
  },
  closeButton: {
    border: 'none',
    background: 'rgba(255,255,255,0.06)',
    color: 'var(--text-main)',
    width: 36,
    height: 36,
    borderRadius: 12,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gridAutoRows: 'minmax(140px, auto)',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  statCard: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '18px',
    padding: '1.15rem',
    minHeight: '140px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.02)',
  },
  statAccent: {
    width: 48,
    height: 4,
    borderRadius: 999,
    marginBottom: '1rem',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--text-main)',
    letterSpacing: '0.02em',
  },
  statLabel: {
    color: 'var(--text-secondary)',
    margin: '0.65rem 0 0.35rem',
    fontWeight: 600,
  },
  statDetail: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: '0.88rem',
    lineHeight: 1.5,
  },
  contentArea: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    overflowX: 'hidden',
    paddingRight: '0.75rem',
    paddingBottom: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    overscrollBehavior: 'contain',
  },
  rowSection: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  sectionPanel: {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '280px',
  height: '100%',
  padding: '1rem',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '18px',
  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.02)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    letterSpacing: '0.02em',
    color: 'var(--text-main)',
  },
  chart: {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-evenly',
  flex: 1,
  height: '100%',
  },
  barRow: {
  display: 'grid',
  gridTemplateColumns: '110px 1fr 45px',
  alignItems: 'center',
  gap: '0.75rem',
  minHeight: '52px',
 },
  barLabel: {
    color: 'var(--text-secondary)',
    fontSize: '0.88rem',
  },
  barTrack: {
    height: '12px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '999px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '999px',
  },
  barValue: {
    color: 'var(--text-secondary)',
    fontSize: '0.8rem',
    textAlign: 'right',
  },
  newsList: {
    display: 'grid',
    gap: '0.75rem',
  },
  newsItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    color: 'var(--text-main)',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.06)',
    padding: '0.9rem 1rem',
    borderRadius: '14px',
    fontSize: '0.9rem',
  },
  tipGrid: {
    display: 'grid',
    gap: '0.75rem',
  },
  tipCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    padding: '0.95rem 1rem',
    borderRadius: '14px',
    color: 'var(--text-main)',
    fontSize: '0.9rem',
    lineHeight: 1.5,
  },
};

export default CyberThreatPulse;