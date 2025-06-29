import React, { useEffect, useState } from 'react';

interface MetricItem {
    label: string;
    value: number | string;
    type: 'percentage' | 'count';
    key: string;
}

// TypeScript 인터페이스 (camelCase)
interface MetricVisibility {
    serviceLevel: boolean;
    responseRate: boolean;
    realIncomingCalls: boolean;
    answeredCalls: boolean;
    abandonedCalls: boolean;
    unansweredCalls: boolean;
    transferIncoming: boolean;
    transferAnswered: boolean;
    transferDistributed: boolean;
    transferTurnService: boolean;
    transferFailed: boolean;
    transferRegular: boolean;
}

const AgentStatusInfoBoxForPanelMode4: React.FC = () => {
    // 🎯 하드코딩된 설정 - 모든 메트릭 표시
    const [metricVisibility] = useState<MetricVisibility>({
        serviceLevel: true,
        responseRate: true,
        realIncomingCalls: true,
        answeredCalls: true,
        abandonedCalls: true,
        unansweredCalls: true,
        transferIncoming: true,
        transferAnswered: true,
        transferDistributed: true,
        transferTurnService: true,
        transferFailed: true,
        transferRegular: true,
    });

    const [isLoading, setIsLoading] = useState(true);

    // 🚀 즉시 로딩 완료
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
            console.log('✅ 하드코딩 모드: 패널 메트릭 표시 준비 완료');
        }, 100);

        // 환경설정에서 변경된 설정 감지 (이벤트 리스너는 유지)
        const handleSettingsUpdate = (event: CustomEvent) => {
            console.log('📡 패널 설정 업데이트 이벤트 감지:', event.detail);
            // 필요하면 여기서 metricVisibility 업데이트
        };

        window.addEventListener('panel-settings-updated', handleSettingsUpdate as EventListener);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('panel-settings-updated', handleSettingsUpdate as EventListener);
        };
    }, []);

    // 🎯 모든 메트릭을 하나의 배열로 통합 (순서대로)
    const allMetrics: MetricItem[] = [
        // 첫 번째 줄 (기본 메트릭)
        { key: 'serviceLevel', label: '서비스레벨', value: 58, type: 'percentage' },
        { key: 'responseRate', label: '응답률', value: 89, type: 'percentage' },
        { key: 'realIncomingCalls', label: '실인입호수', value: 82, type: 'percentage' },
        { key: 'answeredCalls', label: '응답호수', value: 50, type: 'count' },
        { key: 'abandonedCalls', label: '포기호수', value: 8, type: 'count' },
        { key: 'unansweredCalls', label: '난서비스호수', value: 0, type: 'count' },

        // 두 번째 줄 (그룹호 전환 통계) - 더 짧은 라벨 사용
        { key: 'transferIncoming', label: '전환(인입)', value: 0, type: 'count' },
        { key: 'transferAnswered', label: '전환(응답)', value: 0, type: 'count' },
        { key: 'transferDistributed', label: '전환(분배)', value: 0, type: 'count' },
        { key: 'transferTurnService', label: '전환(턴서비스)', value: 0, type: 'count' },
        { key: 'transferFailed', label: '전환(실패)', value: 0, type: 'count' },
        { key: 'transferRegular', label: '전환(규전환)', value: 0, type: 'count' },
    ];

    // 설정에 따라 필터링된 메트릭
    const visibleMetrics = allMetrics.filter(item =>
        metricVisibility[item.key as keyof MetricVisibility]
    );

    const renderMetricItem = (item: MetricItem, index: number) => (
        <div
            key={`${item.key}-${index}`}
            className="flex items-center justify-between px-1.5 py-1.5 bg-gray-50 rounded-md border border-gray-200 min-h-[28px] transition-all duration-200 hover:bg-gray-100 min-w-0"
        >
            <div className="flex items-center gap-1 min-w-0 flex-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                <span className="text-xs font-medium text-gray-700 leading-tight truncate" title={item.label}>
                    {item.label}
                </span>
            </div>
            <span className="text-xs font-semibold text-gray-900 flex-shrink-0 ml-1">
                {item.value}{item.type === 'percentage' ? '%' : ''}
            </span>
        </div>
    );

    if (isLoading) {
        return (
            <div className="h-full bg-white p-2 rounded-lg shadow-md border border-gray-200 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-1"></div>
                    <span className="text-xs text-gray-600">초기화 중...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-white p-2 rounded-lg shadow-md border border-gray-200">
            {/* 🎯 모든 메트릭을 반응형 그리드로 표시 */}
            {visibleMetrics.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1 transition-all duration-300">
                    {visibleMetrics.map((item, idx) => renderMetricItem(item, idx))}
                </div>
            ) : (
                /* 메트릭이 하나도 표시되지 않을 때 */
                <div className="flex items-center justify-center h-20 text-gray-500 text-sm text-center">
                    <div>
                        <div className="text-2xl mb-2">📊</div>
                        <div>표시할 메트릭이 없습니다.</div>
                        <div className="text-xs text-gray-400 mt-1">
                            하드코딩 모드에서 메트릭 설정이 모두 비활성화되어 있습니다.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgentStatusInfoBoxForPanelMode4;