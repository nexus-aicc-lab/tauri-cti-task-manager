import React, { useState, useEffect } from 'react';
import {
    Timer,
    Coffee,
    Phone,
    PhoneCall,
    Clock,
    Pin,
    Minus,
    Maximize2,
    Minimize2,
    X
} from 'lucide-react';

interface PanelComponentProps {
    onBackToLauncher: () => void;
}

const CustomTitlebar: React.FC<{ title: string; onBackToLauncher: () => void }> = ({ title, onBackToLauncher }) => {
    const [isMaximized, setIsMaximized] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const { getCurrentWindow } = await import('@tauri-apps/api/window');
                const win = getCurrentWindow();
                setIsMaximized(await win.isMaximized());
            } catch { }
        })();
    }, []);

    const minimize = async () => {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        (await getCurrentWindow()).minimize();
    };
    const maximize = async () => {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        const win = await getCurrentWindow();
        const max = await win.isMaximized();
        if (max) {
            await win.unmaximize();
        } else {
            await win.maximize();
        }
        setIsMaximized(!max);
    };
    const close = async () => {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        (await getCurrentWindow()).close();
    };

    return (
        <div
            className="h-10 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 flex items-center justify-between px-4 select-none border-b border-gray-200"
            data-tauri-drag-region
            style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
            <div className="flex items-center space-x-3">
                <span className="text-gray-800 font-semibold text-sm">{title}</span>
                <button
                    onClick={e => { e.stopPropagation(); onBackToLauncher(); }}
                    className="text-gray-800 hover:text-black hover:bg-gray-300 px-2 py-1 rounded text-xs transition-colors"
                    title="런처로 돌아가기"
                >
                    🏠 런처
                </button>
            </div>
            <div className="flex items-center space-x-1">
                <button
                    onClick={e => { e.stopPropagation(); /* TODO: Pin action */ }}
                    className="text-gray-800 hover:text-black hover:bg-gray-300 p-1 rounded"
                    title="핀 고정"
                >
                    <Pin size={14} />
                </button>
                <button
                    onClick={e => { e.stopPropagation(); minimize(); }}
                    className="text-gray-800 hover:text-black hover:bg-gray-300 p-1 rounded"
                    title="최소화"
                >
                    <Minus size={14} />
                </button>
                <button
                    onClick={e => { e.stopPropagation(); maximize(); }}
                    className="text-gray-800 hover:text-black hover:bg-gray-300 p-1 rounded"
                    title={isMaximized ? '복원' : '최대화'}
                >
                    {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>
                <button
                    onClick={e => { e.stopPropagation(); close(); }}
                    className="text-gray-800 hover:text-red-600 hover:bg-gray-300 p-1 rounded"
                    title="닫기"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
};

export default function PanelComponent({ onBackToLauncher }: PanelComponentProps) {
    return (
        <div className="h-screen flex flex-col bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100">
            <CustomTitlebar title="CTI Task Master – 패널 모드" onBackToLauncher={onBackToLauncher} />
            <div className="flex-1 p-6 flex flex-col gap-6">
                {/* 상단 3박스 영역 */}
                <div className="flex-1 grid grid-cols-3 gap-6">
                    {/* 1영역 */}
                    <div className="bg-white/80 p-8 rounded-2xl shadow-lg border border-gray-200 flex flex-col items-center justify-center">
                        <h2 className="text-lg font-extrabold mb-4 text-gray-800 tracking-wide">1영역</h2>
                        <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center border-4 border-blue-200 shadow-inner">
                            <Timer size={48} className="text-blue-700" />
                        </div>
                        <div className="mt-4 text-center">
                            <div className="text-2xl font-bold text-gray-800">대기중</div>
                            <div className="text-blue-600 font-semibold text-lg">00:03:44</div>
                        </div>
                    </div>
                    {/* 2영역 */}
                    <div className="bg-white/80 p-8 rounded-2xl shadow-lg border border-gray-200 flex flex-col">
                        <h2 className="text-lg font-extrabold mb-4 text-gray-800 tracking-wide">2영역</h2>
                        <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full">
                            <div className="flex flex-col items-center p-4 bg-blue-50 rounded-xl border border-blue-100 shadow">
                                <PhoneCall size={28} className="text-blue-600 mb-2" />
                                <div className="text-base font-semibold text-gray-700 mb-1">통화</div>
                                <div className="font-bold text-blue-700 text-lg">20</div>
                            </div>
                            <div className="flex flex-col items-center p-4 bg-green-50 rounded-xl border border-green-100 shadow">
                                <Phone size={28} className="text-green-600 mb-2" />
                                <div className="text-base font-semibold text-gray-700 mb-1">대기</div>
                                <div className="font-bold text-green-700 text-lg">5</div>
                            </div>
                            <div className="flex flex-col items-center p-4 bg-orange-50 rounded-xl border border-orange-100 shadow">
                                <Clock size={28} className="text-orange-600 mb-2" />
                                <div className="text-base font-semibold text-gray-700 mb-1">후처리</div>
                                <div className="font-bold text-orange-700 text-lg">20</div>
                            </div>
                            <div className="flex flex-col items-center p-4 bg-purple-50 rounded-xl border border-purple-100 shadow">
                                <Coffee size={28} className="text-purple-600 mb-2" />
                                <div className="text-base font-semibold text-gray-700 mb-1">휴식</div>
                                <div className="font-bold text-purple-700 text-lg">13</div>
                            </div>
                        </div>
                    </div>
                    {/* 3영역 */}
                    <div className="bg-white/80 p-8 rounded-2xl shadow-lg border border-gray-200 flex flex-col justify-center">
                        <h2 className="text-lg font-extrabold mb-4 text-gray-800 tracking-wide">3영역</h2>
                        <div className="space-y-4">
                            {[
                                { label: '서비스레벨', value: 58 },
                                { label: '응답률', value: 58 },
                                { label: '실인입호수', value: 58 },
                                { label: '응답호수', value: 50 }
                            ].map((item, idx) => (
                                <div key={idx} className="flex flex-col gap-1 bg-gray-50 p-4 rounded-xl border border-gray-200 shadow">
                                    <div className="flex justify-between text-base font-semibold text-gray-700">
                                        <span>{item.label}</span>
                                        <span>{item.value}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${item.value}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* 하단 4영역 */}
                <div className="flex-1 bg-white/80 p-8 rounded-2xl shadow-lg border border-gray-200 flex flex-col mt-6">
                    <h2 className="text-lg font-extrabold mb-4 text-gray-800 tracking-wide">4영역</h2>
                    <div className="grid grid-cols-3 gap-4 text-base text-gray-700">
                        {[
                            ['그룹호전환 (인입)', 5],
                            ['그룹호전환 (응답)', 5],
                            ['그룹호전환 (분배)', 5],
                            ['그룹호전환 (턴서비스)', 5],
                            ['그룹호전환 (실패)', 5],
                            ['그룹호전환 (규전환)', 5]
                        ].map(([label, value], j) => (
                            <div key={j} className="flex justify-between items-center px-5 py-3 bg-gray-100 rounded-lg border border-gray-200 shadow">
                                <span>{label}</span>
                                <span className="font-bold">{value}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-4 border-t-2 border-gray-200 flex justify-between text-base">
                        <span className="font-semibold text-gray-700">LogOn : 44:42:17</span>
                        <span className="text-green-600 font-extrabold animate-pulse">● 온라인</span>
                    </div>
                </div>
            </div>
        </div>
    );
}