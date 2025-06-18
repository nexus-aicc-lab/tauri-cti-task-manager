'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ViewMode = 'bar' | 'panel';
export type ActivePage = 'dashboard' | 'settings';

interface UIState {
  viewMode: ViewMode;
  activePage: ActivePage;
  setViewMode: (mode: ViewMode) => void;
  setActivePage: (page: ActivePage) => void;
  toggleViewMode: () => void;
  togglePage: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      viewMode: 'bar',
      activePage: 'dashboard',
      setViewMode: (viewMode) => set({ viewMode }),
      setActivePage: (activePage) => set({ activePage }),
      toggleViewMode: () =>
        set((s) => ({ viewMode: s.viewMode === 'bar' ? 'panel' : 'bar' })),
      togglePage: () =>
        set((s) => ({
          activePage: s.activePage === 'dashboard' ? 'settings' : 'dashboard',
        })),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        viewMode: state.viewMode,
        activePage: state.activePage,
      }),
    }
  )
);
