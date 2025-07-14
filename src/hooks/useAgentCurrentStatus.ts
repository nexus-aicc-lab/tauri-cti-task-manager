// src/hooks/useRedisEvents.ts

import { useEffect, useState } from 'react';
import { listen } from '@tauri-apps/api/event';

// 상담원 상태 구조체
export interface SimpleAgentStatus {
    agentId: number;
    name: string;
    callStatus: string; // 예: "READY", "BUSY", "BREAK" 등
}

// Redis → Tauri → 프론트로 단건 상태를 수신하는 훅
export function useAgentCurrentStatus() {
    const [status, setStatus] = useState<SimpleAgentStatus | null>(null);

    useEffect(() => {
        let unlisten: (() => void) | undefined;

        const setupListener = async () => {
            unlisten = await listen<SimpleAgentStatus>(
                'agent-current-status-message',
                (event) => {
                    console.log('🔔 단건 상담원 상태 수신:', event.payload);
                    setStatus(event.payload);
                }
            );
        };

        setupListener();

        return () => {
            unlisten?.(); // 정리
        };
    }, []);

    return status;
}
