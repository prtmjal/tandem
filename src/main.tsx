import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '@fontsource-variable/bricolage-grotesque/wght.css';
import '@fontsource-variable/figtree/wght.css';
import './styles.css';

// Apply the "larger text, plain cards" preference before first paint.
try { if (localStorage.getItem('tad.plain') === '1') document.documentElement.classList.add('plain'); } catch { /* storage blocked */ }

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}
