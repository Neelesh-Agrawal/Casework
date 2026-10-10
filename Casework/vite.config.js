import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Serves the Vercel functions in /api during `vite dev`, so the whole game runs locally.
function vercelApiInDev() {
  return {
    name: 'vercel-api-in-dev',
    configureServer(server) {
      // Lets api/votes.js fall back to its in-memory store when Upstash isn't configured locally.
      process.env.CASEWORK_DEV = '1';
      server.middlewares.use('/api', async (req, res, next) => {
        const url = new URL(req.url, 'http://localhost');
        const name = url.pathname.replace(/^\/+|\/+$/g, '');
        if (!/^[a-z-]+$/.test(name)) return next();

        let handler;
        try {
          ({ default: handler } = await server.ssrLoadModule(`/api/${name}.js`));
        } catch {
          return next();
        }

        let raw = '';
        for await (const chunk of req) raw += chunk;
        req.query = Object.fromEntries(url.searchParams);
        try { req.body = raw ? JSON.parse(raw) : undefined; } catch { req.body = undefined; }

        res.status = (code) => { res.statusCode = code; return res; };
        res.json = (data) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
          return res;
        };
        await handler(req, res);
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), vercelApiInDev()],
})
