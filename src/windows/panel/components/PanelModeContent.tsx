// // src\app\panel-mode\ui\PanelModeContent.tsx
// 'use client';

// import React, { useEffect, useState, useRef } from 'react';
// import useMeasure from 'react-use-measure';
// import AgentStatusInfoBoxForPanelMode1 from './AgentStatusInfoBoxForPanelMode1';
// import AgentStatusInfoBoxForPanelMode2 from './AgentStatusInfoBoxForPanelMode2';
// import AgentStatusInfoBoxForPanelMode3 from './AgentStatusInfoBoxForPanelMode3';
// import AgentStatusInfoBoxForPanelMode4 from './AgentStatusInfoBoxForPanelMode4';

// interface PanelModeContentProps {
//     onSizeCalculated?: (size: { width: number; height: number }) => void;
// }

// const PanelModeContent: React.FC<PanelModeContentProps> = ({ onSizeCalculated }) => {
//     const [lastNotifiedSize, setLastNotifiedSize] = useState({ width: 0, height: 0 });
//     const isInitialMount = useRef(true);
//     const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

//     // 🎯 react-use-measure로 정확한 크기 측정
//     const [ref, bounds] = useMeasure({
//         debounce: 150,
//         scroll: false,
//         offsetSize: true,
//     });

//     useEffect(() => {
//         if (bounds.width > 0 && bounds.height > 0 && onSizeCalculated) {
//             const TITLEBAR_HEIGHT = 42;
//             const PADDING = 16;
//             const WINDOW_BORDER = 8;
//             const MIN_WIDTH = 900;

//             const totalWidth = Math.max(MIN_WIDTH, Math.ceil(bounds.width) + PADDING);
//             const totalHeight = Math.ceil(bounds.height) + PADDING + TITLEBAR_HEIGHT + WINDOW_BORDER;

//             const THRESHOLD = 5;
//             const widthDiff = Math.abs(totalWidth - lastNotifiedSize.width);
//             const heightDiff = Math.abs(totalHeight - lastNotifiedSize.height);
//             const shouldNotify =
//                 isInitialMount.current ||
//                 widthDiff > THRESHOLD ||
//                 heightDiff > THRESHOLD;

//             if (shouldNotify) {
//                 // 기존 타이머 취소
//                 if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);

//                 resizeTimeoutRef.current = setTimeout(() => {
//                     onSizeCalculated({ width: totalWidth, height: totalHeight });
//                     setLastNotifiedSize({ width: totalWidth, height: totalHeight });
//                     isInitialMount.current = false;
//                 }, 50);
//             }
//         }
//     }, [bounds.width, bounds.height, onSizeCalculated, lastNotifiedSize]);

//     return (
//         <div ref={ref} className="w-full flex flex-col gap-2">
//             {/* 상단 3개 박스 */}
//             <div className="flex gap-2 w-full">
//                 <div className="flex-1 h-60 min-w-0">
//                     <AgentStatusInfoBoxForPanelMode1 />
//                 </div>
//                 <div className="flex-1 h-60 min-w-0">
//                     <AgentStatusInfoBoxForPanelMode2 />
//                 </div>
//                 <div className="flex-1 h-60 min-w-0">
//                     <AgentStatusInfoBoxForPanelMode3 />
//                 </div>
//             </div>
//             {/* 하단 박스 */}
//             <div className="w-full">
//                 <AgentStatusInfoBoxForPanelMode4 />
//             </div>
//         </div>
//     );
// };

// export default PanelModeContent;

'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import useMeasure from 'react-use-measure';
import { toast } from 'react-toastify';
import AgentStatusInfoBoxForPanelMode1 from './AgentStatusInfoBoxForPanelMode1';
import AgentStatusInfoBoxForPanelMode2 from './AgentStatusInfoBoxForPanelMode2';
import AgentStatusInfoBoxForPanelMode3 from './AgentStatusInfoBoxForPanelMode3';
import AgentStatusInfoBoxForPanelMode4 from './AgentStatusInfoBoxForPanelMode4';
import {
    setupAllRedisEventListeners,
    UserProfileUpdate,
    AgentStatusInfo,
    AgentInfo,
    SimpleAgentStatus
} from '../../../lib/redis-events';
import { useAgentConsultantStatus } from '@/app/panel-mode/store/useAgentConsultantStatus';

interface PanelModeContentProps {
    onSizeCalculated?: (size: { width: number; height: number }) => void;
}

const getStatusIndexByCallStatus = (callStatus: string): number => {
    switch (callStatus) {
        case 'BUSY': return 0;
        case 'READY': return 1;
        case 'BREAK': return 2;
        case 'OFFLINE': return 3;
        default: return 1;
    }
};

