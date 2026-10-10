// Hands-on case bodies: spot the problems, compose the copy, triage the backlog.
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { PREVIEWS, SPOT_MOCKS } from '../ui/mocks';
import { gradeCompose, gradeSpot, gradeTriage } from '../engine/scoring';
import { shuffled } from './shuffle';

// ─── Spot ───────────────────────────────────────────────────────────────────

export function SpotBody({ caseData, result, onResolve }) {
  const Mock = SPOT_MOCKS[caseData.mock];
  const stageRef = useRef(null);
  const [found, setFound] = useState(result?.foundIds || []);
  const [misses, setMisses] = useState([]);
  const tapsLeft = caseData.taps - found.length - misses.length;
  const done = Boolean(result);

  const finish = useCallback((foundIds) => {
    const graded = gradeSpot(caseData, foundIds);
    onResolve(graded, { foundIds, found: graded.found });
  }, [caseData, onResolve]);

  const onStageClick = (e) => {
    if (done) return;
    const stage = stageRef.current;
    const hit = e.target.closest('[data-hotspot]');
    if (hit && stage.contains(hit)) {
      const id = hit.dataset.hotspot;
      if (found.includes(id)) return;
      const next = [...found, id];
      setFound(next);
      if (next.length === caseData.hotspots.length || caseData.taps - next.length - misses.length <= 0) finish(next);
      return;
    }
    const box = stage.getBoundingClientRect();
    const nextMisses = [...misses, { x: e.clientX - box.left, y: e.clientY - box.top }];
    setMisses(nextMisses);
    if (caseData.taps - found.length - nextMisses.length <= 0) finish(found);
  };

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.querySelectorAll('.hs-badge').forEach(n => n.remove());
    stage.querySelectorAll('[data-hotspot]').forEach(n => n.classList.remove('hs--found', 'hs--missed'));
    const seen = new Set();
    caseData.hotspots.forEach(h => {
      const n = found.indexOf(h.id);
      const state = n >= 0 ? 'found' : done ? 'missed' : null;
      if (!state) return;
      stage.querySelectorAll(`[data-hotspot="${h.id}"]`).forEach(el => {
        el.classList.add(`hs--${state}`);
        if (seen.has(h.id)) return;
        seen.add(h.id);
        const badge = document.createElement('span');
        badge.className = 'hs-badge';
        badge.textContent = state === 'found' ? String(n + 1) : '!';
        el.appendChild(badge);
      });
    });
  }, [found, done, caseData.hotspots]);

  if (!Mock) return <p className="muted">This exercise is still being built.</p>;

  const ordered = [
    ...found.map(id => ({ ...caseData.hotspots.find(h => h.id === id), state: 'found' })),
    ...caseData.hotspots.filter(h => !found.includes(h.id)).map(h => ({ ...h, state: 'missed' })),
  ];

  return (
    <div className="hands-on">
      <div className="hands-on__bar">
        <p className="ask">{caseData.ask}</p>
        <div className="taps" aria-label={`${Math.max(tapsLeft, 0)} taps left`}>
          {Array.from({ length: caseData.taps }, (_, i) => <i key={i} className={i < caseData.taps - tapsLeft ? 'used' : ''} />)}
          <span>{done ? 'done' : `${tapsLeft} left`}</span>
        </div>
      </div>
      <div ref={stageRef} className={`stage ${done ? '' : 'stage--armed'}`} onClick={onStageClick} role="application" aria-label="Interactive mockup: tap the problems">
        <Mock />
        {misses.map((m, i) => <span key={i} className="miss-mark" style={{ left: m.x, top: m.y }}>✕</span>)}
      </div>
      {(done || found.length > 0) && (
        <div className="findings">
          {(done ? ordered : ordered.filter(h => h.state === 'found')).map((h, i) => (
            <div className={`finding finding--${h.state}`} key={h.id} style={{ animationDelay: `${i * 60}ms` }}>
              <span className="finding__n">{h.state === 'found' ? found.indexOf(h.id) + 1 : '!'}</span>
              <div>
                <b>{h.label}{h.state === 'missed' ? ' (missed)' : ''}</b>
                {done && <p>{h.explain}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Compose ────────────────────────────────────────────────────────────────

const GRADE_MARK = { good: '✓ ', meh: '~ ', bad: '✕ ' };

export function ComposeBody({ caseData, result, onResolve }) {
  const Preview = PREVIEWS[caseData.preview];
  const [picks, setPicks] = useState(result?.picks || {});
  const done = Boolean(result);
  const complete = caseData.slots.every(s => picks[s.id] !== undefined);
  const values = Object.fromEntries(caseData.slots.map(s => [s.id, s.options[picks[s.id]]?.text]));

  const ship = () => {
    const graded = gradeCompose(caseData, picks);
    onResolve(graded, { picks, points: graded.points });
  };

  return (
    <div className="hands-on">
      <p className="ask">{caseData.ask}</p>
      {Preview && <div className="compose-preview"><Preview values={values} /></div>}
      {caseData.slots.map(slot => (
        <div className="slot" key={slot.id}>
          <span className="label">{slot.label}</span>
          <div className="slot__options" role="radiogroup" aria-label={slot.label}>
            {slot.options.map((opt, i) => {
              const on = picks[slot.id] === i;
              const reveal = done && (on || opt.grade === 'good');
              const cls = ['slot-option', !done && on && 'is-on', reveal && `is-${opt.grade}`].filter(Boolean).join(' ');
              return (
                <button type="button" key={i} className={cls} disabled={done} role="radio" aria-checked={on} onClick={() => setPicks(p => ({ ...p, [slot.id]: i }))}>
                  {opt.text}
                  {reveal && <span className="slot-option__note">{on ? GRADE_MARK[opt.grade] : '→ Best: '}{opt.note}</span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {!done && (
        <button type="button" className="btn btn-primary" disabled={!complete} onClick={ship}>
          {caseData.submitLabel || 'Ship it'} →
        </button>
      )}
    </div>
  );
}

// ─── Triage ─────────────────────────────────────────────────────────────────

const TIER_LABEL = { must: 'Fix now', should: 'Good pick', nice: 'Can wait' };

export function TriageBody({ caseData, result, onResolve }) {
  const items = useMemo(() => shuffled(caseData.items, caseData.id), [caseData]);
  const [picked, setPicked] = useState(result?.pickedIds || []);
  const done = Boolean(result);
  const full = picked.length >= caseData.pick;

  const toggle = (id) => {
    if (done) return;
    setPicked(p => (p.includes(id) ? p.filter(x => x !== id) : p.length < caseData.pick ? [...p, id] : p));
  };

  const submit = () => {
    const graded = gradeTriage(caseData, picked);
    onResolve(graded, { pickedIds: picked, points: graded.points, max: graded.max });
  };

  return (
    <div className="hands-on">
      <p className="ask">{caseData.ask}</p>
      <div className="triage" role="group" aria-label="Items">
        {items.map(item => {
          const on = picked.includes(item.id);
          const cls = ['triage-item', on && 'is-on', !done && full && !on && 'is-dim'].filter(Boolean).join(' ');
          return (
            <button type="button" key={item.id} className={cls} disabled={done} aria-pressed={on} onClick={() => toggle(item.id)}>
              <span className="triage-item__box">{on ? picked.indexOf(item.id) + 1 : ''}</span>
              <span className="triage-item__body">
                <span className="triage-item__text">{item.text}</span>
                {done && <span className={`tier tier--${item.tier}`}>{TIER_LABEL[item.tier]}</span>}
                {done && <span className="triage-item__note">{item.note}</span>}
              </span>
            </button>
          );
        })}
      </div>
      {!done && (
        <div className="row">
          <button type="button" className="btn btn-primary" disabled={!full} onClick={submit}>{caseData.submitLabel || 'Lock it in'} →</button>
          <span className="label">{picked.length}/{caseData.pick} picked</span>
        </div>
      )}
    </div>
  );
}
