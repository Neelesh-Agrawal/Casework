import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { ALL_TRACKS, DAILY_POOL, getTrack, trackCases, TRACKS } from './content';
import { loadStore } from './engine/store';
import { dateKey, pickDailyCase, previousDateKey } from './engine/daily';
import { track as trackEvent } from './engine/analytics';
import { match, usePath } from './ui/router';
import Nav from './pages/Nav';
import Home from './pages/Home';
import TrackRoom from './pages/TrackRoom';
import CasePage from './pages/CasePage';
import Playbook from './pages/Playbook';
import DailyPage from './pages/DailyPage';
import MePage from './pages/MePage';

const AdminPage = lazy(() => import('./pages/AdminPage'));

export default function App() {
  const path = usePath();
  const [store, setStore] = useState(loadStore);

  const daily = useMemo(() => {
    const pick = pickDailyCase(DAILY_POOL);
    return pick ? { number: pick.number, caseData: pick.entry } : null;
  }, []);

  // A streak only counts if the last daily was today or yesterday.
  const streak = store.daily.lastDate && store.daily.lastDate >= previousDateKey() ? store.daily.streak : 0;
  const dailyEntry = store.daily.history[dateKey()] || null;

  useEffect(() => { trackEvent('visit', {}, { once: 'visit' }); }, []);

  useEffect(() => {
    const titles = { '/daily': daily ? `Daily case #${daily.number} · Casework` : 'Daily case · Casework', '/me': 'Your desk · Casework', '/playbook': 'Your playbook · Casework', '/admin': 'Admin · Casework' };
    const play = match('/play/:track', path) || match('/play/:track/:case', path);
    const caseTitle = play?.case && getTrack(play.track)?.chapters.flatMap(ch => ch.cases).find(c => c.id === play.case)?.title;
    document.title = play
      ? `${caseTitle ? `${caseTitle} · ` : ''}${getTrack(play.track)?.title || 'Play'} · Casework`
      : titles[path] || 'Casework - learn design judgment from real situations';
  }, [path, daily]);

  const progressFor = (t) => {
    if (!t.released) return { answered: 0, total: 0, complete: false };
    const cases = trackCases(t);
    const answers = store.tracks[t.id]?.answers || {};
    const answered = cases.filter(c => answers[c.id]).length;
    return { answered, total: cases.length, complete: answered === cases.length };
  };
  const totalCases = TRACKS.reduce((n, t) => n + trackCases(t).length, 0) + DAILY_POOL.length;

  let page;
  const params = new URLSearchParams(window.location.search);
  const play = match('/play/:track', path);
  const playCase = match('/play/:track/:case', path);
  if (playCase) {
    const t = getTrack(playCase.track);
    const exists = t?.chapters.some(ch => ch.cases.some(c => c.id === playCase.case));
    page = exists
      ? <CasePage key={path + window.location.search} track={t} caseId={playCase.case} store={store} setStore={setStore} review={params.get('review') === '1'} />
      : <NotFound />;
  } else if (play) {
    const t = getTrack(play.track);
    const done = params.has('done') ? Number(params.get('done')) : null;
    page = t
      ? <TrackRoom key={t.id + (done ?? '')} track={t} store={store} setStore={setStore} doneChapter={Number.isInteger(done) ? done : null} />
      : <NotFound />;
  } else if (path === '/playbook') {
    page = <Playbook store={store} />;
  } else if (path === '/daily') {
    page = <DailyPage daily={daily} store={store} setStore={setStore} streak={streak} />;
  } else if (path === '/me') {
    page = <MePage store={store} tracks={ALL_TRACKS} streak={streak} />;
  } else if (path === '/admin') {
    page = <Suspense fallback={null}><AdminPage /></Suspense>;
  } else if (path === '/') {
    page = <Home tracks={ALL_TRACKS} progressFor={progressFor} daily={daily} dailyEntry={dailyEntry} streak={streak} totalCases={totalCases} />;
  } else {
    page = <NotFound />;
  }

  return (
    <>
      <Nav path={path} streak={streak} />
      {page}
    </>
  );
}

function NotFound() {
  return (
    <main className="page page--narrow">
      <h1 className="display page-title">This room doesn't exist.</h1>
      <p className="muted">Even Launchly's office has limits. <a href="/" className="link">Back to the lobby →</a></p>
    </main>
  );
}
