
// 'use client';

// import React, { useState, useEffect, useCallback } from 'react';
// import { Phone, Edit, Users, Hourglass, Coffee, Wifi, WifiOff } from 'lucide-react';
// import { Card, CardContent } from "@/shared/ui/card";
// import { Button } from "@/shared/ui/button";
// import { toast } from 'react-toastify';
// import RadarStyles from '../../../app/panel-mode/ui/styles/RadarStyles';
// import { useAgentConsultantStatus } from '../../../app/panel-mode/store/useAgentConsultantStatus';
// import {
//     setupAllRedisEventListeners,
//     UserProfileUpdate,
//     AgentStatusInfo,
//     AgentInfo
// } from '../../../lib/redis-events';

// type Status = {
//     label: string;
//     time: string;
//     icon: React.ReactNode;
//     color: string;
//     callStatus: string;
// };

// const statuses: Status[] = [
//     {
//         label: '통화중',
//         time: '00:03:45',
//         icon: <Phone className="w-4 h-4 text-gray-600" />,
//         color: '#3698A2',
//         callStatus: 'BUSY'
//     },
//     {
//         label: '대기중',
//         time: '12:03:45',
//         icon: <Hourglass className="w-4 h-4 text-gray-600" />,
//         color: '#4199E0',
//         callStatus: 'READY'
//     },
//     {
//         label: '후처리',
//         time: '00:34:20',
//         icon: <Edit className="w-4 h-4 text-gray-600" />,
//         color: '#FF947A',
//         callStatus: 'WRAP_UP'
//     },
//     {
//         label: '휴식중',
//         time: '00:01:45',
//         icon: <Coffee className="w-4 h-4 text-gray-600" />,
//         color: '#8B68A5',
//         callStatus: 'BREAK'
//     },
// ];

// // callStatus에 따른 statusIndex 매핑
// const getStatusIndexByCallStatus = (callStatus: string): number => {
//     switch (callStatus) {
//         case 'BUSY': return 0;      // 통화중
//         case 'READY': return 1;     // 대기중
//         case 'WRAP_UP': return 2;   // 후처리
//         case 'BREAK': return 3;     // 휴식중
//         default: return 1;          // 기본값: 대기중
//     }
// };

// const RadarDisplay: React.FC<{
//     statusIndex: number;
//     onClick: () => void;
//     agentInfo?: AgentInfo | null;
//     isLive?: boolean;
// }> = ({ statusIndex, onClick, agentInfo, isLive = false }) => {
//     const current = statuses[statusIndex];
//     const bgClasses = ['green-bg', 'blue-bg', 'orange-bg', 'purple-bg'];
//     const sweepClasses = ['green-sweep', 'blue-sweep', 'orange-sweep', 'purple-sweep'];

//     return (
//         <div className="flex-1 flex justify-center items-center mb-2 relative">

//             <div className="radar-container shadow-md">
//                 <div className={`radar-background ${bgClasses[statusIndex]}`} />
//                 <div className={`radar-sweep ${sweepClasses[statusIndex]}`} />
//                 <div className="inner-white-mask" />
//                 <Button
//                     onClick={onClick}
//                     variant="ghost"
//                     className={`relative z-20 w-20 h-20 rounded-full flex flex-col items-center justify-center bg-white shadow-lg transition-all duration-500 hover:scale-110 active:scale-95 ${isLive ? 'ring-2 ring-blue-400 animate-pulse' : ''
//                         }`}
//                     style={{
//                         boxShadow: `
//                             0 2px 6px rgba(0,0,0,0.1),
//                             0 3px 15px rgba(0,0,0,0.15),
//                             0 0 0 2px ${current.color}20,
//                             0 0 15px ${current.color}30
//                         `
//                     }}
//                 >
//                     <div className="mb-1">{current.icon}</div>
//                     <div className="text-xs font-bold text-gray-800">{current.label}</div>
//                     <div className="text-xs font-medium text-gray-600">
//                         {agentInfo?.currentCallDuration || current.time}
//                     </div>
//                 </Button>
//             </div>


