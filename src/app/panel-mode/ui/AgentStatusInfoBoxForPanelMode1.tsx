'use client';

import React, { useState } from 'react';
import { PauseCircle, PhoneCall, ClipboardList, Users, Phone } from 'lucide-react';

const AgentStatusInfoBoxForPanelMode1 = () => {
    const [statusIndex, setStatusIndex] = useState(0);

    const statuses = [
        {
            label: '대기중',
            time: '00:03:44',
            icon: <PauseCircle className="w-8 h-8 text-white" />,
            color: '#4285f4'
        },
        {
            label: '통화중',
            time: '00:12:21',
            icon: <PhoneCall className="w-8 h-8 text-white" />,
            color: '#34a853'
        },
        {
            label: '후처리중',
            time: '00:01:08',
            icon: <ClipboardList className="w-8 h-8 text-white" />,
            color: '#ff9500'
        },
    ];

    const current = statuses[statusIndex];
    const waitQueueCount = 5;
    const waitAgentCount = 1;

    const handleClick = () => {
        setStatusIndex((prev) => (prev + 1) % statuses.length);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 max-w-sm mx-auto">
            {/* 원형 상태 박스 */}
            <div className="flex justify-center mb-6">
                <button
                    onClick={handleClick}
                    className="relative w-48 h-48 rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
                    style={{
                        background: `radial-gradient(circle at 30% 30%, ${current.color}dd, ${current.color})`
                    }}
                >
                    <div className="mb-3">
                        {current.icon}
                    </div>
                    <div className="text-xl font-bold mb-1">{current.label}</div>
                    <div className="text-lg font-medium opacity-90">{current.time}</div>
                </button>
            </div>

            {/* 하단 통계 카드 */}
            <div className="grid grid-cols-2 gap-4">
                {/* 대기호 */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:shadow-sm transition-shadow">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Phone className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                            <div className="text-sm text-gray-600 font-medium">대기호</div>
                            <div className="text-2xl font-bold text-gray-900">{waitQueueCount}</div>
                        </div>
                    </div>
                </div>
                {/* 대기 상담사 */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:shadow-sm transition-shadow">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                            <div className="text-sm text-gray-600 font-medium">대기 상담</div>
                            <div className="text-2xl font-bold text-gray-900">{waitAgentCount}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentStatusInfoBoxForPanelMode1;