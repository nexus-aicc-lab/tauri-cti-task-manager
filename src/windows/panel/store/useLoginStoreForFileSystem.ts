// C:\tauri\cti-task-pilot\src\windows\panel\store\useLoginStoreForFileSystem.ts

// C:\tauri\cti-task-pilot\src\windows\panel\store\useLoginStoreForFileSystem.ts

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

    // Actions
    setUser: (user: UserInfo) => void;
    loadUserFromFile: () => Promise<void>;
    clearUser: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useLoginStore = create<LoginStore>((set) => ({
    user: null,
    isLoading: false,
    error: null,

    setUser: (user) => set({ user, error: null }),

    loadUserFromFile: async () => {
        set({ isLoading: true, error: null });

        try {
            // 파일 시스템에서 로그인 정보 읽기
            const loginData = localStorage.getItem('cti_login_info');

            if (loginData) {
                const user: UserInfo = JSON.parse(loginData);
                set({ user, isLoading: false });
                console.log('✅ 로그인 정보 로드 성공:', user.username);
            } else {
                set({ user: null, isLoading: false });
                console.log('ℹ️ 저장된 로그인 정보 없음');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '로그인 정보 로드 실패';
            set({ error: errorMessage, isLoading: false });
            console.error('❌ 로그인 정보 로드 실패:', error);
        }
    },

    clearUser: () => set({ user: null, error: null }),

    setLoading: (isLoading) => set({ isLoading }),

    setError: (error) => set({ error })
}));