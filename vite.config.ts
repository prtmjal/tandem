import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react(), {
    // In dev, serve the game page at /play like the production server does.
    name: 'play-route',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => { if (req.url && /^\/play(\/|\?|$)/.test(req.url)) req.url = req.url.replace(/^\/play/, '/play.html');
        else if (req.url && /^\/privacy(\?|$)/.test(req.url)) req.url = req.url.replace(/^\/privacy/, '/privacy.html'); next(); });
    },
  }],
  server: { host: true, port: 5173, proxy: { '/socket.io': { target: 'http://localhost:3001', ws: true } } },
  build: {
    target: 'es2020', sourcemap: false,
    // Two pages: the public landing page at / and the game at /play.
    rollupOptions: { input: { index: resolve(__dirname, 'index.html'), play: resolve(__dirname, 'play.html'), privacy: resolve(__dirname, 'privacy.html') } },
  },
});
