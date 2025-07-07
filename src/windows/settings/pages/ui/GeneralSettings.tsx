'use client';

import React, { useEffect, useState } from 'react';
import { useAlwaysOnTopStore } from '@/windows/settings/stores/useAlwaysOnTopStore';

const GeneralSettings = () => {
    const { isPinned, setPinned } = useAlwaysOnTopStore();
    const [isLoading, setIsLoading] = useState(true);

    const fetchPinState = async () => {
        try {
            const { invoke } = await import('@tauri-apps/api/core');
            const pinState = await invoke('get_always_on_top_state') as boolean;
            setPinned(pinState);
        } catch (error) {
            console.error('❌ 핀 상태 가져오기 실패:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const togglePin = async () => {
        try {
            const { invoke } = await import('@tauri-apps/api/core');
            const newState = await invoke('toggle_always_on_top') as boolean;
            setPinned(newState);
        } catch (error) {
            console.error('❌ 핀 상태 토글 실패:', error);
        }
    };

    useEffect(() => {
        fetchPinState();
    }, []);

    return (
        <div className="text-sm text-gray-700">
            <label className="inline-flex items-center space-x-2">
                <input
                    type="checkbox"
                    className="accent-[#55BDC7]"
                    checked={isPinned}
                    onChange={togglePin}
                    disabled={isLoading}
                />
                <span>항상 위에 보기</span>
            </label>
        </div>
    );
};

export default GeneralSettings;
