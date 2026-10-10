// Mocks for the UI Craft track.

const MEMBERS = [
  ['Maya Klein', 'maya.klein@acme-industries.co', 'Admin', '#16A34A', '3', '2 days ago', '#F4B79A'],
  ['Omar Haddad', 'omar@acme.co', 'Editor', '#F59E0B', '12', '5 hours ago', '#A9C7EE'],
  ['Lin Zhou', 'lin.zhou@acme-industries.co', 'Editor', '#DC2626', '140', '3 weeks ago', '#C8E6C9'],
  ['Sara Ali', 'sara@acme.co', 'Viewer', '#16A34A', '7', 'Just now', '#F2D58A'],
];

function MembersTable() {
  return (
    <div className="mock m-page" style={{ maxWidth: 560 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <b style={{ fontSize: 15 }}>Members (40)</b>
        <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', fontSize: 9, color: '#475569' }}>
          Search members
          <span style={{ width: 120, height: 26, border: '1px solid #CBD5E1', borderRadius: 6 }} />
        </div>
        <span style={{ alignSelf: 'flex-end', height: 28, padding: '0 10px', display: 'flex', alignItems: 'center', background: '#FF6B2C', color: '#fff', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>Invite member</span>
      </div>
      <table className="m-table" style={{ marginTop: 10, fontSize: 10.5, tableLayout: 'fixed' }}>
        <thead>
          <tr>
            <th style={{ width: 18 }}><span style={{ display: 'inline-block', width: 10, height: 10, border: '1px solid #94A3B8', borderRadius: 2 }} /></th>
            <th style={{ width: 92 }}>Name</th><th>Email</th><th data-hotspot="sortcue" style={{ width: 44 }}>Role</th>
            <th style={{ width: 40 }}>Status</th><th style={{ width: 42 }}>Seats used</th><th style={{ width: 62 }}>Last active</th>
          </tr>
        </thead>
        <tbody>
          {MEMBERS.map(([n, e, r, c, s, l, av], i) => (
            <tr key={n} style={{ background: i === 1 ? '#F8FAFC' : undefined }}>
              <td><span style={{ display: 'inline-block', width: 10, height: 10, border: '1px solid #94A3B8', borderRadius: 2 }} /></td>
              <td><span style={{ display: 'inline-flex', gap: 4, alignItems: 'center', whiteSpace: 'nowrap' }}><i style={{ width: 14, height: 14, borderRadius: 14, background: av }} />{n}</span></td>
              <td title={e} style={{ position: 'relative', overflow: i === 2 ? 'visible' : 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e}</span>
                {i === 2 && <span style={{ position: 'absolute', left: 0, top: '100%', zIndex: 2, padding: '3px 6px', borderRadius: 4, background: '#0F172A', color: '#fff', fontSize: 9, whiteSpace: 'nowrap' }}>{e}</span>}
              </td>
              <td>{r}</td>
              <td><span data-hotspot={i === 0 ? 'colouronly' : undefined} style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 8, background: c }} /></td>
              <td data-hotspot={i === 1 ? 'numbers' : undefined} style={{ textAlign: 'left' }}>{s}</td>
              <td style={{ position: 'relative', whiteSpace: 'nowrap' }}>
                {l}
                {i === 1 && (
                  <span data-hotspot="hoveractions" style={{ position: 'absolute', right: 0, top: 2, display: 'flex', gap: 4, background: '#F8FAFC', fontSize: 9, color: '#2563EB' }}>
                    <span>Edit role</span><span style={{ color: '#DC2626' }}>Remove</span>
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ fontSize: 9, color: '#64748B', marginTop: 4 }}>↳ Row actions appear on mouse hover (row 2 shown hovered)</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, fontSize: 11, color: '#475569' }}>
        Showing 1-20 of 40
        <span style={{ display: 'flex', gap: 6 }}><span className="m-chip">Previous</span><span className="m-chip">Next</span></span>
      </div>
    </div>
  );
}

function Field({ label = 'Email', value, border = '#CBD5E1', button = {}, extra }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, fontSize: 9, color: '#475569' }}>
        {label}
        <span style={{ width: 150, height: 26, border: `1px solid ${border}`, borderRadius: 6, display: 'flex', alignItems: 'center', padding: '0 7px', fontSize: 11, color: '#0F172A', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', ...extra }}>{value}</span>
      </div>
      <span style={{ height: 26, padding: '0 9px', display: 'flex', alignItems: 'center', borderRadius: 6, fontSize: 10, fontWeight: 700, background: '#FF6B2C', color: '#fff', whiteSpace: 'nowrap', ...button }}>Send invite</span>
    </div>
  );
}

function InviteFieldStates() {
  const row = (name, content, hs) => (
    <div key={name} data-hotspot={hs} style={{ display: 'grid', gridTemplateColumns: '64px 1fr', alignItems: 'center', gap: 10, padding: '6px 0', borderTop: '1px dashed #E2E8F0' }}>
      <span style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>{name}</span>
      {content}
    </div>
  );
  return (
    <div className="mock m-page" style={{ maxWidth: 380, background: '#FAFAF9' }}>
      <b style={{ fontSize: 13, marginBottom: 6 }}>Invite field: states</b>
      {row('Default', <Field />)}
      {row('Hover', <Field border="#475569" />)}
      {row('Focus', <Field />, 'focus')}
      {row('Filled', <Field value="maya@acme.co" />)}
      {row('Error', <Field value="maya@acme" border="#DC2626" />, 'errortext')}
      {row('Sending', <Field value="maya@acme.co" />, 'loading')}
      {row('Sent', (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Field />
          <span style={{ background: '#FFF3B8', padding: '4px 6px', fontSize: 9, lineHeight: 1.1, transform: 'rotate(2deg)', maxWidth: 70 }}>Field just clears, nothing else</span>
        </div>
      ), 'success')}
      {row('Disabled', (
        <div>
          <Field button={{ background: '#E2E8F0', color: '#94A3B8' }} extra={{ background: '#F1F5F9' }} />
          <div style={{ fontSize: 9, color: '#64748B', marginTop: 2 }}>Only admins can invite teammates</div>
        </div>
      ))}
      {row('Long text', (
        <div>
          <Field value="maya.klein.product.operations@acme-industries-holdings.co" />
          <div style={{ fontSize: 9, color: '#64748B', marginTop: 2 }}>Full address shown on focus and in a tooltip</div>
        </div>
      ))}
    </div>
  );
}

function RemoveMemberDialog({ values }) {
  const empty = (t) => <span className="mock-empty">{t}</span>;
  return (
    <div style={{ background: 'rgba(15,23,42,0.35)', padding: 16, borderRadius: 14, width: '100%', maxWidth: 420 }}>
      <div className="mock m-page" style={{ maxWidth: 400 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
          <b style={{ fontSize: 16 }}>{values.headline || empty('Pick a title…')}</b>
          <span style={{ color: '#94A3B8' }}>✕</span>
        </div>
        <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, marginTop: 6, minHeight: 38 }}>{values.body || empty('Pick the body text…')}</p>
        <div style={{ fontSize: 11, color: '#334155', marginTop: 10 }}>Type Maya Klein to confirm</div>
        <div style={{ height: 34, border: '1px solid #CBD5E1', borderRadius: 6, marginTop: 4 }} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 14 }}>
          <span style={{ height: 34, padding: '0 14px', display: 'flex', alignItems: 'center', background: '#F1F5F9', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>Cancel</span>
          <span style={{ height: 34, padding: '0 14px', display: 'flex', alignItems: 'center', background: '#DC2626', color: '#fff', opacity: 0.55, borderRadius: 8, fontSize: 13, fontWeight: 700 }}>{values.confirm || '…'}</span>
        </div>
      </div>
    </div>
  );
}

export const CRAFT_MOCKS = {
  'members-table': MembersTable,
  'invite-field-states': InviteFieldStates,
};

export const CRAFT_PREVIEWS = {
  'remove-member-dialog': RemoveMemberDialog,
};
