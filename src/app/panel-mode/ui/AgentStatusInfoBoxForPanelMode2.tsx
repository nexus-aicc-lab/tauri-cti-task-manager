import React from 'react';
import { Hourglass, Phone, Edit, Coffee } from 'lucide-react';

const AgentStatusInfoBoxForPanelMode2: React.FC = () => {
    const formatTime = (hours: number, minutes: number, seconds: number) => {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const items = [
        {
            icon: <Hourglass size={16} className="text-white" />,
            label: '대기',
            time: formatTime(12, 0, 34),
            count: 15,
            bg: 'bg-blue-100',
            iconBg: 'bg-blue-500',
            textColor: 'text-blue-600',
        },
        {
            icon: <Phone size={16} className="text-white" />,
            label: '통화',
            time: formatTime(12, 50, 20),
            count: 12,
            bg: 'bg-teal-100',
            iconBg: 'bg-teal-500',
            textColor: 'text-teal-600',
        },
        {
            icon: <Edit size={16} className="text-white" />,
            label: '후처리',
            time: formatTime(0, 34, 20),
            count: 15,
            bg: 'bg-orange-100',
            iconBg: 'bg-orange-500',
            textColor: 'text-orange-600',
        },
        {
            icon: <Coffee size={16} className="text-white" />,
            label: '휴식',
            time: formatTime(0, 0, 0),
            count: 0,
            bg: 'bg-purple-100',
            iconBg: 'bg-purple-500',
            textColor: 'text-purple-600',
        },
    ];

    return (
        <div className="h-full bg-white p-2 rounded-lg shadow-md border border-gray-200">
            <div className="grid grid-cols-2 gap-2 h-full">
                {items.map((item, idx) => (
                    <div
                        key={idx}
                        className={`${item.bg} rounded-lg p-3 flex flex-col items-center justify-between shadow-sm`}
                    >
                        <div className={`${item.iconBg} w-8 h-8 rounded-full flex items-center justify-center mb-2`}>
                            {item.icon}
                        </div>

                        <div className="bg-white rounded-lg p-2 w-full text-center">
                            <div className="text-xs font-medium text-gray-800 mb-1">
                                {item.label}
                            </div>
                            <div className={`text-sm font-bold ${item.textColor} mb-1`}>
                                {item.time}
                            </div>
                            <div className={`text-xs font-semibold ${item.textColor}`}>
                                ({item.count})
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AgentStatusInfoBoxForPanelMode2;