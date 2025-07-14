// C:\tauri\cti-task-pilot\src\shared\api\authApi.ts
import { apiClient } from '../../lib/api';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    id: number;
    email: string;
    name: string;
}

export interface RegisterRequest {
    email: string;
    name: string;
    password: string;
}

export interface User {
    id: number;
    email: string;
    name: string;
    profileImage?: string;
    callStatus: 'READY' | 'BUSY' | 'AFTER_CALL' | 'BREAK';
    createdAt: string;
}

export const authApi = {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await apiClient.post('/users/login', data);
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<User> => {
        const response = await apiClient.post('/users/register', data);
        return response.data;
    },

    getCurrentProfile: async (): Promise<User> => {
        const response = await apiClient.get('/users/profile');
        return response.data;
    },

    changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<string> => {
        const response = await apiClient.put('/users/password', data);
        return response.data;
    }
};