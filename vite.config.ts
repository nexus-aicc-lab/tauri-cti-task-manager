// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from '@tailwindcss/vite'


// // @ts-expect-error process is a nodejs global
// const host = process.env.TAURI_DEV_HOST;

// // https://vitejs.dev/config/
// export default defineConfig(async () => ({
//   plugins: [
//     react(),
//     tailwindcss(),
//   ],

//   // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
//   //
//   // 1. prevent vite from obscuring rust errors
//   clearScreen: false,
//   // 2. tauri expects a fixed port, fail if that port is not available
//   server: {
//     port: 1420,
//     strictPort: true,
//     host: host || false,
//     hmr: host
//       ? {
//         protocol: "ws",
//         host,
//         port: 1421,
//       }
//       : undefined,
//     watch: {
//       // 3. tell vite to ignore watching `src-tauri`
//       ignored: ["**/src-tauri/**"],
//     },
//   },
// }));

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [
    react(),
    tailwindcss(),
  ],

  // 경로 별칭 추가 (상대 경로 사용)
  resolve: {
    alias: {
      "@": "/src",
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
        overlay: false, // ← 이 한 줄이면 됩니다!
      }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
}));