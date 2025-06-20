

'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/shared/store/useUIStore';
import { getCurrentWindow, LogicalSize } from '@tauri-apps/api/window';
import { WINDOW_CONFIG } from './config/windowConfig';
import Titlebar from './widgets/titlebar/ui/Titlebar';
import PanelContent from './widgets/main/ui/PanelContent';
import { loadViewMode, saveViewMode } from '@/shared/lib/fs/viewModeStorage';

declare global {
  interface Window {
    __TAURI__?: any;
    __TAURI_INTERNALS__?: any;
  }
}

export default function App() {
  const viewMode = useUIStore((s) => s.viewMode);
  const setViewMode = useUIStore((s) => s.setViewMode);

  // 1) 앱 시작 시: 파일에서 모드 로드 / 없으면 기본('bar') 저장
  useEffect(() => {
    const init = async () => {
      const isTauri =
        typeof window.__TAURI__ !== 'undefined' ||
        typeof window.__TAURI_INTERNALS__ !== 'undefined' ||
        navigator.userAgent.toLowerCase().includes('tauri');
      if (!isTauri) return;

      const stored = await loadViewMode();
      if (stored === null) {
        await saveViewMode('bar');
        setViewMode('bar');
      } else {
        setViewMode(stored);
      }
    };
    init();
  }, []);

  // 2) viewMode 변경 시: 윈도우 크기 조절
  useEffect(() => {
    const resize = async () => {
      const isTauri =
        typeof window.__TAURI__ !== 'undefined' ||
        typeof window.__TAURI_INTERNALS__ !== 'undefined' ||
        navigator.userAgent.toLowerCase().includes('tauri');
      if (!isTauri) return;

      try {
        const win = getCurrentWindow();
        const cfg = WINDOW_CONFIG[viewMode];
        await win.setSize(new LogicalSize(cfg.width, cfg.height));
        window.dispatchEvent(new Event('resize'));
      } catch (e) {
        console.error('[App] resize failed', e);
      }
    };
    resize();
  }, [viewMode]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Titlebar />
      <div className="flex-1 min-h-0 overflow-auto">
        {viewMode === 'panel' ? (
          <PanelContent />
        ) : (
          <div className="h-full flex items-center justify-center">BAR MODE</div>
        )}
      </div>
    </div>
  );
}