//         </div>
//     );
// };

// const StatsCard: React.FC<{
//     icon: React.ReactNode;
//     label: string;
//     value: string | number;
// }> = ({ icon, label, value }) => (
//     <Card className="rounded-md p-2 hover:shadow-sm transition-all duration-300">
//         <CardContent className="p-0">
//             <div className="flex items-center space-x-2">
//                 <div className="w-6 h-6 rounded-full bg-gray-100 border flex items-center justify-center">
//                     {icon}
//                 </div>
//                 <div>
//                     <div className="text-xs text-gray-500 font-medium">{label}</div>
//                     <div className={`text-sm font-bold ${label === '대기호' ? 'text-red-600' : 'text-gray-800'}`}>
//                         {value}
//                     </div>
//                 </div>
//             </div>
//         </CardContent>
//     </Card>
// );

// const AgentStatusInfoBoxForPanelMode1: React.FC = () => {
//     const { data1, updateData1 } = useAgentConsultantStatus();

//     // 🎯 Redis 이벤트 관련 상태들 (Radar만 업데이트)
//     const [targetAgent, setTargetAgent] = useState<AgentInfo | null>(null); // ID 2번 상담원
//     const [lastUpdate, setLastUpdate] = useState<number>(0);
//     const [isConnected, setIsConnected] = useState<boolean>(false);
//     const [previousCallStatus, setPreviousCallStatus] = useState<string>('');

//     // 사용자 프로필 업데이트 핸들러
//     const handleUserProfileUpdate = useCallback((data: UserProfileUpdate) => {
//         console.log('📱 사용자 프로필 업데이트:', data);
//         setLastUpdate(Date.now());
//         setIsConnected(true);
//     }, []);

//     // 🎯 상담원 상태 업데이트 핸들러 (Radar만 업데이트)
//     const handleAgentStatusUpdate = useCallback((data: AgentStatusInfo) => {
//         console.log('📊 상담원 상태 업데이트:', data);
//         setLastUpdate(Date.now());
//         setIsConnected(true);

//         // ID 2번 상담원 찾기
//         const agent2 = data.agents.find(agent => agent.id === 2);

//         if (agent2) {
//             const currentCallStatus = agent2.callStatus;

//             // 상태 변경 감지 및 토스트 알림
//             if (previousCallStatus && previousCallStatus !== currentCallStatus) {
//                 const statusMap: { [key: string]: string } = {
//                     'BUSY': '통화중',
//                     'READY': '대기중',
//                     'WRAP_UP': '후처리',
//                     'BREAK': '휴식중'
//                 };

//                 toast.success(
//                     `🔄 ${agent2.name} 상담원 상태 변경: ${statusMap[previousCallStatus] || previousCallStatus} → ${statusMap[currentCallStatus] || currentCallStatus}`,
//                     {
//                         position: "top-center",
//                         autoClose: 4000,
//                         hideProgressBar: false,
//                         closeOnClick: true,
//                         pauseOnHover: true,
//                         draggable: true,
//                         containerId: "panel-mode-toast"
//                     }
//                 );
//             }

//             // 처음 로드시에도 알림
//             if (!previousCallStatus) {
//                 const statusMap: { [key: string]: string } = {
//                     'BUSY': '통화중',
//                     'READY': '대기중',
//                     'WRAP_UP': '후처리',
//                     'BREAK': '휴식중'
//                 };

//                 toast.info(
//                     `📡 ${agent2.name} 상담원 연결됨 - 현재 상태: ${statusMap[currentCallStatus] || currentCallStatus}`,
//                     {
//                         position: "top-center",
//                         autoClose: 3000,
//                         hideProgressBar: false,
//                         closeOnClick: true,
//                         pauseOnHover: true,
//                         draggable: true,
//                         containerId: "panel-mode-toast"
//                     }
//                 );
//             }

//             setPreviousCallStatus(currentCallStatus);
//             setTargetAgent(agent2);

