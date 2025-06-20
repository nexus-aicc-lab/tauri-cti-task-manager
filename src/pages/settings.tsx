// src/pages/SettingsPage.tsx
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Monitor, LayoutPanelLeft, Save } from 'lucide-react';
import { useUIStore } from '@/shared/store/useUIStore';
import { saveViewMode } from '@/shared/lib/fs/viewModeStorage';
import type { ViewMode } from '@/shared/store/useUIStore';

const viewModes: { value: ViewMode; label: string; icon: JSX.Element }[] = [
    { value: 'bar', label: 'Bar 모드', icon: <LayoutPanelLeft className="w-5 h-5 text-blue-600" /> },
    { value: 'panel', label: 'Panel 모드', icon: <Monitor className="w-5 h-5 text-green-600" /> },
];

export default function SettingsPage() {
    const viewMode = useUIStore((s) => s.viewMode);
    const setViewMode = useUIStore((s) => s.setViewMode);
    const [selectedMode, setSelectedMode] = useState<ViewMode>('bar');

    useEffect(() => {
        setSelectedMode(viewMode);
    }, [viewMode]);

    const handleSave = async () => {
        setViewMode(selectedMode);
        await saveViewMode(selectedMode);
        toast.success('설정이 저장되었습니다!');
        console.log(`[Settings] 저장 완료: ${selectedMode}`);
    };

    return (
        <div className="h-full w-full flex flex-col items-center justify-center px-4">
            <div className="max-w-md w-full bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800">
                <div className="mb-6 text-center">
                    <div className="text-3xl font-bold mb-1 flex items-center justify-center gap-2">
                        ⚙️ 환경 설정
                    </div>
                    <p className="text-sm text-muted-foreground">원하는 화면 모드를 선택하고 저장하세요.</p>
                </div>

                <div className="space-y-4">
                    <div className="text-base font-semibold">화면 모드 선택</div>

                    <div className="space-y-3">
                        {viewModes.map((mode) => (
                            <label
                                key={mode.value}
                                className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition"
                            >
                                <input
                                    type="radio"
                                    name="viewMode"
                                    value={mode.value}
                                    checked={selectedMode === mode.value}
                                    onChange={() => setSelectedMode(mode.value)}
                                    className="accent-blue-600"
                                />
                                {mode.icon}
                                <span className="text-base">{mode.label}</span>
                            </label>
                        ))}
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-base hover:bg-blue-700 transition"
                    >
                        <Save className="w-5 h-5" />
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
}
