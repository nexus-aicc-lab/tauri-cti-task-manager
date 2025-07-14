import React from 'react';
import { Button } from "@/shared/ui/button";

// 🎯 RadarDisplay에서만 필요한 타입
export type RadarStatus = {
    label: string;
    time: string;
    icon: React.ReactNode;
    color: string;
    callStatus: string;
};

// 🎯 기본 상태들 (RadarDisplay 내부에서 관리)
export const DEFAULT_RADAR_STATUSES: RadarStatus[] = [
    {
        label: '대기',
        time: '12:03:45',
        icon: <img src="/icons/panel-mode/hourglass.png" alt="대기" className="w-4 h-4" />,
        color: '#4199E0',
        callStatus: 'READY'
    },
    {
        label: '통화',
        time: '00:03:45',
        icon: <img src="/icons/panel-mode/cell_phone.png" alt="통화" className="w-4 h-4" />,
        color: '#3698A2',
        callStatus: 'BUSY'
    },
    {
        label: '후처리',
        time: '00:34:20',
        icon: <img src="/icons/panel-mode/pencel.png" alt="후처리" className="w-4 h-4" />,
        color: '#FF947A',
        callStatus: 'AFTER_CALL'
    },
    {
        label: '휴식',
        time: '00:01:45',
        icon: <img src="/icons/panel-mode/coffe.png" alt="휴식" className="w-4 h-4" />,
        color: '#8B68A5',
        callStatus: 'BREAK'
    },
];

interface RadarDisplayProps {
    statusIndex: number;
    onClick: () => void;
    statuses?: RadarStatus[]; // 선택적으로 커스텀 상태 배열 받기
}

const RadarDisplay: React.FC<RadarDisplayProps> = ({
    statusIndex,
    onClick,
    statuses = DEFAULT_RADAR_STATUSES
}) => {
    const currentStatus = statuses[statusIndex];

    // 🛡️ 예외 방지
    if (!currentStatus) {
        return (
            <div className="flex-1 flex justify-center items-center mb-2 text-gray-400 text-xs">
                상태 정보를 불러오는 중...
            </div>
        );
    }

    const bgClasses = ['blue-bg', 'green-bg', 'orange-bg', 'purple-bg'];
    const sweepClasses = ['blue-sweep', 'green-sweep', 'orange-sweep', 'purple-sweep'];

    return (
        <div className="flex-1 flex justify-center items-center mb-2 relative">
            <div className="radar-container shadow-md">
                <div className={`radar-background ${bgClasses[statusIndex % bgClasses.length]}`} />
                <div className={`radar-sweep ${sweepClasses[statusIndex % sweepClasses.length]}`} />
                <div className="inner-white-mask" />
                <Button
                    onClick={onClick}
                    variant="ghost"
                    className="relative z-20 w-20 h-20 rounded-full flex flex-col items-center justify-center bg-white shadow-lg transition-all duration-500 hover:scale-110 active:scale-95"
                    style={{
                        boxShadow: `
              0 2px 6px rgba(0,0,0,0.1),
              0 3px 15px rgba(0,0,0,0.15),
              0 0 0 2px ${currentStatus.color}20,
              0 0 15px ${currentStatus.color}30
            `
                    }}
                >
                    <div className="mb-1">{currentStatus.icon}</div>
                    <div className="text-xs font-bold text-gray-800">{currentStatus.label}</div>
                    <div className="text-xs font-medium text-gray-600">{currentStatus.time}</div>
                </Button>
            </div>
        </div>
    );
};


export default RadarDisplay;