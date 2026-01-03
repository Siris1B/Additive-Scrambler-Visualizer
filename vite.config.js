/* eslint-env node */
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
	base: mode === 'production' ? '/Additive-Scrambler-Visualizer/' : '/',
	plugins: [react()],

	build: {
		sourcemap: false,
		minify: 'esbuild',
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
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './src/test/setup.ts',
	},
}));
