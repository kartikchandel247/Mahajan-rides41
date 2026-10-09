import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

function vercelApiDevPlugin() {
  return {
    name: 'vercel-api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';
        if (url === '/api/analytics') {
          try {
            const apiModule = await server.ssrLoadModule('/api/analytics.js');
            res.status = (code) => {
              res.statusCode = code;
              return res;
            };
            res.json = (data) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return res;
            };

            if (req.method === 'POST') {
              let bodyStr = '';
              req.on('data', chunk => { bodyStr += chunk; });
              req.on('end', async () => {
                try {
                  req.body = bodyStr ? JSON.parse(bodyStr) : {};
                } catch {
                  req.body = {};
                }
                await apiModule.default(req, res);
              });
            } else {
              await apiModule.default(req, res);
            }
            return;
          } catch (err) {
            console.error('[Vite API Middleware Error]:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
            return;
          }
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), vercelApiDevPlugin()],
  base: './', // Ensures assets load properly on any domain, subpath, or hosting provider
  server: {
    host: true, // Exposes to local network (test on phone or other devices)
    open: false,
  },
})


