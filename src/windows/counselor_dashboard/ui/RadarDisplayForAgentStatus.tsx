import React from 'react';
import { Phone, Hourglass, Coffee, Edit } from 'lucide-react';
import { Button } from '@/shared/ui/button';

export type Status = {
    label: string;
    time: string;
    icon: React.ReactNode;
    color: string;
    callStatus: string;
};

// 🎯 대기, 통화, 후처리, 휴식 4가지 상태 (time 은 예시 고정값)
export const statuses: Status[] = [
    {
        label: '대기',
        time: '12:03:45',
        icon: <Hourglass className="w-4 h-4" />,
        color: '#4199E0',
        callStatus: 'READY',
    },
    {
        label: '통화',
        time: '00:03:45',
        icon: <Phone className="w-4 h-4" />,
        color: '#3698A2',
        callStatus: 'BUSY',
    },
    {
        label: '후처리',
        time: '00:34:20',
        icon: <Edit className="w-4 h-4" />,
        color: '#FF947A',
        callStatus: 'AFTER_CALL',
    },
    {
        label: '휴식',
        time: '00:01:45',
        icon: <Coffee className="w-4 h-4" />,
        color: '#8B68A5',
        callStatus: 'BREAK',
    },
];

interface RadarDisplayProps {
    statusIndex: number;
    onClick: () => void;
}

const RadarDisplayForAgentStatus: React.FC<RadarDisplayProps> = ({ statusIndex, onClick }) => {
    const current = statuses[statusIndex];
    const bgClasses = ['blue-bg', 'green-bg', 'orange-bg', 'purple-bg'];
    const sweepClasses = ['blue-sweep', 'green-sweep', 'orange-sweep', 'purple-sweep'];

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
            `,
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

export default RadarDisplayForAgentStatus;