// // src\app\panel-mode\ui\AgentStatusInfoBoxForPanelMode1.tsx
// 'use client';

// import React, { useState } from 'react';
// import { Phone, Edit, Users, Hourglass, Coffee } from 'lucide-react';
// import { Card, CardContent } from "@/shared/ui/card";
// import { Button } from "@/shared/ui/button";
// import RadarStyles from '../ui/styles/RadarStyles';


// type Status = {
//     label: string;
//     time: string;
//     icon: React.ReactNode;
//     color: string;
// };

// const statuses: Status[] = [
//     {
//         label: '통화중',
//         time: '00:03:45',
//         icon: <Phone className="w-4 h-4 text-gray-600" />,
//         color: '#3698A2'
//     },
//     {
//         label: '대기중',
//         time: '12:03:45',
//         icon: <Hourglass className="w-4 h-4 text-gray-600" />,
//         color: '#4199E0'
//     },
//     {
//         label: '후처리',
//         time: '00:34:20',
//         icon: <Edit className="w-4 h-4 text-gray-600" />,
//         color: '#FF947A'
//     },
//     {
//         label: '휴식중',
//         time: '00:01:45',
//         icon: <Coffee className="w-4 h-4 text-gray-600" />,
//         color: '#8B68A5'
//     },
// ];


// const RadarDisplay: React.FC<{
//     statusIndex: number;
//     onClick: () => void;
// }> = ({ statusIndex, onClick }) => {
//     const current = statuses[statusIndex];
//     const bgClasses = ['green-bg', 'blue-bg', 'orange-bg', 'purple-bg'];
//     const sweepClasses = ['green-sweep', 'blue-sweep', 'orange-sweep', 'purple-sweep'];

//     return (
//         <div className="flex-1 flex justify-center items-center mb-2">
//             <div className="radar-container shadow-md">
//                 <div className={`radar-background ${bgClasses[statusIndex]}`} />
//                 <div className={`radar-sweep ${sweepClasses[statusIndex]}`} />
//                 <div className="inner-white-mask" />
//                 <Button
//                     onClick={onClick}
//                     variant="ghost"
//                     className="relative z-20 w-20 h-20 rounded-full flex flex-col items-center justify-center bg-white shadow-lg transition-transform hover:scale-110 active:scale-95"
//                     style={{
//                         boxShadow: `
//               0 2px 6px rgba(0,0,0,0.1),
//               0 3px 15px rgba(0,0,0,0.15),
//               0 0 0 2px ${current.color}20,
//               0 0 15px ${current.color}30
//             `
//                     }}
//                 >
//                     <div className="mb-1">{current.icon}</div>
//                     <div className="text-xs font-bold text-gray-800">{current.label}</div>
//                     <div className="text-xs font-medium text-gray-600">{current.time}</div>
//                 </Button>
//             </div>
//         </div>
//     );
// };

// const StatsCard: React.FC<{
//     icon: React.ReactNode;
//     label: string;
//     value: string | number;
// }> = ({ icon, label, value }) => (
//     <Card className="rounded-md p-2 hover:shadow-sm transition-all duration-300">
//         <CardContent className="p-0">
//             <div className="flex items-center space-x-2">
//                 <div className="w-6 h-6 rounded-full bg-gray-100 border flex items-center justify-center">
//                     {icon}
//                 </div>
//                 <div>
//                     <div className="text-xs text-gray-500 font-medium">{label}</div>
//                     <div className={`text-sm font-bold ${label === '대기호' ? 'text-red-600' : 'text-gray-800'}`}>
//                         {value}
//                     </div>
//                 </div>
//             </div>
//         </CardContent>
//     </Card>
// );

// const AgentStatusInfoBoxForPanelMode1: React.FC = () => {
//     const [statusIndex, setStatusIndex] = useState(0);

