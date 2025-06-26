// src/components/AgentCallStatusBadge.tsx
import React from 'react';
import { Play, Phone, Clock, Coffee } from 'lucide-react';

export type StatusType = '대기중' | '통화중' | '후처리중' | '휴식중';

interface AgentCallStatusBadgeProps {
    /** 보여줄 상태 (기본값: 대기중) */
    status?: StatusType;
    /** 경과 시간 문자열 ex) "00:01:53" */
    workTime: string;
}

const statusConfig: Record<StatusType, {
    label: string;
    icon: JSX.Element;
    bg: string;
    color: string;
}> = {
    대기중: {
        label: '대기중',
        icon: <Play size={10} />,
        bg: 'bg-blue-500',
        color: 'text-white',
    },
    통화중: {
        label: '통화중',
        icon: <Phone size={10} />,
        bg: 'bg-red-500',
        color: 'text-white',
    },
    후처리중: {
        label: '후처리중',
        icon: <Clock size={10} />,
        bg: 'bg-green-500',
        color: 'text-white',
    },
    휴식중: {
        label: '휴식중',
        icon: <Coffee size={10} />,
        bg: 'bg-gray-400',
        color: 'text-white',
    },
};

const AgentCallStatusBadge: React.FC<AgentCallStatusBadgeProps> = ({
    status = '대기중',
    workTime,
}) => {
    const { label, icon, bg, color } = statusConfig[status];

    return (
        <div style={{ marginLeft: 12 }}>
            <div
                className={`${bg} ${color} rounded-full px-3 h-6 flex items-center gap-1 text-xs font-medium shadow-sm`}
            >
                {icon}
                <span>{label}</span>
                <span className="font-mono">{workTime}</span>
            </div>
        </div>
    );
};

export default AgentCallStatusBadge;
