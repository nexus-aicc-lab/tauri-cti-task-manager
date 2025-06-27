import React from 'react';

interface MetricItem {
    label: string;
    value: number | string;
    type: 'percentage' | 'count';
}

const AgentStatusInfoBoxForPanelMode4: React.FC = () => {
    const topMetrics: MetricItem[] = [
        { label: '서비스레벨', value: 58, type: 'percentage' },
        { label: '응답률', value: 58, type: 'percentage' },
        { label: '실인입호수', value: 58, type: 'percentage' },
        { label: '응답호수', value: 50, type: 'count' },
        { label: '포기호수', value: 8, type: 'count' },
        { label: '난서비스호수', value: 8, type: 'count' },
    ];

    const transferStats: MetricItem[] = [
        { label: '그룹호전환\n(인입)', value: 5, type: 'count' },
        { label: '그룹호전환\n(응답)', value: 5, type: 'count' },
        { label: '그룹호전환\n(분배)', value: 5, type: 'count' },
        { label: '그룹호전환\n(턴서비스)', value: 5, type: 'count' },
        { label: '그룹호전환\n(실패)', value: 5, type: 'count' },
        { label: '그룹호전환\n(규전환)', value: 5, type: 'count' },
    ];

    const renderMetricItem = (item: MetricItem, index: number) => (
        <div
            key={index}
            className="flex items-center justify-between px-2 py-2 bg-gray-50 rounded-md border border-gray-200 min-h-[32px]"
        >
            <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-xs font-medium text-gray-700 whitespace-pre-line leading-tight">
                    {item.label}
                </span>
            </div>
            <span className="text-xs font-semibold text-gray-900">
                {item.value}{item.type === 'percentage' ? '%' : ''}
            </span>
        </div>
    );

    return (
        <div className="h-full bg-white p-2 rounded-lg shadow-md border border-gray-200 flex flex-col">
            {/* 상단 메트릭스 */}
            <div className="mb-2">
                <div className="grid grid-cols-6 gap-1">
                    {topMetrics.map((item, idx) => renderMetricItem(item, idx))}
                </div>
            </div>

            {/* 하단 그룹호 전환 통계 */}
            <div className="flex-1">
                <div className="grid grid-cols-6 gap-1 mb-2">
                    {transferStats.map((item, idx) => renderMetricItem(item, idx))}
                </div>

                {/* LogOn 정보 */}
                <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-xs">
                    <span className="font-medium text-gray-700">LogOn : 44:42:17</span>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-600 font-bold">온라인</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentStatusInfoBoxForPanelMode4;