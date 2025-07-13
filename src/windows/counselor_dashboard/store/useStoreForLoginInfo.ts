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
            const { invoke } = await import('@tauri-apps/api/core');
            const result = await invoke('get_login_info') as string;
            const loginData = JSON.parse(result || '{}');

            if (Object.keys(loginData).length > 0 && loginData.username) {
                const user: UserInfo = {
                    id: loginData.session_id || '',
                    username: loginData.username,
                    email: loginData.email || '',
                    department: loginData.department || '',
                    role: loginData.role || '',
                    safeToken: loginData.safe_token || '',
                    sessionId: loginData.session_id || '',
                    loginMethod: loginData.login_method || '',
                    timestamp: loginData.timestamp || loginData.received_at || ''
                };

                // localStorage에도 저장
                localStorage.setItem('cti_login_info', JSON.stringify(user));

                set({ user, isLoading: false });
                console.log('✅ [counselor] 로그인 정보 로드:', user.username);
            } else {
                set({ user: null, isLoading: false });
                console.log('ℹ️ [counselor] 저장된 로그인 정보 없음');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '로그인 정보 로드 실패';
            set({ error: errorMessage, isLoading: false });
            console.error('❌ [counselor] 로그인 정보 로드 실패:', error);
        }
    },

    clearUser: () => set({ user: null, error: null })
}));