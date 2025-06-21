// 📄 src/shared/api/axiosInstance.ts
import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 5000,
    withCredentials: true, // ✅ 세션 쿠키 포함을 위한 필수 설정
    headers: {
        'Content-Type': 'application/json',
    },
});
