// src/windows/counselor_dashboard/hooks/useUserQueries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi, type User } from '../api/userApi';

// 전체 사용자 목록
export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: userApi.getAllUsers,
    });
};

// 현재 사용자 프로필
export const useCurrentUser = () => {
    return useQuery({
        queryKey: ['user', 'profile'],
        queryFn: userApi.getCurrentProfile,
        enabled: !!localStorage.getItem('authToken'),
    });
};

// ✅ ID로 특정 사용자 조회
export const useUser = (id: number) => {
    return useQuery({
        queryKey: ['user', id],
        queryFn: () => userApi.getUserById(id),
        enabled: !!id, // id가 있을 때만 실행
    });
};

// ✅ 사용자 검색
export const useSearchUsers = (keyword: string) => {
    return useQuery({
        queryKey: ['users', 'search', keyword],
        queryFn: () => userApi.searchUsers(keyword),
        enabled: !!keyword && keyword.length >= 2, // 2글자 이상일 때만 검색
    });
};

// ✅ 프로필 업데이트 mutation
export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: userApi.updateProfile,
        onSuccess: (updatedUser) => {
            // 캐시 업데이트
            queryClient.setQueryData(['user', 'profile'], updatedUser);
            queryClient.setQueryData(['user', updatedUser.id], updatedUser);
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};

// ✅ 상담원 상태 변경 mutation
export const useUpdateCallStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: userApi.updateCallStatus,
        onSuccess: (updatedUser) => {
            // 캐시 업데이트
            queryClient.setQueryData(['user', 'profile'], updatedUser);
            queryClient.setQueryData(['user', updatedUser.id], updatedUser);
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};

export const useUpdateCallStatusById = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, callStatus }: { userId: number; callStatus: User['callStatus'] }) =>
            userApi.updateCallStatusById(userId, callStatus),
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(['user', updatedUser.id], updatedUser);
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};