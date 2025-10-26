import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// @ts-ignore
import monacoEditorPlugin from 'vite-plugin-monaco-editor';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    monacoEditorPlugin({
      languageWorkers: ['html'],
    }),
  ],
  optimizeDeps: {
    include: ['mjml-browser'],
    force: true,
  },
  server: {
    port: 3000,
    proxy: {
      '/third-login/': {
        target: 'https://yongma16.xyz/third-login/',
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/third-login\//, ''),
      },
    },
  },
  build: {
    outDir: 'build',
    commonjsOptions: {
      include: [/mjml-browser/, /node_modules/],
    },
  },
});