//             // 🎯 Radar만 업데이트 (StatsCard는 고정값 유지)
//             const newStatusIndex = getStatusIndexByCallStatus(currentCallStatus);
//             updateData1({
//                 statusIndex: newStatusIndex
//                 // waitingCalls, waitingAgents는 업데이트하지 않음
//             });

//         } else {
//             // ID 2번 상담원이 없는 경우
//             toast.warn(
//                 `⚠️ ID 2번 상담원을 찾을 수 없습니다`,
//                 {
//                     position: "top-center",
//                     autoClose: 3000,
//                     containerId: "panel-mode-toast"
//                 }
//             );
//         }
//     }, [updateData1, previousCallStatus]);

//     // Redis 이벤트 리스너 설정
//     useEffect(() => {
//         console.log('🔌 Redis 이벤트 리스너 설정 중...');

//         const cleanupListeners = setupAllRedisEventListeners(
//             handleUserProfileUpdate,
//             handleAgentStatusUpdate
//         );

//         // 연결 상태 확인 타이머
//         const connectionCheckTimer = setInterval(() => {
//             const timeSinceLastUpdate = Date.now() - lastUpdate;
//             if (timeSinceLastUpdate > 30000) { // 30초 이상 업데이트 없으면 연결 끊김으로 간주
//                 setIsConnected(false);
//             }
//         }, 5000);

//         return () => {
//             console.log('🔌 Redis 이벤트 리스너 정리 중...');
//             cleanupListeners();
//             clearInterval(connectionCheckTimer);
//         };
//     }, [handleUserProfileUpdate, handleAgentStatusUpdate, lastUpdate]);

//     return (
//         <>
//             <RadarStyles />
//             <div className="h-full bg-gray-50 p-2 rounded-lg shadow-md border flex flex-col min-h-0 relative">
//                 {/* 연결 상태 표시 */}
//                 <div className="absolute top-1 right-1 flex items-center space-x-1">

//                 </div>

//                 {/* 🎯 Radar만 실시간 업데이트됨 */}
//                 <RadarDisplay
//                     statusIndex={data1.statusIndex}
//                     onClick={() =>
//                         updateData1({
//                             statusIndex: (data1.statusIndex + 1) % statuses.length,
//                         })
//                     }
//                     agentInfo={targetAgent}
//                     isLive={isConnected && !!targetAgent}
//                 />

//                 {/* 🎯 StatsCard는 고정값 유지 (Redis 업데이트 없음) */}
//                 <div className="grid grid-cols-2 gap-2 flex-shrink-0">
//                     <StatsCard
//                         icon={<Phone className="w-3 h-3 text-gray-600" />}
//                         label="대기호"
//                         value={data1.waitingCalls}
//                     />
//                     <StatsCard
//                         icon={<Users className="w-3 h-3 text-gray-600" />}
//                         label="대기 상담"
//                         value={data1.waitingAgents}
//                     />
//                 </div>

//             </div>

//         </>
//     );
// };

// export default AgentStatusInfoBoxForPanelMode1;

'use client';

import React from 'react';
import { Phone, Users, Hourglass, Coffee, WifiOff } from 'lucide-react';
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import RadarStyles from '../../../app/panel-mode/ui/styles/RadarStyles';
import { useAgentConsultantStatus } from '../../../app/panel-mode/store/useAgentConsultantStatus';

type Status = {
    label: string;
    time: string;
    icon: React.ReactNode;
    color: string;
    callStatus: string;
};

// 🎯 Java enum (READY, BUSY, BREAK, OFFLINE)에 맞춘 상태 배열
const statuses: Status[] = [
    {
        label: '통화중',
        time: '00:03:45',
        icon: <Phone className="w-4 h-4 text-gray-600" />,
        color: '#3698A2',
        callStatus: 'BUSY'
    },
    {
        label: '대기중',
        time: '12:03:45',
        icon: <Hourglass className="w-4 h-4 text-gray-600" />,
        color: '#4199E0',
        callStatus: 'READY'
    },
    {
        label: '휴식중',
        time: '00:01:45',
        icon: <Coffee className="w-4 h-4 text-gray-600" />,
        color: '#8B68A5',
        callStatus: 'BREAK'
    },
    {
        label: '오프라인',
        time: '00:00:00',
        icon: <WifiOff className="w-4 h-4 text-gray-600" />,
        color: '#6B7280',
        callStatus: 'OFFLINE'
    },
];

