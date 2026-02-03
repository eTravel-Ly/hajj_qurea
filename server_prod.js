import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Logging middleware
app.use((req, res, next) => {
    next();
});

// Proxy for Auth
// Vite config: /proxy-auth -> https://hajjajlogin.hajj.gov.ly
app.use('/proxy-auth', createProxyMiddleware({
    target: 'https://hajjajlogin.hajj.gov.ly',
    changeOrigin: true,
    pathRewrite: {
        '^/proxy-auth': '', // Rewrite logic from vite config
    },
    onProxyRes: function (proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
}));

// Proxy for API
// Vite config: /proxy-api -> https://hajjaj.hajj.gov.ly
app.use('/proxy-api', createProxyMiddleware({
    target: 'https://hajjaj.hajj.gov.ly',
    changeOrigin: true,
    pathRewrite: {
        '^/proxy-api': '', // Rewrite logic from vite config
    },
    onProxyRes: function (proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    },
    // Increase timeout/body size limits if needed
    xfwd: true,
}));

// Serve static files from dist
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Handle SPA routing (send index.html for non-API requests)
app.get(/.*/, (req, res) => {
    if (req.url.startsWith('/proxy-')) return; // Don't serve HTML for failed proxy requests
    res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
});
