import React from 'react';
import { emit } from '@tauri-apps/api/event';

type Mode = 'launcher' | 'bar' | 'panel' | 'login' | 'settings' | 'counselor_dashboard';

const MainPage: React.FC = () => {
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
            {/* ✅ 메인 콘텐츠만 남김 */}
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                <h1 className="text-xl font-bold    text-center mb-6 text-gray-800">
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
    );
};

export default MainPage;
