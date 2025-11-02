// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    terserOptions: {
      compress: {
        // Production build'da console.log'ları kaldır
        drop_console: true,
      },
    },
  },
});