'use client';

import React from 'react';
import { Phone, PhoneIncoming } from 'lucide-react';

interface BarData {
    label: string;
    value: number;
    color: string;
    time: string;
}

interface SectionData {
    title: string;
    icon: React.ReactNode;
    bars: BarData[];
}

const AgentStatus3: React.FC = () => {
    const maxValue = 15;

    const inboundData: SectionData = {
        title: '인바운드',
        icon: <Phone className="w-4 h-4 text-gray-600" />,
        bars: [
            { label: '개인', value: 15, color: 'bg-pink-400', time: '03:12:44(15)' },
            { label: '그룹', value: 1, color: 'bg-teal-400', time: '01:10:44(1)' },
            { label: '팀', value: 1, color: 'bg-sky-400', time: '04:10:44(1)' },
        ],
    };

    const outboundData: SectionData = {
        title: '아웃바운드',
        icon: <PhoneIncoming className="w-4 h-4 text-gray-600" />,
        bars: [
            { label: '개인', value: 15, color: 'bg-pink-400', time: '03:12:44(15)' },
            { label: '그룹', value: 1, color: 'bg-teal-400', time: '01:10:44(1)' },
            { label: '팀', value: 1, color: 'bg-sky-400', time: '04:10:44(1)' },
        ],
    };

    const renderSection = (data: SectionData) => (
        <div className="bg-white p-3 rounded-lg border border-gray-200 mb-2">
            <div className="flex items-center gap-2 mb-2">
                {data.icon}
                <h3 className="text-sm font-semibold text-gray-800">{data.title}</h3>
            </div>

            <div className="flex gap-3">
                {/* Bar Chart */}
                <div className="flex items-end gap-1">
                    {data.bars.map((bar, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                            <div
                                className={`${bar.color} rounded-t-sm flex items-end justify-center text-white font-bold text-xs w-6`}
                                style={{
                                    height: `${(bar.value / maxValue) * 40 + 10}px`,
                                }}
                            >
                                {bar.value}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-1">
                    {data.bars.map((bar, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                                <div className={`w-2 h-2 ${bar.color} rounded`}></div>
                                <span className="text-xs font-medium text-gray-700">{bar.label}</span>
                            </div>
                            <span className="text-xs text-gray-600">{bar.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col bg-white p-2 rounded-lg shadow-md border border-gray-200">
            {renderSection(inboundData)}
            {renderSection(outboundData)}
        </div>
    );
};

export default AgentStatus3;