const PanelModeContent: React.FC<PanelModeContentProps> = ({ onSizeCalculated }) => {
    const [lastNotifiedSize, setLastNotifiedSize] = useState({ width: 0, height: 0 });
    const isInitialMount = useRef(true);
    const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { updateData1 } = useAgentConsultantStatus();
    const [targetAgent, setTargetAgent] = useState<AgentInfo | null>(null);
    const [lastUpdate, setLastUpdate] = useState<number>(0);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [previousCallStatus, setPreviousCallStatus] = useState<string>('');

    const [ref, bounds] = useMeasure({ debounce: 150, scroll: false, offsetSize: true });

    const handleUserProfileUpdate = useCallback((data: UserProfileUpdate) => {
        console.log('📱 [PanelModeContent] 사용자 프로필 업데이트:', data);
        setLastUpdate(Date.now());
        setIsConnected(true);
    }, []);

    const getStatusIndexByCallStatus = (callStatus: string): number => {
        switch (callStatus) {
            case 'BUSY': return 0;
            case 'READY': return 1;
            case 'BREAK': return 2;
            case 'OFFLINE': return 3;
            default: return 1;
        }
    };

    const handleSingleAgentStatusUpdate = useCallback((data: SimpleAgentStatus) => {
        console.log('📡 [단건 상태] 상담원 상태 업데이트:', data);

        // 단건 Redis 메시지로 ID 2번일 경우에만 상태 적용
        const newIndex = getStatusIndexByCallStatus(data.callStatus);

        updateData1({
            statusIndex: newIndex,
            // 대기호/대기상담사 수는 유지
        });

        toast(`🟢 상담원 상태 갱신: ${data.name} → ${data.callStatus} → index ${newIndex}`, {
            containerId: 'panel-mode-toast',
            autoClose: 2500,
        });
    }, [updateData1]);

    useEffect(() => {
        console.log('🔌 [PanelModeContent] Redis 이벤트 리스너 설정 중...');

        const setupListeners = async () => {
            const cleanup = await setupAllRedisEventListeners(
                handleUserProfileUpdate,
                handleSingleAgentStatusUpdate
            );

            const connectionCheckTimer = setInterval(() => {
                const timeSinceLastUpdate = Date.now() - lastUpdate;
                if (timeSinceLastUpdate > 30000) setIsConnected(false);
            }, 5000);

            return () => {
                cleanup();
                clearInterval(connectionCheckTimer);
            };
        };

        const cleanupPromise = setupListeners();
        return () => { cleanupPromise.then(fn => fn()); };
    }, [handleUserProfileUpdate, handleSingleAgentStatusUpdate, lastUpdate]);

    useEffect(() => {
        if (bounds.width > 0 && bounds.height > 0 && onSizeCalculated) {
            const TITLEBAR_HEIGHT = 42;
            const PADDING = 16;
            const WINDOW_BORDER = 8;
            const MIN_WIDTH = 900;

            const totalWidth = Math.max(MIN_WIDTH, Math.ceil(bounds.width) + PADDING);
            const totalHeight = Math.ceil(bounds.height) + PADDING + TITLEBAR_HEIGHT + WINDOW_BORDER;

            const THRESHOLD = 5;
            const widthDiff = Math.abs(totalWidth - lastNotifiedSize.width);
            const heightDiff = Math.abs(totalHeight - lastNotifiedSize.height);
            const shouldNotify =
                isInitialMount.current ||
                widthDiff > THRESHOLD ||
                heightDiff > THRESHOLD;

            if (shouldNotify) {
                if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);

                resizeTimeoutRef.current = setTimeout(() => {
                    onSizeCalculated({ width: totalWidth, height: totalHeight });
                    setLastNotifiedSize({ width: totalWidth, height: totalHeight });
                    isInitialMount.current = false;
                }, 50);
            }
        }
    }, [bounds.width, bounds.height, onSizeCalculated, lastNotifiedSize]);

    return (
        <div ref={ref} className="w-full flex flex-col gap-2 relative">
            <div className="flex gap-2 w-full">
                <div className="flex-1 h-60 min-w-0">
                    <AgentStatusInfoBoxForPanelMode1 />
                </div>
                <div className="flex-1 h-60 min-w-0">
                    <AgentStatusInfoBoxForPanelMode2 />
                </div>
                <div className="flex-1 h-60 min-w-0">
                    <AgentStatusInfoBoxForPanelMode3 />
                </div>
            </div>
            <div className="w-full">
                <AgentStatusInfoBoxForPanelMode4 />
            </div>
        </div>
    );
};

export default PanelModeContent;