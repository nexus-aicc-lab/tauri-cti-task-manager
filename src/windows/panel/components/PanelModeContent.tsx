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
    AgentInfo
} from '../../../lib/redis-events';
import { useAgentConsultantStatus } from '@/app/panel-mode/store/useAgentConsultantStatus';

interface PanelModeContentProps {
    onSizeCalculated?: (size: { width: number; height: number }) => void;
}

// 🎯 ID 2번 사용자의 callStatus에 따른 statusIndex 매핑 (Java enum 기준)
const getStatusIndexByCallStatus = (callStatus: string): number => {
    switch (callStatus) {
        case 'BUSY': return 0;      // 통화중 (녹색)
        case 'READY': return 1;     // 대기중 (파란색)  
        case 'BREAK': return 2;     // 휴식중 (보라색)
        case 'OFFLINE': return 3;   // 오프라인 (회색)
        default: return 1;          // 기본값: 대기중
    }
};

const PanelModeContent: React.FC<PanelModeContentProps> = ({ onSizeCalculated }) => {
    const [lastNotifiedSize, setLastNotifiedSize] = useState({ width: 0, height: 0 });
    const isInitialMount = useRef(true);
    const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // 🎯 Zustand store
    const { updateData1 } = useAgentConsultantStatus();

    // 🎯 Redis 이벤트 관련 상태들
    const [targetAgent, setTargetAgent] = useState<AgentInfo | null>(null); // ID 2번 상담원
    const [lastUpdate, setLastUpdate] = useState<number>(0);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [previousCallStatus, setPreviousCallStatus] = useState<string>('');

    // 🎯 react-use-measure로 정확한 크기 측정
    const [ref, bounds] = useMeasure({
        debounce: 150,
        scroll: false,
        offsetSize: true,
    });

    // 🎯 사용자 프로필 업데이트 핸들러
    const handleUserProfileUpdate = useCallback((data: UserProfileUpdate) => {
        console.log('📱 [PanelModeContent] 사용자 프로필 업데이트:', data);
        setLastUpdate(Date.now());
        setIsConnected(true);
    }, []);

    // 🎯 상담원 상태 업데이트 핸들러 (ID 2번 사용자 전용)
    const handleAgentStatusUpdate = useCallback((data: AgentStatusInfo) => {
        console.log('📊 [PanelModeContent] 상담원 상태 업데이트:', data);
        setLastUpdate(Date.now());
        setIsConnected(true);

        // 🎯 ID 2번 상담원만 찾기 (OhHyunSeok)
        const agent2 = data.agents.find(agent => agent.id === 2);

        if (agent2) {
            const currentCallStatus = agent2.callStatus;
            console.log(`🎯 [ID 2번] ${agent2.name}의 상태: ${currentCallStatus}`);

            // 상태 변경 감지 및 토스트 알림
            if (previousCallStatus && previousCallStatus !== currentCallStatus) {
                const statusMap: { [key: string]: string } = {
                    'BUSY': '통화중',
                    'READY': '대기중',
                    'BREAK': '휴식중',
                    'OFFLINE': '오프라인'
                };

                toast.success(
                    `🔄 ${agent2.name} 상담원 상태 변경: ${statusMap[previousCallStatus] || previousCallStatus} → ${statusMap[currentCallStatus] || currentCallStatus}`,
                    {
                        position: "top-center",
                        autoClose: 4000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        containerId: "panel-mode-toast"
                    }
                );
            }

            // 처음 로드시 알림
            if (!previousCallStatus) {
                const statusMap: { [key: string]: string } = {
                    'BUSY': '통화중',
                    'READY': '대기중',
                    'BREAK': '휴식중',
                    'OFFLINE': '오프라인'
                };

                toast.info(
                    `📡 ${agent2.name} 상담원 연결됨 - 현재 상태: ${statusMap[currentCallStatus] || currentCallStatus}`,
                    {
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        containerId: "panel-mode-toast"
                    }
                );
            }

            setPreviousCallStatus(currentCallStatus);
            setTargetAgent(agent2);

            // 🎯 ID 2번 사용자의 상태를 Radar에 매핑
            const newStatusIndex = getStatusIndexByCallStatus(currentCallStatus);
            updateData1({
                statusIndex: newStatusIndex
                // waitingCalls, waitingAgents는 업데이트하지 않음 (고정값 유지)
            });

            console.log(`🎯 [Radar 업데이트] ${currentCallStatus} → Index ${newStatusIndex} (${['통화중', '대기중', '휴식중', '오프라인'][newStatusIndex]})`);

        } else {
            // ID 2번 상담원이 없는 경우
            console.warn('⚠️ [PanelModeContent] ID 2번 상담원을 찾을 수 없습니다');
            toast.warn(
                `⚠️ ID 2번 상담원(OhHyunSeok)을 찾을 수 없습니다`,
                {
                    position: "top-center",
                    autoClose: 3000,
                    containerId: "panel-mode-toast"
                }
            );
        }
    }, [updateData1, previousCallStatus]);

    // 🎯 Redis 이벤트 리스너 설정 (중앙에서 한 번만)
    useEffect(() => {
        console.log('🔌 [PanelModeContent] Redis 이벤트 리스너 설정 중...');

        const cleanupListeners = setupAllRedisEventListeners(
            handleUserProfileUpdate,
            handleAgentStatusUpdate
        );

        // 연결 상태 확인 타이머
        const connectionCheckTimer = setInterval(() => {
            const timeSinceLastUpdate = Date.now() - lastUpdate;
            if (timeSinceLastUpdate > 30000) { // 30초 이상 업데이트 없으면 연결 끊김으로 간주
                setIsConnected(false);
            }
        }, 5000);

        return () => {
            console.log('🔌 [PanelModeContent] Redis 이벤트 리스너 정리 중...');
            cleanupListeners();
            clearInterval(connectionCheckTimer);
        };
    }, [handleUserProfileUpdate, handleAgentStatusUpdate, lastUpdate]);

    // 🎯 윈도우 크기 계산 (기존 로직)
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
                // 기존 타이머 취소
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
            {/* 🎯 Redis 연결 상태 및 ID 2번 사용자 추적 표시 */}
            {/* <div className="absolute top-1 right-1 z-10 flex items-center gap-1 text-xs bg-white/90 px-2 py-1 rounded-md border shadow-sm">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                    }`}></div>
                <span className={isConnected ? 'text-green-600' : 'text-gray-500'}>
                    Redis {isConnected ? 'Live' : 'Off'}
                </span>
                {targetAgent && (
                    <>
                        <span className="text-blue-600 ml-1">
                            | {targetAgent.name}
                        </span>
                        <span className="text-purple-600">
                            ({targetAgent.callStatus})
                        </span>
                    </>
                )}
                {!targetAgent && isConnected && (
                    <span className="text-orange-600 ml-1">
                        | ID 2번 대기중...
                    </span>
                )}
            </div> */}

            {/* 상단 3개 박스 */}
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
            {/* 하단 박스 */}
            <div className="w-full">
                <AgentStatusInfoBoxForPanelMode4 />
            </div>
        </div>
    );
};

export default PanelModeContent;