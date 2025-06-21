// src/pages/Launcher.tsx (로그인은 새 창으로 열기)
import React from 'react';
import { emit } from '@tauri-apps/api/event';

type Mode = 'launcher' | 'bar' | 'panel';

interface LauncherProps {
    onModeChange: (mode: Mode) => void;
}

export const Launcher: React.FC<LauncherProps> = ({ onModeChange }) => {
    // 로그인 창 열기 (새 창)
    const openLoginWindow = async () => {
        try {
            await emit('open-login');
            console.log('📤 로그인 창 열기 요청 전송');
        } catch (error) {
            console.error('❌ 로그인 창 열기 실패:', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
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
                </div>
            </div>
        </div>
    );
};