// C:\tauri\cti-task-pilot\src\shared\hook\useApiForAuth.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi, type LoginRequest, type LoginResponse, type RegisterRequest, type User } from '../api/authApi';

// 로그인 훅
export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation<LoginResponse, Error, LoginRequest>({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            // 토큰 저장
            localStorage.setItem('token', data.token);
            // 사용자 데이터 저장
            localStorage.setItem('user_data', JSON.stringify({
                email: data.email,
                name: data.name
            }));
            // 사용자 정보 캐시 무효화
            queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
        },
        onError: (error) => {
            console.error('로그인 실패:', error);
        }
    });
};

// 회원가입 훅
export const useRegister = () => {
    return useMutation<User, Error, RegisterRequest>({
        mutationFn: authApi.register,
        onSuccess: (data) => {
            console.log('회원가입 성공:', data);
        },
        onError: (error) => {
            console.error('회원가입 실패:', error);
        }
    });
};

// 현재 사용자 프로필 조회 훅 (localStorage 기반)
export const useCurrentProfile = () => {
    return useQuery<{ email: string; name: string } | null, Error>({
        queryKey: ['user', 'profile'],
        queryFn: () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user_data');

            if (!token || !userData) return null;

            return JSON.parse(userData);
        },
        enabled: !!localStorage.getItem('token'),
        staleTime: Infinity, // localStorage 데이터는 변경되지 않으므로
        gcTime: Infinity,
    });
};

// 비밀번호 변경 훅
export const useChangePassword = () => {
    return useMutation<string, Error, { currentPassword: string; newPassword: string }>({
        mutationFn: authApi.changePassword,
        onSuccess: () => {
            console.log('비밀번호 변경 성공');
        },
        onError: (error) => {
            console.error('비밀번호 변경 실패:', error);
        }
    });
};

// 로그아웃 훅 (클라이언트 사이드)
export const useLogout = () => {
    const queryClient = useQueryClient();

    return () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_data'); // 사용자 데이터도 삭제
        queryClient.clear(); // 모든 쿼리 캐시 삭제
        queryClient.invalidateQueries(); // 모든 쿼리 무효화
    };
};