import React, { useState, useEffect } from 'react';
import ColorHexText from './ColorHexText';

const PRINCIPLE_ICONS = {
  "Hick's Law": '⚡', "Hick's Law + Form Design": '⚡',
  'Collaborative Design Process': '🤝', 'WCAG Contrast Ratios': '👁️',
  'Accessibility & WCAG AA': '♿', 'Stakeholder Communication': '🗣️',
  'Perceived Performance': '⏳', 'Skeleton Screens': '🦴',
  'Delight vs. Utility': '✨', 'Notification Design': '🔔',
  'User Autonomy & Progressive Disclosure': '🎛️', 'Data-Informed vs. Data-Dependent': '📊',
  'Error Message UX': '❌', 'Microcopy & Error Messages': '✍️',
  'Tone of Voice': '🎭', 'User Segmentation': '👥',
  'Progressive Disclosure': '🎯', 'Research Before Redesign': '🔬',
  'Typographic Hierarchy': '🔠', 'Typography Systems': '📐',
  'Design Advocacy': '📢', 'Mobile-First Thinking': '📱',
  'Mobile-First Design': '📱', 'Responsive Design': '💻',
  'Validated Shipping': '🚦', 'A/B Testing': '🧪',
  'Staged Rollouts': '🪜', 'Research as Persuasion': '🎬',
  'Evidence-Based Design': '📋', "Jakob's Law": '🧭',
  'Doherty Threshold': '⚡', 'Zeigarnik Effect': '🔄',
  'Default Effect': '🎲', 'Von Restorff Effect': '🎪',
  'Peak-End Rule': '🏁', 'Anchoring Bias': '⚓',
  'Dark Patterns': '🚫', 'Nudge Theory': '👉',
  'Social Proof': '💬', 'Gestalt — Proximity': '📐',
  'Gestalt — Similarity': '🔗', 'Gestalt — Figure-Ground': '🖼️',
  'Aesthetic-Usability Effect': '🎨', "Fitts's Law": '🎯',
  'Cognitive Accessibility': '🧠', 'Motion & Animation Safety': '🎞️',
  'Icon Clarity & Metaphor': '🔍', 'Colour Theory & Convention': '🎨',
  'Visual Weight & Balance': '⚖️', 'Law of Pragnanz': '🔲',
  'Mental Models': '🗺️', 'Usability Testing': '🔬',
  'Jobs-to-be-Done': '💼', 'Affinity Mapping': '🗂️',
  'Design Sprints': '🏃', 'Design Systems': '🏗️',
  'Design Debt': '💳', "Tesler's Law": '⚙️',
  'Component Reuse': '♻️', 'Dual-Process Thinking': '🧠',
  'Consistency and Standards': '📏', 'Help and Documentation': '📖',
  'Error Prevention': '🛡️', 'Visibility of System Status': '📡',
  'Recognition Rather Than Recall': '👁️', "Miller's Law": '🔢',
  'Non-text Contrast': '🌗', "WCAG 2.2 Focus Visibility": '🎯',
  'Keyboard Accessibility': '⌨️',
};

const METRICS = {
  15: { conversion: '+12–18%', satisfaction: '↑ High', impact: 'Positive' },
  5:  { conversion: '+2–5%',   satisfaction: '→ Neutral', impact: 'Mixed' },
  0:  { conversion: '±0%',     satisfaction: '→ Neutral', impact: 'Neutral' },
  '-10': { conversion: '-8–15%', satisfaction: '↓ Low', impact: 'Negative' },
};

function getMetrics(delta) {
  if (delta >= 15) return METRICS[15];
  if (delta > 0)   return METRICS[5];
  if (delta === 0) return METRICS[0];
  return METRICS['-10'];
}

function getBadge(delta) {
  if (delta >= 15) return { label: 'Great Call', cls: 'great' };
  if (delta > 0)   return { label: 'Decent Move', cls: 'okay' };
  return { label: 'Painful Lesson', cls: 'bad' };
}

function truncate(text, maxWords = 28) {
  if (!text) return '';
  const words = text.split(' ');
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + '…';
}

