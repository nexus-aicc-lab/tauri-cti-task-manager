// // 1. src/lib/redis-events.ts - 새로 생성
// import { listen } from '@tauri-apps/api/event';

// export interface UserProfileUpdate {
//     userId: number;
//     field: string;
//     newValue: string;
//     timestamp: number;
// }

// export interface RedisEvent {
//     channel: string;
//     data: UserProfileUpdate;
// }

// // Redis s이벤트 리스너 설정
// export const setupRedisEventListener = (onUserProfileUpdate: (data: UserProfileUpdate) => void) => {
//     return listen<RedisEvent>('redis-user-profile-update', (event) => {
//         console.log('🔔 Redis 이벤트 수신:', event.payload);
//         onUserProfileUpdate(event.payload.data);
//     });
// };

// src/lib/redis-events.ts - 기존 파일에 추가
import { listen } from '@tauri-apps/api/event';

// 기존 인터페이스들
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

// ✅ 새로 추가: 상담원 상태 관련 인터페이스들
export interface AgentInfo {
    id: number;
    name: string;
    email: string;
    callStatus: string;
    statusIndex: number;
    waitingCalls: number;
    currentCallDuration: string;
}

export interface AgentStatistics {
    totalAgents: number;
    availableCount: number;
    onCallCount: number;
    wrapUpCount: number;
    breakCount: number;
    totalWaitingCalls: number;
    avgWaitTime: string;
    longestWaitTime: string;
}

export interface AgentStatusInfo {
    agents: AgentInfo[];
    statistics: AgentStatistics;
    timestamp: number;
}

export interface AgentStatusEvent {
    channel: string;
    data: AgentStatusInfo;
}

// 기존 Redis 이벤트 리스너 설정
export const setupRedisEventListener = (onUserProfileUpdate: (data: UserProfileUpdate) => void) => {
    return listen<RedisEvent>('redis-user-profile-update', (event) => {
        console.log('🔔 Redis 이벤트 수신:', event.payload);
        onUserProfileUpdate(event.payload.data);
    });
};

// ✅ 새로 추가: 상담원 상태 이벤트 리스너 설정
export const setupAgentStatusEventListener = (onAgentStatusUpdate: (data: AgentStatusInfo) => void) => {
    return listen<AgentStatusEvent>('redis-agent-status-update', (event) => {
        console.log('🔔 상담원 상태 이벤트 수신:', event.payload);
        onAgentStatusUpdate(event.payload.data);
    });
};

// ✅ 새로 추가: 모든 Redis 이벤트를 한 번에 설정하는 헬퍼 함수
export const setupAllRedisEventListeners = (
    onUserProfileUpdate: (data: UserProfileUpdate) => void,
    onAgentStatusUpdate: (data: AgentStatusInfo) => void
) => {
    const userProfileUnlisten = setupRedisEventListener(onUserProfileUpdate);
    const agentStatusUnlisten = setupAgentStatusEventListener(onAgentStatusUpdate);

    // 두 리스너를 모두 해제하는 함수 반환
    return async () => {
        const [userUnlisten, agentUnlisten] = await Promise.all([
            userProfileUnlisten,
            agentStatusUnlisten
        ]);
        userUnlisten();
        agentUnlisten();
    };
};