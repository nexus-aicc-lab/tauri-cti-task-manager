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

const AgentStatusInfoBoxForPanelMode3: React.FC = () => {
    // 최대값 (차트 높이 계산용)
    const maxValue = 15;

    const inboundData: SectionData = {
        title: '인바운드',
        icon: <Phone className="w-5 h-5 text-gray-600" />,
        bars: [
            { label: '개인', value: 15, color: 'bg-pink-400', time: '03:12:44(15)' },
            { label: '그룹', value: 1, color: 'bg-teal-400', time: '01:10:44(1)' },
            { label: '팀', value: 1, color: 'bg-sky-400', time: '04:10:44(1)' },
        ],
    };

    const outboundData: SectionData = {
        title: '아웃바운드',
        icon: <PhoneIncoming className="w-5 h-5 text-gray-600" />,
        bars: [
            { label: '개인', value: 15, color: 'bg-pink-400', time: '03:12:44(15)' },
            { label: '그룹', value: 1, color: 'bg-teal-400', time: '01:10:44(1)' },
            { label: '팀', value: 1, color: 'bg-sky-400', time: '04:10:44(1)' },
        ],
    };

    const renderSection = (data: SectionData) => (
        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-4">
            <div className="flex items-center gap-2 mb-4">
                {data.icon}
                <h3 className="text-lg font-semibold text-gray-800">{data.title}</h3>
            </div>

            <div className="flex gap-6">
                {/* Bar Chart */}
                <div className="flex items-end gap-2">
                    {data.bars.map((bar, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                            <div
                                className={`${bar.color} rounded-t-md flex items-end justify-center text-white font-bold text-lg w-12`}
                                style={{
                                    height: `${(bar.value / maxValue) * 80 + 20}px`,
                                }}
                            >
                                {bar.value}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-2">
                    {data.bars.map((bar, idx) => (
                        <div key={idx} className="flex items-center justify-between py-1">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 ${bar.color} rounded`}></div>
                                <span className="text-sm font-medium text-gray-700">{bar.label}</span>
                            </div>
                            <span className="text-sm text-gray-600">{bar.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col bg-white rounded-xl shadow-md border border-gray-200">
            {renderSection(inboundData)}
            {renderSection(outboundData)}
        </div>
    );
};

export default AgentStatusInfoBoxForPanelMode3;
