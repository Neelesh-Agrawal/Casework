// Mocks for the Systems Thinking track.

const REF = { background: '#F26B1D', color: '#fff', fontSize: 13, fontWeight: 600, borderRadius: 8, height: 40, padding: '0 14px' };

function Btn({ page, style, children, hotspot }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
      <span style={{ fontSize: 10, color: '#6B7280' }}>{page}</span>
      <span data-hotspot={hotspot} style={{ display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap', ...REF, ...style }}>{children}</span>
    </div>
  );
}

function ButtonInventory() {
  return (
    <div className="mock m-page" style={{ maxWidth: 460, background: '#F3F4F6' }}>
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Buttons in production: 9 of 12</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: '16px 14px', justifyContent: 'start' }}>
        <Btn page="Dashboard">Create project</Btn>
        <Btn page="Settings">Save changes</Btn>
        <Btn page="Team page" hotspot="off-orange" style={{ background: '#F47A2E' }}>Invite teammates</Btn>
        <Btn page="Settings" style={{ background: '#DC2626' }}>Delete project</Btn>
        <Btn page="Reports" hotspot="pill" style={{ borderRadius: 20 }}>Export CSV</Btn>
        <Btn page="Modal" style={{ background: '#fff', color: '#374151', border: '1px solid #D1D5DB' }}>Cancel</Btn>
        <Btn page="Onboarding" hotspot="short" style={{ height: 32, fontSize: 12 }}>Next step</Btn>
        <Btn page="Billing" style={{ background: 'transparent', color: '#F26B1D', padding: 0 }}>Learn more</Btn>
        <Btn page="Contact" hotspot="caps" style={{ textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: 11 }}>Submit form</Btn>
      </div>
    </div>
  );
}

const ROWS = [
  ['--orange-500', '#FF5A1F', 'Palette'],
  ['--red-600', '#DC2626', 'Palette'],
  ['--color-action', '{orange-500}', 'Buttons, links'],
  ['--color-big-orange', '#FF5A1F', 'Primary button background', 'value-name'],
  ['--color-danger', '{red-600}', 'Delete, errors'],
  ['--color-text-primary', '#1F2937', 'Body text'],
  ['--text-default', '#1F2937', 'Body text', 'duplicate'],
  ['--color-surface', 'light #FFFFFF / dark #17171C', 'Page and card background'],
  ['--space-8', '8px', 'Gaps'],
  ['--space-13', '13px', 'Settings page', 'off-scale'],
  ['--space-16', '16px', 'Gaps'],
  ['--fontSizeLarge', '20px', 'Section titles', 'case'],
  ['--radius-full', '999px', 'Pills, avatars'],
];

function TokenTable() {
  return (
    <div className="mock m-page" style={{ maxWidth: 480 }}>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Launchly tokens, draft v0.3</div>
      <table className="m-table" style={{ fontSize: 11 }}>
        <thead><tr><th>Name</th><th>Value</th><th>Used for</th></tr></thead>
        <tbody>
          {ROWS.map(([n, v, u, hs]) => (
            <tr key={n} data-hotspot={hs}>
              <td style={{ fontFamily: 'ui-monospace, monospace', whiteSpace: 'nowrap' }}>{n}</td>
              <td style={{ fontFamily: 'ui-monospace, monospace', color: '#475569' }}>
                {v.startsWith('#') && <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: v, marginRight: 4 }} />}
                {v}
              </td>
              <td style={{ color: '#475569' }}>{u}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DeprecationNotice({ values }) {
  const empty = (t) => <span className="mock-empty">{t}</span>;
  return (
    <div className="mock m-page" style={{ maxWidth: 420 }}>
      <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 8 }}># design-system</div>
      <div style={{ display: 'flex', gap: 10 }}>
        <span style={{ width: 32, height: 32, borderRadius: 8, background: '#D6457A', flex: 'none' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12 }}><b>Launchly Design System</b> <span style={{ fontSize: 9, background: '#E2E8F0', padding: '1px 4px', borderRadius: 3 }}>APP</span> <span style={{ color: '#94A3B8' }}>10:02</span></div>
          <div style={{ borderLeft: '3px solid #E0A423', paddingLeft: 10, marginTop: 6, display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12, lineHeight: 1.45 }}>
            <b style={{ fontSize: 13 }}>{values.headline || empty('Pick a headline…')}</b>
            <span>{values.why || empty('Why…')}</span>
            <span>{values.action || empty('What to do…')}</span>
            <span style={{ color: '#475569' }}>{values.help || empty('Help…')}</span>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8, fontSize: 11 }}>
            <span className="m-chip">👀 6</span><span className="m-chip">🙏 3</span><span style={{ color: '#2563EB', fontWeight: 600, alignSelf: 'center' }}>4 replies</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export const SYSTEMS_MOCKS = {
  'button-inventory': ButtonInventory,
  'token-table': TokenTable,
};

export const SYSTEMS_PREVIEWS = {
  'deprecation-notice': DeprecationNotice,
};
