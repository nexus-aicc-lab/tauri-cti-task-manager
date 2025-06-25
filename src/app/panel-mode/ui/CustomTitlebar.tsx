// src/app/panel-mode/ui/CustomTitlebar.tsx

import { useEffect, useState } from 'react';
import { Menu, Pin, Minus, Maximize2, Minimize2, X } from 'lucide-react';

interface Props {
    title: string;
    onBackToLauncher: () => void;
}

export default function CustomTitlebar({ title, onBackToLauncher }: Props) {
    const [isMaximized, setIsMaximized] = useState(false);

    useEffect(() => {
        (async () => {
            const { getCurrentWindow } = await import('@tauri-apps/api/window');
            const win = getCurrentWindow();
            setIsMaximized(await win.isMaximized());
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
            className="h-10 bg-gray-200 flex items-center justify-between px-4 select-none border-b border-gray-300"
            data-tauri-drag-region
            style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
            {/* 왼쪽 영역 */}
            <div className="flex items-center space-x-3">
                <button
                    onClick={(e) => e.stopPropagation()}
                    className="text-gray-800 hover:text-black hover:bg-gray-300 p-1 rounded"
                    title="메뉴"
                >
                    <Menu size={16} />
                </button>
                <div className="text-sm text-gray-800 flex items-center space-x-1">
                    <span>👤 홍길동(NEX1011)</span>
                    <span className="bg-blue-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-semibold">2</span>
                </div>
            </div>

            {/* 가운데 영역 */}
            <div className="text-center flex-1 pointer-events-none">
                <span className="text-sm font-semibold text-gray-800">{title}</span>
            </div>

            {/* 오른쪽 영역 */}
            <div className="flex items-center space-x-1">
                <button
                    onClick={(e) => e.stopPropagation()}
                    className="text-gray-800 hover:text-black hover:bg-gray-300 p-1 rounded"
                    title="핀 고정"
                >
                    <Pin size={14} />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        minimize();
                    }}
                    className="text-gray-800 hover:text-black hover:bg-gray-300 p-1 rounded"
                    title="최소화"
                >
                    <Minus size={14} />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        maximize();
                    }}
                    className="text-gray-800 hover:text-black hover:bg-gray-300 p-1 rounded"
                    title={isMaximized ? '복원' : '최대화'}
                >
                    {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        close();
                    }}
                    className="text-gray-800 hover:text-red-600 hover:bg-gray-300 p-1 rounded"
                    title="닫기"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
}
