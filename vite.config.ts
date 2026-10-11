import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3001,
    open: false
  },
  build: {
    target: 'es2022',
    outDir: 'dist',
    assetsDir: 'assets'
  }
});
