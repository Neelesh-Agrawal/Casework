import { Component } from 'react';

// Progress lives in localStorage, so recovering is just a reload — nothing is lost.
export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error, info) {
    console.error('Casework crashed:', error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="page" style={{ textAlign: 'center', paddingTop: 120 }}>
        <div className="cw-bg" />
        <span className="kicker">Something broke</span>
        <h1 className="case__title" style={{ marginTop: 10 }}>That one's on us.</h1>
        <p style={{ color: 'var(--text-2)', marginTop: 12 }}>Your progress is saved. Reload and you'll pick up where you left off.</p>
        <button type="button" className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => window.location.reload()}>
          Reload Casework
        </button>
      </div>
    );
  }
}
