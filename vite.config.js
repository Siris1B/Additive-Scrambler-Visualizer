import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './src/test/setup.ts',
	},
	build: {
		sourcemap: false,
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
			},
		},
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ['react', 'react-dom'],
					chakra: [
						'@chakra-ui/react',
						'@emotion/react',
						'@emotion/styled',
						'framer-motion',
					],
					forms: ['react-hook-form', 'zod', '@hookform/resolvers'],
				},
			},
		},
	},
});
