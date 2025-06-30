// C:\tauri\cti-task-manager-tauri\src\app\launcher\index.tsx

import React, { useState, useEffect } from 'react';
import { emit } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/core';

type Mode = 'launcher' | 'bar' | 'panel' | 'login' | 'settings';

// ✅ onModeChange prop 제거 - 모든 모드 변경을 직접 이벤트로 처리
export const Launcher: React.FC = () => {
    // 딥링크 히스토리 state
    const [deepLinkHistory, setDeepLinkHistory] = useState<DeepLinkData[]>([]);
    const [isLoadingDeepLinks, setIsLoadingDeepLinks] = useState(false);

    // 컴포넌트 마운트 시 딥링크 히스토리 로드
    useEffect(() => {
        loadDeepLinkHistory();
    }, []);

    // 딥링크 히스토리 로드 함수
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

    // 로그인 데이터 파싱 함수
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

    // 부서명 한글 변환
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

    // 역할명 한글 변환
    const getRoleName = (role: string) => {
        const roleMap: Record<string, string> = {
            'user': '일반 사용자',
            'manager': '팀장',
            'admin': '관리자'
        };
        return roleMap[role] || role;
    };

    // 토큰 축약 함수
    const shortenToken = (token: string) => {
        if (!token) return '';
        return token.length > 20 ? `${token.substring(0, 15)}...` : token;
    };

    // URL 축약 함수
    const shortenUrl = (url: string) => {
        try {
            const urlObj = new URL(url);
            const baseUrl = `${urlObj.protocol}//${urlObj.hostname}`;
            const pathAndQuery = `${urlObj.pathname}${urlObj.search}`;

            // 경로+쿼리가 긴 경우 축약
            if (pathAndQuery.length > 30) {
                return `${baseUrl}${pathAndQuery.substring(0, 15)}...${pathAndQuery.substring(pathAndQuery.length - 10)}`;
            }
            return url;
        } catch {
            // URL 파싱 실패 시 문자열로 축약
            if (url.length > 50) {
                return `${url.substring(0, 25)}...${url.substring(url.length - 15)}`;
            }
            return url;
        }
    };

    // 🎯 통합 모드 변경 함수 - 모든 버튼이 이 함수를 사용
    const switchMode = async (mode: Mode) => {
        try {
            await emit('switch-mode', mode);
            console.log(`📤 ${mode} 모드로 창 교체 요청 전송`);
        } catch (error) {
            console.error(`❌ ${mode} 모드 교체 실패:`, error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            {/* 딥링크 히스토리 박스 */}
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
                                        {/* 상단: 타입, 축약된 URL, 시간 */}
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium flex-shrink-0 ${isLoginRequest
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {isLoginRequest ? '🔐 로그인' : '🔗 일반'}
                                                </span>
                                                <div className="flex items-center gap-1 min-w-0 flex-1">
                                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded flex-shrink-0">
                                                        {link.scheme}://
                                                    </span>
                                                    <span className="text-xs text-gray-600 font-mono truncate">
                                                        {shortenUrl(link.url)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500 flex-shrink-0 ml-2">
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
                                            /* 일반 요청인 경우 더 많은 파라미터 표시 */
                                            link.query_params.length > 0 && (
                                                <div className="bg-white rounded-lg p-3 mb-3 border border-blue-200">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-xs font-medium text-gray-600">
                                                            📋 파라미터 ({link.query_params.length}개)
                                                        </span>
                                                    </div>
                                                    <div className="max-h-32 overflow-y-auto">
                                                        <div className="grid grid-cols-1 gap-2">
                                                            {link.query_params.map(([key, value], paramIndex) => (
                                                                <div key={paramIndex} className="flex items-start gap-2 bg-blue-50 rounded p-2">
                                                                    <span className="text-xs font-medium text-blue-700 flex-shrink-0 min-w-0">
                                                                        {key}:
                                                                    </span>
                                                                    <span className="text-xs text-blue-900 font-mono break-all">
                                                                        {value.length > 40 ? `${value.substring(0, 40)}...` : value}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}

                                        {/* 하단: 원본 URL - 더 간결하게 */}
                                        <details className="group">
                                            <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700 flex items-center gap-1">
                                                <span className="group-open:rotate-90 transition-transform">▶</span>
                                                원본 URL
                                            </summary>
                                            <div className="mt-2 p-2 bg-gray-50 rounded text-xs font-mono text-gray-600 break-all max-h-20 overflow-y-auto">
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

            {/* 메인 콘텐츠 */}
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                <h1 className="text-xl font-bold text-center mb-6 text-gray-800">
                    CTI Task Master
                </h1>

                <div className="space-y-3">
                    {/* ✅ 모든 버튼이 switchMode 함수 사용 */}
                    <button
                        onClick={() => switchMode('login')}
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                    >
                        🔐 로그인
                        <div className="text-xs text-purple-100 mt-0.5">
                            사용자 인증 창 열기 (500x600)
                        </div>
                    </button>

                    <button
                        onClick={() => switchMode('bar')}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                    >
                        📊 바 모드
                        <div className="text-xs text-blue-100 mt-0.5">
                            작업 표시줄 형태 (1100x40)
                        </div>
                    </button>

                    <button
                        onClick={() => switchMode('panel')}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                    >
                        📋 패널 모드
                        <div className="text-xs text-green-100 mt-0.5">
                            전체 창 형태 (1200x800)
                        </div>
                    </button>

                    <button
                        onClick={() => switchMode('settings')}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                    >
                        ⚙️ 시스템 환경 설정
                        <div className="text-xs text-orange-100 mt-0.5">
                            시스템 전체 설정 관리 (600x500)
                        </div>
                    </button>
                </div>

                {/* 하단 정보 */}
                <div className="mt-6 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                        💡 시스템 환경 설정에서 시작 모드를 변경하면<br />
                        다음 실행 시 해당 모드로 바로 시작됩니다.
                    </p>
                </div>
            </div>
        </div>
    );
};

// 딥링크 데이터 인터페이스
interface DeepLinkData {
    timestamp: string;
    url: string;
    scheme: string;
    path: string;
    query_params: [string, string][];
}

// 파싱된 로그인 데이터 인터페이스
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