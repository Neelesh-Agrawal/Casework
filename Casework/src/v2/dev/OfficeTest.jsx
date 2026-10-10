// Dev-only: walk the camera through every room with sample actors. Visit /dev/office.
import { useState } from 'react';
import Office from '../scene/Office';
import { ROOMS } from '../scene/rooms';

export default function OfficeTest() {
  const places = Object.keys(ROOMS);
  const [i, setI] = useState(0);
  const [overview, setOverview] = useState(false);
  const place = places[i];
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: 8, display: 'flex', gap: 8, flexWrap: 'wrap', fontFamily: 'system-ui', fontSize: 12 }}>
        {places.map((p, n) => <button key={p} onClick={() => { setI(n); setOverview(false); }} style={{ fontWeight: n === i ? 700 : 400 }}>{p}</button>)}
        <button onClick={() => setOverview(o => !o)}>overview</button>
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        <Office
          place={place}
          overview={overview}
          actors={[{ id: 'rhea', mood: 'annoyed', talking: true }, { id: 'priya', mood: 'worried' }, { id: 'jonas', mood: 'thinking' }]}
          bubble={{ index: 0, text: 'Sales says half our signups are students and tire-kickers. Add three fields today.' }}
        />
      </div>
    </div>
  );
}
