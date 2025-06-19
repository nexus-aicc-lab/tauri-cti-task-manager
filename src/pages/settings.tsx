// src/pages/SettingsPage.tsx
'use client';

import { useState, useEffect } from 'react';
import { useUIStore } from '@/shared/store/useUIStore';
import { saveViewMode } from '@/shared/lib/fs/viewModeStorage';
import type { ViewMode } from '@/shared/store/useUIStore';

const viewModes: { value: ViewMode; label: string }[] = [
    { value: 'bar', label: 'Bar 모드' },
    { value: 'panel', label: 'Panel 모드' },
];

export default function SettingsPage() {
    const viewMode = useUIStore((s) => s.viewMode);
    const setViewMode = useUIStore((s) => s.setViewMode);

    const [selectedMode, setSelectedMode] = useState<ViewMode>('bar');

    useEffect(() => {
        // 현재 상태를 로컬 state에 반영
        setSelectedMode(viewMode);
    }, [viewMode]);

    const handleSave = async () => {
        setViewMode(selectedMode);
        await saveViewMode(selectedMode);
        console.log(`[Settings] 저장 완료: ${selectedMode}`);
    };

    return (
        <div className="h-full flex flex-col items-center justify-center gap-6 text-xl font-bold">
            <div className="text-2xl">⚙️ 환경 설정</div>

            <div className="flex flex-col items-start space-y-4">
                <div className="text-base font-semibold">화면 모드 선택:</div>
                {viewModes.map((mode) => (
                    <label key={mode.value} className="flex items-center gap-2 cursor-pointer text-base font-normal">
                        <input
                            type="radio"
                            name="viewMode"
                            value={mode.value}
                            checked={selectedMode === mode.value}
                            onChange={() => setSelectedMode(mode.value)}
                            className="accent-blue-600"
                        />
                        {mode.label}
                    </label>
                ))}

                <button
                    onClick={handleSave}
                    className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-base hover:bg-blue-700 transition"
                >
                    저장
                </button>
            </div>
        </div>
    );
}
