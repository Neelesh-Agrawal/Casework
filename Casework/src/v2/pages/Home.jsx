import { lazy, Suspense, useEffect, useState } from 'react';
import { Portrait } from '../ui/Character';
import { CAST, getPerson } from '../content/cast';
import { onLinkClick } from '../ui/router';
import { VERDICT } from '../engine/scoring';
import { roomFor } from '../content';

const Office = lazy(() => import('../scene/Office'));

const TEAM = ['rhea', 'priya', 'marcus', 'jonas', 'ana', 'kofi', 'lena', 'sam', 'dana'];

// Desktop and tablet push the office right to make room for the text; phones centre it.
function heroShiftFor(w) {
  if (w >= 960) return 0.2;
  if (w >= 700) return 0.23;
  return 0;
}

function useIsPhone() {
  const query = '(max-width: 699px)';
  const [phone, setPhone] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setPhone(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return phone;
}

function useHeroShift() {
  const [shift, setShift] = useState(() => (typeof window === 'undefined' ? 0 : heroShiftFor(window.innerWidth)));
  useEffect(() => {
    const onResize = () => setShift(heroShiftFor(window.innerWidth));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return shift;
}

// Phone hero: Dana walks in and says the hero text, one line at a time.
const GREETING = [
  { mood: 'happy', text: "Hi, I'm Dana, head of design. Welcome to Launchly!" },
  { mood: 'excited', text: 'This is where you sharpen your design judgment.' },
  { mood: 'thinking', text: 'Stakeholders disagree, deadlines are real, and every choice has a cost.' },
  { mood: 'happy', text: 'Pick your answer, see where it leads, and learn the principle behind it.' },
];

function useGreeting() {
  const [line, setLine] = useState(0);
  const last = line === GREETING.length - 1;
  useEffect(() => {
    if (last) return undefined;
    const t = setTimeout(() => setLine(l => l + 1), line === 0 ? 3600 : 4200);
    return () => clearTimeout(t);
  }, [line, last]);
  return [line, () => setLine(l => (l + 1) % GREETING.length)];
}

function PhoneActions({ startTo, daily }) {
  return (
    <div className="greeter">
      <a href={startTo} className="btn btn-orange" onClick={e => onLinkClick(e, startTo)}>Start with UX Thinking</a>
      {daily && <a href="/daily" className="btn btn-ghost" onClick={e => onLinkClick(e, '/daily')}>Today's case</a>}
    </div>
  );
}

function caseCount(track) {
  return track.chapters ? track.chapters.reduce((n, ch) => n + ch.cases.length, 0) : 0;
}

export default function Home({ tracks, progressFor, daily, dailyEntry, streak }) {
  const ux = tracks.find(t => t.id === 'ux' && t.released);
  const startTo = ux ? '/play/ux' : '/daily';
  const heroShift = useHeroShift();
  const [line, nextLine] = useGreeting();
  const isPhone = useIsPhone();
  const guide = isPhone ? { id: 'dana', mood: GREETING[line].mood, text: GREETING[line].text, line, lines: GREETING.length, onTap: nextLine } : null;
  const pins = tracks.filter(t => t.released).map(t => ({ place: roomFor(t.id), label: t.title, sub: t.subtitle, href: `/play/${t.id}`, color: t.color }));
  if (daily) pins.push({ place: 'kitchen', label: 'Daily case', sub: `#${daily.number} today`, href: '/daily', color: '#F25F1C' });

  return (
    <main className="home">
      <section className="hero">
        <div className="hero__card rise">
          <span className="label">A design judgment game</span>
          <h1 className="display hero__title">Sharpen your design judgment.</h1>
          <p className="hero__lede">
            You've just joined Launchly's product team. Stakeholders disagree, deadlines are real, and every
            choice has a cost. Pick your answer, see where it leads, and learn the principle behind it.
          </p>
          <div className="hero__actions">
            <a href={startTo} className="btn btn-orange" onClick={e => onLinkClick(e, startTo)}>Start with UX Thinking</a>
            {daily && (
              <a href="/daily" className="btn btn-ghost" onClick={e => onLinkClick(e, '/daily')}>Today's case #{daily.number}</a>
            )}
          </div>
        </div>
        <div className="hero__scene rise rise-2">
          <Suspense fallback={<div className="office office--loading" />}>
            <Office overview place={null} actors={[]} label={false} pins={pins} onPin={onLinkClick} frameShift={heroShift} frameY={isPhone ? 0.12 : 0} guide={guide} />
          </Suspense>
        </div>
        <PhoneActions startTo={startTo} daily={daily} />
      </section>

      {daily && (
        <section className="section">
          <a href="/daily" className="ticket rise" onClick={e => onLinkClick(e, '/daily')}>
            <div className="ticket__stub">
              <span className="label">Daily case</span>
              <b className="display">#{daily.number}</b>
              <span className="ticket__date">{new Date().toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}</span>
            </div>
            <div className="ticket__body">
              <div className="ticket__who">
                <Portrait id={daily.caseData.scene[0].who} mood={daily.caseData.scene[0].mood} size={52} />
                <div>
                  <h2 className="display">{daily.caseData.title}</h2>
                  <p className="muted">{getPerson(daily.caseData.scene[0].who).name} needs a decision · about a minute</p>
                </div>
              </div>
              <div className="ticket__cta">
                {dailyEntry
                  ? <span className={`tag tag--${dailyEntry.verdict}`}>You: {VERDICT[dailyEntry.verdict].label}</span>
                  : <span className="btn btn-primary btn-sm">Play today's case</span>}
                <span className="ticket__streak">{streak > 0 ? `🔥 ${streak}-day streak` : 'One case a day. Keep the streak.'}</span>
              </div>
            </div>
          </a>
        </section>
      )}

      <section className="section" id="tracks">
        <div className="section__head">
          <h2 className="display">Pick a track</h2>
          <p className="muted">Each one is a season in Launchly's story. Play them in any order.</p>
        </div>
        <div className="tracks">
          {tracks.map((t, i) => {
            const p = progressFor(t);
            const to = `/play/${t.id}`;
            const inner = (
              <>
                <div className="track__top">
                  <span className="track__num">Track {t.number}</span>
                  {!t.released && <span className="tag">Writing now</span>}
                </div>
                <h3 className="display track__title">{t.title}</h3>
                <span className="track__sub">{t.subtitle}</span>
                <p className="track__blurb">{t.blurb}</p>
                {t.released && (
                  <div className="track__foot">
                    <div className="track__bar"><span style={{ width: `${p.total ? (p.answered / p.total) * 100 : 0}%` }} /></div>
                    <span className="track__meta">{p.answered ? `${p.answered}/${p.total}` : `${caseCount(t)} cases · ${t.chapters.length} chapters`}</span>
                    <span className="track__cta">{p.complete ? 'Your profile →' : p.answered ? 'Continue →' : 'Start →'}</span>
                  </div>
                )}
              </>
            );
            return t.released ? (
              <a key={t.id} href={to} className="track rise" style={{ '--track': t.color, animationDelay: `${i * 60}ms` }} onClick={e => onLinkClick(e, to)}>{inner}</a>
            ) : (
              <div key={t.id} className="track track--soon" style={{ '--track': t.color }} aria-disabled="true">{inner}</div>
            );
          })}
        </div>
      </section>

      <section className="section">
        <div className="section__head">
          <h2 className="display">Meet the team</h2>
          <p className="muted">They all mean well. They all want something different from you.</p>
        </div>
        <div className="team">
          {TEAM.map(id => (
            <div className="person-card" key={id}>
              <Portrait id={id} mood="neutral" size={64} />
              <div>
                <b>{CAST[id].name}</b>
                <span className="label">{CAST[id].role}</span>
                <p>{CAST[id].trait}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <p>Made by <a href="https://www.linkedin.com/in/neelesh-agrawal-92472b278/" target="_blank" rel="noreferrer">Neelesh Agrawal</a> · part of <a href="https://ship69-hub.vercel.app/" target="_blank" rel="noreferrer">Ship69</a></p>
      </footer>
    </main>
  );
}
