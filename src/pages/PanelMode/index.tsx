// src/pages/PanelMode/index.tsx
import React, { useState, useEffect } from 'react';
import {
    Timer,
    Coffee,
    Phone,
    PhoneCall,
    Clock,
    BarChart3,
    Minus,
    Maximize2,
    Minimize2,
    X
} from 'lucide-react';

interface PanelComponentProps {
    onBackToLauncher: () => void;
}

// ── Custom Titlebar ───────────────────────────────────────────────────────────
const CustomTitlebar: React.FC<{
    title: string;
    onBackToLauncher: () => void;
}> = ({ title, onBackToLauncher }) => {
    const [isMaximized, setIsMaximized] = useState(false);

    useEffect(() => {
        const check = async () => {
            try {
                const { getCurrentWindow } = await import('@tauri-apps/api/window');
                const win = getCurrentWindow();
                setIsMaximized(await win.isMaximized());
            } catch { }
        };
        check();
    }, []);

    const minimize = async () => {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        (await getCurrentWindow()).minimize();
    };
    const maximize = async () => {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        const win = getCurrentWindow();
        isMaximized ? (await win).unmaximize() : (await win).maximize();
        setIsMaximized(!isMaximized);
    };
    const close = async () => {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        (await getCurrentWindow()).close();
    };

    return (
        <div
            className="h-10 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-between px-4 select-none"
            data-tauri-drag-region
            style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
            <div className="flex items-center space-x-3">
                <span className="text-white font-semibold text-sm">{title}</span>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onBackToLauncher();
                    }}
                    className="text-white/80 hover:text-white hover:bg-white/10 px-2 py-1 rounded text-xs transition-colors"
                >
                    🏠 런처
                </button>
            </div>
            <div className="flex items-center space-x-1">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        minimize();
                    }}
                    className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded transition-colors"
                    title="최소화"
                >
                    <Minus size={14} />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        maximize();
                    }}
                    className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded transition-colors"
                    title={isMaximized ? '복원' : '최대화'}
                >
                    {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        close();
                    }}
                    className="text-white/80 hover:text-red-500 p-1 rounded transition-colors"
                    title="닫기"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
};

// ── 메인 패널 컴포넌트 ─────────────────────────────────────────────────────────
export default function PanelComponent({ onBackToLauncher }: PanelComponentProps) {
    return (
        <div className="h-screen flex flex-col bg-gray-50">
            <CustomTitlebar
                title="CTI Task Master – 패널 모드"
                onBackToLauncher={onBackToLauncher}
            />

            <div className="flex-1 p-4 space-y-4">
                {/* 상단 3박스 영역 */}
                <div className="grid grid-cols-3 gap-4 h-1/2">
                    {/* 1영역 */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col items-center justify-center">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">1영역</h2>
                        <div className="w-32 h-32 bg-blue-200 rounded-full flex items-center justify-center border-4 border-blue-300">
                            <Timer size={48} className="text-blue-700" />
                        </div>
                        <div className="mt-4 text-center">
                            <div className="text-xl font-bold text-gray-800">대기중</div>
                            <div className="text-blue-600 font-semibold">00:03:44</div>
                        </div>
                    </div>

                    {/* 2영역 */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col items-center justify-center">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">2영역</h2>
                        <div className="grid grid-cols-2 gap-3 w-full">
                            <div className="text-center p-4 bg-blue-100 rounded-lg border border-blue-200">
                                <PhoneCall size={24} className="mx-auto mb-2 text-blue-600" />
                                <div className="text-sm font-medium text-gray-700">통화</div>
                                <div className="font-bold text-blue-700">20</div>
                            </div>
                            <div className="text-center p-4 bg-green-100 rounded-lg border border-green-200">
                                <Phone size={24} className="mx-auto mb-2 text-green-600" />
                                <div className="text-sm font-medium text-gray-700">대기</div>
                                <div className="font-bold text-green-700">5</div>
                            </div>
                            <div className="text-center p-4 bg-orange-100 rounded-lg border border-orange-200">
                                <Clock size={24} className="mx-auto mb-2 text-orange-600" />
                                <div className="text-sm font-medium text-gray-700">후처리</div>
                                <div className="font-bold text-orange-700">13</div>
                            </div>
                            <div className="text-center p-4 bg-purple-100 rounded-lg border border-purple-200">
                                <Coffee size={24} className="mx-auto mb-2 text-purple-600" />
                                <div className="text-sm font-medium text-gray-700">휴식</div>
                                <div className="font-bold text-purple-700">1</div>
                            </div>
                        </div>
                    </div>

                    {/* 3영역 */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">3영역</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-blue-100 rounded-lg border border-blue-200">
                                <span className="font-medium text-gray-700">서비스레벨</span>
                                <span className="font-bold text-blue-700">58%</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg border border-green-200">
                                <span className="font-medium text-gray-700">응답률</span>
                                <span className="font-bold text-green-700">58%</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-orange-100 rounded-lg border border-orange-200">
                                <span className="font-medium text-gray-700">실인입호수</span>
                                <span className="font-bold text-orange-700">58%</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-purple-100 rounded-lg border border-purple-200">
                                <span className="font-medium text-gray-700">응답호수</span>
                                <span className="font-bold text-purple-700">50</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 하단 1박스 영역 */}
                <div className="h-1/2">
                    {/* 4영역 */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 h-full">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">4영역</h2>
                        <div className="grid grid-cols-2 gap-6 h-full">
                            {/* 인바운드 */}
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <h3 className="text-md font-semibold mb-3 text-blue-700">인바운드</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between p-3 bg-blue-100 rounded-lg border border-blue-200">
                                        <span className="font-medium text-gray-700">개인</span>
                                        <span className="font-semibold text-blue-700">03:53:44(5)</span>
                                    </div>
                                    <div className="flex justify-between p-3 bg-blue-100 rounded-lg border border-blue-200">
                                        <span className="font-medium text-gray-700">그룹</span>
                                        <span className="font-semibold text-blue-700">05:53:44(7)</span>
                                    </div>
                                    <div className="flex justify-between p-3 bg-blue-100 rounded-lg border border-blue-200">
                                        <span className="font-medium text-gray-700">팀</span>
                                        <span className="font-semibold text-blue-700">04:53:44(5)</span>
                                    </div>
                                </div>
                            </div>

                            {/* 아웃바운드 */}
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                <h3 className="text-md font-semibold mb-3 text-green-700">아웃바운드</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between p-3 bg-green-100 rounded-lg border border-green-200">
                                        <span className="font-medium text-gray-700">개인</span>
                                        <span className="font-semibold text-green-700">03:53:44(5)</span>
                                    </div>
                                    <div className="flex justify-between p-3 bg-green-100 rounded-lg border border-green-200">
                                        <span className="font-medium text-gray-700">그룹</span>
                                        <span className="font-semibold text-green-700">05:53:44(7)</span>
                                    </div>
                                    <div className="flex justify-between p-3 bg-green-100 rounded-lg border border-green-200">
                                        <span className="font-medium text-gray-700">팀</span>
                                        <span className="font-semibold text-green-700">04:53:44(5)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 하단 로그인 정보 */}
                        <div className="mt-4 pt-4 border-t-2 border-gray-200 flex justify-between text-sm">
                            <span className="font-medium text-gray-700">LogOn : 44:42:17</span>
                            <span className="text-green-600 font-bold">● 온라인</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}