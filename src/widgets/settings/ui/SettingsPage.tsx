'use client';

import { useUIStore } from '@/shared/store/useUIStore';

export default function SettingsPage() {
    const setActivePage = useUIStore((s) => s.setActivePage);

    return (
        <div className="p-6 space-y-4">
            <h2 className="text-lg font-bold">환경 설정</h2>
            <button
                onClick={() => setActivePage('dashboard')}
                className="px-4 py-2 bg-indigo-500 text-white rounded"
            >
                대시보드로 돌아가기
            </button>
            {/* 추가 설정 옵션 여기에 */}
        </div>
    );
}
