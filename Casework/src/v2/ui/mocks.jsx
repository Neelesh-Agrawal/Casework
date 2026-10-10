import { VISUAL_MOCKS } from './mocks/visual';
import { AI_MOCKS, AI_PREVIEWS } from './mocks/ai';
import { SYSTEMS_MOCKS, SYSTEMS_PREVIEWS } from './mocks/systems';
import { CRAFT_MOCKS, CRAFT_PREVIEWS } from './mocks/craft';
import { UX_MOCKS } from './mocks/ux';

// Realistic product surfaces used by hands-on cases.
// Spot mocks mark problem areas with data-hotspot="<id>"; everything else counts as a miss.

function SignupForm() {
  return (
    <div className="mock mock-signup">
      <div className="mock-logo"><i />launchly</div>
      <div>
        <div className="mock-h">Create your account</div>
      </div>
      <div className="mock-sub">Free for teams up to 5. No card needed.</div>
      <div className="mock-google"><i />Continue with Google</div>
      <div className="mock-or">or</div>
      <div className="mock-input" data-hotspot="labels">maya.k@gmail.co</div>
      <div className="mock-input mock-input--ph" data-hotspot="confirm">Confirm email</div>
      <div className="mock-input mock-input--err" data-hotspot="labels">••••••••</div>
      <div className="mock-err" data-hotspot="pwrules">Password does not meet requirements.</div>
      <div className="mock-terms"><i />I agree to the <u>Terms</u> and <u>Privacy Policy</u></div>
      <div className="mock-cta" data-hotspot="cta">Create account</div>
      <div className="mock-foot">Already have an account? <b>Log in</b></div>
    </div>
  );
}

function UploadError({ values }) {
  const empty = (text) => <span className="mock-empty">{text}</span>;
  return (
    <div className="mock mock-dialog" role="img" aria-label="Preview of the error dialog">
      <div className="mock-dialog__icon">⚠️</div>
      <div className="mock-dialog__file">
        <span>📄</span> Q3-roadmap-final-v4.pdf <small>41 MB</small>
      </div>
      <div className="mock-dialog__h">{values.headline || empty('Pick a headline…')}</div>
      <div className="mock-dialog__p">{values.body || empty('Pick an explanation…')}</div>
      <div className="mock-dialog__actions">
        <span className="mock-btn mock-btn--ghost">Cancel</span>
        <span className="mock-btn mock-btn--primary">{values.action || '…'}</span>
      </div>
    </div>
  );
}

function CancelFlow() {
  return (
    <div className="mock mock-cancel">
      <div className="mock-logo"><i />launchly</div>
      <div className="mock-h">We're sorry to see you go</div>
      <div className="mock-plan">
        <div><b>Team plan</b><span>12 members · renews 3 Nov</span></div>
        <strong>$96/mo</strong>
      </div>
      <div className="mock-field-label">Why are you leaving? <span>(optional)</span></div>
      <div className="mock-select">Choose a reason <i>▾</i></div>
      <div className="mock-check" data-hotspot="precheck">
        <i className="mock-check__box mock-check__box--on">✓</i>
        Pause my plan for 3 months instead of cancelling
      </div>
      <div className="mock-note">Your data is kept for 30 days after cancelling.</div>
      <div className="mock-stay" data-hotspot="hierarchy">Keep my plan &amp; my team's work</div>
      <div className="mock-shame" data-hotspot="confirmshame">No thanks, I don't care about my team's productivity</div>
      <div className="mock-phone" data-hotspot="phone">To finish cancelling, call <b>1-800-LAUNCHLY</b> (Mon-Fri, 9-5 ET)</div>
    </div>
  );
}

export const SPOT_MOCKS = {
  'signup-form': SignupForm,
  'cancel-flow': CancelFlow,
  ...VISUAL_MOCKS,
  ...AI_MOCKS,
  ...SYSTEMS_MOCKS,
  ...CRAFT_MOCKS,
  ...UX_MOCKS,
};

// Small animated previews shown inside decision choices. All three loading states run the
// same 8-second cycle — wait, then the same loaded dashboard — so only the waiting differs.
const METRICS = ['1,284', '96%', '342', '18m'];
const LINES = ['0,12 15,9 30,10 45,4 60,6', '0,8 15,8 30,6 45,7 60,3', '0,14 15,10 30,11 45,6 60,8', '0,6 15,9 30,7 45,10 60,5'];

function MetricContent({ i }) {
  return (
    <>
      <b>{METRICS[i]}</b>
      <svg viewBox="0 0 60 16"><polyline points={LINES[i]} /></svg>
    </>
  );
}

function LoadedGrid() {
  return (
    <div className="mini-layer mini-layer--loaded mini-grid">
      {[0, 1, 2, 3].map(i => <div className="mini-card mini-card--plain" key={i}><MetricContent i={i} /></div>)}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="mini-ui">
      <div className="mini-layer mini-layer--wait mini-ui--center">
        <span className="mini-spinner" />
        <span className="mini-caption">Loading your dashboard…</span>
      </div>
      <LoadedGrid />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="mini-ui">
      <div className="mini-layer mini-grid">
        {[0, 1, 2, 3].map(i => (
          <div className="mini-card" key={i}>
            <span className="mini-sk mini-sk--title" />
            <span className="mini-sk mini-sk--num" />
            <span className="mini-real"><MetricContent i={i} /></span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoadingBar() {
  return (
    <div className="mini-ui">
      <div className="mini-layer mini-layer--wait mini-ui--center">
        <span className="mini-bar"><span /></span>
        <span className="mini-caption">Loading your dashboard…</span>
      </div>
      <LoadedGrid />
    </div>
  );
}

export const CHOICE_VISUALS = {
  'loading-spinner': LoadingSpinner,
  'loading-skeleton': LoadingSkeleton,
  'loading-bar': LoadingBar,
};

export const PREVIEWS = {
  'upload-error': UploadError,
  ...AI_PREVIEWS,
  ...SYSTEMS_PREVIEWS,
  ...CRAFT_PREVIEWS,
};
