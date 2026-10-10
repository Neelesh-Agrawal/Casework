// A single lesson inside a track. Next goes to the next case; the end of a chapter goes back to the
// track page, which shows the chapter summary.
import { useCallback } from 'react';
import Lesson from '../player/Lesson';
import { saveAnswer } from '../engine/store';
import { track as trackEvent } from '../engine/analytics';
import { navigate, onLinkClick } from '../ui/router';

export default function CasePage({ track, caseId, store, setStore, review }) {
  const answers = store.tracks[track.id]?.answers || {};
  const chapterIdx = track.chapters.findIndex(ch => ch.cases.some(c => c.id === caseId));
  const chapter = track.chapters[chapterIdx];
  const caseIdx = chapter.cases.findIndex(c => c.id === caseId);
  const caseData = chapter.cases[caseIdx];
  const isLast = caseIdx === chapter.cases.length - 1;

  const onView = useCallback((id) => trackEvent('case_view', { track: track.id, case: id }, { once: id }), [track.id]);

  const next = () => {
    if (review) {
      // Review mode walks through every case still worth another try, then returns to the playbook.
      const pending = Object.entries(store.tracks)
        .flatMap(([tid, t]) => Object.entries(t.answers || {}).map(([cid, a]) => ({ tid, cid, a })))
        .filter(x => x.a.verdict !== 'strong' && x.cid !== caseId);
      return navigate(pending.length ? `/play/${pending[0].tid}/${pending[0].cid}?review=1` : '/playbook');
    }
    if (!isLast) return navigate(`/play/${track.id}/${chapter.cases[caseIdx + 1].id}`);
    trackEvent('chapter_done', { track: track.id, ch: chapterIdx + 1 }, { once: `${track.id}-${chapterIdx}` });
    return navigate(`/play/${track.id}?done=${chapterIdx}`);
  };

  const header = (
    <nav className="crumbs" aria-label="Breadcrumb">
      <a href={`/play/${track.id}`} onClick={e => onLinkClick(e, `/play/${track.id}`)}>{track.title}</a>
      <span className="muted">Chapter {chapterIdx + 1} · {chapter.title}</span>
      <span className="crumbs__dots" aria-hidden="true">
        {chapter.cases.map((c, i) => <i key={c.id} className={`${answers[c.id] ? `is-${answers[c.id].verdict}` : ''} ${i === caseIdx ? 'is-here' : ''}`} />)}
      </span>
    </nav>
  );

  return (
    <Lesson
      key={`${caseData.id}-${review ? 'r' : ''}`}
      caseData={caseData}
      kicker={review ? `Review · ${track.title}` : `Case ${caseIdx + 1} of ${chapter.cases.length}`}
      priorAnswer={answers[caseData.id]}
      review={review}
      header={header}
      onView={onView}
      nextLabel={review ? 'Next review' : isLast ? 'Finish chapter' : 'Next case'}
      onResolved={(answer) => {
        setStore(saveAnswer(track.id, caseData.id, answer));
        trackEvent('case_answer', { track: track.id, case: caseData.id, verdict: answer.verdict });
      }}
      onNext={next}
    />
  );
}
