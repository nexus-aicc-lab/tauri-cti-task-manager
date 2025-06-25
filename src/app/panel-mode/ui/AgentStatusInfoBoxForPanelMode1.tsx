// AgentStatusInfoBoxForPanelMode1 (Responsive)
'use client';

import React, { useState } from 'react';
import { PauseCircle, PhoneCall, ClipboardList, Users, Phone } from 'lucide-react';

interface Status {
    label: string;
    time: string;
    icon: React.ReactNode;
    color: string;
}

const AgentStatusInfoBoxForPanelMode1: React.FC = () => {
    const [statusIndex, setStatusIndex] = useState<number>(0);

    const statuses: Status[] = [
        {
            label: '대기중',
            time: '00:03:44',
            icon: <PauseCircle className="w-6 sm:w-8 h-6 sm:h-8 text-white" />,
            color: '#4285f4'
        },
        {
            label: '통화중',
            time: '00:12:21',
            icon: <PhoneCall className="w-6 sm:w-8 h-6 sm:h-8 text-white" />,
            color: '#34a853'
        },
        {
            label: '후처리중',
            time: '00:01:08',
            icon: <ClipboardList className="w-6 sm:w-8 h-6 sm:h-8 text-white" />,
            color: '#ff9500'
        },
    ];

    const current = statuses[statusIndex];
    const waitQueueCount = 5;
    const waitAgentCount = 1;

    const handleClick = (): void => {
        setStatusIndex((prev) => (prev + 1) % statuses.length);
    };

    return (
        <div className="h-full bg-white p-3 sm:p-6 rounded-xl shadow-md border border-gray-200 flex flex-col min-h-0">
            {/* 원형 상태 박스 */}
            <div className="flex-1 flex justify-center items-center mb-3 sm:mb-6 min-h-0">
                <button
                    onClick={handleClick}
                    className="relative w-24 h-24 sm:w-32 md:w-40 lg:w-48 sm:h-32 md:h-40 lg:h-48 rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
                    style={{
                        background: `radial-gradient(circle at 30% 30%, ${current.color}dd, ${current.color})`
                    }}
                >
                    <div className="mb-1 sm:mb-3">
                        {current.icon}
                    </div>
                    <div className="text-sm sm:text-lg lg:text-xl font-bold mb-1">{current.label}</div>
                    <div className="text-xs sm:text-sm lg:text-lg font-medium opacity-90">{current.time}</div>
                </button>
            </div>

            {/* 하단 통계 카드 */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4 flex-shrink-0">
                {/* 대기호 */}
                <div className="bg-gray-50 rounded-lg p-2 sm:p-4 border border-gray-100 hover:shadow-sm transition-shadow">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                            <div className="text-xs sm:text-sm text-gray-600 font-medium">대기호</div>
                            <div className="text-lg sm:text-2xl font-bold text-gray-900">{waitQueueCount}</div>
                        </div>
                    </div>
                </div>
                {/* 대기 상담사 */}
                <div className="bg-gray-50 rounded-lg p-2 sm:p-4 border border-gray-100 hover:shadow-sm transition-shadow">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                            <div className="text-xs sm:text-sm text-gray-600 font-medium">대기 상담</div>
                            <div className="text-lg sm:text-2xl font-bold text-gray-900">{waitAgentCount}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentStatusInfoBoxForPanelMode1;