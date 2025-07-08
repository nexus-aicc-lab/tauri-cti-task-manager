import React, { useState, useEffect } from 'react';
import { emit } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/core';

type Mode = 'launcher' | 'bar' | 'panel' | 'login' | 'settings' | 'counselor_dashboard';

interface LoginInfo {
    safe_token?: string;
    username?: string;
    department?: string;
    role?: string;
    email?: string;
    session_id?: string;
    login_method?: string;
    timestamp?: string;
    received_at?: string;
}

const MainPage: React.FC = () => {
    const [loginInfo, setLoginInfo] = useState<LoginInfo>({});
    const [lastUpdate, setLastUpdate] = useState<string>('-');
    const [loading, setLoading] = useState(true);

    // 로그인 정보 로드
    const loadLoginInfo = async () => {
        try {
            const result = await invoke('get_login_info') as string;
            const data = JSON.parse(result || '{}');
            setLoginInfo(data);
            setLastUpdate(new Date().toLocaleTimeString('ko-KR'));
            setLoading(false);
        } catch (error) {
            console.error('로그인 정보 로드 실패:', error);
            setLoading(false);
        }
    };

    // 로그인 정보 삭제
    const clearLoginInfo = async () => {
        try {
            await invoke('clear_login_info');
            setLoginInfo({});
            alert('로그인 정보가 삭제되었습니다');
        } catch (error) {
            alert('삭제 실패: ' + error);
        }
    };

    // 컴포넌트 마운트 시 로그인 정보 로드
    useEffect(() => {
        loadLoginInfo();

        // 5초마다 자동 새로고침
        const interval = setInterval(loadLoginInfo, 5000);
        return () => clearInterval(interval);
    }, []);

    const switchMode = async (mode: Mode) => {
        try {
            await emit('switch-mode', mode);
            console.log(`📤 ${mode} 모드로 창 교체 요청 전송`);
        } catch (error) {
            console.error(`❌ ${mode} 모드 교체 실패:`, error);
        }
    };

    const hasLoginInfo = Object.keys(loginInfo).length > 0;

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* 왼쪽: 메뉴 섹션 */}
            <div className="w-1/2 flex flex-col justify-center p-6 border-r border-gray-300">
                <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto w-full">
                    <h1 className="text-xl font-bold text-center mb-6 text-gray-800">
                        CTI Task Master
                    </h1>

                    <div className="space-y-3">
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

                        <button
                            onClick={() => switchMode('counselor_dashboard')}
                            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                        >
                            🧑‍💼 상담사 대시보드
                            <div className="text-xs text-pink-100 mt-0.5">
                                상담 업무 실시간 모니터링 (1280x800)
                            </div>
                        </button>
                    </div>

                    <div className="mt-6 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center">
                            💡 시스템 환경 설정에서 시작 모드를 변경하면<br />
                            다음 실행 시 해당 모드로 바로 시작됩니다.
                        </p>
                    </div>
                </div>
            </div>

            {/* 오른쪽: 딥링크 로그인 정보 섹션 */}
            <div className="w-1/2 flex flex-col justify-center p-6">
                <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto w-full">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">
                            딥링크 로그인 정보
                        </h2>
                        <div className="flex space-x-2">
                            <button
                                onClick={loadLoginInfo}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition-colors"
                                disabled={loading}
                            >
                                {loading ? '로딩...' : '새로고침'}
                            </button>
                            <button
                                onClick={clearLoginInfo}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors"
                                disabled={!hasLoginInfo}
                            >
                                삭제
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                            <p className="text-gray-500">로그인 정보를 불러오는 중...</p>
                        </div>
                    ) : hasLoginInfo ? (
                        <div className="space-y-3">
                            {[
                                { label: '사용자명', value: loginInfo.username, icon: '👤' },
                                { label: '토큰', value: loginInfo.safe_token ? '***' + loginInfo.safe_token : null, icon: '🔑' },
                                // { label: '부서', value: loginInfo.department, icon: '🏢' },
                                // { label: '역할', value: loginInfo.role, icon: '🎭' },
                                // { label: '이메일', value: loginInfo.email, icon: '📧' },
                                // { label: '세션 ID', value: loginInfo.session_id, icon: '🔐' },
                                // { label: '로그인 방법', value: loginInfo.login_method, icon: '🚪' },
                                // { label: '수신 시간', value: loginInfo.received_at, icon: '⏰' }
                            ].map((item, index) => (
                                item.value && (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                                        <div className="flex items-center">
                                            <span className="mr-3 text-lg">{item.icon}</span>
                                            <span className="font-medium text-gray-700 text-sm">{item.label}</span>
                                        </div>
                                        <span className="text-gray-600 font-mono text-xs bg-white px-2 py-1 rounded max-w-[150px] truncate">
                                            {item.value}
                                        </span>
                                    </div>
                                )
                            ))}

                            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                    <span className="text-green-700 text-sm font-medium">로그인 상태: 활성</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-6xl mb-4">🔗</div>
                            <h3 className="text-lg font-medium text-gray-700 mb-2">
                                딥링크 정보 없음
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                웹에서 로그인 후 딥링크를 통해<br />
                                앱을 실행해보세요.<br />
                                <br />
                                <span className="text-xs text-gray-400">
                                    cti-personal:// 딥링크 대기 중...
                                </span>
                            </p>
                        </div>
                    )}

                    <div className="mt-6 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center">
                            마지막 업데이트: <span className="font-mono">{lastUpdate}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;