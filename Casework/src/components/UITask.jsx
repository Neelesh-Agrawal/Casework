import React, { useState } from 'react';

/**
 * UITask — interactive scenario replacing the standard A/B/C choice.
 * Each task type teaches a UX law through doing, not reading.
 *
 * Props: task { type, title, law, narration, instruction, consequences }
 *        onComplete(choiceId)  — calls with 'A' / 'B' / 'C'
 *
 * Supported types (17 total):
 *   fitts | proximity | contrast | reorder
 *   heuristic-audit | type-scale | ia-sort | copy-fix
 *   icon-match | color-roles | dark-pattern | spacing-pick
 *   a11y-audit | component-states | focus-order
 *   before-after | color-palette
 */

// ─── Design tokens (mirror index.css) ────────────────────────────────────────
const T = {
  accent:        '#00D4FF',
  accentBg:      'rgba(0,212,255,0.10)',
  accentBorder:  'rgba(0,212,255,0.35)',
  purple:        '#7C3AED',
  purpleBg:      'rgba(124,58,237,0.10)',
  purpleBorder:  'rgba(124,58,237,0.35)',
  green:         '#10B981',
  greenBg:       'rgba(16,185,129,0.10)',
  greenBorder:   'rgba(16,185,129,0.35)',
  red:           '#EF4444',
  redBg:         'rgba(239,68,68,0.08)',
  redBorder:     'rgba(239,68,68,0.30)',
  yellow:        '#F59E0B',
  yellowBg:      'rgba(245,158,11,0.10)',
  yellowBorder:  'rgba(245,158,11,0.30)',
  card:          '#1C2230',
  secondary:     '#161B22',
  border:        'rgba(255,255,255,0.08)',
  borderSoft:    'rgba(255,255,255,0.05)',
  text:          '#F0F6FF',
  textSec:       '#8B9AB8',
  textMuted:     '#4A5568',
  mono:          "'Space Mono', monospace",
  body:          "'DM Sans', sans-serif",
};

// Light-theme colours for mock UI mockups
const LT = {
  bg:      '#FFFFFF',
  surface: '#F9FAFB',
  border:  '#E5E7EB',
  text:    '#111827',
  textSec: '#374151',
  textMuted:'#9CA3AF',
  accent:  '#4F46E5',
  green:   '#059669',
  red:     '#DC2626',
};

// ─── Shared micro-components ──────────────────────────────────────────────────

function FeedbackBox({ text, type = 'correct' }) {
  if (!text) return null;
  const styles = {
    correct: { bg: T.greenBg,  border: T.greenBorder,  color: '#6EE7B7' },
    wrong:   { bg: T.redBg,    border: T.redBorder,    color: '#FCA5A5' },
    info:    { bg: T.accentBg, border: T.accentBorder, color: '#A5F3FC' },
  };
  const s = styles[type] || styles.correct;
  return (
    <div style={{
      background: s.bg, border: `1px solid ${s.border}`,
      borderRadius: 10, padding: '12px 16px', marginTop: 16,
      fontSize: 13, color: s.color, lineHeight: 1.65, fontFamily: T.body,
    }}>
      {text}
    </div>
  );
}

function SubmitBtn({ onClick, disabled, children }) {
  return (
    <button
      className="btn btn-defend"
      onClick={onClick}
      disabled={disabled}
      style={{ marginTop: 14, width: '100%', justifyContent: 'center' }}
    >
      {children}
    </button>
  );
}

// ─── 1. FittsTask ─────────────────────────────────────────────────────────────
function FittsTask({ task, onComplete }) {
  const [selected, setSelected] = useState(null);
  const buttons = [
    { id: 'A', label: 'Tiny',   height: 24,  note: '24px — hard to hit'     },
    { id: 'B', label: 'Medium', height: 36,  note: '36px — borderline'       },
    { id: 'C', label: 'Large',  height: 48,  note: '48px — comfortable tap'  },
  ];
  const pick = (btn) => {
    if (selected) return;
    setSelected(btn.id);
    setTimeout(() => onComplete(btn.id), 800);
  };
  return (
    <div className="uitask__body">
      <p className="uitask__instruction">{task.instruction}</p>
      <div className="uitask__fitts-demo">
        {buttons.map(btn => (
          <div key={btn.id} className="uitask__fitts-row">
            <button
              className={`uitask__fitts-btn ${selected === btn.id ? 'selected' : ''} ${selected && selected !== btn.id ? 'dimmed' : ''}`}
              style={{ height: btn.height }}
              onClick={() => pick(btn)}
              disabled={!!selected}
              aria-label={`${btn.label} button — ${btn.note}`}
            >
              {btn.label}
            </button>
            <span className="uitask__fitts-note">{btn.note}</span>
          </div>
        ))}
      </div>
      {selected && (
        <div className="uitask__selection-confirm">
          You chose the {buttons.find(b => b.id === selected)?.label} button — getting feedback…
        </div>
      )}
    </div>
  );
}

