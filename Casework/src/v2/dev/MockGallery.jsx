// Dev-only: every hands-on mock and preview. Visit /dev/mocks.
import { PREVIEWS, SPOT_MOCKS } from '../ui/mocks';

export default function MockGallery() {
  return (
    <div style={{ padding: 24, display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
      {Object.entries(SPOT_MOCKS).map(([k, M]) => (
        <div key={k} className="stage" style={{ width: 480 }}>
          <span className="label" style={{ position: 'absolute', top: 4, left: 8 }}>{k}</span>
          <M />
        </div>
      ))}
      {Object.entries(PREVIEWS).map(([k, P]) => (
        <div key={k} className="compose-preview" style={{ width: 480 }}>
          <span className="label">{k}</span>
          <P values={{}} />
        </div>
      ))}
    </div>
  );
}
