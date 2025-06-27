// // AgentStatusInfoBoxForPanelMode2 (Responsive)
// import React from 'react';
// import { Pause, Headphones, Clock, Coffee } from 'lucide-react';

// const AgentStatusInfoBoxForPanelMode2: React.FC = () => {
//     const formatTime = (hours: number, minutes: number, seconds: number) => {
//         return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
//     };

//     const items = [
//         {
//             icon: <Pause size={20} className="text-gray-600 mb-1 sm:mb-2" />,
//             label: '대기',
//             time: formatTime(0, 53, 44),
//             count: 10,
//             bg: 'bg-blue-50',
//             border: 'border-blue-200',
//             text: 'text-gray-700',
//         },
//         {
//             icon: <Headphones size={20} className="text-gray-600 mb-1 sm:mb-2" />,
//             label: '통화',
//             time: formatTime(4, 53, 44),
//             count: 20,
//             bg: 'bg-red-50',
//             border: 'border-red-200',
//             text: 'text-gray-700',
//         },
//         {
//             icon: <Clock size={20} className="text-gray-600 mb-1 sm:mb-2" />,
//             label: '후처리',
//             time: formatTime(2, 53, 44),
//             count: 20,
//             bg: 'bg-green-50',
//             border: 'border-green-200',
//             text: 'text-gray-700',
//         },
//         {
//             icon: <Coffee size={20} className="text-gray-600 mb-1 sm:mb-2" />,
//             label: '휴식',
//             time: formatTime(0, 43, 44),
//             count: 13,
//             bg: 'bg-gray-50',
//             border: 'border-gray-200',
//             text: 'text-gray-700',
//         },
//     ];

//     return (
//         <div className="bg-white p-3 sm:p-6 rounded-xl shadow-md border border-gray-200 flex flex-col h-full">
//             <div className="grid grid-cols-2 gap-2 sm:gap-4 h-full">
//                 {items.map((item, idx) => (
//                     <div
//                         key={idx}
//                         className={`flex flex-col items-center justify-center p-3 sm:p-6 ${item.bg} ${item.border} border rounded-xl aspect-square`}
//                     >
//                         {item.icon}
//                         <div className="text-sm sm:text-base font-medium text-gray-800 mb-1 sm:mb-2">
//                             {item.label}
//                         </div>
//                         <div className="text-xs sm:text-sm text-gray-600 mb-1">
//                             {item.time}({item.count})
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default AgentStatusInfoBoxForPanelMode2;

import React from 'react';
import { Hourglass, Phone, Edit, Coffee } from 'lucide-react';

const AgentStatusInfoBoxForPanelMode2: React.FC = () => {
    const formatTime = (hours: number, minutes: number, seconds: number) => {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const items = [
        {
            icon: <Hourglass size={28} className="text-white" />,
            label: '대기',
            time: formatTime(12, 0, 34),
            count: 15,
            bg: 'bg-blue-100',
            iconBg: 'bg-blue-500',
            textColor: 'text-blue-600',
        },
        {
            icon: <Phone size={28} className="text-white" />,
            label: '통화',
            time: formatTime(12, 50, 20),
            count: 12,
            bg: 'bg-teal-100',
            iconBg: 'bg-teal-500',
            textColor: 'text-teal-600',
        },
        {
            icon: <Edit size={28} className="text-white" />,
            label: '후처리',
            time: formatTime(0, 34, 20),
            count: 15,
            bg: 'bg-orange-100',
            iconBg: 'bg-orange-500',
            textColor: 'text-orange-600',
        },
        {
            icon: <Coffee size={28} className="text-white" />,
            label: '휴식',
            time: formatTime(0, 0, 0),
            count: 0,
            bg: 'bg-purple-100',
            iconBg: 'bg-purple-500',
            textColor: 'text-purple-600',
        },
    ];

    return (
        <div className="p-4 sm:p-6">
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {items.map((item, idx) => (
                    <div
                        key={idx}
                        className={`${item.bg} rounded-2xl p-6 flex flex-col items-center justify-between shadow-sm aspect-square`}
                    >
                        <div className={`${item.iconBg} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
                            {item.icon}
                        </div>

                        <div className="bg-white rounded-xl p-4 w-full text-center">
                            <div className="text-base font-medium text-gray-800 mb-2">
                                {item.label}
                            </div>
                            <div className={`text-xl font-bold ${item.textColor} mb-1`}>
                                {item.time}
                            </div>
                            <div className={`text-lg font-semibold ${item.textColor}`}>
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