// ─── 2. ProximityTask ─────────────────────────────────────────────────────────
// Now shows real Launchly settings form mockups instead of emoji grids.
function ProximityTask({ task, onComplete }) {
  const [selected, setSelected] = useState(null);

  // Use task.layouts if provided (new tracks), otherwise fall back to hardcoded
  // Track 2 default: A=Scattered(-10), B=Grouped(+15), C=Boxed(+5)
  const layouts = task.layouts || [
    { id: 'A', label: 'Scattered', visualType: 'scattered', desc: 'All elements spread evenly — no grouping' },
    { id: 'B', label: 'Grouped',   visualType: 'grouped',   desc: 'Related elements clustered by whitespace' },
    { id: 'C', label: 'Boxed',     visualType: 'boxed',     desc: 'Each group inside a bordered card' },
  ];

  const pick = (opt) => {
    if (selected) return;
    setSelected(opt.id);
    setTimeout(() => onComplete(opt.id), 800);
  };

  // Mini form-field subcomponents for the mockups
  const Field = ({ label, type = 'input', gap = 7 }) => (
    <div style={{ marginBottom: gap }}>
      <div style={{ fontSize: 9, fontWeight: 600, color: '#6B7280', fontFamily: 'system-ui', marginBottom: 2, letterSpacing: '0.03em' }}>{label}</div>
      {type === 'toggle' ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, height: 18 }}>
          <div style={{ width: 26, height: 14, borderRadius: 7, background: '#4F46E5', position: 'relative', flexShrink: 0 }}>
            <div style={{ position: 'absolute', right: 2, top: 2, width: 10, height: 10, borderRadius: '50%', background: '#fff' }} />
          </div>
          <span style={{ fontSize: 9, color: '#6B7280', fontFamily: 'system-ui' }}>On</span>
        </div>
      ) : (
        <div style={{ height: 20, border: '1px solid #E5E7EB', borderRadius: 4, background: '#F9FAFB' }} />
      )}
    </div>
  );

  const SecLabel = ({ text }) => (
    <div style={{ fontSize: 8, fontWeight: 700, color: '#9CA3AF', fontFamily: 'system-ui', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
      {text}
    </div>
  );

  const renderSettingsForm = (visualType) => {
    const card = { background: '#fff', borderRadius: 8, padding: '10px', fontFamily: 'system-ui', boxShadow: '0 1px 6px rgba(0,0,0,0.12)' };

    if (visualType === 'scattered') {
      // All fields with identical spacing — no visual grouping
      return (
        <div style={card}>
          <Field label="Full Name" />
          <Field label="Email Address" />
          <Field label="Email Alerts" type="toggle" />
          <Field label="Push Notifications" type="toggle" />
          <Field label="Password" />
          <Field label="Two-Factor Auth" type="toggle" gap={0} />
        </div>
      );
    }

    if (visualType === 'grouped') {
      // Clear section separation with whitespace + section labels
      return (
        <div style={card}>
          <div style={{ marginBottom: 12 }}>
            <SecLabel text="Account" />
            <Field label="Full Name" gap={6} />
            <Field label="Email Address" gap={0} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <SecLabel text="Notifications" />
            <Field label="Email Alerts" type="toggle" gap={6} />
            <Field label="Push Notifications" type="toggle" gap={0} />
          </div>
          <div>
            <SecLabel text="Security" />
            <Field label="Password" gap={6} />
            <Field label="Two-Factor Auth" type="toggle" gap={0} />
          </div>
        </div>
      );
    }

    // Boxed — each section inside its own bordered card
    return (
      <div style={{ ...card, background: '#F9FAFB', display: 'flex', flexDirection: 'column', gap: 6, padding: 8 }}>
        {[
          { label: 'Account',       fields: [{ label: 'Full Name' }, { label: 'Email Address' }] },
          { label: 'Notifications', fields: [{ label: 'Email Alerts', type: 'toggle' }, { label: 'Push Notifications', type: 'toggle' }] },
          { label: 'Security',      fields: [{ label: 'Password' }, { label: 'Two-Factor Auth', type: 'toggle' }] },
        ].map(sec => (
          <div key={sec.label} style={{ background: '#fff', borderRadius: 6, padding: '8px', border: '1px solid #E5E7EB' }}>
            <SecLabel text={sec.label} />
            {sec.fields.map((f, i) => (
              <Field key={f.label} {...f} gap={i < sec.fields.length - 1 ? 6 : 0} />
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="uitask__body">
      <p className="uitask__instruction">{task.instruction}</p>
      <p className="uitask__sub">Each option shows the same Launchly settings page laid out differently. Pick the layout that best applies the Law of Proximity.</p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {layouts.map(opt => {
          const isSel    = selected === opt.id;
          const isDimmed = selected && !isSel;
          return (
            <div
              key={opt.id}
              onClick={() => pick(opt)}
              style={{
                flex: '1 1 130px',
                cursor: selected ? 'default' : 'pointer',
                opacity: isDimmed ? 0.35 : 1,
                transition: 'all 0.2s',
                borderRadius: 12,
                overflow: 'hidden',
                border: `2px solid ${isSel ? T.accent : T.border}`,
                boxShadow: isSel ? `0 0 0 3px ${T.accentBg}` : 'none',
              }}
            >
              {/* Option label strip */}
              <div style={{
                background: isSel ? T.accentBg : T.card,
                borderBottom: `1px solid ${T.border}`,
                padding: '7px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: isSel ? T.accent : T.textSec, fontFamily: T.mono }}>{opt.id}</span>
                <span style={{ fontSize: 10, color: T.textMuted, fontFamily: T.body }}>{opt.label}</span>
              </div>
              {/* Live settings form preview */}
              <div style={{ padding: '8px', background: '#EAECF0' }}>
                {renderSettingsForm(opt.visualType || opt.id)}
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <div style={{ marginTop: 10, padding: '10px 14px', background: T.accentBg, borderRadius: 8, fontSize: 12, color: T.accent, fontFamily: T.mono }}>
          Option {selected} selected — getting feedback…
        </div>
      )}
    </div>
  );
}

// ─── 3. ContrastTask ──────────────────────────────────────────────────────────
// Now shows real Launchly UI cards in context instead of abstract swatch boxes.
function ContrastTask({ task, onComplete }) {
  const [selected, setSelected] = useState(null);

  // Use task.swatches if provided (new tracks), otherwise fall back to hardcoded
  // Track 2 default: A=fails(−10), B=passes AA(+5), C=high contrast AAA(+5)
  const swatches = task.swatches || [
    { id: 'A', bg: '#E8F4E8', text: '#7DC47D', note: '2.1:1' },
    { id: 'B', bg: '#E8F4E8', text: '#2D7D2D', note: '5.8:1' },
    { id: 'C', bg: '#E8F4E8', text: '#1A1A1A', note: '15:1'  },
  ];

  const pick = (s) => {
    if (selected) return;
    setSelected(s.id);
    const outcome = task.correctAnswer
      ? (s.id === task.correctAnswer ? 'A' : 'B')
      : s.id;
    setTimeout(() => onComplete(outcome), 800);
  };

  return (
    <div className="uitask__body">
      <p className="uitask__instruction">{task.instruction}</p>
      <p className="uitask__sub">Each card shows the same Launchly dashboard with a different text colour. Pick the one that passes WCAG AA (minimum 4.5:1 contrast ratio).</p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {swatches.map(s => {
          const isSel    = selected === s.id;
          const isDimmed = selected && !isSel;
          const textColor = s.text || s.hex || '#111827';
          const bgColor   = s.bg || '#FFFFFF';
          const ratio     = parseFloat(s.note || s.contrastOnWhite);
          const passes    = !Number.isNaN(ratio) ? ratio >= 4.5 : true;

          return (
            <button
              key={s.id}
              onClick={() => pick(s)}
              disabled={!!selected}
              style={{
                flex: '1 1 130px',
                background: bgColor,
                border: `2px solid ${isSel ? T.accent : 'transparent'}`,
                borderRadius: 12,
                padding: 0,
                cursor: selected ? 'default' : 'pointer',
                opacity: isDimmed ? 0.35 : 1,
                transition: 'all 0.2s',
                textAlign: 'left',
                overflow: 'hidden',
                boxShadow: isSel ? `0 0 0 3px ${T.accentBg}` : '0 2px 12px rgba(0,0,0,0.25)',
              }}
              aria-label={`Option ${s.id}: ${s.label || s.note || textColor}`}
            >
              {/* Card header strip */}
              <div style={{ background: `${textColor}18`, borderBottom: `1px solid ${textColor}22`, padding: '7px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: textColor, letterSpacing: '0.06em', fontFamily: T.mono }}>OPTION {s.id}</span>
                <span style={{ fontSize: 9, color: textColor, fontFamily: T.mono, opacity: 0.7 }}>{s.note ? `${s.note} ratio` : (s.label || '')}</span>
              </div>

              {/* Card body — real Launchly UI in context */}
              <div style={{ padding: '12px 12px 14px', fontFamily: 'system-ui' }}>
                {/* Page heading */}
                <div style={{ fontSize: 14, fontWeight: 700, color: textColor, marginBottom: 4, lineHeight: 1.3 }}>{s.label || 'Dashboard Overview'}</div>
                {/* Sub-label */}
                <div style={{ fontSize: 9, fontWeight: 600, color: textColor, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 8 }}>Monthly Overview</div>
                {/* Body copy */}
                <p style={{ fontSize: 11, color: textColor, marginBottom: 12, lineHeight: 1.5, opacity: 0.85 }}>
                  3 active projects · 2 pending reviews. Weekly goal 74% complete.
                </p>
                {/* CTA button (inverted) */}
                <div style={{ display: 'inline-block', background: textColor, color: bgColor, borderRadius: 6, padding: '7px 11px', fontSize: 11, fontWeight: 600, marginBottom: 12 }}>
                  Open Dashboard →
                </div>

                {/* Contrast ratio bar */}
                {!Number.isNaN(ratio) && (
                  <div style={{ borderTop: `1px solid ${textColor}22`, paddingTop: 10 }}>
                    <div style={{ height: 3, borderRadius: 2, background: `${textColor}1A`, overflow: 'hidden', marginBottom: 5 }}>
                      <div style={{ height: '100%', width: `${Math.min((ratio / 21) * 100, 100)}%`, background: passes ? '#059669' : '#DC2626', borderRadius: 2 }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 8, color: textColor, opacity: 0.55, fontFamily: 'system-ui' }}>4.5:1 minimum (AA)</span>
                      <span style={{
                        fontSize: 8, fontWeight: 700,
                        padding: '2px 6px', borderRadius: 3,
                        background: passes ? 'rgba(5,150,105,0.15)' : 'rgba(220,38,38,0.12)',
                        color: passes ? '#059669' : '#DC2626',
                        border: `1px solid ${passes ? 'rgba(5,150,105,0.3)' : 'rgba(220,38,38,0.25)'}`,
                      }}>
                        {passes ? '✓ PASSES AA' : '✗ FAILS AA'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {selected && (
        <div style={{ marginTop: 10, padding: '10px 14px', background: T.accentBg, borderRadius: 8, fontSize: 12, color: T.accent, fontFamily: T.mono }}>
          Option {selected} selected — getting feedback…
        </div>
      )}
    </div>
  );
}

// ─── 4. ReorderTask ───────────────────────────────────────────────────────────
function getReorderConfig(task) {
  const legacyItems = ['Low stock alert', 'Weekly digest', 'New comment', 'System update'];
  const legacyCorrect = ['Low stock alert', 'New comment', 'System update', 'Weekly digest'];

  if (task.items?.length) {
    const labels = task.items.map(i => i.label);
    const correct = task.correctOrder
      ? task.correctOrder.map(id => task.items.find(i => i.id === id)?.label).filter(Boolean)
      : labels;
    return { initial: [...labels], correct };
  }

  return { initial: [...legacyItems], correct: legacyCorrect };
}

function scoreReorderResult(current, correct) {
  const matches = current.filter((item, i) => item === correct[i]).length;
  const ratio = matches / correct.length;
  if (ratio >= 0.75) return 'A';
  if (ratio >= 0.4) return 'B';
  return 'C';
}

function ReorderTask({ task, onComplete }) {
  const { initial, correct } = getReorderConfig(task);
  const [items, setItems]       = useState(initial);
  const [dragging, setDragging] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const onDragStart = (i) => setDragging(i);
  const onDragOver  = (e, i) => {
    e.preventDefault();
    if (dragging === null || dragging === i) return;
    const next = [...items];
    const [moved] = next.splice(dragging, 1);
    next.splice(i, 0, moved);
    setItems(next);
    setDragging(i);
  };
  const onDragEnd = () => setDragging(null);

  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
    const id = scoreReorderResult(items, correct);
    setTimeout(() => onComplete(id), 600);
  };

  return (
    <div className="uitask__body">
      <p className="uitask__instruction">{task.instruction}</p>
      <p className="uitask__sub">Drag to reorder — most important at the top.</p>
      <div className="uitask__reorder-list">
        {items.map((item, i) => (
          <div
            key={item}
            className={`uitask__reorder-item ${dragging === i ? 'dragging' : ''}`}
            draggable
            onDragStart={() => onDragStart(i)}
            onDragOver={e => onDragOver(e, i)}
            onDragEnd={onDragEnd}
          >
            <span className="reorder-handle" aria-hidden="true">⠿</span>
            <span className="reorder-pos">{i + 1}</span>
            <span className="reorder-label">{item}</span>
          </div>
        ))}
      </div>
      <SubmitBtn onClick={handleSubmit} disabled={submitted}>
        {submitted ? 'Submitting…' : 'Submit Order →'}
      </SubmitBtn>
    </div>
  );
}

// ─── 5. HeuristicAuditTask ────────────────────────────────────────────────────
// Tap the element in a light-theme mock UI that violates a Nielsen heuristic.
function HeuristicAuditTask({ task, onComplete }) {
  const [picked, setPicked]   = useState(null);
  const [fb, setFb]           = useState(null);
  const [done, setDone]       = useState(false);

  const CORRECT_ID = 'submit';

  const tap = (id, isCorrect) => {
    if (done) return;
    setPicked(id);
    if (isCorrect) {
      setFb({ type: 'correct', text: 'Correct. The "Get started" button is active even with empty required fields and only reveals errors after submission. Nielsen Heuristic #5 — Error Prevention — says to design so errors cannot occur. Fix: disable until valid, or show inline validation on blur.' });
      setDone(true);
      setTimeout(() => onComplete('A'), 2200);
    } else {
      setFb({ type: 'wrong', text: 'Not this one. Think about what happens the moment a user clicks the primary action button without filling in any fields — which element is responsible for not preventing that mistake?' });
      setTimeout(() => { setPicked(null); setFb(null); }, 1800);
    }
  };

  const elStyle = (id, isCorrect) => ({
    cursor: done ? 'default' : 'pointer',
    outline: picked === id && !done && !isCorrect ? `2px solid ${LT.red}` : 'none',
    outlineOffset: 2,
    borderRadius: 6,
    transition: 'outline 0.1s',
  });

  return (
    <div className="uitask__body">
      <p className="uitask__instruction">{task.instruction || 'Tap the element that violates Nielsen\'s Error Prevention heuristic.'}</p>

      {/* Light-theme mock UI */}
      <div style={{ background: LT.bg, borderRadius: 14, padding: '24px 22px', marginBottom: 4, boxShadow: '0 8px 40px rgba(0,0,0,0.55)' }}>
        {/* Heading */}
        <div
          onClick={() => tap('heading', false)}
          style={{ fontSize: 22, fontWeight: 700, color: LT.text, fontFamily: 'system-ui, sans-serif', marginBottom: 22, ...elStyle('heading', false) }}
        >
          Create Account
        </div>

        {/* Name field */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: LT.textSec, fontFamily: 'system-ui', display: 'block', marginBottom: 5 }}>Full name</label>
          <div
            onClick={() => tap('name', false)}
            style={{ border: `1.5px solid ${picked === 'name' ? LT.red : LT.border}`, borderRadius: 8, padding: '10px 12px', fontSize: 14, color: LT.textMuted, fontFamily: 'system-ui', background: LT.surface, transition: 'border-color 0.1s', ...elStyle('name', false) }}
          >
            Full name
          </div>
        </div>

        {/* Email field */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: LT.textSec, fontFamily: 'system-ui', display: 'block', marginBottom: 5 }}>Email address</label>
          <div
            onClick={() => tap('email', false)}
            style={{ border: `1.5px solid ${picked === 'email' ? LT.red : LT.border}`, borderRadius: 8, padding: '10px 12px', fontSize: 14, color: LT.textMuted, fontFamily: 'system-ui', background: LT.surface, transition: 'border-color 0.1s', ...elStyle('email', false) }}
          >
            Email address
          </div>
        </div>

        {/* Submit button — the broken element */}
        <div
          onClick={() => tap(CORRECT_ID, true)}
          style={{
            background: done ? LT.green : LT.accent,
            borderRadius: 9, padding: '12px 16px', textAlign: 'center',
            color: '#fff', fontSize: 15, fontWeight: 600, fontFamily: 'system-ui',
            cursor: done ? 'default' : 'pointer',
            boxShadow: done ? `0 0 0 3px rgba(5,150,105,0.4)` : 'none',
            transition: 'all 0.2s',
          }}
        >
          {done ? '✓ Error Prevention violation identified' : 'Get started →'}
        </div>

        {/* Sign-in link */}
        <div style={{ textAlign: 'center', marginTop: 14 }}>
          <span
            onClick={() => tap('signin', false)}
            style={{ fontSize: 13, color: LT.textSec, fontFamily: 'system-ui', cursor: 'pointer', textDecoration: 'underline', borderRadius: 3, ...elStyle('signin', false) }}
          >
            Already have an account? Sign in
          </span>
        </div>
      </div>

      {fb && <FeedbackBox text={fb.text} type={fb.type} />}
    </div>
  );
}

// ─── 6. TypeScaleTask ─────────────────────────────────────────────────────────
// Tap a text sample, then tap the typographic role it belongs to.
function TypeScaleTask({ task, onComplete }) {
  const samples = [
    { id: 's1', text: 'Dashboard',                           sz: 28, wt: 700, ls: 'normal', role: 'H1'    },
    { id: 's2', text: 'Monthly Overview',                    sz: 19, wt: 600, ls: 'normal', role: 'H2'    },
    { id: 's3', text: 'Showing data for the last 30 days.',  sz: 14, wt: 400, ls: 'normal', role: 'Body'  },
    { id: 's4', text: 'ACTIVE USERS',                        sz: 11, wt: 600, ls: '0.1em',  role: 'Label' },
  ];
  const roles = ['H1', 'H2', 'Body', 'Label'];

  const [selSample, setSelSample]   = useState(null);  // currently-selected sample id
  const [sToRole, setSToRole]       = useState({});    // sampleId → role
  const [roleToS, setRoleToS]       = useState({});    // role → sampleId
  const [submitted, setSubmitted]   = useState(false);
  const [correct, setCorrect]       = useState(null);

  const tapSample = (id) => {
    if (submitted) return;
    setSelSample(prev => prev === id ? null : id);
  };

  const tapRole = (role) => {
    if (!selSample || submitted) return;
    const prevRole = sToRole[selSample];
    const prevSamp = roleToS[role];
    const ns = { ...sToRole };
    const nr = { ...roleToS };
    if (prevRole) delete nr[prevRole];
    if (prevSamp) delete ns[prevSamp];
    ns[selSample] = role;
    nr[role] = selSample;
    setSToRole(ns);
    setRoleToS(nr);
    setSelSample(null);
  };

  const allDone = Object.keys(roleToS).length === 4;

  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
    let n = 0;
    samples.forEach(s => { if (sToRole[s.id] === s.role) n++; });
    setCorrect(n);
    setTimeout(() => onComplete(n === 4 ? 'A' : n >= 2 ? 'B' : 'C'), 2200);
  };

  const sampleBg = (s) => {
    if (submitted) {
      return sToRole[s.id] === s.role ? T.greenBg : sToRole[s.id] ? T.redBg : T.borderSoft;
    }
    if (selSample === s.id) return T.accentBg;
    if (sToRole[s.id]) return T.purpleBg;
    return T.borderSoft;
  };
  const sampleBorder = (s) => {
    if (submitted) {
      return sToRole[s.id] === s.role ? T.greenBorder : sToRole[s.id] ? T.redBorder : T.border;
    }
    if (selSample === s.id) return T.accentBorder;
    if (sToRole[s.id]) return T.purpleBorder;
    return T.border;
  };
  const sampleColor = (s) => {
    if (submitted) return sToRole[s.id] === s.role ? T.green : sToRole[s.id] ? T.red : T.textSec;
    if (selSample === s.id) return T.accent;
    return T.text;
  };

  return (
    <div className="uitask__body">
      <p className="uitask__instruction">{task.instruction || 'Tap a text sample, then tap the role it belongs to.'}</p>

      {/* Text samples */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        {samples.map(s => (
          <div
            key={s.id}
            onClick={() => tapSample(s.id)}
            style={{
              background: sampleBg(s), border: `1.5px solid ${sampleBorder(s)}`,
              borderRadius: 10, padding: '12px 16px',
              cursor: submitted ? 'default' : 'pointer', transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
            }}
          >
            <span style={{ fontSize: s.sz, fontWeight: s.wt, letterSpacing: s.ls, color: sampleColor(s), fontFamily: T.body, lineHeight: 1.2 }}>
              {s.text}
            </span>
            {sToRole[s.id] && !submitted && (
              <span style={{ fontSize: 10, fontFamily: T.mono, color: T.purple, background: T.purpleBg, border: `1px solid ${T.purpleBorder}`, padding: '2px 8px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                → {sToRole[s.id]}
              </span>
            )}
            {submitted && sToRole[s.id] && (
              <span style={{ fontSize: 10, fontFamily: T.mono, color: sToRole[s.id] === s.role ? T.green : T.red, whiteSpace: 'nowrap' }}>
                {sToRole[s.id] === s.role ? `✓ ${s.role}` : `✗ was ${sToRole[s.id]} · should be ${s.role}`}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Role slots */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 4 }}>
        {roles.map(role => {
          const assignedId = roleToS[role];
          const assignedSample = samples.find(s => s.id === assignedId);
          const canAssign = !submitted && !!selSample;
          return (
            <div
              key={role}
              onClick={() => tapRole(role)}
              style={{
                border: `1.5px ${assignedId ? 'solid' : 'dashed'} ${canAssign ? T.accentBorder : assignedId ? T.purpleBorder : T.border}`,
                borderRadius: 10, padding: '10px 14px', cursor: canAssign ? 'pointer' : 'default',
                background: canAssign ? T.accentBg : assignedId ? T.purpleBg : 'transparent',
                transition: 'all 0.15s', minHeight: 54, display: 'flex', flexDirection: 'column', justifyContent: 'center',
              }}
            >
              <div style={{ fontSize: 10, fontFamily: T.mono, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                {role}
              </div>
              {assignedSample ? (
                <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.3 }}>
                  {assignedSample.text.length > 24 ? assignedSample.text.slice(0, 24) + '…' : assignedSample.text}
                </div>
              ) : (
                <div style={{ fontSize: 12, color: T.textMuted, fontStyle: 'italic' }}>
                  {canAssign ? 'Tap to assign →' : 'empty'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <SubmitBtn onClick={handleSubmit} disabled={!allDone || submitted}>
        {submitted ? 'Checking…' : 'Check assignments →'}
      </SubmitBtn>

      {correct !== null && (
        <FeedbackBox
          type={correct === 4 ? 'correct' : 'wrong'}
          text={correct === 4
            ? 'All correct. Key insight: type roles aren\'t just about size — Label is defined by its uppercase tracking + small size combination, not small size alone. Good hierarchy requires contrast between adjacent levels, not just individual sizes.'
            : `${correct}/4 correct. Compare the samples side by side: H1 and H2 are separated by size, but Label vs Body differs in case, tracking, and weight — not just size. Review where the visual contrast between levels breaks down.`}
        />
      )}
    </div>
  );
}

// ─── 7. IASortTask ────────────────────────────────────────────────────────────
// Tap item from pool, then tap a bucket to place it.
function IASortTask({ task, onComplete }) {
  const allItems = [
    { id: 'billing',  text: 'Billing',           bucket: 'account'   },
    { id: 'profile',  text: 'Profile settings',  bucket: 'account'   },
    { id: 'activity', text: 'Activity log',       bucket: 'workspace' },
    { id: 'team',     text: 'Team members',       bucket: 'workspace' },
    { id: 'api',      text: 'API keys',           bucket: 'developer' },
    { id: 'notifs',   text: 'Notifications',      bucket: 'account'   },
  ];
  const buckets = [
    { id: 'account',   label: 'Account',   desc: 'User-specific' },
    { id: 'workspace', label: 'Workspace', desc: 'Team-wide'     },
    { id: 'developer', label: 'Developer', desc: 'Technical'     },
  ];

  const [selItem, setSelItem]     = useState(null);
  const [placed, setPlaced]       = useState({});  // itemId → bucketId
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore]         = useState(null);

  const pool = allItems.filter(i => !placed[i.id]);
  const isAllPlaced = pool.length === 0;

  const tapItem = (id) => {
    if (submitted) return;
    setSelItem(prev => prev === id ? null : id);
  };

  const tapBucket = (bucketId) => {
    if (!selItem || submitted) return;
    setPlaced(prev => ({ ...prev, [selItem]: bucketId }));
    setSelItem(null);
  };

  const removeItem = (itemId) => {
    if (submitted) return;
    setPlaced(prev => { const n = { ...prev }; delete n[itemId]; return n; });
  };

  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
    const n = allItems.filter(i => placed[i.id] === i.bucket).length;
    setScore(n);
    setTimeout(() => onComplete(n >= 5 ? 'A' : n >= 3 ? 'B' : 'C'), 2200);
  };

  return (
    <div className="uitask__body">
      <p className="uitask__instruction">{task.instruction || 'Tap a nav item, then tap the category it belongs to.'}</p>

      {/* Pool */}
      {pool.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {pool.map(item => (
            <div
              key={item.id}
              onClick={() => tapItem(item.id)}
              style={{
                padding: '8px 14px', borderRadius: 8, fontSize: 13,
                background: selItem === item.id ? T.accentBg : T.card,
                border: `1.5px solid ${selItem === item.id ? T.accentBorder : T.border}`,
                cursor: 'pointer', transition: 'all 0.15s', color: selItem === item.id ? T.accent : T.text,
                fontFamily: T.body,
              }}
            >
              {item.text}
            </div>
          ))}
        </div>
      )}

      {/* Hint */}
      {selItem && !submitted && (
        <p style={{ fontSize: 12, color: T.accent, marginBottom: 12, fontFamily: T.body }}>
          "{allItems.find(i => i.id === selItem)?.text}" selected — now tap a bucket ↓
        </p>
      )}

      {/* Buckets */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 4 }}>
        {buckets.map(b => {
          const bucketItems = allItems.filter(i => placed[i.id] === b.id);
          const canReceive  = !submitted && !!selItem;
          return (
            <div
              key={b.id}
              onClick={() => tapBucket(b.id)}
              style={{
                border: `1.5px ${canReceive ? 'solid' : 'dashed'} ${canReceive ? T.accentBorder : T.border}`,
                borderRadius: 12, padding: '12px 14px',
                background: canReceive ? T.accentBg : 'transparent',
                cursor: canReceive ? 'pointer' : 'default', transition: 'all 0.15s',
                minHeight: 56,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: bucketItems.length > 0 ? 10 : 0 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text, fontFamily: T.body }}>{b.label}</span>
                <span style={{ fontSize: 11, color: T.textMuted, fontFamily: T.body }}>{b.desc}</span>
              </div>
              {bucketItems.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {bucketItems.map(item => {
                    const isCorrect = submitted && item.bucket === b.id;
                    const isWrong   = submitted && item.bucket !== b.id;
                    return (
                      <div
                        key={item.id}
                        onClick={e => { e.stopPropagation(); removeItem(item.id); }}
                        style={{
                          padding: '5px 11px', borderRadius: 6, fontSize: 12,
                          background: isCorrect ? T.greenBg : isWrong ? T.redBg : T.purpleBg,
                          border: `1px solid ${isCorrect ? T.greenBorder : isWrong ? T.redBorder : T.purpleBorder}`,
                          color: isCorrect ? T.green : isWrong ? T.red : T.purple,
                          cursor: submitted ? 'default' : 'pointer', fontFamily: T.body,
                        }}
                      >
                        {item.text}{!submitted ? ' ×' : ''}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <SubmitBtn onClick={handleSubmit} disabled={!isAllPlaced || submitted}>
        {submitted ? 'Checking…' : 'Check groupings →'}
      </SubmitBtn>

      {score !== null && (
        <FeedbackBox
          type={score >= 5 ? 'correct' : 'wrong'}
          text={score >= 5
            ? 'Well sorted. The core logic: Account = what\'s mine (profile, billing, notifications). Workspace = what we share (team, activity). Developer = how we integrate (API keys). IA groupings map to mental models — who controls it, who sees it, and how often it\'s accessed.'
            : `${score}/6 correct. The tricky ones: Notifications live in Account (they\'re about the user, not the team), and Activity log belongs in Workspace (the whole team has read access). IA groupings should reflect usage pattern and ownership — not just topic proximity.`}
        />
      )}
    </div>
  );
}

// ─── 8. CopyFixTask ───────────────────────────────────────────────────────────
// Three versions of UI copy — pick the best one.
function CopyFixTask({ task, onComplete }) {
  const opts = task.copyOptions || [
    {
      id: 'A',
      context: 'Option A — system language',
      text: 'Error 403: Authentication failure. Credentials do not match records.',
      correct: false,
      fb: 'Option A is written for the server, not the user. "403" and "credentials do not match records" are system-level language. Users need to know what went wrong in plain terms and what to do next.',
    },
    {
      id: 'B',
      context: 'Option B — vague',
      text: 'Something went wrong. Please try again.',
      correct: false,
      fb: 'Option B gives zero information about the actual problem. "Something went wrong" could mean anything — wrong password, expired account, server error. Users can\'t diagnose or fix a problem they can\'t name.',
    },
    {
      id: 'C',
      context: 'Option C — specific and human',
      text: "That password isn't right. Try again, or reset your password if you've forgotten it.",
      correct: true,
      fb: 'Correct. Option C names the problem specifically ("password"), addresses the user as a person, and gives a clear path forward (reset link). Nielsen Heuristic #9: Help users recognise, diagnose, and recover from errors.',
    },
  ];

  const [picked, setPicked] = useState(null);
  const [done, setDone]     = useState(false);

  const pick = (opt) => {
    if (done) return;
    setPicked(opt.id);
    if (opt.correct) {
      setDone(true);
      setTimeout(() => onComplete('A'), 2200);
    } else {
      // Map wrong picks: A (system language) → B, B (vague, worst) → C
      const outcomeMap = { A: 'B', B: 'C' };
      setTimeout(() => { if (!done) { setDone(true); onComplete(outcomeMap[opt.id] || 'C'); } }, 2200);
    }
  };

  return (
    <div className="uitask__body">
      <p className="uitask__instruction">{task.instruction || 'A user entered the wrong password. Pick the error message that best follows microcopy principles.'}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 4 }}>
        {opts.map(opt => {
          const isSelected = picked === opt.id;
          const showResult = done && isSelected;
          return (
            <div
              key={opt.id}
              onClick={() => pick(opt)}
              style={{
                border: `1.5px solid ${showResult ? (opt.correct ? T.greenBorder : T.redBorder) : isSelected ? T.accentBorder : T.border}`,
                borderRadius: 12, padding: '14px 16px',
                background: showResult ? (opt.correct ? T.greenBg : T.redBg) : isSelected ? T.accentBg : T.card,
                cursor: done ? 'default' : 'pointer', transition: 'all 0.15s',
              }}
            >
              <div style={{ fontSize: 10, fontFamily: T.mono, color: T.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 7 }}>
                {opt.context}
              </div>
              <div style={{ fontSize: 14, color: showResult ? (opt.correct ? T.green : T.red) : T.text, lineHeight: 1.55, fontFamily: T.body }}>
                {opt.text}
              </div>
              {done && isSelected && (
                <div style={{ fontSize: 12, color: opt.correct ? T.green : T.red, marginTop: 10, lineHeight: 1.55, borderTop: `1px solid ${opt.correct ? T.greenBorder : T.redBorder}`, paddingTop: 10 }}>
                  {opt.fb}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── 9. IconMatchTask ─────────────────────────────────────────────────────────
// Tap an icon, then tap the label it represents.
function IconMatchTask({ task, onComplete }) {
  const icons = [
    { id: 'bookmark', sym: '🔖', correct: 'save'  },
    { id: 'heart',    sym: '♡',  correct: 'like'  },
    { id: 'bell',     sym: '🔔', correct: 'alert' },
    { id: 'share',    sym: '⬆',  correct: 'share' },
  ];
  const labels = [
    { id: 'save',  text: 'Save for later' },
    { id: 'like',  text: 'Like / favourite' },
    { id: 'alert', text: 'Alerts' },
    { id: 'share', text: 'Share / export' },
  ];

  const [selIcon, setSelIcon]   = useState(null);
  const [matched, setMatched]   = useState({});    // iconId → labelId
  const [wrongFlash, setWrong]  = useState(null);  // iconId that is flashing wrong
  const [done, setDone]         = useState(false);

  const tapIcon = (id) => {
    if (matched[id] || done) return;
    setSelIcon(prev => prev === id ? null : id);
  };

  const tapLabel = (labelId) => {
    if (!selIcon || done) return;
    const icon = icons.find(i => i.id === selIcon);
    if (icon.correct === labelId) {
      const next = { ...matched, [selIcon]: labelId };
      setMatched(next);
      setSelIcon(null);
      if (Object.keys(next).length === icons.length) {
        setDone(true);
        setTimeout(() => onComplete('A'), 2000);
      }
    } else {
      setWrong(selIcon);
      setTimeout(() => { setWrong(null); setSelIcon(null); }, 900);
    }
  };

  const usedLabels = new Set(Object.values(matched));

  return (
    <div className="uitask__body">
      <p className="uitask__instruction">{task.instruction || 'Tap an icon, then tap the label it represents.'}</p>

      {/* Icons row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
        {icons.map(ic => {
          const isMatched = !!matched[ic.id];
          const isSel     = selIcon === ic.id;
          const isWrong   = wrongFlash === ic.id;
          return (
            <div
              key={ic.id}
              onClick={() => tapIcon(ic.id)}
              style={{
                textAlign: 'center', borderRadius: 12, padding: '14px 8px',
                border: `1.5px solid ${isMatched ? T.greenBorder : isWrong ? T.redBorder : isSel ? T.accentBorder : T.border}`,
                background: isMatched ? T.greenBg : isWrong ? T.redBg : isSel ? T.accentBg : T.card,
                cursor: isMatched || done ? 'default' : 'pointer', transition: 'all 0.15s',
                outline: isSel ? `2px solid ${T.accent}` : 'none', outlineOffset: 2,
              }}
            >
              <div style={{ fontSize: 26, marginBottom: 8, lineHeight: 1 }}>{ic.sym}</div>
              <div style={{ fontSize: 11, color: isMatched ? T.green : T.textMuted, fontFamily: T.body, lineHeight: 1.3 }}>
                {isMatched ? labels.find(l => l.id === matched[ic.id])?.text : '—'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Labels pool */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 4 }}>
        {labels.map(lbl => {
          const isUsed = usedLabels.has(lbl.id);
          const canPick = !isUsed && !!selIcon && !done;
          return (
            <div
              key={lbl.id}
              onClick={() => tapLabel(lbl.id)}
              style={{
                padding: '8px 16px', borderRadius: 24, fontSize: 13,
                border: `1.5px solid ${isUsed ? T.greenBorder : canPick ? T.accentBorder : T.border}`,
                background: isUsed ? T.greenBg : canPick ? T.accentBg : T.card,
                color: isUsed ? T.green : canPick ? T.accent : T.textSec,
                cursor: canPick ? 'pointer' : 'default', transition: 'all 0.15s',
                opacity: isUsed ? 0.5 : 1, fontFamily: T.body,
              }}
            >
              {lbl.text}
            </div>
          );
        })}
      </div>

      {done && (
        <FeedbackBox
          type="correct"
          text="All matched. The tricky one: ⬆ means Share/Export on iOS — but some platforms use the same icon for Upload. Icons are only as clear as the convention your specific users have already learnt from other apps. Jakob's Law: users spend most of their time on other products, not yours."
        />
      )}
      {wrongFlash && (
        <FeedbackBox
          type="wrong"
          text="Not quite. Think about the primary, most familiar action users associate with this icon in the apps they use most — Jakob's Law says users expect icons to work the way they've learnt them elsewhere."
        />
      )}
    </div>
  );
}

// ─── 10. ColorRolesTask ───────────────────────────────────────────────────────
// Tap a swatch, then tap the semantic role slot.
function ColorRolesTask({ task, onComplete }) {
  const swatches = [
    { id: 'green',  hex: '#1D9E75', role: 'success' },
    { id: 'red',    hex: '#E24B4A', role: 'error'   },
    { id: 'purple', hex: '#7F77DD', role: 'primary' },
    { id: 'amber',  hex: '#EF9F27', role: 'warning' },
    { id: 'gray',   hex: '#888780', role: 'neutral' },
  ];
  const slots = [
    { id: 'primary', name: 'Primary CTA',  desc: 'Brand action'         },
    { id: 'error',   name: 'Error',        desc: 'Destructive / fail'    },
    { id: 'success', name: 'Success',      desc: 'Confirm / complete'    },
    { id: 'warning', name: 'Warning',      desc: 'Caution / review'      },
    { id: 'neutral', name: 'Neutral',      desc: 'Disabled / inactive'   },
  ];

  const [selSwatch, setSelSwatch] = useState(null);
  const [slotToSw, setSlotToSw]   = useState({});  // slotId → swatchId
  const [swToSlot, setSwToSlot]   = useState({});  // swatchId → slotId
  const [checked, setChecked]     = useState(false);
  const [numCorrect, setNC]       = useState(null);

  const tapSwatch = (id) => {
    if (checked) return;
    setSelSwatch(prev => prev === id ? null : id);
  };

  const tapSlot = (slotId) => {
    if (!selSwatch || checked) return;
    const prevSlot = swToSlot[selSwatch];
    const prevSw   = slotToSw[slotId];
    const ns = { ...slotToSw };
    const nw = { ...swToSlot };
    if (prevSlot) delete ns[prevSlot];
    if (prevSw)   delete nw[prevSw];
    ns[slotId]   = selSwatch;
    nw[selSwatch] = slotId;
    setSlotToSw(ns);
    setSwToSlot(nw);
    setSelSwatch(null);
  };

  const handleCheck = () => {
    if (checked) return;
    setChecked(true);
    let n = 0;
    swatches.forEach(sw => { if (swToSlot[sw.id] === sw.role) n++; });
    setNC(n);
    setTimeout(() => onComplete(n === 5 ? 'A' : n >= 3 ? 'B' : 'C'), 2200);
  };

  const assignedSwatches = new Set(Object.values(slotToSw));
  const allAssigned = assignedSwatches.size === 5;

  return (
    <div className="uitask__body">
      <p className="uitask__instruction">{task.instruction || 'Tap a colour, then tap the semantic role it should fill.'}</p>

      {/* Swatches */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        {swatches.map(sw => {
          const isAssigned = !!swToSlot[sw.id];
          const isSel = selSwatch === sw.id;
          let outlineColor = 'transparent';
          if (isSel) outlineColor = sw.hex;
          if (checked && swToSlot[sw.id] === sw.role) outlineColor = T.green;
          if (checked && swToSlot[sw.id] && swToSlot[sw.id] !== sw.role) outlineColor = T.red;
          return (
            <div
              key={sw.id}
              onClick={() => tapSwatch(sw.id)}
              style={{
                width: 48, height: 48, borderRadius: 10, background: sw.hex,
                cursor: isAssigned || checked ? 'default' : 'pointer',
                border: `2.5px solid ${isSel ? sw.hex : 'transparent'}`,
                outline: `3px solid ${outlineColor}`, outlineOffset: 3,
                opacity: isAssigned && !isSel ? 0.5 : 1,
                transition: 'all 0.15s',
              }}
            />
          );
        })}
      </div>

      {/* Role slots */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 4 }}>
        {slots.map(slot => {
          const swId  = slotToSw[slot.id];
          const sw    = swatches.find(s => s.id === swId);
          const canFill = !checked && !!selSwatch;
          const isRight = checked && sw && sw.role === slot.id;
          const isWrong = checked && sw && sw.role !== slot.id;
          return (
            <div
              key={slot.id}
              onClick={() => tapSlot(slot.id)}
              style={{
                border: `1.5px ${sw ? 'solid' : 'dashed'} ${isRight ? T.greenBorder : isWrong ? T.redBorder : canFill ? T.accentBorder : T.border}`,
                borderRadius: 10, padding: '10px 12px', cursor: canFill ? 'pointer' : 'default',
                background: isRight ? T.greenBg : isWrong ? T.redBg : canFill ? T.accentBg : 'transparent',
                transition: 'all 0.15s', minHeight: 54, display: 'flex', alignItems: 'center', gap: 10,
              }}
            >
              {sw && (
                <div style={{ width: 26, height: 26, borderRadius: 6, background: sw.hex, flexShrink: 0 }} />
              )}
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: isRight ? T.green : isWrong ? T.red : T.text, fontFamily: T.body }}>{slot.name}</div>
                <div style={{ fontSize: 11, color: T.textMuted, fontFamily: T.body }}>{slot.desc}</div>
              </div>
            </div>
          );
        })}
      </div>

      <SubmitBtn onClick={handleCheck} disabled={!allAssigned || checked}>
        {checked ? 'Checking…' : 'Check my colour map →'}
      </SubmitBtn>

      {numCorrect !== null && (
        <FeedbackBox
          type={numCorrect === 5 ? 'correct' : 'wrong'}
          text={numCorrect === 5
            ? 'Perfect. Red = error (universal — stop signs, alerts). Green = success (traffic lights, confirmation). Amber = warning (caution, review). Gray = neutral/disabled. Your brand colour (purple) = primary CTA. These aren\'t aesthetic choices — they\'re learnt associations users bring from every product they\'ve used.'
            : `${numCorrect}/5 correct. Think about pre-existing colour associations: traffic lights (red/amber/green), stop signs (red), and the way every major product already uses these colours semantically. Convention exists because users arrive with pre-learnt meanings. Breaking it has a real cognitive cost per user per session.`}
        />
      )}
    </div>
  );
}

// ─── 11. DarkPatternTask ──────────────────────────────────────────────────────
// Identify the dark pattern element in a mock cancellation modal.
function DarkPatternTask({ task, onComplete }) {
  const answers = task.darkPatternOptions || [
    {
      id: 'A',
      text: 'The countdown timer — creates false urgency for an offer that is never actually time-limited.',
      outcome: 'A',
      fb: 'Correct. A perpetual countdown that resets is a false scarcity dark pattern. It manipulates users through urgency that doesn\'t exist. The FTC has begun fining companies specifically for fabricated scarcity and urgency claims.',
    },
    {
      id: 'B',
      text: 'The cancel button copy — "I want to lose my data and cancel" is confirmshaming.',
      outcome: 'A',
      fb: 'Correct — and arguably the more insidious pattern. Confirmshaming reframes a legitimate user choice as self-harm to induce guilt. Unlike fake urgency, it targets the user\'s identity and self-perception. Both A and B are valid answers here.',
    },
    {
      id: 'C',
      text: 'The 3-month free offer — a retention tactic designed to keep users from leaving.',
      outcome: 'C',
      fb: 'Not a dark pattern. Retention offers are legitimate — they provide genuine value (3 months free) and don\'t deceive. The dark patterns are the fake timer and the guilt-laden cancel button copy. Ethical retention = genuine value offer + clear cancel path.',
    },
  ];

  const [picked, setPicked] = useState(null);
  const [done, setDone]     = useState(false);

  const pick = (ans) => {
    if (done) return;
    setPicked(ans.id);
    setDone(true);
    setTimeout(() => onComplete(ans.outcome), 2400);
  };

  return (
    <div className="uitask__body">
      <p className="uitask__instruction">{task.instruction || 'Read this cancellation modal carefully. Which element is the dark pattern?'}</p>

      {/* Light-theme mock modal */}
      <div style={{ background: LT.bg, borderRadius: 14, padding: '20px 20px 22px', marginBottom: 16, boxShadow: '0 8px 40px rgba(0,0,0,0.55)', maxWidth: 360, margin: '0 auto 16px' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: LT.text, fontFamily: 'system-ui', marginBottom: 10 }}>Before you go…</div>
        <div style={{ fontSize: 13, color: LT.textSec, fontFamily: 'system-ui', lineHeight: 1.6, marginBottom: 14 }}>
          We'd hate to lose you. Your account will be permanently deleted and you'll lose access to 3 years of project history.
          <br /><br />
          As a loyal member you qualify for <strong>3 months free</strong>. This offer expires in{' '}
          <strong style={{ color: LT.red }}>00:04:59</strong>.
        </div>
        <div style={{ background: LT.accent, color: '#fff', borderRadius: 8, padding: '10px 14px', textAlign: 'center', fontSize: 14, fontWeight: 600, fontFamily: 'system-ui', marginBottom: 10 }}>
          Keep my account + claim free months
        </div>
        <div style={{ textAlign: 'center', fontSize: 12, color: LT.textMuted, fontFamily: 'system-ui' }}>
          No thanks, I want to lose my data and cancel
        </div>
      </div>

      {/* Answer options */}
      <p style={{ fontSize: 12, color: T.textSec, marginBottom: 10, fontFamily: T.body }}>Which element is the dark pattern?</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {answers.map(ans => {
          const isSel     = picked === ans.id;
          const isCorrect = done && isSel && ans.outcome !== 'C';
          const isWrong   = done && isSel && ans.outcome === 'C';
          return (
            <div
              key={ans.id}
              onClick={() => pick(ans)}
              style={{
                border: `1.5px solid ${isCorrect ? T.greenBorder : isWrong ? T.redBorder : isSel ? T.accentBorder : T.border}`,
                borderRadius: 10, padding: '12px 14px',
                background: isCorrect ? T.greenBg : isWrong ? T.redBg : isSel ? T.accentBg : T.card,
                cursor: done ? 'default' : 'pointer', transition: 'all 0.15s',
              }}
            >
              <div style={{ fontSize: 13, color: isCorrect ? T.green : isWrong ? T.red : T.text, lineHeight: 1.5, fontFamily: T.body }}>
                {ans.text}
              </div>
              {done && isSel && (
                <div style={{ fontSize: 12, color: isCorrect ? '#6EE7B7' : '#FCA5A5', marginTop: 10, lineHeight: 1.55, borderTop: `1px solid ${isCorrect ? T.greenBorder : T.redBorder}`, paddingTop: 10 }}>
                  {ans.fb}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── 12. SpacingPickTask ──────────────────────────────────────────────────────
// Pick the correct 8pt-grid gap value for a form. Preview updates live.
function SpacingPickTask({ task, onComplete }) {
  const opts = [
    { px: 4,  id: 'C', note: 'too tight'  },
    { px: 8,  id: 'C', note: 'still tight' },
    { px: 16, id: 'A', note: '✓ correct'  },
    { px: 24, id: 'B', note: 'loose'       },
    { px: 32, id: 'B', note: 'too loose'  },
  ];

  const [preview, setPreview]   = useState(4);   // live preview gap
  const [picked, setPicked]     = useState(null);
  const [done, setDone]         = useState(false);

  const pick = (opt) => {
    if (done) return;
    setPreview(opt.px);
    setPicked(opt.px);
    const isCorrect = opt.id === 'A';
    setTimeout(() => {
      setDone(true);
      onComplete(opt.id);
    }, isCorrect ? 1200 : 1800);
  };

  const fields = ['First name', 'Email address', 'Password'];

  return (
    <div className="uitask__body">
      <p className="uitask__instruction">{task.instruction || 'The form fields below are spaced incorrectly. Pick the 8pt-grid gap that fixes it.'}</p>

      {/* Live preview */}
      <div style={{ background: LT.bg, borderRadius: 14, padding: '20px 20px 22px', marginBottom: 16, boxShadow: '0 8px 40px rgba(0,0,0,0.55)' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: LT.textMuted, fontFamily: 'system-ui', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
          Sign up
        </div>
        {fields.map((label, i) => (
          <div key={label} style={{ marginBottom: i < fields.length - 1 ? preview : 0 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: LT.textSec, fontFamily: 'system-ui', marginBottom: 5 }}>{label}</div>
            <div style={{ border: `1.5px solid ${LT.border}`, borderRadius: 7, padding: '9px 11px', fontSize: 13, color: LT.textMuted, fontFamily: 'system-ui', background: LT.surface }}>
              {label === 'First name' ? 'Neelesh' : label === 'Email address' ? 'neelesh@example.com' : '••••••••'}
            </div>
            {i < fields.length - 1 && (
              <div style={{ height: preview, display: 'flex', alignItems: 'center', padding: '0 2px', marginTop: 0 }}>
                <div style={{ width: '100%', height: 1, background: 'rgba(79,70,229,0.2)', borderTop: '1px dashed rgba(79,70,229,0.4)', position: 'relative' }}>
                  <span style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', fontSize: 9, color: LT.accent, fontFamily: 'system-ui', fontWeight: 600, background: LT.bg, padding: '0 3px' }}>
                    {preview}px
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Options */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
        {opts.map(opt => {
          const isSel = picked === opt.px;
          const isCorrect = done && isSel && opt.id === 'A';
          const isWrong   = done && isSel && opt.id !== 'A';
          return (
            <div
              key={opt.px}
              onClick={() => { setPreview(opt.px); pick(opt); }}
              onMouseEnter={() => !done && !picked && setPreview(opt.px)}
              onMouseLeave={() => !done && !picked && setPreview(4)}
              style={{
                flex: '1 1 60px', textAlign: 'center',
                border: `1.5px solid ${isCorrect ? T.greenBorder : isWrong ? T.redBorder : isSel ? T.accentBorder : T.border}`,
                borderRadius: 10, padding: '12px 8px',
                background: isCorrect ? T.greenBg : isWrong ? T.redBg : isSel ? T.accentBg : T.card,
                cursor: done ? 'default' : 'pointer', transition: 'all 0.15s',
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 700, fontFamily: T.mono, color: isCorrect ? T.green : isWrong ? T.red : T.text }}>{opt.px}px</div>
              {isSel && done && (
                <div style={{ fontSize: 10, color: isCorrect ? T.green : T.red, marginTop: 4, fontFamily: T.body }}>{opt.note}</div>
              )}
            </div>
          );
        })}
      </div>

      {done && picked !== null && (
        <FeedbackBox
          type={picked === 16 ? 'correct' : 'wrong'}
          text={picked === 16
            ? 'Correct — 16px (2 units on the 8pt grid) is the standard field-to-field gap. It creates enough breathing room to visually separate fields without making the form feel fragmented. 4–8px makes fields blur together; 24–32px looks like separate sections.'
            : `${picked}px ${picked < 16 ? 'is too tight — the fields blur together visually' : 'is too loose — the form starts to feel like separate sections rather than one continuous form'}. 16px (2 × 8pt) is the standard field gap. The 8pt grid exists because multiples of 8 align to virtually every screen density without sub-pixel rounding.`}
        />
      )}
    </div>
  );
}

// ─── 13. A11yAuditTask ────────────────────────────────────────────────────────
// Tap every element in a form that fails accessibility. Multiple correct answers.
function A11yAuditTask({ task, onComplete }) {
  const elements = [
    {
      id: 'name',
      render: (
        <div>
          <div style={{ fontSize: 12, color: LT.textSec, fontFamily: 'system-ui', marginBottom: 4 }}>Name</div>
          <div style={{ border: `1.5px solid ${LT.border}`, borderRadius: 7, padding: '9px 11px', fontSize: 13, color: LT.textMuted, fontFamily: 'system-ui', background: LT.surface }}>Text input field</div>
        </div>
      ),
      fail: false,
      reason: null,
    },
    {
      id: 'email',
      render: (
        <div>
          <div style={{ fontSize: 11, color: '#AAA', fontFamily: 'system-ui', marginBottom: 4, fontStyle: 'italic' }}>← no label — placeholder only</div>
          <div style={{ border: `1.5px solid ${LT.border}`, borderRadius: 7, padding: '9px 11px', fontSize: 13, color: LT.textMuted, fontFamily: 'system-ui', background: LT.surface }}>Enter email…</div>
        </div>
      ),
      fail: true,
      reason: 'Missing label: placeholder-only inputs lose their context once typed into, and screen readers cannot announce what the field is for.',
    },
    {
      id: 'password',
      render: (
        <div>
          <div style={{ fontSize: 12, color: LT.textSec, fontFamily: 'system-ui', marginBottom: 4 }}>Password <span style={{ fontSize: 11, color: LT.textMuted }}>[required]</span></div>
          <div style={{ border: `1.5px solid ${LT.border}`, borderRadius: 7, padding: '9px 11px', fontSize: 13, color: LT.textMuted, fontFamily: 'system-ui', background: LT.surface }}>••••••••</div>
        </div>
      ),
      fail: false,
      reason: null,
    },
    {
      id: 'error',
      render: (
        <div>
          <div style={{ fontSize: 13, color: LT.red, fontFamily: 'system-ui' }}>✗ Password too short</div>
          <div style={{ fontSize: 11, color: '#AAA', fontFamily: 'system-ui', marginTop: 2, fontStyle: 'italic' }}>← colour only, no role="alert"</div>
        </div>
      ),
      fail: true,
      reason: 'Colour-only error with no ARIA role="alert" — screen readers won\'t announce it, and colour-blind users may miss it entirely.',
    },
    {
      id: 'btn',
      render: (
        <div style={{ background: LT.accent, color: '#fff', borderRadius: 8, padding: '10px 14px', textAlign: 'center', fontSize: 14, fontWeight: 600, fontFamily: 'system-ui' }}>
          Create account
        </div>
      ),
      fail: false,
      reason: null,
    },
  ];

  const CORRECT_FAILS = elements.filter(e => e.fail).map(e => e.id);

  const [tagged, setTagged]       = useState(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore]         = useState(null);

  const toggle = (id) => {
    if (submitted) return;
    setTagged(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
    const hits     = CORRECT_FAILS.filter(id => tagged.has(id)).length;
    const falsePos = [...tagged].filter(id => !CORRECT_FAILS.includes(id)).length;
    const n = hits - falsePos;
    setScore({ hits, total: CORRECT_FAILS.length, falsePos });
    setTimeout(() => onComplete(hits === 2 && falsePos === 0 ? 'A' : hits >= 1 ? 'B' : 'C'), 2200);
  };

  return (
    <div className="uitask__body">
      <p className="uitask__instruction">{task.instruction || 'Tap every element in this form that fails accessibility. There are 2 failures.'}</p>

      <div style={{ background: LT.bg, borderRadius: 14, padding: '18px 18px 20px', marginBottom: 4, boxShadow: '0 8px 40px rgba(0,0,0,0.55)' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: LT.text, fontFamily: 'system-ui', marginBottom: 16 }}>Create your account</div>
        {elements.map(el => {
          const isTagged  = tagged.has(el.id);
          const isCorrect = submitted && el.fail && isTagged;
          const isMissed  = submitted && el.fail && !isTagged;
          const isFalseP  = submitted && !el.fail && isTagged;
          const isOk      = submitted && !el.fail && !isTagged;
          return (
            <div
              key={el.id}
              onClick={() => toggle(el.id)}
              style={{
                marginBottom: 10, padding: '10px 12px', borderRadius: 8, cursor: submitted ? 'default' : 'pointer',
                border: `1.5px solid ${isCorrect ? LT.green : isMissed ? '#F59E0B' : isFalseP ? LT.red : isOk ? 'transparent' : isTagged ? LT.red : LT.border}`,
                background: isCorrect ? 'rgba(5,150,105,0.08)' : isMissed ? 'rgba(245,158,11,0.08)' : isFalseP ? 'rgba(220,38,38,0.06)' : 'transparent',
                transition: 'all 0.15s', position: 'relative',
              }}
            >
              {el.render}
              {/* Flag badges */}
              {!submitted && isTagged && (
                <div style={{ position: 'absolute', top: 8, right: 8, fontSize: 10, fontWeight: 700, background: 'rgba(220,38,38,0.15)', color: LT.red, border: `1px solid rgba(220,38,38,0.3)`, borderRadius: 20, padding: '2px 8px' }}>flagged</div>
              )}
              {submitted && isCorrect && (
                <div style={{ position: 'absolute', top: 8, right: 8, fontSize: 10, fontWeight: 700, background: 'rgba(5,150,105,0.15)', color: LT.green, border: `1px solid rgba(5,150,105,0.3)`, borderRadius: 20, padding: '2px 8px' }}>✓ fail</div>
              )}
              {submitted && isMissed && (
                <div style={{ position: 'absolute', top: 8, right: 8, fontSize: 10, fontWeight: 700, background: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: `1px solid rgba(245,158,11,0.3)`, borderRadius: 20, padding: '2px 8px' }}>missed</div>
              )}
              {submitted && el.fail && (
                <div style={{ fontSize: 11, color: isCorrect ? LT.green : '#F59E0B', marginTop: 8, lineHeight: 1.5, fontFamily: 'system-ui' }}>{el.reason}</div>
              )}
            </div>
          );
        })}
      </div>

      <SubmitBtn onClick={handleSubmit} disabled={tagged.size === 0 || submitted}>
        {submitted ? 'Checking audit…' : `Check my audit (${tagged.size} flagged) →`}
      </SubmitBtn>

      {score !== null && (
        <FeedbackBox
          type={score.hits === 2 && score.falsePos === 0 ? 'correct' : 'wrong'}
          text={score.hits === 2 && score.falsePos === 0
            ? 'Perfect audit. Email (placeholder-only, no label) and the error message (colour + no role="alert") are the two failures. Name has a proper label. Password has a label and required indicator. The button is fine.'
            : `${score.hits}/2 failures found${score.falsePos > 0 ? `, ${score.falsePos} false positive${score.falsePos > 1 ? 's' : ''}` : ''}. The two failures: (1) Email input uses placeholder-only — screen readers can\'t announce the field purpose after typing begins. (2) Error message uses colour only with no ARIA role="alert" — invisible to screen readers and colour-blind users.`}
        />
      )}
    </div>
  );
}

// ─── 14. ComponentStatesTask ──────────────────────────────────────────────────
// A button shows 5 of its 6 required states — identify the missing one.
function ComponentStatesTask({ task, onComplete }) {
  const shownStates = [
    { label: 'Default',  render: <div style={{ display: 'inline-block', background: '#4F46E5', color: '#fff', borderRadius: 7, padding: '8px 16px', fontSize: 13, fontWeight: 600, fontFamily: 'system-ui' }}>Submit</div> },
    { label: 'Hover',    render: <div style={{ display: 'inline-block', background: '#4338CA', color: '#fff', borderRadius: 7, padding: '8px 16px', fontSize: 13, fontWeight: 600, fontFamily: 'system-ui', boxShadow: '0 2px 8px rgba(67,56,202,0.4)' }}>Submit</div> },
    { label: 'Active',   render: <div style={{ display: 'inline-block', background: '#3730A3', color: '#fff', borderRadius: 7, padding: '8px 16px', fontSize: 13, fontWeight: 600, fontFamily: 'system-ui', transform: 'scale(0.97)' }}>Submit</div> },
    { label: 'Disabled', render: <div style={{ display: 'inline-block', background: LT.surface, color: LT.textMuted, borderRadius: 7, padding: '8px 16px', fontSize: 13, fontWeight: 600, fontFamily: 'system-ui', border: `1.5px solid ${LT.border}` }}>Submit</div> },
    { label: 'Error',    render: <div style={{ display: 'inline-block', background: 'rgba(220,38,38,0.08)', color: LT.red, borderRadius: 7, padding: '8px 16px', fontSize: 13, fontWeight: 600, fontFamily: 'system-ui', border: `1.5px solid rgba(220,38,38,0.5)` }}>Submit</div> },
  ];

  const options = [
    { id: 'focus',   label: 'Focus',       desc: 'Keyboard / tab focus ring',         correct: true  },
    { id: 'loading', label: 'Loading',      desc: 'Spinner shown after click',         correct: false },
    { id: 'visited', label: 'Visited',      desc: 'After the element was used',        correct: false },
    { id: 'pressed', label: 'Pressed',      desc: 'Same as Active — different name',   correct: false },
    { id: 'success', label: 'Success',      desc: 'Confirmation after action resolves', correct: false },
    { id: 'tooltip', label: 'Tooltip',      desc: 'Help text on hover',               correct: false },
  ];

  const [picked, setPicked] = useState(null);
  const [done, setDone]     = useState(false);

  const pick = (opt) => {
    if (done) return;
    setPicked(opt.id);
    setDone(true);
    setTimeout(() => onComplete(opt.correct ? 'A' : opt.id === 'loading' ? 'B' : 'C'), 2200);
  };

  return (
    <div className="uitask__body">
      <p className="uitask__instruction">{task.instruction || 'This button component shows 5 of its 6 required interactive states. Which state is missing?'}</p>

      {/* Button states showcase */}
      <div style={{ background: LT.bg, borderRadius: 14, padding: '18px 18px 20px', marginBottom: 16, boxShadow: '0 8px 40px rgba(0,0,0,0.55)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {shownStates.map(st => (
            <div key={st.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: LT.textMuted, fontFamily: 'system-ui', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{st.label}</div>
              {st.render}
            </div>
          ))}
          {/* Missing state slot */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#F59E0B', fontFamily: 'system-ui', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>? Missing</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(245,158,11,0.08)', color: '#F59E0B', border: '1.5px dashed rgba(245,158,11,0.4)', borderRadius: 7, padding: '8px 12px', fontSize: 12, fontFamily: 'system-ui' }}>
              Tap below ↓
            </div>
          </div>
        </div>
      </div>

      {/* Options */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {options.map(opt => {
          const isSel     = picked === opt.id;
          const isCorrect = done && isSel && opt.correct;
          const isWrong   = done && isSel && !opt.correct;
          return (
            <div
              key={opt.id}
              onClick={() => pick(opt)}
              style={{
                border: `1.5px solid ${isCorrect ? T.greenBorder : isWrong ? T.redBorder : isSel ? T.accentBorder : T.border}`,
                borderRadius: 10, padding: '12px 14px',
                background: isCorrect ? T.greenBg : isWrong ? T.redBg : isSel ? T.accentBg : T.card,
                cursor: done ? 'default' : 'pointer', transition: 'all 0.15s',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: isCorrect ? T.green : isWrong ? T.red : T.text, marginBottom: 4, fontFamily: T.body }}>{opt.label}</div>
              <div style={{ fontSize: 11, color: T.textSec, lineHeight: 1.4, fontFamily: T.body }}>{opt.desc}</div>
            </div>
          );
        })}
      </div>

      {done && picked && (
        <FeedbackBox
          type={options.find(o => o.id === picked)?.correct ? 'correct' : 'wrong'}
          text={options.find(o => o.id === picked)?.correct
            ? 'Correct — Focus state. WCAG 2.4.7 requires a visible keyboard focus indicator on all interactive elements. It\'s the most commonly skipped state in design files because it\'s invisible to mouse users. Keyboard users — including many with motor disabilities — rely on it to navigate. Pressed = Active (same thing, just different teams\' naming). Loading and Success are optional enhancements.'
            : options.find(o => o.id === picked)?.id === 'loading'
              ? 'Close, but Loading is an enhancement, not a WCAG requirement. The legally required state that\'s missing is the Focus state — WCAG 2.4.7 requires a visible keyboard focus indicator on every interactive element. It\'s invisible to mouse users, which is why it gets skipped in design files so often.'
              : 'Not the required missing state. Think about WCAG requirements specifically — which state is legally required, primarily serves keyboard and assistive technology users, and is the most commonly skipped in design system implementations?'}
        />
      )}
    </div>
  );
}

// ─── 15. FocusOrderTask ───────────────────────────────────────────────────────
// Tap interactive elements in the correct keyboard tab order.
function FocusOrderTask({ task, onComplete }) {
  const elements = [
    { id: 'title',    label: 'Dialog title: "Delete project"',       type: 'heading',  correctOrder: 5, note: 'static — screen reader announces on modal open, not focusable via Tab' },
    { id: 'body',     label: 'Body: "This action can\'t be undone."', type: 'text',     correctOrder: 6, note: 'static text — not in tab sequence' },
    { id: 'close',    label: '✕ Close icon',                         type: 'button',   correctOrder: 1, note: 'first — always the escape hatch' },
    { id: 'cancel',   label: 'Cancel button',                        type: 'button',   correctOrder: 2, note: 'second — safe option before destructive' },
    { id: 'checkbox', label: '☐ "I understand this is permanent"',   type: 'checkbox', correctOrder: 3, note: 'third — confirmation gate before danger' },
    { id: 'confirm',  label: 'Delete (destructive CTA)',              type: 'button',   correctOrder: 4, note: 'last interactive — after all confirmation' },
  ];

  const [order, setOrder]     = useState([]);   // tapped ids in sequence
  const [submitted, setSubmit] = useState(false);
  const [results, setResults] = useState(null);

  const tap = (id) => {
    if (submitted || order.includes(id)) return;
    setOrder(prev => [...prev, id]);
  };

  const undo = () => {
    if (submitted) return;
    setOrder(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (submitted) return;
    setSubmit(true);
    let correct = 0;
    order.forEach((id, i) => {
      const el = elements.find(e => e.id === id);
      if (el && el.correctOrder === i + 1) correct++;
    });
    setResults(correct);
    setTimeout(() => onComplete(correct >= 5 ? 'A' : correct >= 3 ? 'B' : 'C'), 2200);
  };

  const assignedPos = (id) => {
    const i = order.indexOf(id);
    return i >= 0 ? i + 1 : null;
  };

  return (
    <div className="uitask__body">
      <p className="uitask__instruction">{task.instruction || 'Tap the elements in the order a keyboard user should tab through them. Tap once to assign position.'}</p>

      {/* Elements */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        {elements.map(el => {
          const pos  = assignedPos(el.id);
          const done = submitted;
          const isCorrect = done && pos === el.correctOrder;
          const isWrong   = done && pos !== null && pos !== el.correctOrder;
          const isStatic  = el.type === 'heading' || el.type === 'text';
          return (
            <div
              key={el.id}
              onClick={() => tap(el.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                border: `1.5px solid ${isCorrect ? T.greenBorder : isWrong ? T.redBorder : pos ? T.purpleBorder : T.border}`,
                borderRadius: 10, padding: '11px 14px',
                background: isCorrect ? T.greenBg : isWrong ? T.redBg : pos ? T.purpleBg : T.card,
                cursor: done || pos ? 'default' : 'pointer', transition: 'all 0.15s',
                opacity: isStatic && !pos && !done ? 0.7 : 1,
              }}
            >
              {/* Position circle */}
              {pos ? (
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: isCorrect ? T.green : isWrong ? T.red : T.purple, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0, fontFamily: T.mono }}>
                  {pos}
                </div>
              ) : (
                <div style={{ width: 24, height: 24, borderRadius: '50%', border: `1.5px dashed ${T.border}`, flexShrink: 0 }} />
              )}

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: isCorrect ? T.green : isWrong ? T.red : T.text, fontFamily: T.body }}>{el.label}</div>
                {done && (
                  <div style={{ fontSize: 11, color: T.textMuted, marginTop: 3, fontFamily: T.body }}>{el.note}</div>
                )}
              </div>

              <div style={{ fontSize: 10, color: T.textMuted, fontFamily: T.mono, background: T.card, border: `1px solid ${T.border}`, borderRadius: 4, padding: '2px 6px', whiteSpace: 'nowrap' }}>
                {el.type}
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 8 }}>
        {order.length > 0 && !submitted && (
          <button
            className="btn btn-defend"
            onClick={undo}
            style={{ flex: '0 0 auto', padding: '9px 16px' }}
          >
            ← Undo
          </button>
        )}
        <SubmitBtn onClick={handleSubmit} disabled={order.length < elements.length || submitted}>
          {submitted ? 'Checking…' : `Check order (${order.length}/${elements.length}) →`}
        </SubmitBtn>
      </div>

      {results !== null && (
        <FeedbackBox
          type={results >= 5 ? 'correct' : 'wrong'}
          text={results >= 5
            ? 'Correct order. The logic: ✕ Close first (always the escape hatch). Cancel before Delete (safe option precedes destructive). Checkbox before Delete (confirmation gate must come first). Static text — headings and body copy — don\'t receive Tab focus in standard keyboard navigation; the screen reader announces them on dialog open.'
            : `${results}/6 correct. Key principles: (1) The ✕ close is always first in a dialog. (2) Safe actions precede destructive ones. (3) Confirmation gates come before the action they confirm. (4) Static text (headings, body copy) is NOT in the tab sequence — screen readers announce it on dialog open, separate from keyboard focus.`}
        />
      )}
    </div>
  );
}

// ─── 16. BeforeAfterTask ──────────────────────────────────────────────────────
// Toggleable before/after UI comparison. Player identifies the design problem.
function BeforeAfterTask({ task, onComplete }) {
  const [view, setView]   = useState('before');
  const [picked, setPicked] = useState(null);
  const [done, setDone]   = useState(false);

  const panels   = task.panels   || {};
  const question = panels.question || 'What design problem was fixed between the Before and After versions?';
  const opts = panels.options || [
    {
      id: 'A', correct: true,
      text: 'The CTA button had near-zero contrast — text and background were almost identical colours.',
      fb: 'Correct. The Before version has a light blue CTA (#B8D4F0) with near-matching text (#7AADDC) — a contrast ratio below 1.5:1. WCAG AA requires 4.5:1 for text on interactive elements. The After version uses #1D4ED8 on white (8.1:1), making the primary action immediately scannable.',
    },
    {
      id: 'B', correct: false,
      text: 'The email field was too short and clipped its placeholder text.',
      fb: 'Not this one. The email field dimensions are identical in both versions. The issue is the primary CTA button. Flip between Before and After and focus specifically on the "Get started" button.',
    },
    {
      id: 'C', correct: false,
      text: 'The heading "Sign up free" was shown in too small a font size.',
      fb: 'Not the heading. It\'s identical and readable in both versions. Look at the primary action button — that\'s where the fix happened. Switch to Before, note the button colours, then switch to After.',
    },
  ];

  const pick = (opt) => {
    if (done) return;
    setPicked(opt.id);
    setDone(true);
    setTimeout(() => onComplete(opt.correct ? 'A' : opt.id === 'B' ? 'B' : 'C'), 2200);
  };

  // Panel renderers — extensible via task.panels.beforeType / afterType
  const renderPanel = (type) => {
    const cardBase = { background: '#FFFFFF', borderRadius: 10, padding: '16px', fontFamily: 'system-ui' };

    // ── Built-in panel types ──────────────────────────────────────
    if (type === 'low-contrast-cta') return (
      <div style={cardBase}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 14 }}>Sign up free</div>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: '#374151', marginBottom: 4 }}>Email address</div>
          <div style={{ height: 32, border: '1.5px solid #E5E7EB', borderRadius: 6, background: '#F9FAFB' }} />
        </div>
        {/* Problem: near-zero contrast */}
        <div style={{ background: '#B8D4F0', color: '#7AADDC', borderRadius: 8, padding: '11px', textAlign: 'center', fontSize: 13, fontWeight: 600 }}>
          Get started →
        </div>
        <div style={{ textAlign: 'center', marginTop: 8, fontSize: 11, color: '#9CA3AF' }}>No credit card required</div>
      </div>
    );

    if (type === 'high-contrast-cta') return (
      <div style={cardBase}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 14 }}>Sign up free</div>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: '#374151', marginBottom: 4 }}>Email address</div>
          <div style={{ height: 32, border: '1.5px solid #E5E7EB', borderRadius: 6, background: '#F9FAFB' }} />
        </div>
        {/* Fixed: 8.1:1 contrast */}
        <div style={{ background: '#1D4ED8', color: '#FFFFFF', borderRadius: 8, padding: '11px', textAlign: 'center', fontSize: 13, fontWeight: 600, boxShadow: '0 2px 8px rgba(29,78,216,0.3)' }}>
          Get started →
        </div>
        <div style={{ textAlign: 'center', marginTop: 8, fontSize: 11, color: '#9CA3AF' }}>No credit card required</div>
      </div>
    );

    if (type === 'crowded-form') return (
      <div style={cardBase}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 6 }}>Create account</div>
        {['Full name', 'Email', 'Password', 'Confirm password', 'Phone number'].map(f => (
          <div key={f} style={{ marginBottom: 2 }}>
            <div style={{ fontSize: 9, color: '#374151', marginBottom: 1 }}>{f}</div>
            <div style={{ height: 22, border: '1px solid #E5E7EB', borderRadius: 4, background: '#F9FAFB' }} />
          </div>
        ))}
        <div style={{ background: '#4F46E5', color: '#fff', borderRadius: 5, padding: '8px', textAlign: 'center', fontSize: 12, fontWeight: 600, marginTop: 6 }}>Create account</div>
      </div>
    );

    if (type === 'spaced-form') return (
      <div style={cardBase}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 14 }}>Create account</div>
        {['Full name', 'Email', 'Password', 'Confirm password', 'Phone number'].map((f, i) => (
          <div key={f} style={{ marginBottom: i < 4 ? 12 : 0 }}>
            <div style={{ fontSize: 10, fontWeight: 500, color: '#374151', marginBottom: 4 }}>{f}</div>
            <div style={{ height: 28, border: '1.5px solid #E5E7EB', borderRadius: 6, background: '#F9FAFB' }} />
          </div>
        ))}
        <div style={{ background: '#4F46E5', color: '#fff', borderRadius: 7, padding: '10px', textAlign: 'center', fontSize: 12, fontWeight: 600, marginTop: 14, boxShadow: '0 2px 8px rgba(79,70,229,0.3)' }}>Create account</div>
      </div>
    );

    if (type === 'misaligned-layout') return (
      <div style={cardBase}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 10 }}>Launchly Dashboard</div>
        <div style={{ display: 'grid', gap: 6 }}>
          {[{ w: '60%', h: 40, ml: 0 }, { w: '80%', h: 24, ml: 20 }, { w: '45%', h: 24, ml: 8 }, { w: '70%', h: 24, ml: 0 }].map((b, i) => (
            <div key={i} style={{ width: b.w, height: b.h, marginLeft: b.ml, background: '#E5E7EB', borderRadius: 5 }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
          <div style={{ flex: 1, height: 28, background: '#4F46E5', borderRadius: 5, marginLeft: 12 }} />
          <div style={{ flex: 1, height: 28, background: '#E5E7EB', borderRadius: 5, marginRight: 4 }} />
        </div>
      </div>
    );

    if (type === 'aligned-layout') return (
      <div style={cardBase}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 10 }}>Launchly Dashboard</div>
        <div style={{ display: 'grid', gap: 6 }}>
          {[{ w: '60%', h: 40 }, { w: '80%', h: 24 }, { w: '45%', h: 24 }, { w: '70%', h: 24 }].map((b, i) => (
            <div key={i} style={{ width: b.w, height: b.h, background: '#E5E7EB', borderRadius: 5 }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <div style={{ flex: 1, height: 28, background: '#4F46E5', borderRadius: 5 }} />
          <div style={{ flex: 1, height: 28, background: '#E5E7EB', borderRadius: 5 }} />
        </div>
      </div>
    );

    // Visual hierarchy — flat (problem): all text at near-identical sizes
    if (type === 'flat-type-hierarchy') return (
      <div style={cardBase}>
        <div style={{ marginBottom: 12 }}>
          {/* H1 — barely larger than everything else */}
          <div style={{ fontSize: 15, fontWeight: 500, color: '#374151', marginBottom: 6, fontFamily: 'system-ui' }}>Dashboard Overview</div>
          {/* Section heading — same visual weight as body */}
          <div style={{ fontSize: 14, fontWeight: 400, color: '#374151', marginBottom: 6, fontFamily: 'system-ui' }}>Monthly Overview</div>
          {/* Body — indistinguishable from headings */}
          <div style={{ fontSize: 13, fontWeight: 400, color: '#374151', lineHeight: 1.5, fontFamily: 'system-ui', marginBottom: 6 }}>
            3 active projects · 2 pending reviews.
          </div>
          {/* Label — same size as body */}
          <div style={{ fontSize: 12, fontWeight: 400, color: '#374151', fontFamily: 'system-ui', marginBottom: 10 }}>ACTIVE USERS</div>
        </div>
        {/* Stats row — equal visual weight */}
        <div style={{ display: 'flex', gap: 8 }}>
          {['47', '12', '94%'].map(n => (
            <div key={n} style={{ flex: 1, background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 6, padding: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 500, color: '#374151', fontFamily: 'system-ui' }}>{n}</div>
              <div style={{ fontSize: 12, color: '#374151', fontFamily: 'system-ui', marginTop: 2 }}>metric</div>
            </div>
          ))}
        </div>
      </div>
    );

    // Visual hierarchy — clear (fixed): proper size/weight contrast at every level
    if (type === 'clear-type-hierarchy') return (
      <div style={cardBase}>
        <div style={{ marginBottom: 12 }}>
          {/* H1 — dominant, bold, large */}
          <div style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 4, fontFamily: 'system-ui', lineHeight: 1.2 }}>Dashboard Overview</div>
          {/* Section heading — distinct from both H1 and body */}
          <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8, fontFamily: 'system-ui' }}>Monthly Overview</div>
          {/* Body — comfortable reading size, lower weight */}
          <div style={{ fontSize: 12, fontWeight: 400, color: '#4B5563', lineHeight: 1.55, fontFamily: 'system-ui', marginBottom: 8 }}>
            3 active projects · 2 pending reviews.
          </div>
          {/* Label — small, tracked, uppercase — clearly metadata */}
          <div style={{ fontSize: 10, fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.09em', textTransform: 'uppercase', fontFamily: 'system-ui', marginBottom: 10 }}>ACTIVE USERS</div>
        </div>
        {/* Stats row — numbers dominate, labels support */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[{ n: '47', l: 'projects' }, { n: '12', l: 'tasks' }, { n: '94%', l: 'on track' }].map(({ n, l }) => (
            <div key={n} style={{ flex: 1, background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 6, padding: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#111827', fontFamily: 'system-ui' }}>{n}</div>
              <div style={{ fontSize: 10, color: '#9CA3AF', fontFamily: 'system-ui', marginTop: 2, letterSpacing: '0.04em' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    );

    return <div style={{ color: LT.textMuted, fontFamily: 'system-ui', padding: 10, fontSize: 12 }}>Panel: {type}</div>;
  };

  const beforeType = panels.beforeType || 'low-contrast-cta';
  const afterType  = panels.afterType  || 'high-contrast-cta';

  return (
    <div className="uitask__body">
      <p className="uitask__instruction">{task.instruction || 'Study the Before and After versions of this UI. What design problem was fixed?'}</p>

      {/* Before / After toggle */}
      <div style={{ display: 'flex', marginBottom: 10, borderRadius: 8, overflow: 'hidden', border: `1px solid ${T.border}` }}>
        {[
          { v: 'before', label: '✗ Before', bg: T.redBg,   color: T.red   },
          { v: 'after',  label: '✓ After',  bg: T.greenBg, color: T.green },
        ].map(({ v, label, bg, color }) => (
          <button key={v} onClick={() => setView(v)} style={{ flex: 1, padding: '9px 0', background: view === v ? bg : 'transparent', color: view === v ? color : T.textSec, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: T.body, transition: 'all 0.15s' }}>
            {label}
          </button>
        ))}
      </div>

      {/* UI preview */}
      <div style={{ marginBottom: 16, borderRadius: 10, overflow: 'hidden', border: `2px solid ${view === 'before' ? T.redBorder : T.greenBorder}`, transition: 'border-color 0.2s', boxShadow: '0 6px 24px rgba(0,0,0,0.4)' }}>
        <div style={{ padding: '6px 12px', background: view === 'before' ? T.redBg : T.greenBg, borderBottom: `1px solid ${view === 'before' ? T.redBorder : T.greenBorder}` }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: view === 'before' ? T.red : T.green, fontFamily: T.mono }}>
            {view === 'before' ? '✗ BEFORE — has a problem' : '✓ AFTER — problem solved'}
          </span>
        </div>
        <div style={{ padding: 14, background: '#F3F4F6' }}>
          {renderPanel(view === 'before' ? beforeType : afterType)}
        </div>
      </div>

      {/* Question + options */}
      <p style={{ fontSize: 12, color: T.textSec, marginBottom: 10, fontFamily: T.body }}>{question}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {opts.map(opt => {
          const isSel     = picked === opt.id;
          const isCorrect = done && isSel && opt.correct;
          const isWrong   = done && isSel && !opt.correct;
          return (
            <div key={opt.id} onClick={() => pick(opt)} style={{ border: `1.5px solid ${isCorrect ? T.greenBorder : isWrong ? T.redBorder : isSel ? T.accentBorder : T.border}`, borderRadius: 10, padding: '12px 14px', background: isCorrect ? T.greenBg : isWrong ? T.redBg : isSel ? T.accentBg : T.card, cursor: done ? 'default' : 'pointer', transition: 'all 0.15s' }}>
              <div style={{ fontSize: 13, color: isCorrect ? T.green : isWrong ? T.red : T.text, lineHeight: 1.5, fontFamily: T.body }}>{opt.text}</div>
              {done && isSel && (
                <div style={{ fontSize: 12, color: isCorrect ? '#6EE7B7' : '#FCA5A5', marginTop: 10, lineHeight: 1.55, borderTop: `1px solid ${isCorrect ? T.greenBorder : T.redBorder}`, paddingTop: 10 }}>{opt.fb}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── 17. ColorPaletteTask ─────────────────────────────────────────────────────
// Assign colours from a palette to semantic UI roles. Live preview updates instantly.
function ColorPaletteTask({ task, onComplete }) {
  const palette = task.palette || [
    { id: 'navy',   hex: '#1E3A5F', name: 'Navy'   },
    { id: 'sky',    hex: '#7DD3FC', name: 'Sky'    },
    { id: 'white',  hex: '#FFFFFF', name: 'White'  },
    { id: 'slate',  hex: '#334155', name: 'Slate'  },
    { id: 'muted',  hex: '#94A3B8', name: 'Muted'  },
    { id: 'indigo', hex: '#4F46E5', name: 'Indigo' },
    { id: 'coral',  hex: '#F87171', name: 'Coral'  },
    { id: 'cream',  hex: '#F8FAFC', name: 'Cream'  },
  ];

  const roles = task.roles || [
    { id: 'primary',    label: 'Primary CTA',  correct: 'indigo', hint: 'High contrast — brand action' },
    { id: 'background', label: 'Page BG',       correct: 'cream',  hint: 'Light neutral base'           },
    { id: 'heading',    label: 'Heading text',  correct: 'slate',  hint: 'Dark, high contrast on BG'    },
    { id: 'muted-text', label: 'Muted text',    correct: 'muted',  hint: 'Subdued secondary copy'       },
  ];

  const [selColor, setSelColor] = useState(null);
  const [assignments, setAssign] = useState({});  // roleId → colorId
  const [checked, setChecked]   = useState(false);
  const [numCorrect, setNC]     = useState(null);

  const tapColor = (id) => {
    if (checked) return;
    setSelColor(prev => prev === id ? null : id);
  };

  const tapRole = (roleId) => {
    if (!selColor || checked) return;
    const newAssign = { ...assignments };
    // Un-assign previous role that used this colour
    Object.keys(newAssign).forEach(k => { if (newAssign[k] === selColor) delete newAssign[k]; });
    newAssign[roleId] = selColor;
    setAssign(newAssign);
    setSelColor(null);
  };

  const allAssigned = roles.every(r => assignments[r.id]);

  const getHex = (roleId) => {
    const cid = assignments[roleId];
    return cid ? (palette.find(p => p.id === cid)?.hex || '#E5E7EB') : null;
  };

  // Live preview colours — fallback to neutral grey placeholders
  const bg      = getHex('background') || '#F8FAFC';
  const primary = getHex('primary')    || '#D1D5DB';
  const heading = getHex('heading')    || '#D1D5DB';
  const muted   = getHex('muted-text') || '#D1D5DB';

  const handleCheck = () => {
    if (checked) return;
    setChecked(true);
    const n = roles.filter(r => assignments[r.id] === r.correct).length;
    setNC(n);
    setTimeout(() => onComplete(n === 4 ? 'A' : n >= 2 ? 'B' : 'C'), 2200);
  };

  const assigned = new Set(Object.values(assignments));

  return (
    <div className="uitask__body">
      <p className="uitask__instruction">{task.instruction || 'Tap a colour from the palette, then tap the role slot to assign it. Watch the live preview update.'}</p>

      {/* ── Live UI preview ── */}
      <div style={{ marginBottom: 14, borderRadius: 12, overflow: 'hidden', border: `1px solid ${T.border}`, boxShadow: '0 6px 24px rgba(0,0,0,0.4)' }}>
        <div style={{ padding: '6px 12px', background: T.card, borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: T.textSec, fontFamily: T.mono, letterSpacing: '0.05em' }}>LIVE PREVIEW</span>
          {allAssigned && !checked && <span style={{ fontSize: 9, color: T.accent, fontFamily: T.body }}>← all roles filled, ready to check</span>}
        </div>
        <div style={{ background: bg, padding: '18px', fontFamily: 'system-ui', transition: 'background 0.35s' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: heading, marginBottom: 4, transition: 'color 0.35s' }}>Launchly Sign In</div>
          <div style={{ fontSize: 12, color: muted, marginBottom: 16, transition: 'color 0.35s' }}>Welcome back. Enter your details to continue.</div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: heading, marginBottom: 4, transition: 'color 0.35s' }}>Email</div>
            <div style={{ height: 32, border: `1.5px solid ${heading}33`, borderRadius: 6, background: `${bg}ee`, transition: 'border-color 0.35s' }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: heading, marginBottom: 4, transition: 'color 0.35s' }}>Password</div>
            <div style={{ height: 32, border: `1.5px solid ${heading}33`, borderRadius: 6, background: `${bg}ee` }} />
          </div>
          <div style={{ background: primary, color: '#FFFFFF', borderRadius: 7, padding: '10px', textAlign: 'center', fontSize: 13, fontWeight: 600, transition: 'background 0.35s', boxShadow: primary !== '#D1D5DB' ? `0 2px 8px ${primary}66` : 'none' }}>
            Sign in →
          </div>
          <div style={{ textAlign: 'center', marginTop: 10, fontSize: 11, color: muted, transition: 'color 0.35s' }}>
            Don't have an account?{' '}
            <span style={{ color: primary, fontWeight: 500, transition: 'color 0.35s' }}>Sign up</span>
          </div>
        </div>
      </div>

      {/* ── Colour palette swatches ── */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        {palette.map(c => {
          const isSel  = selColor === c.id;
          const isUsed = assigned.has(c.id);
          let outlineColor = 'transparent';
          if (isSel) outlineColor = T.accent;
          if (checked) {
            const roleForColor = roles.find(r => assignments[r.id] === c.id);
            if (roleForColor) outlineColor = (roleForColor.correct === c.id ? T.green : T.red);
          }
          return (
            <div
              key={c.id}
              title={c.name}
              onClick={() => tapColor(c.id)}
              style={{
                width: 36, height: 36, borderRadius: 8,
                background: c.hex,
                cursor: checked ? 'default' : 'pointer',
                border: `2px solid ${isSel ? T.accent : isUsed && !isSel ? 'rgba(255,255,255,0.25)' : 'transparent'}`,
                outline: `2.5px solid ${outlineColor}`, outlineOffset: 2,
                opacity: isUsed && !isSel ? 0.45 : 1,
                transition: 'all 0.15s',
                boxShadow: isSel ? `0 0 0 5px ${T.accentBg}` : 'none',
                position: 'relative',
              }}
            >
              {isSel && (
                <div style={{ position: 'absolute', inset: 0, borderRadius: 6, background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: 'rgba(0,0,0,0.5)' }}>✓</div>
              )}
            </div>
          );
        })}
      </div>
      {selColor && !checked && (
        <p style={{ fontSize: 11, color: T.accent, marginBottom: 10, fontFamily: T.body }}>
          "{palette.find(p => p.id === selColor)?.name}" selected — tap a role slot to assign it ↓
        </p>
      )}

      {/* ── Role slots ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 4 }}>
        {roles.map(r => {
          const cid     = assignments[r.id];
          const col     = cid ? palette.find(p => p.id === cid) : null;
          const canFill = !checked && !!selColor;
          const isRight = checked && cid === r.correct;
          const isWrong = checked && cid && cid !== r.correct;
          return (
            <div key={r.id} onClick={() => tapRole(r.id)} style={{ border: `1.5px ${col ? 'solid' : 'dashed'} ${isRight ? T.greenBorder : isWrong ? T.redBorder : canFill ? T.accentBorder : T.border}`, borderRadius: 10, padding: '10px 12px', cursor: canFill ? 'pointer' : 'default', background: isRight ? T.greenBg : isWrong ? T.redBg : canFill ? T.accentBg : 'transparent', transition: 'all 0.15s', minHeight: 54, display: 'flex', alignItems: 'center', gap: 10 }}>
              {col && <div style={{ width: 22, height: 22, borderRadius: 5, background: col.hex, flexShrink: 0, border: '1px solid rgba(0,0,0,0.1)' }} />}
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: isRight ? T.green : isWrong ? T.red : T.text, fontFamily: T.body }}>{r.label}</div>
                <div style={{ fontSize: 10, color: T.textMuted, fontFamily: T.body }}>{col ? col.name : r.hint}</div>
              </div>
            </div>
          );
        })}
      </div>

      <SubmitBtn onClick={handleCheck} disabled={!allAssigned || checked}>
        {checked ? 'Checking palette…' : 'Check my palette →'}
      </SubmitBtn>

      {numCorrect !== null && (
        <FeedbackBox
          type={numCorrect === 4 ? 'correct' : 'wrong'}
          text={numCorrect === 4
            ? 'Perfect palette. The logic: Cream (#F8FAFC) as background — low saturation, near-white. Slate (#334155) as headings — 11:1 contrast on cream, strong hierarchy. Indigo (#4F46E5) as primary CTA — distinctive brand colour with white text passing AA. Muted (#94A3B8) for secondary copy — 4.5:1 on cream, subdued but accessible. Every colour role has a contrast requirement, not just a visual preference.'
            : `${numCorrect}/4 correct. Colour system thinking: every role has a contrast floor. Heading text needs 7:1 on the background (AAA). CTA button text needs 4.5:1 on the button colour. Muted copy still needs 4.5:1 (AA). Background should be near-neutral so coloured elements pop. Re-check each pairing — can each text colour pass AA on its background?`}
        />
      )}
    </div>
  );
}

// ─── Main UITask shell ────────────────────────────────────────────────────────
export default function UITask({ task, onComplete }) {
  const renderTask = () => {
    switch (task.type) {
      case 'fitts':             return <FittsTask            task={task} onComplete={onComplete} />;
      case 'proximity':         return <ProximityTask        task={task} onComplete={onComplete} />;
      case 'contrast':          return <ContrastTask         task={task} onComplete={onComplete} />;
      case 'reorder':           return <ReorderTask          task={task} onComplete={onComplete} />;
      case 'heuristic-audit':   return <HeuristicAuditTask   task={task} onComplete={onComplete} />;
      case 'type-scale':        return <TypeScaleTask        task={task} onComplete={onComplete} />;
      case 'ia-sort':           return <IASortTask           task={task} onComplete={onComplete} />;
      case 'copy-fix':          return <CopyFixTask          task={task} onComplete={onComplete} />;
      case 'icon-match':        return <IconMatchTask        task={task} onComplete={onComplete} />;
      case 'color-roles':       return <ColorRolesTask       task={task} onComplete={onComplete} />;
      case 'dark-pattern':      return <DarkPatternTask      task={task} onComplete={onComplete} />;
      case 'spacing-pick':      return <SpacingPickTask      task={task} onComplete={onComplete} />;
      case 'a11y-audit':        return <A11yAuditTask        task={task} onComplete={onComplete} />;
      case 'component-states':  return <ComponentStatesTask  task={task} onComplete={onComplete} />;
      case 'focus-order':       return <FocusOrderTask       task={task} onComplete={onComplete} />;
      case 'before-after':      return <BeforeAfterTask      task={task} onComplete={onComplete} />;
      case 'color-palette':     return <ColorPaletteTask     task={task} onComplete={onComplete} />;
      default:
        return (
          <div style={{ fontSize: 13, color: '#8B9AB8', padding: '16px 0' }}>
            Unknown task type: <code>{task.type}</code>
          </div>
        );
    }
  };

  return (
    <div className="uitask">
      <div className="uitask__header">
        <div className="uitask__law-tag">🎮 UI TASK · {task.law}</div>
        <div className="uitask__title">{task.title}</div>
      </div>
      <div className="uitask__narration">{task.narration || task.instruction}</div>
      {renderTask()}
    </div>
  );
}
