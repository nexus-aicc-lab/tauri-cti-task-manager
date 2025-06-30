import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [
    react(),
    tailwindcss(),
  ],

  // 🔥 멀티 엔트리 빌드 설정 추가
  build: {
    rollupOptions: {
      input: {
        // 기존 메인 엔트리 (개발 중에는 유지)
        main: resolve(__dirname, 'index.html'),

        // 🆕 각 윈도우별 독립 엔트리
        launcher: resolve(__dirname, 'launcher.html'),
        bar: resolve(__dirname, 'bar.html'),
        panel: resolve(__dirname, 'panel.html'),
        settings: resolve(__dirname, 'settings.html'),
        login: resolve(__dirname, 'login.html'),
      },
    },
  },

  // 🔥 경로 별칭 확장
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@shared": resolve(__dirname, "src/shared"),
      "@app": resolve(__dirname, "src/app"),
      "@windows": resolve(__dirname, "src/windows"),
    },
  },

  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
        protocol: "ws",
        host,
        port: 1421,
        overlay: false,
      }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
}));