const RadarDisplay: React.FC<{
    statusIndex: number;
    onClick: () => void;
}> = ({ statusIndex, onClick }) => {
    const current = statuses[statusIndex];
    // 🎯 4개 상태에 맞춘 CSS 클래스 (후처리 제거, 오프라인 추가)
    const bgClasses = ['green-bg', 'blue-bg', 'purple-bg', 'gray-bg'];
    const sweepClasses = ['green-sweep', 'blue-sweep', 'purple-sweep', 'gray-sweep'];

    return (
        <div className="flex-1 flex justify-center items-center mb-2 relative">
            <div className="radar-container shadow-md">
                <div className={`radar-background ${bgClasses[statusIndex]}`} />
                <div className={`radar-sweep ${sweepClasses[statusIndex]}`} />
                <div className="inner-white-mask" />
                <Button
                    onClick={onClick}
                    variant="ghost"
                    className="relative z-20 w-20 h-20 rounded-full flex flex-col items-center justify-center bg-white shadow-lg transition-all duration-500 hover:scale-110 active:scale-95"
                    style={{
                        boxShadow: `
                            0 2px 6px rgba(0,0,0,0.1),
                            0 3px 15px rgba(0,0,0,0.15),
                            0 0 0 2px ${current.color}20,
                            0 0 15px ${current.color}30
                        `
                    }}
                >
                    <div className="mb-1">{current.icon}</div>
                    <div className="text-xs font-bold text-gray-800">{current.label}</div>
                    <div className="text-xs font-medium text-gray-600">{current.time}</div>
                </Button>
            </div>
        </div>
    );
};

const StatsCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string | number;
}> = ({ icon, label, value }) => (
    <Card className="rounded-md p-2 hover:shadow-sm transition-all duration-300">
        <CardContent className="p-0">
            <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-gray-100 border flex items-center justify-center">
                    {icon}
                </div>
                <div>
                    <div className="text-xs text-gray-500 font-medium">{label}</div>
                    <div className={`text-sm font-bold ${label === '대기호' ? 'text-red-600' : 'text-gray-800'}`}>
                        {value}
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
);

const AgentStatusInfoBoxForPanelMode1: React.FC = () => {
    const { data1, updateData1 } = useAgentConsultantStatus();

    return (
        <>
            <RadarStyles />
            <div className="h-full bg-gray-50 p-2 rounded-lg shadow-md border flex flex-col min-h-0 relative">
                {/* 🎯 Radar - PanelModeContent에서 자동 업데이트됨 */}
                <RadarDisplay
                    statusIndex={data1.statusIndex}
                    onClick={() =>
                        updateData1({
                            statusIndex: (data1.statusIndex + 1) % statuses.length,
                        })
                    }
                />

                {/* 🎯 StatsCard - 고정값 유지 */}
                <div className="grid grid-cols-2 gap-2 flex-shrink-0">
                    <StatsCard
                        icon={<Phone className="w-3 h-3 text-gray-600" />}
                        label="대기호"
                        value={data1.waitingCalls}
                    />
                    <StatsCard
                        icon={<Users className="w-3 h-3 text-gray-600" />}
                        label="대기 상담"
                        value={data1.waitingAgents}
                    />
                </div>

                {/* 상태 표시 */}
                {/* <div className="mt-2 text-center">
                    <div className="text-xs text-gray-500">
                        현재 상태: <span className="font-medium text-blue-600">{statuses[data1.statusIndex]?.label || '알 수 없음'}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                        ID 2번 상담원 실시간 추적 중 (Index: {data1.statusIndex})
                    </div>
                    <div className="text-xs text-gray-300 mt-1">
                        매핑: 0=통화중, 1=대기중, 2=휴식중, 3=오프라인
                    </div>
                </div> */}
            </div>
        </>
    );
};

export default AgentStatusInfoBoxForPanelMode1;