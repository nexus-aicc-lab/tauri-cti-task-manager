// src/windows/counselor_dashboard/hooks/useAgentTimer.ts
import { useEffect, useState } from 'react';

export function useAgentTimer(callStatus: string) {
    const [elapsedTime, setElapsedTime] = useState('00:00:00');

    useEffect(() => {
        let interval: NodeJS.Timeout;

        const setupTimer = () => {
            const key = 'agent_status_started_at';
            const saved = localStorage.getItem(key);
            const parsed = saved ? JSON.parse(saved) : null;

            // 저장된 데이터가 없거나 상태가 다르면 초기화
            if (!parsed || parsed.status !== callStatus) {
                setElapsedTime('00:00:00');
                return;
            }

            const startedAt = new Date(parsed.startedAt);

            // 기존 인터벌 정리
            if (interval) clearInterval(interval);

            // 새로운 인터벌 시작
            interval = setInterval(() => {
                const now = new Date();
                const diffInSec = Math.floor((now.getTime() - startedAt.getTime()) / 1000);
                const validDiffInSec = Math.max(0, diffInSec);
                setElapsedTime(formatToHHMMSS(validDiffInSec));
            }, 1000);
        };

        // 초기 설정
        setupTimer();

        // localStorage 변경 감지 이벤트 리스너
        const handleStorageChange = () => {
            setupTimer();
        };

        // 커스텀 이벤트 리스너 (같은 탭 내 변경 감지)
        const handleAgentStatusUpdate = () => {
            setupTimer();
        };

        // 이벤트 리스너 등록
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('agent-status-updated', handleAgentStatusUpdate);

        return () => {
            if (interval) clearInterval(interval);
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('agent-status-updated', handleAgentStatusUpdate);
        };
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