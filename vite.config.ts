import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Increases the warning limit to avoid the "chunk size" warning
    chunkSizeWarningLimit: 1600,
  },
});
