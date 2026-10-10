// Mocks for the Designing for AI track.

function Sparkle() {
  return <span style={{ color: '#7A5AF8', fontSize: 12 }}>✦</span>;
}

function AIAnswerCard() {
  return (
    <div className="mock m-page" style={{ maxWidth: 360 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6B7280' }}>
        <b style={{ color: '#111827' }}>Atlas Website</b><span>Updated 2 min ago</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
        <span style={{ fontSize: 16, fontWeight: 700 }}>Weekly status update</span>
        <span data-hotspot="confidence" style={{ fontSize: 10, fontWeight: 700, color: '#166534', background: '#DCFCE7', padding: '2px 8px', borderRadius: 99 }}>98% accurate</span>
      </div>
      <div data-hotspot="ailabel" style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: 11, color: '#6B7280' }}>
        <span style={{ width: 18, height: 18, borderRadius: 18, background: '#2F4A7A' }} /> by Marcus Webb
      </div>
      <div data-hotspot="sources" style={{ fontSize: 12, lineHeight: 1.55, color: '#1F2937', marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <p>Design is complete and engineering finished the checkout flow this week.</p>
        <p>QA found two minor issues, both fixed. <b>Launching 14 March.</b></p>
        <p>No blockers. The client review is scheduled for Thursday.</p>
      </div>
      <div style={{ fontSize: 10, color: '#6B7280', marginTop: 8 }}>Based on 48 tasks updated this week</div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 10, fontSize: 13 }}>
        <span>👍</span><span>👎</span><span className="m-chip" style={{ marginLeft: 'auto' }}>⧉ Copy</span>
      </div>
      <div data-hotspot="noedit" style={{ marginTop: 10, height: 38, borderRadius: 8, background: '#FF6B2C', color: '#fff', fontWeight: 700, fontSize: 13, display: 'grid', placeItems: 'center' }}>Send to client</div>
    </div>
  );
}

function AgentConfirmDialog() {
  return (
    <div style={{ background: 'rgba(15,23,42,0.35)', padding: 16, borderRadius: 14, width: '100%', maxWidth: 420 }}>
      <div className="mock m-page" style={{ maxWidth: 400 }}>
        <div style={{ fontSize: 11, color: '#6B7280' }}>You asked: tidy up the Q3 board and tell people what changed</div>
        <div data-hotspot="vague" style={{ fontSize: 17, fontWeight: 700, marginTop: 6 }}>Make changes to your workspace?</div>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 }}>
          {[['Fix login bug', 'In progress', 'Done'], ['Pricing copy', 'Review', 'Done'], ['Onboarding email', 'Backlog', 'In progress']].map(([t, a, b]) => (
            <div key={t} style={{ display: 'grid', gridTemplateColumns: '1fr auto', padding: '6px 8px', borderRadius: 6, background: '#F8FAFC' }}>
              <span>{t}</span><span style={{ color: '#6B7280' }}>{a} → <b style={{ color: '#111827' }}>{b}</b></span>
            </div>
          ))}
          <div data-hotspot="hidden" style={{ padding: '6px 8px', borderRadius: 6, background: '#F1F5F9', color: '#6B7280' }}>
            ▸ + 3 other actions
            <div style={{ fontSize: 10, marginTop: 4, color: '#94A3B8' }}>Message 14 people · Archive 22 tasks · …</div>
          </div>
          <div data-hotspot="external" style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '4px 8px', fontSize: 11, color: '#6B7280' }}>
            To: {['#F4B79A', '#C8E6C9', '#A9C7EE', '#F2D58A'].map(c => <span key={c} style={{ width: 18, height: 18, borderRadius: 18, background: c }} />)}
            <span>Ana, Jonas, Priya, tom.hale@northwind-client.com +10</span>
          </div>
        </div>
        <div style={{ fontSize: 11, color: '#6B7280', marginTop: 8 }}>Moves and archives can be undone for 24 hours.</div>
        <div data-hotspot="autoallow" style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, marginTop: 8 }}>
          <span style={{ width: 14, height: 14, borderRadius: 4, background: '#FF6B2C', color: '#fff', fontSize: 9, display: 'grid', placeItems: 'center' }}>✓</span>
          Always allow the agent to do this without asking
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
          <span style={{ height: 36, padding: '0 16px', display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>Cancel</span>
          <span style={{ height: 36, padding: '0 16px', display: 'flex', alignItems: 'center', background: '#FF6B2C', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 700 }}>Approve all</span>
        </div>
      </div>
    </div>
  );
}

function AIUncertainAnswer({ values }) {
  const empty = (t) => <span className="mock-empty">{t}</span>;
  return (
    <div className="mock m-page" style={{ maxWidth: 360 }}>
      <div style={{ alignSelf: 'flex-end', marginLeft: 'auto', maxWidth: 260, background: '#F1F5F9', borderRadius: 12, padding: '8px 12px', fontSize: 13 }}>
        Is Atlas on track to launch on the 14th?
      </div>
      <div style={{ marginTop: 12, border: '1px solid #E2E8F0', borderRadius: 12, padding: 14 }}>
        <div style={{ fontSize: 11, color: '#6B7280', display: 'flex', gap: 4, alignItems: 'center' }}><Sparkle /> Launchly AI</div>
        <div style={{ fontWeight: 700, fontSize: 15, marginTop: 6, minHeight: 22 }}>{values.headline || empty('Pick a headline…')}</div>
        <div style={{ fontSize: 13, color: '#475569', marginTop: 4, lineHeight: 1.5, minHeight: 40 }}>{values.body || empty('Pick an explanation…')}</div>
        <span style={{ display: 'inline-flex', marginTop: 10, height: 32, padding: '0 12px', alignItems: 'center', borderRadius: 8, background: '#0F172A', color: '#fff', fontSize: 12, fontWeight: 600 }}>{values.action || '…'}</span>
      </div>
      <div style={{ display: 'flex', gap: 8, fontSize: 12, color: '#6B7280', marginTop: 8, alignItems: 'center' }}>
        <span>👍</span><span>👎</span><span style={{ marginLeft: 'auto' }}>Based on 35 tasks in Atlas</span>
      </div>
    </div>
  );
}

export const AI_MOCKS = {
  'ai-answer-card': AIAnswerCard,
  'agent-confirm-dialog': AgentConfirmDialog,
};

export const AI_PREVIEWS = {
  'ai-uncertain-answer': AIUncertainAnswer,
};
