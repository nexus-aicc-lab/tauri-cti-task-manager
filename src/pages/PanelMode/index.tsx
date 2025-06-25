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
            className="h-10 bg-gray-200 flex items-center justify-between px-4 select-none"
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
        <div className="h-screen flex flex-col bg-white">
            <CustomTitlebar title="CTI Task Master – 패널 모드" onBackToLauncher={onBackToLauncher} />
            <div className="flex-1 p-4 flex flex-col gap-4">
                {/* 상단 3박스 영역 */}
                <div className="flex-1 grid grid-cols-3 gap-4">
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
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">2영역</h2>
                        <div className="grid grid-cols-2 grid-rows-2 gap-3 w-full">
                            <div className="flex flex-col items-center p-4 bg-blue-100 rounded-lg border border-blue-200">
                                <PhoneCall size={24} className="text-blue-600 mb-2" />
                                <div className="text-sm font-medium text-gray-700 mb-1">통화</div>
                                <div className="font-bold text-blue-700">20</div>
                            </div>
                            <div className="flex flex-col items-center p-4 bg-green-100 rounded-lg border border-green-200">
                                <Phone size={24} className="text-green-600 mb-2" />
                                <div className="text-sm font-medium text-gray-700 mb-1">대기</div>
                                <div className="font-bold text-green-700">5</div>
                            </div>
                            <div className="flex flex-col items-center p-4 bg-orange-100 rounded-lg border border-orange-200">
                                <Clock size={24} className="text-orange-600 mb-2" />
                                <div className="text-sm font-medium text-gray-700 mb-1">후처리</div>
                                <div className="font-bold text-orange-700">20</div>
                            </div>
                            <div className="flex flex-col items-center p-4 bg-purple-100 rounded-lg border border-purple-200">
                                <Coffee size={24} className="text-purple-600 mb-2" />
                                <div className="text-sm font-medium text-gray-700 mb-1">휴식</div>
                                <div className="font-bold text-purple-700">13</div>
                            </div>
                        </div>
                    </div>
                    {/* 3영역 */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col justify-center">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">3영역</h2>
                        <div className="space-y-3">
                            {[
                                { label: '서비스레벨', value: 58 },
                                { label: '응답률', value: 58 },
                                { label: '실인입호수', value: 58 },
                                { label: '응답호수', value: 50 }
                            ].map((item, idx) => (
                                <div key={idx} className="flex flex-col gap-1 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <div className="flex justify-between text-sm font-medium text-gray-700">
                                        <span>{item.label}</span>
                                        <span>{item.value}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${item.value}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* 하단 4영역 */}
                <div className="flex-1 bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">4영역</h2>
                    <div className="grid grid-cols-3 gap-4 text-sm text-gray-700">
                        {[
                            ['그룹호전환 (인입)', 5],
                            ['그룹호전환 (응답)', 5],
                            ['그룹호전환 (분배)', 5],
                            ['그룹호전환 (턴서비스)', 5],
                            ['그룹호전환 (실패)', 5],
                            ['그룹호전환 (규전환)', 5]
                        ].map(([label, value], j) => (
                            <div key={j} className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-md border border-gray-200">
                                <span>{label}</span>
                                <span className="font-semibold">{value}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t-2 border-gray-200 flex justify-between text-sm">
                        <span className="font-medium text-gray-700">LogOn : 44:42:17</span>
                        <span className="text-green-600 font-bold">● 온라인</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

