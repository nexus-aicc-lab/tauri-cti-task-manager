import React, { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

interface MetricItem {
    label: string;
    value: number | string;
    type: 'percentage' | 'count';
    key: string;
}

interface StatisticsSettings {
    row_settings: Record<string, string[]>;
    active_rows: number[];
    timestamp?: string;
}

const AgentStatusInfoBoxForPanelMode4: React.FC = () => {
    const [rowSettings, setRowSettings] = useState<Record<string, string[]>>({});
    const [isLoading, setIsLoading] = useState(true);

    // 🎯 파일 시스템에서 데이터 불러오기
    const loadSettingsFromFile = async () => {
        try {
            setIsLoading(true);
            const loadedSettings: StatisticsSettings = await invoke('load_statistics_settings');
            console.log('📂 불러온 설정:', loadedSettings);
            if (loadedSettings?.row_settings) {
                setRowSettings(loadedSettings.row_settings);
            }
        } catch (error) {
            console.error('❌ 설정 불러오기 실패:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadSettingsFromFile();
    }, []);

    // 🎯 모든 메트릭을 하나의 배열로 통합 (순서대로)
    const allMetrics: MetricItem[] = [
        { key: 'realIncomingCalls', label: '실인입호수', value: 82, type: 'percentage' },
        { key: 'abandonedCalls', label: '포기호수', value: 8, type: 'count' },
        { key: 'unansweredCalls', label: '넌서비스호수', value: 0, type: 'count' },
        { key: 'transferIncoming', label: '외부호전환호수', value: 5, type: 'count' },
        { key: 'transferAnswered', label: '그룹호전환 인입', value: 3, type: 'count' },
        { key: 'groupTransferAbandoned', label: '그룹호전환포기', value: 2, type: 'count' },
        { key: 'failureCalls', label: '실패호수', value: 1, type: 'count' },
        { key: 'callTransferIncoming', label: '콜호전환 인입', value: 4, type: 'count' },
        { key: 'groupTransferQueue', label: '그룹호전환 큐전환', value: 7, type: 'count' },
        { key: 'groupTransferUnanswered', label: '그룹호전환 넌서비스', value: 6, type: 'count' },
        { key: 'groupTransferNS', label: '그룹호전환 ns', value: 9, type: 'count' },
        { key: 'groupTransferDistribution', label: '그룹호전환 분배', value: 10, type: 'count' },
    ];

    // 각 행별로 필터링된 메트릭
    const getMetricsForRow = (rowKey: string) =>
        allMetrics.filter(item => rowSettings[rowKey]?.includes(item.label));

    const renderMetricItem = (item: MetricItem, index: number) => (
        <div
            key={`${item.key}-${index}`}
            className="flex items-center justify-between px-1 py-0.5 bg-gray-50 rounded-md border border-gray-200 min-h-[24px] transition-all duration-200 hover:bg-gray-100 min-w-0"
        >
            <div className="flex items-center gap-1 min-w-0 flex-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" />
                <span
                    className="text-xs font-medium text-gray-700 leading-tight truncate"
                    title={item.label}
                >
                    {item.label}
                </span>
            </div>
            <span className="text-xs font-semibold text-gray-900 flex-shrink-0 ml-1">
                {item.value}
                {item.type === 'percentage' ? '%' : ''}
            </span>
        </div>
    );

    if (isLoading) {
        return (
            <div className="h-full bg-white px-2 py-1 rounded-lg shadow-md border border-gray-200 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-1" />
                    <span className="text-xs text-gray-600">초기화 중...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-white px-2 py-1 rounded-lg shadow-md border border-gray-200">
            {/* 🎯 각 행별로 메트릭을 표시 */}
            {['row1', 'row2', 'row3'].map(rowKey => {
                const metrics = getMetricsForRow(rowKey);
                return (
                    metrics.length > 0 && (
                        <div key={rowKey} className="mb-1 pl-0">
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-1 gap-y-0">
                                {metrics.map((item, idx) => renderMetricItem(item, idx))}
                            </div>
                        </div>
                    )
                );
            })}
        </div>
    );
};

export default AgentStatusInfoBoxForPanelMode4;