function ComparisonReveal({ scenario, choiceId, consequences, uiTask }) {
  if (uiTask || !scenario?.choices) return null;

  const yourChoice = scenario.choices.find(c => c.id === choiceId);
  const bestChoice = [...scenario.choices].sort((a, b) => b.delta - a.delta)[0];
  const isAlreadyBest = yourChoice?.id === bestChoice?.id;

  if (!yourChoice) return null;

  const yourConsequence = consequences?.[choiceId];
  const bestConsequence = consequences?.[bestChoice?.id];
  const yourDelta = yourChoice.delta;

  return (
    <div style={{
      borderRadius: 12,
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.10)',
      marginBottom: 20,
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '10px 16px',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.08em',
        color: 'rgba(255,255,255,0.45)',
        textTransform: 'uppercase',
      }}>
        {isAlreadyBest ? '✓ Decision Breakdown — You picked the best call' : '↕ Decision Breakdown'}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isAlreadyBest ? '1fr' : '1fr 1fr',
        gap: 0,
      }}>
        <div style={{
          padding: '14px 16px',
          borderRight: isAlreadyBest ? 'none' : '1px solid rgba(255,255,255,0.08)',
          background: yourDelta < 0
            ? 'rgba(239,68,68,0.06)'
            : yourDelta >= 15
            ? 'rgba(16,185,129,0.06)'
            : 'rgba(245,158,11,0.06)',
        }}>
          <div style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.07em',
            marginBottom: 8,
            color: yourDelta < 0 ? '#EF4444' : yourDelta >= 15 ? '#10B981' : '#F59E0B',
          }}>
            {yourDelta < 0 ? '✗ YOUR CHOICE' : yourDelta >= 15 ? '✓ YOUR CHOICE' : '~ YOUR CHOICE'}
          </div>
          <p style={{
            margin: '0 0 10px',
            fontSize: 13,
            lineHeight: 1.45,
            color: 'rgba(255,255,255,0.85)',
            fontStyle: 'italic',
          }}>
            <ColorHexText>{yourChoice.text}</ColorHexText>
          </p>
          {yourConsequence?.lesson && (
            <p style={{
              margin: 0,
              fontSize: 12,
              lineHeight: 1.5,
              color: 'rgba(255,255,255,0.55)',
            }}>
              <ColorHexText>{truncate(yourConsequence.lesson, 24)}</ColorHexText>
            </p>
          )}
        </div>

        {!isAlreadyBest && bestChoice && (
          <div style={{
            padding: '14px 16px',
            background: 'rgba(16,185,129,0.06)',
          }}>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.07em',
              color: '#10B981',
              marginBottom: 8,
            }}>
              ✓ BEST CALL
            </div>
            <p style={{
              margin: '0 0 10px',
              fontSize: 13,
              lineHeight: 1.45,
              color: 'rgba(255,255,255,0.85)',
              fontStyle: 'italic',
            }}>
              <ColorHexText>{bestChoice.text}</ColorHexText>
            </p>
            {bestConsequence?.lesson && (
              <p style={{
                margin: 0,
                fontSize: 12,
                lineHeight: 1.5,
                color: 'rgba(255,255,255,0.55)',
              }}>
                <ColorHexText>{truncate(bestConsequence.lesson, 24)}</ColorHexText>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ConsequenceScreen({
  scenario, consequence, choiceId, delta, onNext, uiTask,
}) {
  const [deltaVisible, setDeltaVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDeltaVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  const badge   = getBadge(delta);
  const icon    = PRINCIPLE_ICONS[consequence.principle] || '💡';
  const metrics = getMetrics(delta);
  const deltaSign  = delta >= 0 ? `+${delta}` : `${delta}`;
  const deltaClass = delta > 0 ? 'positive' : delta < 0 ? 'negative' : 'neutral';

  return (
    <div className="consequence">
      <div className="consequence__inner">

        <div className="consequence__verdict">
          <span className={`consequence__badge ${badge.cls}`}>{badge.label}</span>
          <span
            className={`consequence__score-delta ${deltaClass}`}
            style={{ opacity: deltaVisible ? 1 : 0, transition: 'opacity 400ms' }}
          >{deltaSign} Rep</span>
        </div>

        <div className="consequence__metrics">
          <div className="metric-pill">
            <span className="metric-pill__label">Conversion</span>
            <span className="metric-pill__value">{metrics.conversion}</span>
          </div>
          <div className="metric-pill">
            <span className="metric-pill__label">Satisfaction</span>
            <span className="metric-pill__value">{metrics.satisfaction}</span>
          </div>
          <div className="metric-pill">
            <span className="metric-pill__label">Business Impact</span>
            <span className={`metric-pill__value impact-${delta >= 15 ? 'pos' : delta < 0 ? 'neg' : 'neu'}`}>{metrics.impact}</span>
          </div>
        </div>

        <div className="consequence__card story">
          <div className="consequence__card-label">What happened</div>
          <ColorHexText as="p" className="consequence__story">{consequence.story}</ColorHexText>
          <p className="consequence__lesson">
            <strong>Lesson: </strong>
            <ColorHexText>{consequence.lesson}</ColorHexText>
          </p>
        </div>

        <ComparisonReveal
          scenario={scenario}
          choiceId={choiceId}
          consequences={scenario?.consequences}
          uiTask={uiTask}
        />

        <div className="consequence__card principle">
          <div className="consequence__card-label">Design Principle</div>
          <div className="principle-box">
            <div className="principle-box__header">
              <span className="principle-box__icon" aria-hidden="true">{icon}</span>
              <span className="principle-box__title">{consequence.principle}</span>
            </div>
            <ColorHexText as="p" className="principle-box__detail">{consequence.principleDetail}</ColorHexText>
          </div>
        </div>

        <div className="consequence__actions">
          <button type="button" className="btn btn-next" onClick={onNext}>
            Next →
          </button>
        </div>

      </div>
    </div>
  );
}
