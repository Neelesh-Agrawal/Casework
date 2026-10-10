// Mocks for the Visual Foundations track. Colours are exact: contrast ratios in the cases depend on them.

function BillingSettings() {
  return (
    <div className="mock m-page" style={{ maxWidth: 440 }}>
      <div style={{ fontSize: 26, fontWeight: 700, color: '#111827' }}>Billing</div>
      <div style={{ fontSize: 14, color: '#374151', marginTop: 2 }}>Manage your plan and payment details.</div>
      <div className="m-box" style={{ marginTop: 14 }}>
        <div style={{ fontSize: 12, color: '#6B7280' }}>Current plan</div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#111827' }}>Team</div>
          <span data-hotspot="orange-link" style={{ fontSize: 13, color: '#FF6B00', fontWeight: 600 }}>Upgrade plan →</span>
        </div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginTop: 16 }}>Payment method</div>
      <div data-hotspot="input-border" style={{ height: 38, border: '1px solid #E5E7EB', borderRadius: 6, marginTop: 6, display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: 13, color: '#111827' }}>•••• •••• •••• 4242</div>
      <div data-hotspot="helper-text" style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>We charge this card on the 1st of each month.</div>
      <table className="m-table" style={{ marginTop: 14 }}>
        <thead><tr><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
        <tbody>
          {[['1 Oct', '$96.00', '#16A34A'], ['1 Sep', '$96.00', '#DC2626'], ['1 Aug', '$96.00', '#16A34A']].map(([d, a, c]) => (
            <tr key={d}>
              <td>{d}</td><td>{a}</td>
              <td><span data-hotspot="status-dot" style={{ display: 'inline-block', width: 9, height: 9, borderRadius: 9, background: c }} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
        <span title="Select invoices first" style={{ fontSize: 12, padding: '6px 10px', borderRadius: 6, background: '#F3F4F6', color: '#C4C8CF' }}>Download all</span>
        <span style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#2563EB', fontWeight: 600 }}>Cancel</span>
          <span style={{ fontSize: 13, color: '#fff', background: '#0057B7', padding: '8px 12px', borderRadius: 6, fontWeight: 600 }}>Save changes</span>
        </span>
      </div>
    </div>
  );
}

function HelpArticle() {
  return (
    <div className="mock m-page" style={{ maxWidth: 560 }}>
      <div style={{ fontSize: 11, color: '#6B7280' }}>Help › Tasks</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: '4px 0 8px' }}>Setting up recurring tasks</div>
      <p data-hotspot="measure" style={{ fontSize: 11, lineHeight: 1.5, color: '#1F2937' }}>
        Recurring tasks let you schedule work that repeats, like weekly reports, monthly invoices or a daily stand-up note, so you never have to recreate them by hand and nothing slips through the cracks when the team gets busy.
      </p>
      <p data-hotspot="justify" style={{ fontSize: 11, lineHeight: 1.5, color: '#1F2937', textAlign: 'justify', width: 210, marginTop: 8, wordSpacing: 4 }}>
        Each repeat rule creates a fresh copy of the task on its schedule. Edits apply forward only.
      </p>
      <div data-hotspot="subheads" style={{ marginTop: 10 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: '#374151' }}>Create a repeat rule</div>
        <div style={{ fontSize: 15, fontWeight: 600, fontStyle: 'italic', color: '#111827', marginTop: 6 }}>Edit a series</div>
        <div style={{ fontSize: 18, fontWeight: 500, color: '#FF6B00', marginTop: 6 }}>Stop repeating</div>
      </div>
      <ol style={{ fontSize: 11, color: '#1F2937', paddingLeft: 18, marginTop: 8, lineHeight: 1.6 }}>
        <li>Open the task</li><li>Click Repeat</li><li>Choose a rule, e.g. <code style={{ background: '#F3F4F6', padding: '1px 4px', borderRadius: 4, fontSize: 10 }}>every 2 weeks on Monday</code></li><li>Save</li>
      </ol>
      <p data-hotspot="note" style={{ fontSize: 10, fontWeight: 300, fontStyle: 'italic', color: '#9CA3AF', marginTop: 8 }}>
        Note: repeats use the time zone of the person who created the rule, not yours.
      </p>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 12, fontSize: 11, color: '#374151' }}>
        Was this helpful? <span className="m-chip">Yes</span><span className="m-chip">No</span>
      </div>
    </div>
  );
}

function ProfileSettings() {
  const field = (label, extra = {}) => (
    <div style={{ marginTop: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 16 }}>{label}</div>
      <div style={{ height: 34, border: '1px solid #CBD5E1', borderRadius: 6, ...extra }} />
    </div>
  );
  return (
    <div className="mock m-page" style={{ maxWidth: 400 }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#111827' }}>Profile</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12 }}>
        <span style={{ width: 44, height: 44, borderRadius: 44, background: '#FBD3B9' }} />
        <span style={{ fontSize: 13, color: '#2563EB', fontWeight: 600 }}>Change photo</span>
      </div>
      <div data-hotspot="label-gap">
        {field('Name')}
        {field('Email')}
        <div style={{ fontSize: 11, color: '#6B7280', marginTop: 4 }}>We'll send login links here.</div>
        {field('Job title')}
      </div>
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Bio</div>
        <div data-hotspot="indent" style={{ height: 52, border: '1px solid #CBD5E1', borderRadius: 6, marginLeft: 6 }} />
      </div>
      <div data-hotspot="section-gap" style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginTop: 16 }}>Notifications</div>
      {['Mentions', 'Weekly digest', 'Product news'].map((n, i) => (
        <div key={n} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, fontSize: 12, color: '#374151' }}>
          {n}<span style={{ width: 28, height: 16, borderRadius: 16, background: i < 2 ? '#2563EB' : '#CBD5E1' }} />
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8, marginTop: 16 }}>
        <span style={{ height: 40, padding: '0 14px', display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: 6, fontSize: 13 }}>Cancel</span>
        <span data-hotspot="button-height" style={{ height: 28, padding: '4px 14px', display: 'flex', alignItems: 'center', background: '#111827', color: '#fff', borderRadius: 6, fontSize: 13 }}>Save</span>
      </div>
    </div>
  );
}

export const VISUAL_MOCKS = {
  'billing-settings': BillingSettings,
  'help-article': HelpArticle,
  'profile-settings': ProfileSettings,
};
