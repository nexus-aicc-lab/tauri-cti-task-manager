import React, { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

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

// Rust 구조체 (snake_case)
interface RustMetricVisibility {
    service_level: boolean;
    response_rate: boolean;
    real_incoming_calls: boolean;
    answered_calls: boolean;
    abandoned_calls: boolean;
    unanswered_calls: boolean;
    transfer_incoming: boolean;
    transfer_answered: boolean;
    transfer_distributed: boolean;
    transfer_turn_service: boolean;
    transfer_failed: boolean;
    transfer_regular: boolean;
}

const AgentStatusInfoBoxForPanelMode4: React.FC = () => {
    const [metricVisibility, setMetricVisibility] = useState<MetricVisibility>({
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
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    // 키 변환 함수
    const fromRustFormat = (rustFormat: RustMetricVisibility): MetricVisibility => ({
        serviceLevel: rustFormat.service_level,
        responseRate: rustFormat.response_rate,
        realIncomingCalls: rustFormat.real_incoming_calls,
        answeredCalls: rustFormat.answered_calls,
        abandonedCalls: rustFormat.abandoned_calls,
        unansweredCalls: rustFormat.unanswered_calls,
        transferIncoming: rustFormat.transfer_incoming,
        transferAnswered: rustFormat.transfer_answered,
        transferDistributed: rustFormat.transfer_distributed,
        transferTurnService: rustFormat.transfer_turn_service,
        transferFailed: rustFormat.transfer_failed,
        transferRegular: rustFormat.transfer_regular,
    });

    // 설정 로드
    useEffect(() => {
        loadConfig();

        // 환경설정에서 변경된 설정 감지
        const handleSettingsUpdate = (event: CustomEvent) => {
            console.log('📡 패널 설정 업데이트 이벤트 감지:', event.detail);
            setMetricVisibility(event.detail);
            setLastUpdated(new Date());
        };

        window.addEventListener('panel-settings-updated', handleSettingsUpdate as EventListener);

        // 주기적으로 설정 확인 (5초마다)
        const interval = setInterval(() => {
            loadConfig();
        }, 5000);

        return () => {
            window.removeEventListener('panel-settings-updated', handleSettingsUpdate as EventListener);
            clearInterval(interval);
        };
    }, []);

    const loadConfig = async () => {
        try {
            console.log('🔄 패널에서 설정 로드');

            const rustSettings = await invoke<RustMetricVisibility>('load_panel_settings');
            const jsSettings = fromRustFormat(rustSettings);

            console.log('📖 패널 로드된 설정:', jsSettings);
            setMetricVisibility(jsSettings);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('❌ 패널 설정 로드 실패:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // 전체 메트릭 데이터 (실제 데이터는 API에서 가져와야 함)
    const allTopMetrics: MetricItem[] = [
        { key: 'serviceLevel', label: '서비스레벨', value: 58, type: 'percentage' },
        { key: 'responseRate', label: '응답률', value: 58, type: 'percentage' },
        { key: 'realIncomingCalls', label: '실인입호수', value: 58, type: 'percentage' },
        { key: 'answeredCalls', label: '응답호수', value: 50, type: 'count' },
        { key: 'abandonedCalls', label: '포기호수', value: 8, type: 'count' },
        { key: 'unansweredCalls', label: '난서비스호수', value: 8, type: 'count' },
    ];

    const allTransferStats: MetricItem[] = [
        { key: 'transferIncoming', label: '그룹호전환\n(인입)', value: 5, type: 'count' },
        { key: 'transferAnswered', label: '그룹호전환\n(응답)', value: 5, type: 'count' },
        { key: 'transferDistributed', label: '그룹호전환\n(분배)', value: 5, type: 'count' },
        { key: 'transferTurnService', label: '그룹호전환\n(턴서비스)', value: 5, type: 'count' },
        { key: 'transferFailed', label: '그룹호전환\n(실패)', value: 5, type: 'count' },
        { key: 'transferRegular', label: '그룹호전환\n(규전환)', value: 5, type: 'count' },
    ];

    // 설정에 따라 필터링된 메트릭
    const visibleTopMetrics = allTopMetrics.filter(item =>
        metricVisibility[item.key as keyof MetricVisibility]
    );

    const visibleTransferStats = allTransferStats.filter(item =>
        metricVisibility[item.key as keyof MetricVisibility]
    );

    const renderMetricItem = (item: MetricItem, index: number) => (
        <div
            key={`${item.key}-${index}`}
            className="flex items-center justify-between px-2 py-2 bg-gray-50 rounded-md border border-gray-200 min-h-[32px] transition-all duration-200 hover:bg-gray-100"
        >
            <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                <span className="text-xs font-medium text-gray-700 whitespace-pre-line leading-tight">
                    {item.label}
                </span>
            </div>
            <span className="text-xs font-semibold text-gray-900 flex-shrink-0">
                {item.value}{item.type === 'percentage' ? '%' : ''}
            </span>
        </div>
    );

    // 동적 그리드 컬럼 계산
    const getGridCols = (itemCount: number) => {
        if (itemCount === 0) return 'grid-cols-1';
        if (itemCount <= 2) return `grid-cols-${itemCount}`;
        if (itemCount <= 3) return 'grid-cols-3';
        if (itemCount <= 4) return 'grid-cols-4';
        if (itemCount <= 5) return 'grid-cols-5';
        return 'grid-cols-6';
    };

    // 활성화된 메트릭 개수
    const activeMetricsCount = visibleTopMetrics.length + visibleTransferStats.length;

    if (isLoading) {
        return (
            <div className="h-full bg-white p-2 rounded-lg shadow-md border border-gray-200 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <span className="text-sm text-gray-600">설정 로딩 중...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-white p-2 rounded-lg shadow-md border border-gray-200 flex flex-col">

            {/* 상단 메트릭스 */}
            {visibleTopMetrics.length > 0 && (
                <div className="mb-2">
                    <div className={`grid ${getGridCols(visibleTopMetrics.length)} gap-1 transition-all duration-300`}>
                        {visibleTopMetrics.map((item, idx) => renderMetricItem(item, idx))}
                    </div>
                </div>
            )}

            {/* 하단 그룹호 전환 통계 */}
            <div className="flex-1">
                {visibleTransferStats.length > 0 && (
                    <div className={`grid ${getGridCols(visibleTransferStats.length)} gap-1 mb-2 transition-all duration-300`}>
                        {visibleTransferStats.map((item, idx) => renderMetricItem(item, idx))}
                    </div>
                )}

                {/* 메트릭이 하나도 표시되지 않을 때 */}
                {visibleTopMetrics.length === 0 && visibleTransferStats.length === 0 && (
                    <div className="flex items-center justify-center h-20 text-gray-500 text-sm text-center">
                        <div>
                            <div className="text-2xl mb-2">📊</div>
                            <div>표시할 메트릭이 없습니다.</div>
                            <div className="text-xs text-gray-400 mt-1">
                                환경설정 → 패널설정에서 항목을 선택하세요.
                            </div>
                            <button
                                onClick={loadConfig}
                                className="mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                            >
                                새로고침
                            </button>
                        </div>
                    </div>
                )}

                {/* LogOn 정보 */}
                {activeMetricsCount > 0 && (
                    <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-xs">
                        <span className="font-medium text-gray-700">LogOn : 44:42:17</span>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 animate-pulse"></div>
                            <span className="text-green-600 font-bold">온라인</span>
                        </div>
                    </div>
                )}
            </div>

            {/* 하단 상태 표시 */}
            <div className="flex justify-between items-center text-xs text-gray-400 mt-1">
                <span>🚀 네이티브 저장소</span>
                <button
                    onClick={loadConfig}
                    className="hover:text-blue-500 transition-colors"
                    title="설정 새로고침"
                >
                    🔄
                </button>
            </div>
        </div>
    );
};

export default AgentStatusInfoBoxForPanelMode4;