// Mocks for the UX Thinking track (beyond the original signup form and cancel flow).

function ProjectCard() {
  return (
    <div style={{ background: '#F1F5F9', padding: 16, borderRadius: 14, width: '100%', maxWidth: 360 }}>
      <div className="mock m-page" style={{ gap: 0 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ width: 18, height: 18, borderRadius: 5, background: '#FF6B2C' }} />
          <b style={{ fontSize: 18, color: '#0F172A' }}>Q4 Website Launch</b>
        </div>
        <div data-hotspot="contrast" style={{ fontSize: 12, color: '#B8B8B8', marginTop: 4 }}>New marketing site, pricing page and launch email.</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#166534', background: '#DCFCE7', padding: '3px 8px', borderRadius: 99 }}>✓ On track</span>
          <span style={{ display: 'flex', marginLeft: 6 }}>
            {['#F4B79A', '#A9C7EE', '#C8E6C9', '#F2D58A'].map((c, i) => <i key={c} style={{ width: 20, height: 20, borderRadius: 20, background: c, border: '2px solid #fff', marginLeft: i ? -6 : 0 }} />)}
            <span style={{ fontSize: 11, color: '#475569', alignSelf: 'center', marginLeft: 4 }}>+3</span>
          </span>
        </div>
        <div style={{ marginTop: 12, height: 6, borderRadius: 6, background: '#E2E8F0' }}>
          <div style={{ width: '68%', height: '100%', borderRadius: 6, background: '#FF6B2C' }} />
        </div>
        <div style={{ fontSize: 11, color: '#334155', marginTop: 4 }}>68% complete</div>
        <div data-hotspot="proximity" style={{ marginTop: 4 }}>
          <div style={{ fontSize: 10, color: '#64748B' }}>Due</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A', marginTop: 16 }}>Fri 14 Nov</div>
        </div>
        <div data-hotspot="align" style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 12, fontSize: 11, color: '#475569' }}>
          <span>Tasks <b style={{ color: '#0F172A' }}>42</b></span>·<span>Open <b style={{ color: '#0F172A' }}>11</b></span>·<span>Comments <b style={{ color: '#0F172A' }}>7</b></span>
        </div>
        <div data-hotspot="buttons" style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          {['Open project', 'Archive'].map(l => (
            <span key={l} style={{ flex: 1, height: 34, borderRadius: 8, background: '#C2410C', color: '#fff', fontSize: 12, fontWeight: 700, display: 'grid', placeItems: 'center' }}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export const UX_MOCKS = {
  'project-card': ProjectCard,
};
