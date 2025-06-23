// src/pages/Launcher.tsx (개선된 딥링크 표시)
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

// 🎨 파싱된 로그인 데이터 인터페이스
interface ParsedLoginData {
    username: string;
    department: string;
    role: string;
    email: string;
    safeToken: string;
    timestamp: string;
    sessionId: string;
    loginMethod: string;
    koreanSupport: string;
    version: string;
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
            setDeepLinkHistory(history.slice(-3).reverse()); // 최근 3개만 역순으로 표시
            console.log('✅ 딥링크 히스토리 로드 완료:', history.length, '개');
        } catch (error) {
            console.error('❌ 딥링크 히스토리 로드 실패:', error);
            setDeepLinkHistory([]);
        } finally {
            setIsLoadingDeepLinks(false);
        }
    };

    // 🎨 로그인 데이터 파싱 함수
    const parseLoginData = (link: DeepLinkData): ParsedLoginData | null => {
        try {
            const paramsMap = new Map(link.query_params);
            return {
                username: paramsMap.get('username') || 'Unknown',
                department: paramsMap.get('department') || 'Unknown',
                role: paramsMap.get('role') || 'Unknown',
                email: paramsMap.get('email') || 'Unknown',
                safeToken: paramsMap.get('safe_token') || '',
                timestamp: paramsMap.get('timestamp') || '',
                sessionId: paramsMap.get('session_id') || '',
                loginMethod: paramsMap.get('login_method') || '',
                koreanSupport: paramsMap.get('korean_support') || '',
                version: paramsMap.get('version') || ''
            };
        } catch {
            return null;
        }
    };

    // 🎨 부서명 한글 변환
    const getDepartmentName = (dept: string) => {
        const deptMap: Record<string, string> = {
            'dev': '개발팀',
            'design': '디자인팀',
            'marketing': '마케팅팀',
            'sales': '영업팀',
            'hr': '인사팀'
        };
        return deptMap[dept] || dept;
    };

    // 🎨 역할명 한글 변환
    const getRoleName = (role: string) => {
        const roleMap: Record<string, string> = {
            'user': '일반 사용자',
            'manager': '팀장',
            'admin': '관리자'
        };
        return roleMap[role] || role;
    };

    // 🎨 토큰 축약 함수
    const shortenToken = (token: string) => {
        if (!token) return '';
        return token.length > 20 ? `${token.substring(0, 15)}...` : token;
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            {/* 🎨 개선된 딥링크 히스토리 박스 */}
            {(deepLinkHistory.length > 0 || isLoadingDeepLinks) && (
                <div className="bg-white rounded-xl shadow-lg p-5 w-full max-w-lg mb-6 border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                            🌐 웹 요청 데이터
                        </h2>
                        <div className="flex items-center space-x-2">
                            {isLoadingDeepLinks && (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            )}
                            <button
                                onClick={loadDeepLinkHistory}
                                disabled={isLoadingDeepLinks}
                                className="text-xs text-blue-600 hover:text-blue-800 disabled:text-blue-400 p-2 rounded-full hover:bg-blue-50 transition-colors"
                                title="새로고침"
                            >
                                🔄
                            </button>
                        </div>
                    </div>

                    {deepLinkHistory.length > 0 ? (
                        <div className="space-y-3 max-h-80 overflow-y-auto">
                            {deepLinkHistory.map((link, index) => {
                                const loginData = parseLoginData(link);
                                const isLoginRequest = link.path.includes('/login') || link.url.includes('login');

                                return (
                                    <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100 shadow-sm">
                                        {/* 상단: 타입과 시간 */}
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isLoginRequest
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {isLoginRequest ? '🔐 로그인' : '🔗 일반'}
                                                </span>
                                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                    {link.scheme}://
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {new Date(link.timestamp).toLocaleString('ko-KR', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit'
                                                })}
                                            </div>
                                        </div>

                                        {/* 중간: 로그인 정보 (로그인 요청인 경우) */}
                                        {isLoginRequest && loginData ? (
                                            <div className="bg-white rounded-lg p-3 mb-3 border border-blue-200">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-medium text-gray-600">👤 사용자</span>
                                                        <span className="text-sm font-semibold text-gray-900">{loginData.username}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-medium text-gray-600">🏢 부서</span>
                                                        <span className="text-sm text-gray-900">{getDepartmentName(loginData.department)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-medium text-gray-600">⭐ 역할</span>
                                                        <span className="text-sm text-gray-900">{getRoleName(loginData.role)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-medium text-gray-600">✉️ 이메일</span>
                                                        <span className="text-xs text-gray-700 truncate">{loginData.email}</span>
                                                    </div>
                                                </div>

                                                {/* 기술 정보 */}
                                                <div className="mt-3 pt-3 border-t border-gray-200">
                                                    <div className="flex flex-wrap gap-2">
                                                        <div className="bg-purple-50 px-2 py-1 rounded text-xs">
                                                            <span className="text-purple-600 font-medium">🔑 토큰:</span>
                                                            <span className="text-purple-800 ml-1 font-mono">{shortenToken(loginData.safeToken)}</span>
                                                        </div>
                                                        <div className="bg-yellow-50 px-2 py-1 rounded text-xs">
                                                            <span className="text-yellow-600 font-medium">🆔 세션:</span>
                                                            <span className="text-yellow-800 ml-1 font-mono">{loginData.sessionId.replace('sess_', '')}</span>
                                                        </div>
                                                        {loginData.koreanSupport === 'true' && (
                                                            <div className="bg-green-50 px-2 py-1 rounded text-xs">
                                                                <span className="text-green-600 font-medium">🇰🇷 한글지원</span>
                                                            </div>
                                                        )}
                                                        <div className="bg-gray-50 px-2 py-1 rounded text-xs">
                                                            <span className="text-gray-600 font-medium">📍 v{loginData.version}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            /* 일반 요청인 경우 파라미터 표시 */
                                            link.query_params.length > 0 && (
                                                <div className="bg-white rounded-lg p-3 mb-3 border border-blue-200">
                                                    <div className="flex flex-wrap gap-1">
                                                        {link.query_params.slice(0, 6).map(([key, value], paramIndex) => (
                                                            <span key={paramIndex} className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                                                                <span className="font-medium">{key}:</span>
                                                                <span className="ml-1">{value.length > 10 ? value.substring(0, 10) + '...' : value}</span>
                                                            </span>
                                                        ))}
                                                        {link.query_params.length > 6 && (
                                                            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
                                                                +{link.query_params.length - 6} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        )}

                                        {/* 하단: 원본 URL */}
                                        <details className="group">
                                            <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700 flex items-center gap-1">
                                                <span className="group-open:rotate-90 transition-transform">▶</span>
                                                원본 URL 보기
                                            </summary>
                                            <div className="mt-2 p-2 bg-gray-50 rounded text-xs font-mono text-gray-600 break-all">
                                                {link.url}
                                            </div>
                                        </details>
                                    </div>
                                );
                            })}
                        </div>
                    ) : !isLoadingDeepLinks ? (
                        <div className="text-center py-6">
                            <div className="text-gray-400 text-sm mb-2">
                                📭 아직 웹 요청이 없습니다
                            </div>
                            <div className="text-xs text-gray-500">
                                테스트: <code className="bg-gray-200 px-2 py-1 rounded">cti-personal://test</code>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <div className="text-gray-400 text-sm">Loading...</div>
                        </div>
                    )}
                </div>
            )}

            {/* 기존 메인 콘텐츠 - 컴팩트하게 수정 */}
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                <h1 className="text-xl font-bold text-center mb-6 text-gray-800">
                    CTI Task Master
                </h1>

                <div className="space-y-3">
                    <button
                        onClick={openLoginWindow}
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                    >
                        🔐 로그인 (새 창)
                        <div className="text-xs text-purple-100 mt-0.5">
                            사용자 인증 창 열기 (400x500)
                        </div>
                    </button>

                    <button
                        onClick={() => onModeChange('bar')}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                    >
                        📊 바 모드
                        <div className="text-xs text-blue-100 mt-0.5">
                            작업 표시줄 형태 (1000x40)
                        </div>
                    </button>

                    <button
                        onClick={() => onModeChange('panel')}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                    >
                        📋 패널 모드
                        <div className="text-xs text-green-100 mt-0.5">
                            전체 창 형태 (1200x800)
                        </div>
                    </button>

                    <button
                        onClick={openSettingsWindow}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                    >
                        ⚙️ 환경 설정 (새 창)
                        <div className="text-xs text-orange-100 mt-0.5">
                            시작 모드 및 앱 설정 (600x700)
                        </div>
                    </button>
                </div>

                {/* 하단 정보 */}
                <div className="mt-6 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                        💡 환경 설정에서 시작 모드를 변경하면<br />
                        다음 실행 시 해당 모드로 바로 시작됩니다.
                    </p>
                </div>
            </div>

            {/* 🔧 하단 디버깅 정보 - 컴팩트하게 */}
            <div className="mt-4 text-center">
                <div className="text-xs text-gray-400">
                    🎯 딥링크 테스트: <code className="bg-gray-200 px-1 rounded">cti-personal://test</code>
                </div>
            </div>
        </div>
    );
};