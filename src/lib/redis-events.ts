import { listen, UnlistenFn } from '@tauri-apps/api/event';

export interface SimpleAgentStatus {
    agentId: number;
    name: string;
    callStatus: string;
}

/**
 * Redis에서 단건 상담원 상태 이벤트를 수신합니다.
 * @param callback payload(SimpleAgentStatus)를 받을 콜백
 * @returns 해제 함수
 */
export function setupSingleAgentStatusListener(
    callback: (status: SimpleAgentStatus) => void
): Promise<UnlistenFn> {
    return listen<SimpleAgentStatus>(
        'redis-agent-status-single',
        (event) => {
            console.log('🔔 단건 상담원 상태 수신:', event.payload);
            callback(event.payload);
        }
    );
}
