import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Replaces 'process.env.API_KEY' with the actual value from the Vercel environment variable
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  };
});
