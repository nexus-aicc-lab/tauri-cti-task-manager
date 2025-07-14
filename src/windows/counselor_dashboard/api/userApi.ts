// src/windows/counselor_dashboard/api/userApi.ts
import { apiClient } from '../../../lib/api';

export interface User {
    id: number;
    email: string;
    name: string;
    profileImage?: string;
    callStatus: 'READY' | 'BUSY' | 'AFTER_CALL' | 'BREAK';
    createdAt: string;
}

export interface UpdateProfileRequest {
    name?: string;
    email?: string;
    profileImage?: string;
    callStatus?: User['callStatus'];
}

export const userApi = {
    // ✅ 사용자 조회
    getAllUsers: async (): Promise<User[]> => {
        const response = await apiClient.get('/users');
        return response.data;
    },

    getUserById: async (id: number): Promise<User> => {
        const response = await apiClient.get(`/users/${id}`);
        return response.data;
    },

    searchUsers: async (keyword: string): Promise<User[]> => {
        const response = await apiClient.get(`/users/search?keyword=${keyword}`);
        return response.data;
    },

    // ✅ 프로필 업데이트
    updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
        const response = await apiClient.put('/users/profile', data);
        return response.data;
    },

    // ✅ 상담원 상태 변경 (ID 기반 - 개발용)
    updateCallStatusById: async (userId: number, callStatus: User['callStatus']): Promise<User> => {
        const response = await apiClient.put(`/users/${userId}/status?callStatus=${callStatus}`);
        return response.data;
    },

    // ✅ 상담원 상태 변경 (Authentication 기반 - 프로덕션용)
    updateCallStatus: async (callStatus: User['callStatus']): Promise<User> => {
        const response = await apiClient.put(`/users/status?callStatus=${callStatus}`);
        return response.data;
    },

    // ✅ 통계 관련 (향후 확장용)
    getUserStatusStats: async (): Promise<{ callStatus: string; count: number }[]> => {
        const response = await apiClient.get('/users/stats/status');
        return response.data;
    },

    getTotalUserCount: async (): Promise<number> => {
        const response = await apiClient.get('/users/stats/total');
        return response.data;
    },

    // ✅ 상태별 사용자 조회
    getUsersByStatus: async (callStatus: User['callStatus']): Promise<User[]> => {
        const response = await apiClient.get(`/users/search?keyword=${callStatus}`);
        return response.data;
    },

    getActiveUsers: async (): Promise<User[]> => {
        const response = await apiClient.get('/users/active');
        return response.data;
    },
};