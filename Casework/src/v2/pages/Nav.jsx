import { onLinkClick } from '../ui/router';

const LINKS = [
  { to: '/#tracks', label: 'Tracks', match: '/play' },
  { to: '/daily', label: 'Daily case', match: '/daily' },
  { to: '/me', label: 'Your desk', match: '/me' },
];

export default function Nav({ path, streak = 0, right = null }) {
  return (
    <header className="nav">
      <a href="/" className="wordmark" onClick={e => onLinkClick(e, '/')} aria-label="Casework home">
        <span className="wordmark__mark" aria-hidden="true">c</span>
        <span className="wordmark__text">casework</span>
      </a>
      <nav className="nav__links" aria-label="Main">
        {LINKS.map(l => (
          <a
            key={l.to}
            href={l.to}
            className={`nav__link ${path === l.match || path.startsWith(`${l.match}/`) ? 'is-active' : ''}`}
            aria-current={path === l.match || path.startsWith(`${l.match}/`) ? 'page' : undefined}
            onClick={e => {
              if (l.to.startsWith('/#')) {
                if (path === '/') { e.preventDefault(); document.getElementById('tracks')?.scrollIntoView({ behavior: 'smooth' }); }
                else onLinkClick(e, '/');
                return;
              }
              onLinkClick(e, l.to);
            }}
          >
            {l.label}
          </a>
        ))}
      </nav>
      <div className="nav__right">
        {right}
        {streak > 0 && (
          <a href="/me" className="streak-chip" onClick={e => onLinkClick(e, '/me')} title={`${streak}-day streak`}>
            <span aria-hidden="true">🔥</span> {streak}
          </a>
        )}
      </div>
    </header>
  );
}
