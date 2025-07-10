// 1. src/lib/redis-events.ts - 새로 생성
import { listen } from '@tauri-apps/api/event';

export interface UserProfileUpdate {
    userId: number;
    field: string;
    newValue: string;
    timestamp: number;
}

export interface RedisEvent {
    channel: string;
    data: UserProfileUpdate;
}

// Redis 이벤트 리스너 설정
export const setupRedisEventListener = (onUserProfileUpdate: (data: UserProfileUpdate) => void) => {
    return listen<RedisEvent>('redis-user-profile-update', (event) => {
        console.log('🔔 Redis 이벤트 수신:', event.payload);
        onUserProfileUpdate(event.payload.data);
    });
};