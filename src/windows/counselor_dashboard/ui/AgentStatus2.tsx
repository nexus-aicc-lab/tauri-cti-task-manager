'use client';

import React, { useState } from 'react';

const AgentStatus2: React.FC = () => {
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

    const formatTime = (hours: number, minutes: number, seconds: number) => {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    // 상태 변경 처리 함수 (API 호출 포함)
    const handleStatusChange = (status: string) => {
        setSelectedStatus(status);
        console.log(`🚀 [상태변경] 상담사 상태를 "${status}" 로 변경합니다.`);

        // 여기에 실제 API 호출 추가
        // ex) await axios.post('/api/agent/status', { status });
    };

    const items = [
        {
            key: 'WAITING',
            icon: '/icons/panel-mode/hourglass.png',
            label: '대기',
            time: formatTime(12, 0, 34),
            count: 15,
            bg: '#EAF3FF',
            textColor: '#2563eb',
        },
        {
            key: 'ON_CALL',
            icon: '/icons/panel-mode/cell_phone.png',
            label: '통화',
            time: formatTime(12, 50, 20),
            count: 12,
            bg: '#ECF9FA',
            textColor: '#14b8a6',
        },
        {
            key: 'AFTER_CALL',
            icon: '/icons/panel-mode/pencel.png',
            label: '후처리',
            time: formatTime(0, 34, 20),
            count: 15,
            bg: '#FFEFDE',
            textColor: '#f97316',
        },
        {
            key: 'BREAK',
            icon: '/icons/panel-mode/coffe.png',
            label: '휴식',
            time: formatTime(0, 0, 0),
            count: 0,
            bg: '#F4ECFA',
            textColor: '#8b5cf6',
        },
    ];

    return (
        <div className="h-full bg-white p-1 rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-2 gap-2 h-full">
                {items.map((item, idx) => {
                    const isSelected = selectedStatus === item.key;
                    return (
                        <button
                            key={idx}
                            onClick={() => handleStatusChange(item.key)}
                            style={{
                                backgroundColor: item.bg,
                                boxShadow: isSelected ? '0 0 0 2px #0ea5e9' : 'none', // 강조 테두리
                            }}
                            className={`rounded-md p-2 flex flex-col items-center justify-center gap-3 transition 
                                hover:scale-[1.02] active:scale-[0.98] 
                                ${isSelected ? 'ring-2 ring-sky-400' : ''}`}
                        >
                            <div className="pt-2">
                                <img
                                    src={item.icon}
                                    alt={item.label}
                                    className="w-6 h-6"
                                    style={{ objectFit: 'contain' }}
                                />
                            </div>
                            <div className="bg-white rounded px-2 py-1 w-full text-center min-h-0">
                                <div className="text-xs font-medium text-gray-800 mb-0.5 truncate leading-tight">
                                    {item.label}
                                </div>
                                <div className="flex flex-col items-center gap-0">
                                    <span className="text-sm font-bold leading-none" style={{ color: item.textColor }}>
                                        {item.time}
                                    </span>
                                    <span className="text-xs font-semibold leading-none" style={{ color: item.textColor }}>
                                        ({item.count})
                                    </span>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default AgentStatus2;
