import { listen } from '@tauri-apps/api/event';

//
// 📌 공통 인터페이스들
//
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

export interface SimpleAgentStatus {
    agentId: number;
    name: string;
    callStatus: string;
}

//
// 📡 Redis 이벤트 리스너들
//

// 1. 유저 프로필 변경 리스너
export const setupRedisEventListener = (
    onUserProfileUpdate: (data: UserProfileUpdate) => void
) => {
    return listen<RedisEvent>('redis-user-profile-update', (event) => {
        console.log('🔔 Redis 이벤트 수신:', event.payload);
        onUserProfileUpdate(event.payload.data);
    });
};

// 2. 전체 상담원 상태 리스너
export const setupAgentStatusEventListener = (
    onAgentStatusUpdate: (data: AgentStatusInfo) => void
) => {
    return listen<AgentStatusEvent>('redis-agent-status-update', (event) => {
        console.log('🔔 상담원 상태 이벤트 수신:', event.payload);
        onAgentStatusUpdate(event.payload.data);
    });
};

// 3. 단건 상담원 상태 리스너
export const setupSingleAgentStatusEventListener = (
    onSingleAgentStatusUpdate: (data: SimpleAgentStatus) => void
) => {
    return listen<SimpleAgentStatus>('redis-agent-status-single', (event) => {
        console.log('🔔 단건 상담원 상태 이벤트 수신:', event.payload);
        onSingleAgentStatusUpdate(event.payload);
    });
};

//
// 🧩 전체 Redis 이벤트 통합 리스너
//
export const setupAllRedisEventListeners = async (
    onUserProfileUpdate: (data: UserProfileUpdate) => void,
    onSingleAgentStatusUpdate: (data: SimpleAgentStatus) => void
) => {
    const userUnlisten = await setupRedisEventListener(onUserProfileUpdate);
    const singleAgentUnlisten = await setupSingleAgentStatusEventListener(onSingleAgentStatusUpdate);

    // 🔁 해제 함수 통합 반환
    return () => {
        userUnlisten();
        singleAgentUnlisten();
    };
};
