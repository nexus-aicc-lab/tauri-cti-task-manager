// src/windows/settings/stores/useAlwaysOnTopStore.ts

import { create } from 'zustand';

interface AlwaysOnTopStore {
    isPinned: boolean;
    setPinned: (value: boolean) => void;
}

export const useAlwaysOnTopStore = create<AlwaysOnTopStore>((set) => ({
    isPinned: false,
    setPinned: (value) => set({ isPinned: value }),
}));
