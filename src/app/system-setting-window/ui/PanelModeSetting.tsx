import React, { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { toast } from 'react-toastify';

interface ExtendedCSSProperties extends React.CSSProperties {
    WebkitAppRegion?: 'drag' | 'no-drag';
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

interface PanelModeSettingProps {
    settings: any;
    updateSetting: (key: string, value: any) => void;
}

const PanelModeSetting: React.FC<PanelModeSettingProps> = () => {
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
    const [isSaving, setIsSaving] = useState(false);

    // 키 매핑 함수들
    const toRustFormat = (jsFormat: MetricVisibility): RustMetricVisibility => ({
        service_level: jsFormat.serviceLevel,
        response_rate: jsFormat.responseRate,
        real_incoming_calls: jsFormat.realIncomingCalls,
        answered_calls: jsFormat.answeredCalls,
        abandoned_calls: jsFormat.abandonedCalls,
        unanswered_calls: jsFormat.unansweredCalls,
        transfer_incoming: jsFormat.transferIncoming,
        transfer_answered: jsFormat.transferAnswered,
        transfer_distributed: jsFormat.transferDistributed,
        transfer_turn_service: jsFormat.transferTurnService,
        transfer_failed: jsFormat.transferFailed,
        transfer_regular: jsFormat.transferRegular,
    });

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
    }, []);

    const loadConfig = async () => {
        try {
            setIsLoading(true);
            console.log('🔄 패널 설정 로드 시작');

            const rustSettings = await invoke<RustMetricVisibility>('load_panel_settings');
            const jsSettings = fromRustFormat(rustSettings);

            console.log('📖 로드된 설정:', jsSettings);
            setMetricVisibility(jsSettings);
            console.log('✅ 패널 설정 로드 완료');
        } catch (error) {
            console.error('❌ 설정 로드 실패:', error);
            toast.error('설정 로드에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const saveConfig = async (newConfig: MetricVisibility) => {
        try {
            setIsSaving(true);
            console.log('💾 패널 설정 저장 시작:', newConfig);

            const rustConfig = toRustFormat(newConfig);
            await invoke('save_panel_settings', { settings: rustConfig });

            console.log('✅ 패널 설정 저장 완료');
            toast.success('설정이 저장되었습니다! 🎉');

            // 다른 창에 설정 변경 알림 (패널 모드에서 감지용)
            window.dispatchEvent(new CustomEvent('panel-settings-updated', {
                detail: newConfig
            }));

        } catch (error) {
            console.error('❌ 설정 저장 실패:', error);
            toast.error('설정 저장에 실패했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleMetricToggle = (key: keyof MetricVisibility) => {
        console.log('🔄 메트릭 토글:', key, '현재값:', metricVisibility[key]);

        const newConfig = {
            ...metricVisibility,
            [key]: !metricVisibility[key]
        };

        setMetricVisibility(newConfig);
        saveConfig(newConfig);
    };

    const handleSelectAll = async () => {
        try {
            console.log('🔵 전체 선택');
            await invoke('toggle_all_metrics', { enabled: true });
            await loadConfig(); // 설정 다시 로드
            toast.success('모든 메트릭이 활성화되었습니다!');
        } catch (error) {
            console.error('❌ 전체 선택 실패:', error);
            toast.error('전체 선택에 실패했습니다.');
        }
    };

    const handleDeselectAll = async () => {
        try {
            console.log('🔴 전체 해제');
            await invoke('toggle_all_metrics', { enabled: false });
            await loadConfig(); // 설정 다시 로드
            toast.success('모든 메트릭이 비활성화되었습니다!');
        } catch (error) {
            console.error('❌ 전체 해제 실패:', error);
            toast.error('전체 해제에 실패했습니다.');
        }
    };

    const handleReset = async () => {
        try {
            console.log('🔄 설정 초기화');
            const defaultSettings = await invoke<RustMetricVisibility>('reset_panel_settings');
            const jsSettings = fromRustFormat(defaultSettings);
            setMetricVisibility(jsSettings);
            toast.success('설정이 기본값으로 초기화되었습니다!');
        } catch (error) {
            console.error('❌ 설정 초기화 실패:', error);
            toast.error('설정 초기화에 실패했습니다.');
        }
    };

    const metricItems = [
        { key: 'serviceLevel' as keyof MetricVisibility, label: '서비스레벨', category: 'top' },
        { key: 'responseRate' as keyof MetricVisibility, label: '응답률', category: 'top' },
        { key: 'realIncomingCalls' as keyof MetricVisibility, label: '실인입호수', category: 'top' },
        { key: 'answeredCalls' as keyof MetricVisibility, label: '응답호수', category: 'top' },
        { key: 'abandonedCalls' as keyof MetricVisibility, label: '포기호수', category: 'top' },
        { key: 'unansweredCalls' as keyof MetricVisibility, label: '난서비스호수', category: 'top' },
        { key: 'transferIncoming' as keyof MetricVisibility, label: '그룹호전환(인입)', category: 'transfer' },
        { key: 'transferAnswered' as keyof MetricVisibility, label: '그룹호전환(응답)', category: 'transfer' },
        { key: 'transferDistributed' as keyof MetricVisibility, label: '그룹호전환(분배)', category: 'transfer' },
        { key: 'transferTurnService' as keyof MetricVisibility, label: '그룹호전환(턴서비스)', category: 'transfer' },
        { key: 'transferFailed' as keyof MetricVisibility, label: '그룹호전환(실패)', category: 'transfer' },
        { key: 'transferRegular' as keyof MetricVisibility, label: '그룹호전환(규전환)', category: 'transfer' },
    ];

    const topMetrics = metricItems.filter(item => item.category === 'top');
    const transferMetrics = metricItems.filter(item => item.category === 'transfer');

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-32" style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-sm text-gray-600">설정 로딩 중...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6" style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}>
            {/* Tauri Command 사용 알림 */}
            <div className="text-xs bg-green-50 p-2 rounded border border-green-200">
                🚀 네이티브 파일 시스템 사용 중 (안전하고 빠름)
            </div>

            {/* 상단 메트릭스 설정 */}
            <div>
                <h4 className="text-sm font-medium mb-3" style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}>
                    기본 통계 표시 설정
                </h4>
                <div className="grid grid-cols-2 gap-2">
                    {topMetrics.map(item => (
                        <div key={item.key} className="flex items-center">
                            <input
                                type="checkbox"
                                id={item.key}
                                checked={metricVisibility[item.key]}
                                onChange={() => handleMetricToggle(item.key)}
                                disabled={isSaving}
                                className="mr-2"
                                style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}
                            />
                            <label htmlFor={item.key} className="text-sm cursor-pointer" style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}>
                                {item.label}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* 그룹호 전환 통계 설정 */}
            <div>
                <h4 className="text-sm font-medium mb-3" style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}>
                    그룹호 전환 통계 표시 설정
                </h4>
                <div className="grid grid-cols-2 gap-2">
                    {transferMetrics.map(item => (
                        <div key={item.key} className="flex items-center">
                            <input
                                type="checkbox"
                                id={item.key}
                                checked={metricVisibility[item.key]}
                                onChange={() => handleMetricToggle(item.key)}
                                disabled={isSaving}
                                className="mr-2"
                                style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}
                            />
                            <label htmlFor={item.key} className="text-sm cursor-pointer" style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}>
                                {item.label}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* 버튼들 */}
            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={handleSelectAll}
                    disabled={isSaving}
                    className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
                    style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}
                >
                    전체 선택
                </button>
                <button
                    onClick={handleDeselectAll}
                    disabled={isSaving}
                    className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 disabled:bg-gray-300 transition-colors"
                    style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}
                >
                    전체 해제
                </button>
                <button
                    onClick={handleReset}
                    disabled={isSaving}
                    className="px-3 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600 disabled:bg-orange-300 transition-colors"
                    style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}
                >
                    기본값
                </button>
                <button
                    onClick={loadConfig}
                    disabled={isSaving}
                    className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 disabled:bg-green-300 transition-colors"
                    style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}
                >
                    새로고침
                </button>
            </div>

            {/* 현재 설정 미리보기 */}
            <div className="text-xs bg-gray-50 p-2 rounded border">
                <strong>현재 활성화된 메트릭:</strong> {
                    Object.entries(metricVisibility)
                        .filter(([_, enabled]) => enabled)
                        .map(([key, _]) => metricItems.find(item => item.key === key)?.label)
                        .filter(Boolean)
                        .join(', ') || '없음'
                }
            </div>

            {/* 상태 표시 */}
            {isSaving && (
                <div className="text-xs text-blue-600 flex items-center">
                    <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600 mr-2"></div>
                    저장 중...
                </div>
            )}
        </div>
    );
};

export default PanelModeSetting;