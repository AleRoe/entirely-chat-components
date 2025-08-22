import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

// Custom plugin to add CSP headers for Keycloak compatibility
const cspPlugin = (): Plugin => ({
  name: 'csp-headers',
  configureServer(server) {
    server.middlewares.use('/', (req, res, next) => {
      // Set CSP headers that allow frame ancestors for Keycloak
      res.setHeader(
        'Content-Security-Policy',
        "frame-ancestors *; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' ws: wss: https: http://localhost:8080;"
      );
      next();
    });
  },
});

export default defineConfig(({ mode }) => {
    // Load env variables based on the current mode
    const env = loadEnv(mode, process.cwd(), '');

    // Force port 5173 to match Keycloak configuration
    const port = 5173;
    const apiProxyTarget = env.services__kernel_service__http__0 || 'http://localhost:5378';

    // Check if SSL certificates exist
    let httpsConfig;
    try {
        if (fs.existsSync('cert.key') && fs.existsSync('cert.crt')) {
            httpsConfig = {
                key: fs.readFileSync('cert.key'),
                cert: fs.readFileSync('cert.crt')
            };
        }
    } catch (error) {
        console.warn('SSL certificates not found, running in HTTP mode');
    }

    return {
        plugins: [react(), cspPlugin()],
        assetsInclude: ['**/*.md'],
        server: {
            port,
            strictPort: true, // Prevent Vite from using a different port if 5173 is busy
            https: httpsConfig,
            proxy: {
                '/api': {
                    target: apiProxyTarget,
                    changeOrigin: true,
                    secure: false, // Allow self-signed certificates in development
                },
            },
        },
    };
});
