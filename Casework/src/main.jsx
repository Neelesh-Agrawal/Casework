import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './v2/ui/theme.css'
import './v2/ui/pages.css'
import './v2/ui/mocks.css'
import './v2/ui/learn.css'
import App from './v2/App.jsx'
import ErrorBoundary from './v2/ui/ErrorBoundary.jsx'

// Dev-only playgrounds for the illustrations and the 3D office.
const DEV_PAGES = import.meta.env.DEV ? {
  '/dev/cast': lazy(() => import('./v2/dev/CastGallery.jsx')),
  '/dev/office': lazy(() => import('./v2/dev/OfficeTest.jsx')),
  '/dev/mocks': lazy(() => import('./v2/dev/MockGallery.jsx')),
  '/film': lazy(() => import('./v2/film/Film.jsx')),
  '/hook': lazy(() => import('./v2/film/Hook.jsx')),
  '/summary': lazy(() => import('./v2/film/Summary.jsx')),
} : {}
const DevPage = DEV_PAGES[window.location.pathname]

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      {DevPage ? <Suspense fallback={null}><DevPage /></Suspense> : <App />}
    </ErrorBoundary>
  </StrictMode>,
)
