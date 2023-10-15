import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		{
			name: 'configure-response-headers',
			configureServer: server => {
				server.middlewares.use((_req, res, next) => {
					res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
					next();
				});
			},
		},
	],
});
