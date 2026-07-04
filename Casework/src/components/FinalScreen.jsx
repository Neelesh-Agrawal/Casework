import React, { useState, useMemo } from 'react';
import { getEnding as getDefaultEnding } from '../gameData';
import { DNA_TRAITS, getDNALabel } from '../hooks/useProgression';
import { createMessage, hasLlmKey } from '../lib/llm';
import { buildMissedItems } from '../lib/uiTasks';
import FeedbackCard from './FeedbackCard';
import ColorHexText from './ColorHexText';

const LLM_READY = hasLlmKey();

const DNA_COLORS = {
  riskTolerance:    '#F59E0B',
  stakeholderStyle: '#7C3AED',
  researchLean:     '#10B981',
  userEmpathy:      '#00D4FF',
};

/**
 * FinalScreen — game-end results screen.
 *
 * Props:
 *   getEnding  (optional) track-specific ending function; falls back to
 *              the original gameData.getEnding for Track 2 compatibility.
 *              Ending objects must have { title, subtitle, description, color }.
 *              Older shapes (with `desc` instead of `description`) are handled
 *              automatically via the `resolveEnding` helper below.
 */
export default function FinalScreen({
  totalScore, maxScore, principles, totalScenarios,
  dna, titles, choices, scenarios, uiTasks, onPlayAgain,
  getEnding: getEndingProp,
  trackId,
  trackLabel,
}) {
  // ── Resolve ending ───────────────────────────────────────────────────────────
  const getEndingFn = getEndingProp || getDefaultEnding;
  const clamped     = Math.min(Math.max(totalScore, 0), maxScore);

  // Normalise either { title, subtitle, description, color }
  //              or  { title, desc, ... }  (legacy / simplified shape)
  const rawEnding = getEndingFn(clamped);
  const ending = {
    title:       rawEnding?.title       || 'Designer',
    subtitle:    rawEnding?.subtitle    || '',
    description: rawEnding?.description || rawEnding?.desc || '',
    color:       rawEnding?.color       || '#00D4FF',
  };

  const pct = Math.round((clamped / maxScore) * 100);

  // ── State ────────────────────────────────────────────────────────────────────
  const [tab, setTab]                     = useState('dna');
  const [caseStudy, setCaseStudy]         = useState('');
  const [caseLoading, setCaseLoading]     = useState(false);
  const [caseGenerated, setCaseGenerated] = useState(false);

  // ── What You Missed ──────────────────────────────────────────────────────────
  const missedItems = useMemo(() => {
    const raw = buildMissedItems(choices, scenarios, uiTasks);
    const max = 170;
    return raw.map(item => ({
      ...item,
      context: item.context.length > max ? `${item.context.slice(0, max)}...` : item.context,
    }));
  }, [choices, scenarios, uiTasks]);

  // ── Portfolio case study ─────────────────────────────────────────────────────
  const generateCaseStudy = async () => {
    if (caseGenerated || caseLoading || !LLM_READY) return;
    setCaseLoading(true);

    const dnaSummary = Object.entries(DNA_TRAITS).map(([key, config]) => {
      const val = dna?.[key] ?? 50;
      return `${config.label}: ${getDNALabel(key, val)} (${val}/100)`;
    }).join(', ');

    const topPrinciples = principles.slice(0, 8).map(p => p.principle).join(', ');

    const prompt = `You are writing a professional UX design portfolio case study for a junior designer who just completed Casework — a game where players make real product design decisions for a startup called Launchly.

Their results:
- Final Score: ${clamped}/${maxScore} (${pct}%)
- Designer DNA: ${dnaSummary}
- Key principles encountered: ${topPrinciples}

Write a 3-paragraph portfolio case study in first person as if the designer is writing it for LinkedIn or their portfolio.

Paragraph 1: What Casework is and what challenge the player tackled (2-3 sentences)
Paragraph 2: Key decisions made and design thinking demonstrated based on their DNA profile (3-4 sentences — be specific to their DNA scores, not generic)
Paragraph 3: What they learned and how this shapes their design approach going forward (2-3 sentences)

Write in a professional but human tone. No bullet points. No headers. Just three clean paragraphs. Max 200 words total.`;

    try {
      const text = await createMessage(prompt, 400);
      setCaseStudy(text);
    } catch (err) {
      setCaseStudy(
        err?.message
          ? `Could not generate case study: ${err.message}`
          : 'Could not generate case study. Try again later.',
      );
    } finally {
      setCaseLoading(false);
      setCaseGenerated(true);
    }
  };

  // ── Share ────────────────────────────────────────────────────────────────────
  const handleShare = () => {
    const dnaParts = Object.entries(DNA_TRAITS).map(([key, config]) => {
      return `${config.label}: ${getDNALabel(key, dna?.[key] ?? 50)}`;
    }).join(' | ');
    const text = `I just completed Casework with ${clamped}/${maxScore} Design Rep!\n\nMy Designer DNA: ${dnaParts}\n\n#Casework #UXDesign #ProductDesign`;
    if (navigator.share) {
      navigator.share({ title: 'My Casework Results', text }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text).then(() => alert('Copied to clipboard!')).catch(() => {});
    }
  };

  const handleCopyCaseStudy = () => {
    if (caseStudy) {
      navigator.clipboard?.writeText(caseStudy).then(() => alert('Case study copied!')).catch(() => {});
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="final-screen">
      <div className="final-screen__inner">

        {/* Header */}
        <div className="final-screen__header">
          <div className="final-screen__eyebrow">Game Complete</div>
          <h1 className="final-screen__title" style={{ color: ending.color }}>{ending.title}</h1>
          {ending.subtitle && (
            <p className="final-screen__subtitle">"{ending.subtitle}"</p>
          )}
        </div>

        {/* Score */}
        <div className="final-screen__score-block">
          <div className="final-score__num" style={{ color: ending.color }}>{clamped}</div>
          <div className="final-score__meta">
            <div className="final-score__label">Design Rep</div>
            <div className="final-score__of">out of {maxScore}</div>
            <div className="final-score__pct">{pct}% of maximum</div>
          </div>
        </div>
        <div className="final-screen__bar-wrap">
          <div className="final-screen__bar-fill" style={{ width: `${pct}%`, background: ending.color }} />
        </div>

        {/* Story — only render when there's content to avoid empty rectangle */}
        {ending.description && (
          <div className="final-screen__story">
            <p>{ending.description}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="final-tabs" role="tablist">
          {['dna', 'missed', 'principles', 'portfolio'].map(t => (
            <button
              key={t}
              className={`final-tab ${tab === t ? 'active' : ''}`}
              onClick={() => { setTab(t); if (t === 'portfolio') generateCaseStudy(); }}
              role="tab"
              aria-selected={tab === t}
            >
              {t === 'dna' ? 'DNA Report' : t === 'missed' ? 'What You Missed' : t === 'principles' ? 'Principles' : 'Portfolio'}
            </button>
          ))}
        </div>

        {/* DNA Report */}
        {tab === 'dna' && (
          <div className="final-panel">
            <div className="final-dna__grid">
              {Object.entries(DNA_TRAITS).map(([key, config]) => {
                const val   = dna?.[key] ?? 50;
                const label = getDNALabel(key, val);
                const color = DNA_COLORS[key];
                return (
                  <div key={key} className="dna-card">
                    <div className="dna-card__trait">{config.label}</div>
                    <div className="dna-card__value" style={{ color }}>{label}</div>
                    <div className="dna-card__bar-wrap">
                      <div className="dna-card__bar" style={{ width: `${val}%`, background: color }} />
                    </div>
                    <div className="dna-card__score">{val}/100</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* What You Missed */}
        {tab === 'missed' && (
          <div className="final-panel">
            {missedItems.length === 0 ? (
              <div className="missed-empty">
                <div style={{ fontSize: 32 }}>🎯</div>
                <p>You made the optimal call on every tracked scenario. Impressive.</p>
              </div>
            ) : (
              <>
                <p className="missed-intro">These scenarios had a better call available — including UI tasks where you didn&apos;t ace it. Here&apos;s what you could have done differently:</p>
                <div className="missed-list">
                  {missedItems.map((item, i) => (
                    <div key={i} className="missed-item">
                      <div className="missed-item__title">{item.title}</div>
                      <p className="missed-item__context">
                        <span className="missed-item__context-label">Scenario context:</span>{' '}
                        <ColorHexText>{item.context}</ColorHexText>
                      </p>
                      <div className="missed-item__row">
                        <div className="missed-item__col">
                          <div className="missed-item__col-label">You chose</div>
                          <div className="missed-item__col-text your-choice">
                            <ColorHexText>{item.youChose}</ColorHexText>
                          </div>
                        </div>
                        <div className="missed-item__arrow">→</div>
                        <div className="missed-item__col">
                          <div className="missed-item__col-label">Best call</div>
                          <div className="missed-item__col-text best-choice">
                            <ColorHexText>{item.bestWas}</ColorHexText>
                          </div>
                        </div>
                      </div>
                      {item.principle && (
                        <div className="missed-item__principle">
                          💡 {item.principle} — <ColorHexText>{item.lesson}</ColorHexText>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Principles */}
        {tab === 'principles' && (
          <div className="final-panel">
            <p className="panel-count">{principles.length} design principles encountered across {totalScenarios} scenarios.</p>
            <div className="lessons-list">
              {principles.map((item, idx) => (
                <div key={idx} className="lesson-item">
                  <div className="lesson-item__number">{String(idx + 1).padStart(2, '0')}</div>
                  <div className="lesson-item__content">
                    <div className="lesson-item__principle">{item.principle}</div>
                    <div className="lesson-item__lesson">{item.lesson}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Portfolio Case Study */}
        {tab === 'portfolio' && (
          <div className="final-panel">
            <p className="panel-intro">Generate a portfolio-ready case study based on your decisions and DNA profile. Paste it on LinkedIn or your portfolio site.</p>
            {!LLM_READY ? (
              <div className="portfolio-no-key">
                <p>Add <code>VITE_GROQ_API_KEY</code> (recommended) or <code>VITE_ANTHROPIC_API_KEY</code> to your <code>.env</code> file to generate your personalised case study.</p>
              </div>
            ) : !caseGenerated && !caseLoading ? (
              <button className="btn btn-primary" onClick={generateCaseStudy}>
                Generate My Case Study →
              </button>
            ) : caseLoading ? (
              <div className="critic-loading" style={{ marginTop: 20 }}>
                <span className="critic-dot" /><span className="critic-dot" /><span className="critic-dot" />
                <span className="critic-loading-text">Writing your case study…</span>
              </div>
            ) : (
              <div className="case-study-block">
                <div className="case-study-text">{caseStudy}</div>
                <div className="case-study-actions">
                  <button className="btn btn-defend" onClick={handleCopyCaseStudy}>Copy Text</button>
                  <button className="btn btn-ghost" onClick={() => { setCaseGenerated(false); setCaseStudy(''); }}>Regenerate</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <FeedbackCard
          variant="full"
          scope="track"
          trackId={trackId}
          trackLabel={trackLabel}
        />

        <div className="final-screen__actions">
          <button className="btn btn-primary" onClick={onPlayAgain}>Play Again</button>
          <button className="btn btn-ghost" onClick={handleShare}>Share DNA Report ↗</button>
        </div>

      </div>
    </div>
  );
}