//     return (
//         <>
//             <RadarStyles />
//             <div className="h-full bg-gray-50 p-2 rounded-lg shadow-md border flex flex-col min-h-0">
//                 <RadarDisplay
//                     statusIndex={statusIndex}
//                     onClick={() => setStatusIndex((i) => (i + 1) % statuses.length)}
//                 />
//                 <div className="grid grid-cols-2 gap-2 flex-shrink-0">
//                     <StatsCard icon={<Phone className="w-3 h-3 text-gray-600" />} label="대기호" value={5} />
//                     <StatsCard icon={<Users className="w-3 h-3 text-gray-600" />} label="대기 상담" value={1} />
//                 </div>
//             </div>
//         </>
//     );
// };

// export default AgentStatusInfoBoxForPanelMode1;

'use client';

import React from 'react';
import { Phone, Edit, Users, Hourglass, Coffee } from 'lucide-react';
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import RadarStyles from '../ui/styles/RadarStyles';
import { useAgentConsultantStatus } from '../store/useAgentConsultantStatus';

type Status = {
    label: string;
    time: string;
    icon: React.ReactNode;
    color: string;
};

const statuses: Status[] = [
    {
        label: '통화중',
        time: '00:03:45',
        icon: <Phone className="w-4 h-4 text-gray-600" />,
        color: '#3698A2'
    },
    {
        label: '대기중',
        time: '12:03:45',
        icon: <Hourglass className="w-4 h-4 text-gray-600" />,
        color: '#4199E0'
    },
    {
        label: '후처리',
        time: '00:34:20',
        icon: <Edit className="w-4 h-4 text-gray-600" />,
        color: '#FF947A'
    },
    {
        label: '휴식중',
        time: '00:01:45',
        icon: <Coffee className="w-4 h-4 text-gray-600" />,
        color: '#8B68A5'
    },
];

const RadarDisplay: React.FC<{
    statusIndex: number;
    onClick: () => void;
}> = ({ statusIndex, onClick }) => {
    const current = statuses[statusIndex];
    const bgClasses = ['green-bg', 'blue-bg', 'orange-bg', 'purple-bg'];
    const sweepClasses = ['green-sweep', 'blue-sweep', 'orange-sweep', 'purple-sweep'];

    return (
        <div className="flex-1 flex justify-center items-center mb-2">
            <div className="radar-container shadow-md">
                <div className={`radar-background ${bgClasses[statusIndex]}`} />
                <div className={`radar-sweep ${sweepClasses[statusIndex]}`} />
                <div className="inner-white-mask" />
                <Button
                    onClick={onClick}
                    variant="ghost"
                    className="relative z-20 w-20 h-20 rounded-full flex flex-col items-center justify-center bg-white shadow-lg transition-transform hover:scale-110 active:scale-95"
                    style={{
                        boxShadow: `
              0 2px 6px rgba(0,0,0,0.1),
              0 3px 15px rgba(0,0,0,0.15),
              0 0 0 2px ${current.color}20,
              0 0 15px ${current.color}30
            `
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

const StatsCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string | number;
}> = ({ icon, label, value }) => (
    <Card className="rounded-md p-2 hover:shadow-sm transition-all duration-300">
        <CardContent className="p-0">
            <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-gray-100 border flex items-center justify-center">
                    {icon}
                </div>
                <div>
                    <div className="text-xs text-gray-500 font-medium">{label}</div>
                    <div className={`text-sm font-bold ${label === '대기호' ? 'text-red-600' : 'text-gray-800'}`}>
                        {value}
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
);

const AgentStatusInfoBoxForPanelMode1: React.FC = () => {
    const { data1, updateData1 } = useAgentConsultantStatus();

    return (
        <>
            <RadarStyles />
            <div className="h-full bg-gray-50 p-2 rounded-lg shadow-md border flex flex-col min-h-0">
                <RadarDisplay
                    statusIndex={data1.statusIndex}
                    onClick={() =>
                        updateData1({
                            statusIndex: (data1.statusIndex + 1) % statuses.length,
                        })
                    }
                />
                <div className="grid grid-cols-2 gap-2 flex-shrink-0">
                    <StatsCard icon={<Phone className="w-3 h-3 text-gray-600" />} label="대기호" value={data1.waitingCalls} />
                    <StatsCard icon={<Users className="w-3 h-3 text-gray-600" />} label="대기 상담" value={data1.waitingAgents} />
                </div>
            </div>
        </>
    );
};

export default AgentStatusInfoBoxForPanelMode1;
