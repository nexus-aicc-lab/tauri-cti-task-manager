// C:\tauri\cti-task-pilot\src\windows\counselor_dashboard\store\useStoreForLoginInfo.ts

import { create } from 'zustand';

export interface UserInfo {
    id: string;
    username: string;
    email: string;
    department: string;
    role: string;
    profileImage?: string;
    safeToken: string;
    sessionId: string;
    loginMethod: string;
    timestamp: string;
}

interface LoginStore {
    user: UserInfo | null;
    isLoading: boolean;
    error: string | null;

    setUser: (user: UserInfo) => void;
    loadUserFromFile: () => Promise<void>;
    clearUser: () => void;
}

export const useStoreForLoginInfo = create<LoginStore>((set) => ({
    user: null,
    isLoading: false,
    error: null,

    setUser: (user) => set({ user, error: null }),

    loadUserFromFile: async () => {
        set({ isLoading: true, error: null });

        try {

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '로그인 정보 로드 실패';
            set({ error: errorMessage, isLoading: false });
            console.error('❌ [counselor] 로그인 정보 로드 실패:', error);
        }
    },

    clearUser: () => set({ user: null, error: null })
}));