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

// 현재 사용자 프로필 조회 훅
export const useCurrentProfile = () => {
    return useQuery<User, Error>({
        queryKey: ['user', 'profile'],
        queryFn: authApi.getCurrentProfile,
        enabled: !!localStorage.getItem('token'), // 토큰이 있을 때만 실행
        staleTime: 5 * 60 * 1000, // 5분
        gcTime: 10 * 60 * 1000, // 10분
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
        queryClient.clear(); // 모든 쿼리 캐시 삭제
        queryClient.invalidateQueries(); // 모든 쿼리 무효화
    };
};