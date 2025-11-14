import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        // 🔹 Redireciona qualquer chamada a /functions/v1/... para o domínio das Edge Functions
        '/functions/v1': {
          target: 'https://xznzppgkkkkpzyvzemlr.functions.supabase.co',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/functions\/v1/, ''),
        },
      },
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
