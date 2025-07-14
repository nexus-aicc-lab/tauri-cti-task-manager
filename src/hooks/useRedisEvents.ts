// hooks/useSingleAgentStatus.ts
import { useEffect, useState } from 'react';
import {
    setupSingleAgentStatusListener,
    SimpleAgentStatus,
} from '@/lib/redis-events';

export function useSingleAgentStatus() {
    const [status, setStatus] = useState<SimpleAgentStatus | null>(null);

    useEffect(() => {
        let unlisten: (() => void) | undefined;

        setupSingleAgentStatusListener((s) => setStatus(s)).then((fn) => {
            unlisten = fn;
        });

        return () => {
            unlisten?.();
        };
    }, []);

    return status;
}
