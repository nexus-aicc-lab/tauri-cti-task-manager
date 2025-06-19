
// src/App.tsx
'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/shared/store/useUIStore';
import { getCurrentWindow, LogicalSize } from '@tauri-apps/api/window';
import { WINDOW_CONFIG } from './config/windowConfig';
import Titlebar from './widgets/titlebar/ui/Titlebar';
import PanelContent from './widgets/main/ui/PanelContent';

declare global {
  interface Window {
    __TAURI__?: any;
    __TAURI_INTERNALS__?: any;
  }
}

export default function App() {
  const viewMode = useUIStore((s) => s.viewMode);

  useEffect(() => {
    console.log('[App] useEffect resize ▶ viewMode=', viewMode);
    const isTauri =
      typeof window.__TAURI__ !== 'undefined' ||
      typeof window.__TAURI_INTERNALS__ !== 'undefined' ||
      navigator.userAgent.toLowerCase().includes('tauri');
    console.log('[App] isTauri?', isTauri, 'ua=', navigator.userAgent);

    if (!isTauri) return;

    (async () => {
      try {
        const win = getCurrentWindow();
        const cfg = WINDOW_CONFIG[viewMode];
        console.log('[App] resizing to', cfg);
        await win.setSize(new LogicalSize(cfg.width, cfg.height));
        // 강제로 CSS vh 재계산
        window.dispatchEvent(new Event('resize'));
      } catch (e) {
        console.error('[App] setSize failed', e);
      }
    })();
  }, [viewMode]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Titlebar />
      <div className="flex-1 min-h-0 overflow-auto">
        {viewMode === 'panel'
          ? <PanelContent />
          : <div className="h-full flex items-center justify-center">BAR MODE</div>
        }
      </div>
    </div>
  );
}
