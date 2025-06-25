import React from 'react';
import { PhoneCall, Phone, Clock, Coffee } from 'lucide-react';

const AgentStatusInfoBoxForPanelMode2 = () => {
    const items = [
        {
            icon: <PhoneCall size={24} className="text-blue-600 mb-2" />,
            label: '통화',
            value: 20,
            bg: 'bg-blue-100',
            border: 'border-blue-200',
            text: 'text-blue-700',
        },
        {
            icon: <Phone size={24} className="text-green-600 mb-2" />,
            label: '대기',
            value: 5,
            bg: 'bg-green-100',
            border: 'border-green-200',
            text: 'text-green-700',
        },
        {
            icon: <Clock size={24} className="text-orange-600 mb-2" />,
            label: '후처리',
            value: 20,
            bg: 'bg-orange-100',
            border: 'border-orange-200',
            text: 'text-orange-700',
        },
        {
            icon: <Coffee size={24} className="text-purple-600 mb-2" />,
            label: '휴식',
            value: 13,
            bg: 'bg-purple-100',
            border: 'border-purple-200',
            text: 'text-purple-700',
        },
    ];

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">상담사 상태</h2>
            <div className="grid grid-cols-2 grid-rows-2 gap-3 w-full">
                {items.map((item, idx) => (
                    <div
                        key={idx}
                        className={`flex flex-col items-center p-4 ${item.bg} ${item.border} rounded-lg`}
                    >
                        {item.icon}
                        <div className="text-sm font-medium text-gray-700 mb-1">{item.label}</div>
                        <div className={`font-bold ${item.text}`}>{item.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AgentStatusInfoBoxForPanelMode2;
