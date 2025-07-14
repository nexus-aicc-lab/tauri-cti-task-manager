// // hooks/useSingleAgentStatus.ts
// import { useEffect, useState } from 'react';
// import {
//     setupSingleAgentStatusListener,
//     SimpleAgentStatus,
// } from '@/lib/redis-events';

// export function useSingleAgentStatus() {
//     const [status, setStatus] = useState<SimpleAgentStatus | null>(null);

//     useEffect(() => {
//         let unlisten: (() => void) | undefined;

//         setupSingleAgentStatusListener((s) => setStatus(s)).then((fn) => {
//             unlisten = fn;
//         });

//         return () => {
//             unlisten?.();
//         };
//     }, []);

//     return status;
// }

// C:\tauri\cti-task-pilot2\src\hooks\useRedisEvents.ts
import { useEffect, useState } from 'react';
import { listen, UnlistenFn } from '@tauri-apps/api/event';

export interface SimpleAgentStatus {
    agentId: number;
    name: string;
    callStatus: string;
}

export function useSingleAgentStatus() {
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
            unlisten?.();
        };
    }, []);

    return status;
}