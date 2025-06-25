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
    const inboundData: SectionData = {
        title: '인바운드',
        icon: <Phone className="w-5 h-5" />,
        bars: [
            { label: '그룹', value: 8, color: 'bg-green-500', time: '05:53:44(8)' },
            { label: '개인', value: 5, color: 'bg-blue-500', time: '03:53:44(5)' },
            { label: '팀', value: 7, color: 'bg-purple-500', time: '04:53:44(7)' }
        ]
    };

    const outboundData: SectionData = {
        title: '아웃바운드',
        icon: <PhoneIncoming className="w-5 h-5" />,
        bars: [
            { label: '그룹', value: 8, color: 'bg-green-500', time: '05:53:44(8)' },
            { label: '개인', value: 5, color: 'bg-blue-500', time: '03:53:44(5)' },
            { label: '팀', value: 7, color: 'bg-purple-500', time: '04:53:44(7)' }
        ]
    };

    const maxValue: number = 10;

    const renderSection = (data: SectionData): JSX.Element => (
        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-4">
            <div className="flex items-center gap-2 mb-4">
                {data.icon}
                <h3 className="text-lg font-semibold text-gray-800">{data.title}</h3>
            </div>

            <div className="flex gap-6">
                {/* Chart */}
                <div className="flex items-end gap-2">
                    {data.bars.map((bar: BarData, idx: number) => (
                        <div key={idx} className="flex flex-col items-center">
                            <div
                                className={`${bar.color} rounded-t-md flex items-end justify-center text-white font-bold text-lg w-12`}
                                style={{ height: `${(bar.value / maxValue) * 80 + 20}px` }}
                            >
                                {bar.value}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-2">
                    {data.bars.map((bar: BarData, idx: number) => (
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