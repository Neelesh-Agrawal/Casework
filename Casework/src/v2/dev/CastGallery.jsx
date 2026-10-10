// Dev-only: every cast member in every mood, for checking the illustrations. Visit /dev/cast.
import Character from '../ui/Character';

const IDS = ['rhea', 'priya', 'marcus', 'jonas', 'ana', 'kofi', 'lena', 'sam', 'dana'];
const MOODS = ['neutral', 'happy', 'worried', 'annoyed', 'thinking', 'excited'];

export default function CastGallery() {
  const params = new URLSearchParams(window.location.search);
  const only = params.get('id');
  const size = Number(params.get('size')) || 84;
  if (only) {
    return (
      <div style={{ padding: 24, background: '#F3EDE2', minHeight: '100vh', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {MOODS.map(m => <Character key={m} id={only} mood={m} size={size} />)}
      </div>
    );
  }
  return (
    <div style={{ padding: 24, background: '#F3EDE2', minHeight: '100vh', fontFamily: 'system-ui' }}>
      {IDS.map(id => (
        <div key={id} style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginBottom: 16 }}>
          <b style={{ width: 70 }}>{id}</b>
          {MOODS.map(m => (
            <div key={m} style={{ textAlign: 'center', fontSize: 10 }}>
              <Character id={id} mood={m} size={84} talking={m === 'excited'} />
              <div>{m}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
