import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tsconfigPaths(), react(), tailwindcss()],
  css: {
    devSourcemap: process.env.NODE_ENV === 'development',
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          antd: ['antd'],
          refine: ['@refinedev/core', '@refinedev/antd'],
        },
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  },
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 3000,
    host: true,
  },
});
