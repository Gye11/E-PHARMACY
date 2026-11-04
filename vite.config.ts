import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  base: '/E-PHARMACY/',
  plugins: [react(), svgr()],
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      plugins: [
        {
          name: 'github-pages-spa-fallback',
          writeBundle({ dir }) {
            const outputDirectory = dir ?? 'dist';
            copyFileSync(
              resolve(outputDirectory, 'index.html'),
              resolve(outputDirectory, '404.html'),
            );
          },
        },
      ],
    },
  },
});
