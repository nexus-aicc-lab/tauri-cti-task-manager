// 'use client';

// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// export type ViewMode = 'bar' | 'panel';
// export type ActivePage = 'dashboard' | 'settings';

// interface UIState {
//   viewMode: ViewMode;
//   activePage: ActivePage;
//   setViewMode: (mode: ViewMode) => void;
//   setActivePage: (page: ActivePage) => void;
//   toggleViewMode: () => void;
//   togglePage: () => void;
// }

// export const useUIStore = create<UIState>()(
//   persist(
//     (set) => ({
//       viewMode: 'bar',
//       activePage: 'dashboard',
//       setViewMode: (viewMode) => set({ viewMode }),
//       setActivePage: (activePage) => set({ activePage }),
//       toggleViewMode: () =>
//         set((s) => ({ viewMode: s.viewMode === 'bar' ? 'panel' : 'bar' })),
//       togglePage: () =>
//         set((s) => ({
//           activePage: s.activePage === 'dashboard' ? 'settings' : 'dashboard',
//         })),
//     }),
//     {
//       name: 'ui-storage',
//       partialize: (state) => ({
//         viewMode: state.viewMode,
//         activePage: state.activePage,
//       }),
//     }
//   )
// );

'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { saveViewMode } from '@/shared/lib/fs/viewModeStorage'; // ⬅ 추가

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
      setViewMode: (viewMode) => {
        set({ viewMode });
        saveViewMode(viewMode); // 저장
      },
      setActivePage: (activePage) => set({ activePage }),
      toggleViewMode: () =>
        set((s) => {
          const next = s.viewMode === 'bar' ? 'panel' : 'bar';
          saveViewMode(next); // 저장
          return { viewMode: next };
        }),
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
