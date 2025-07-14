// hooks/useAgentTimer.ts
import { useEffect, useState } from 'react';

export function useAgentTimer(callStatus: string) {
    const [elapsedTime, setElapsedTime] = useState('00:00:00');

    useEffect(() => {
        const key = 'agent_status_started_at';
        const saved = localStorage.getItem(key);
        const parsed = saved ? JSON.parse(saved) : null;

        if (!parsed || parsed.status !== callStatus) return;

        const startedAt = new Date(parsed.startedAt);

        const interval = setInterval(() => {
            const now = new Date();
            const diffInSec = Math.floor((now.getTime() - startedAt.getTime()) / 1000);
            setElapsedTime(formatToHHMMSS(diffInSec));
        }, 1000);

        return () => clearInterval(interval);
    }, [callStatus]);

    return elapsedTime;
}

function formatToHHMMSS(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return [
        h.toString().padStart(2, '0'),
        m.toString().padStart(2, '0'),
        s.toString().padStart(2, '0'),
    ].join(':');
}
