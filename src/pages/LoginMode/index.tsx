import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { useTheme } from '@/shared/hooks/useTheme';

interface AppSettings {
    startup_mode: string;
    auto_login: boolean;
    theme: string;
}

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

    // 테마 훅 사용
    const { currentTheme, isLoading: isThemeLoading } = useTheme();

    // 자동 로그인 설정 확인
    useEffect(() => {
        checkAutoLogin();
    }, []);

    const checkAutoLogin = async () => {
        try {
            const settings = await invoke<AppSettings>('load_settings');
            if (settings.auto_login) {
                setRememberMe(true);
            }
        } catch (error) {
            console.error('설정 로드 실패:', error);
        }
    };

    const handleLogin = async () => {
        if (!username || !password) {
            setErrorMessage('아이디와 비밀번호를 입력해주세요.');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        setTimeout(async () => {
            if (username === 'admin' && password === 'password') {
                // 자동 로그인 설정 저장
                if (rememberMe) {
                    try {
                        const settings = await invoke<AppSettings>('load_settings');
                        settings.auto_login = true;
                        await invoke('save_settings', { settings });
                    } catch (error) {
                        console.error('자동 로그인 설정 저장 실패:', error);
                    }
                }

                // 로그인 성공 시 창 닫기
                setTimeout(async () => {
                    const currentWindow = getCurrentWebviewWindow();
                    await currentWindow.close();
                }, 500);
            } else {
                setErrorMessage('아이디 또는 비밀번호가 잘못되었습니다.');
            }
            setIsLoading(false);
        }, 1200);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    // 테마 로딩 중일 때
    if (isThemeLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="text-white">테마 로딩 중...</div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* 동적 그라데이션 배경 */}
            <div className={`absolute inset-0 bg-gradient-to-br ${currentTheme.tailwind.gradient}`} />

            {/* 애니메이션 블러 효과 */}
            <div className="absolute inset-0">
                <div className={`absolute top-20 left-20 w-72 h-72 ${currentTheme.tailwind.blur} rounded-full blur-3xl animate-pulse`} />
                <div className={`absolute bottom-20 right-20 w-96 h-96 ${currentTheme.tailwind.blur} rounded-full blur-3xl animate-pulse animation-delay-2000`} />
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] ${currentTheme.tailwind.blur} rounded-full blur-3xl opacity-50`} />
            </div>

            {/* 로그인 카드 */}
            <div className="relative z-10 flex items-center justify-center h-full">
                <div className={`w-[400px] ${currentTheme.tailwind.card || 'bg-white/10'} backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl`}>
                    {/* 탭 헤더 */}
                    <div className="flex space-x-6 mb-8 border-b border-white/20">
                        <button
                            onClick={() => setActiveTab('signin')}
                            className={`pb-3 px-1 text-white font-medium transition-all ${activeTab === 'signin'
                                ? `border-b-2 ${currentTheme.tailwind.tab}`
                                : 'text-white/60 hover:text-white/80'
                                }`}
                        >
                            SIGN IN
                        </button>
                        <button
                            onClick={() => setActiveTab('signup')}
                            className={`pb-3 px-1 text-white font-medium transition-all ${activeTab === 'signup'
                                ? `border-b-2 ${currentTheme.tailwind.tab}`
                                : 'text-white/60 hover:text-white/80'
                                }`}
                        >
                            SIGN UP
                        </button>
                    </div>

                    {activeTab === 'signin' ? (
                        <>
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-xs text-white/70 uppercase tracking-wider mb-2">
                                        Username
                                    </label>
                                    <Input
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="bg-white/10 text-white placeholder-white/50 border-white/30 focus:border-white/50 focus:bg-white/20 h-12"
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-white/70 uppercase tracking-wider mb-2">
                                        Password
                                    </label>
                                    <Input
                                        placeholder="Enter your password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="bg-white/10 text-white placeholder-white/50 border-white/30 focus:border-white/50 focus:bg-white/20 h-12"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {errorMessage && (
                                <p className="text-sm text-red-400 mb-4 text-center">{errorMessage}</p>
                            )}

                            <div className="flex items-center mb-6">
                                <Checkbox
                                    checked={rememberMe}
                                    onCheckedChange={(v) => setRememberMe(v as boolean)}
                                    className={`mr-2 border-white/40 ${currentTheme.tailwind.checkbox}`}
                                    disabled={isLoading}
                                />
                                <span className="text-sm text-white/80">Keep me signed in</span>
                            </div>

                            <Button
                                onClick={handleLogin}
                                className={`w-full h-12 ${currentTheme.tailwind.button} text-white font-semibold shadow-lg`}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    'SIGN IN'
                                )}
                            </Button>

                            <div className="mt-6 text-center">
                                <button className="text-sm text-white/60 hover:text-white/80 transition-colors">
                                    Forgot Password?
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="py-12 text-center text-white/60">
                            <p>회원가입 기능은 준비 중입니다.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 하단 정보 */}
            <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="text-white/40 text-sm">
                    CTI TASK MASTER v2.7.22.40000
                </p>
            </div>
        </div>
    );
};

export default LoginPage;