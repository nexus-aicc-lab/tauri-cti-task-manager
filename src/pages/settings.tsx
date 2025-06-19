// src/pages/SettingsPage.tsx
'use client';

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

    const handleChange = async (newMode: ViewMode) => {
        setViewMode(newMode);
        await saveViewMode(newMode);
        console.log(`[Settings] viewMode 저장됨: ${newMode}`);
    };

    return (
        <div className="h-full flex flex-col items-center justify-center gap-6 text-xl font-bold">
            <div className="text-2xl">⚙️ 환경 설정</div>

            <div className="flex flex-col items-start space-y-2">
                <div className="text-base font-semibold">화면 모드 선택:</div>
                {viewModes.map((mode) => (
                    <label key={mode.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="viewMode"
                            value={mode.value}
                            checked={viewMode === mode.value}
                            onChange={() => handleChange(mode.value)}
                            className="accent-blue-600"
                        />
                        {mode.label}
                    </label>
                ))}
            </div>
        </div>
    );
}
