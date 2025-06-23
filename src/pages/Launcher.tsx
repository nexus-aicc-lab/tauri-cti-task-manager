// src/pages/Launcher.tsx (환경 설정 버튼 추가)
import React, { useState, useEffect } from 'react';
import { emit } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/core';

type Mode = 'launcher' | 'bar' | 'panel';

interface LauncherProps {
    onModeChange: (mode: Mode) => void;
}

// 🆕 딥링크 데이터 인터페이스 추가
interface DeepLinkData {
    timestamp: string;
    url: string;
    scheme: string;
    path: string;
    query_params: [string, string][];
}

export const Launcher: React.FC<LauncherProps> = ({ onModeChange }) => {
    // 🆕 딥링크 히스토리 state 추가
    const [deepLinkHistory, setDeepLinkHistory] = useState<DeepLinkData[]>([]);
    const [isLoadingDeepLinks, setIsLoadingDeepLinks] = useState(false);

    // 🆕 컴포넌트 마운트 시 딥링크 히스토리 로드
    useEffect(() => {
        loadDeepLinkHistory();
    }, []);

    // 🆕 딥링크 히스토리 로드 함수
    const loadDeepLinkHistory = async () => {
        try {
            setIsLoadingDeepLinks(true);
            const historyJson = await invoke<string>('get_deep_link_history');
            const history: DeepLinkData[] = JSON.parse(historyJson);
            setDeepLinkHistory(history.slice(-5).reverse()); // 최근 5개만 역순으로 표시
            console.log('✅ 딥링크 히스토리 로드 완료:', history.length, '개');
        } catch (error) {
            console.error('❌ 딥링크 히스토리 로드 실패:', error);
            setDeepLinkHistory([]);
        } finally {
            setIsLoadingDeepLinks(false);
        }
    };

    // 로그인 창 열기 (새 창)
    const openLoginWindow = async () => {
        try {
            await emit('open-login');
            console.log('📤 로그인 창 열기 요청 전송');
        } catch (error) {
            console.error('❌ 로그인 창 열기 실패:', error);
        }
    };

    // 환경 설정 창 열기 (새 창)
    const openSettingsWindow = async () => {
        try {
            await emit('open-settings');
            console.log('📤 환경 설정 창 열기 요청 전송');
        } catch (error) {
            console.error('❌ 환경 설정 창 열기 실패:', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
            {/* 🆕 딥링크 히스토리 박스 - 상단에 추가 */}
            {(deepLinkHistory.length > 0 || isLoadingDeepLinks) && (
                <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md mb-6 border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-semibold text-blue-800">
                            🌐 Data from Web Request
                        </h2>
                        <div className="flex items-center space-x-2">
                            {isLoadingDeepLinks && (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            )}
                            <button
                                onClick={loadDeepLinkHistory}
                                disabled={isLoadingDeepLinks}
                                className="text-xs text-blue-600 hover:text-blue-800 disabled:text-blue-400 p-1"
                                title="새로고침"
                            >
                                🔄
                            </button>
                        </div>
                    </div>

                    {deepLinkHistory.length > 0 ? (
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                            {deepLinkHistory.map((link, index) => (
                                <div key={index} className="bg-blue-50 rounded-lg p-2 border border-blue-100">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="font-mono text-xs text-blue-700 break-all">
                                                {link.url}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {new Date(link.timestamp).toLocaleString('ko-KR', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                            {link.query_params.length > 0 && (
                                                <div className="mt-1">
                                                    <div className="flex flex-wrap gap-1">
                                                        {link.query_params.slice(0, 3).map(([key, value], paramIndex) => (
                                                            <span key={paramIndex} className="inline-flex items-center px-1 py-0.5 rounded text-xs bg-blue-200 text-blue-800">
                                                                {key}={value.length > 8 ? value.substring(0, 8) + '...' : value}
                                                            </span>
                                                        ))}
                                                        {link.query_params.length > 3 && (
                                                            <span className="inline-flex items-center px-1 py-0.5 rounded text-xs bg-gray-200 text-gray-600">
                                                                +{link.query_params.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-2">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                                {link.scheme}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : !isLoadingDeepLinks ? (
                        <div className="text-center py-3">
                            <div className="text-gray-400 text-sm">
                                📭 No web requests yet
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                Try: <code className="bg-gray-200 px-1 rounded text-xs">cti-personal://test</code>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-3">
                            <div className="text-gray-400 text-sm">Loading...</div>
                        </div>
                    )}
                </div>
            )}

            {/* 기존 메인 콘텐츠 */}
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">
                    CTI Task Master
                </h1>

                <div className="space-y-4">
                    <button
                        onClick={openLoginWindow}
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                        🔐 로그인 (새 창)
                        <div className="text-sm text-purple-100 mt-1">
                            사용자 인증 창 열기 (400x500)
                        </div>
                    </button>

                    <button
                        onClick={() => onModeChange('bar')}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                        📊 바 모드
                        <div className="text-sm text-blue-100 mt-1">
                            작업 표시줄 형태 (1000x40)
                        </div>
                    </button>

                    <button
                        onClick={() => onModeChange('panel')}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                        📋 패널 모드
                        <div className="text-sm text-green-100 mt-1">
                            전체 창 형태 (1200x800)
                        </div>
                    </button>

                    {/* 환경 설정 버튼 */}
                    <button
                        onClick={openSettingsWindow}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                        ⚙️ 환경 설정 (새 창)
                        <div className="text-sm text-orange-100 mt-1">
                            시작 모드 및 앱 설정 (600x700)
                        </div>
                    </button>
                </div>

                {/* 하단 정보 */}
                <div className="mt-8 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                        💡 환경 설정에서 시작 모드를 변경하면<br />
                        다음 실행 시 해당 모드로 바로 시작됩니다.
                    </p>
                </div>
            </div>
        </div>
    );
};