import React from 'react';
import { Pause, Headphones, Clock, Coffee } from 'lucide-react';

const AgentStatusKorean = () => {
    const formatTime = (hours: number, minutes: number, seconds: number) => {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const items = [
        {
            icon: <Pause size={28} className="text-gray-600 mb-2" />,
            label: '대기',
            time: formatTime(0, 53, 44),
            count: 10,
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-gray-700',
        },
        {
            icon: <Headphones size={28} className="text-gray-600 mb-2" />,
            label: '통화',
            time: formatTime(4, 53, 44),
            count: 20,
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-gray-700',
        },
        {
            icon: <Clock size={28} className="text-gray-600 mb-2" />,
            label: '후처리',
            time: formatTime(2, 53, 44),
            count: 20,
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-gray-700',
        },
        {
            icon: <Coffee size={28} className="text-gray-600 mb-2" />,
            label: '휴식',
            time: formatTime(0, 43, 44),
            count: 13,
            bg: 'bg-gray-50',
            border: 'border-gray-200',
            text: 'text-gray-700',
        },
    ];

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col">

            <div className="grid grid-cols-2 gap-4">
                {items.map((item, idx) => (
                    <div
                        key={idx}
                        className={`flex flex-col items-center justify-center p-6 ${item.bg} ${item.border} border rounded-xl aspect-square`}
                    >
                        {item.icon}
                        <div className="text-base font-medium text-gray-800 mb-2">
                            {item.label}
                        </div>
                        <div className="text-sm text-gray-600 mb-1">
                            {item.time}({item.count})
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AgentStatusKorean;