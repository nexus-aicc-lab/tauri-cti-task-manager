// src/shared/hooks/useTheme.ts

import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Theme, ThemeKey, ThemeDefinitions } from '@/shared/types/theme';

interface AppSettings {
    startup_mode: string;
    auto_login: boolean;
    theme: string;
}

// 기본 테마 정의 (파일 로드 실패 시 폴백)
const defaultThemes: ThemeDefinitions['themes'] = {
    red: {
        name: "빨간 계통",
        description: "Red & Pink",
        emoji: "🔴",
        colors: {
            gradient: { from: "rgb(127, 29, 29)", via: "rgb(131, 24, 67)", to: "rgb(136, 19, 55)" },
            primary: "#dc2626",
            primaryHover: "#b91c1c",
            blur: "rgba(239, 68, 68, 0.2)",
            border: "#f87171",
            card: "rgba(255, 255, 255, 0.1)"
        },
        tailwind: {
            gradient: "from-red-900 via-pink-900 to-rose-900",
            button: "bg-red-600 hover:bg-red-700",
            checkbox: "data-[state=checked]:bg-red-600",
            tab: "border-red-400",
            blur: "bg-red-500/20",
            preview: "bg-gradient-to-br from-red-500 to-pink-600"
        }
    },
    yellow: {
        name: "노란 계통",
        description: "Yellow & Orange",
        emoji: "🟡",
        colors: {
            gradient: { from: "rgb(113, 63, 18)", via: "rgb(120, 53, 15)", to: "rgb(124, 45, 18)" },
            primary: "#ca8a04",
            primaryHover: "#a16207",
            blur: "rgba(250, 204, 21, 0.2)",
            border: "#facc15",
            card: "rgba(255, 255, 255, 0.1)"
        },
        tailwind: {
            gradient: "from-yellow-900 via-amber-900 to-orange-900",
            button: "bg-yellow-600 hover:bg-yellow-700",
            checkbox: "data-[state=checked]:bg-yellow-600",
            tab: "border-yellow-400",
            blur: "bg-yellow-500/20",
            preview: "bg-gradient-to-br from-yellow-400 to-orange-500"
        }
    },
    green: {
        name: "초록 계통",
        description: "Green & Emerald",
        emoji: "🟢",
        colors: {
            gradient: { from: "rgb(20, 83, 45)", via: "rgb(6, 78, 59)", to: "rgb(19, 78, 74)" },
            primary: "#16a34a",
            primaryHover: "#15803d",
            blur: "rgba(34, 197, 94, 0.2)",
            border: "#4ade80",
            card: "rgba(255, 255, 255, 0.1)"
        },
        tailwind: {
            gradient: "from-green-900 via-emerald-900 to-teal-900",
            button: "bg-green-600 hover:bg-green-700",
            checkbox: "data-[state=checked]:bg-green-600",
            tab: "border-green-400",
            blur: "bg-green-500/20",
            preview: "bg-gradient-to-br from-green-500 to-emerald-600"
        }
    },
    dark: {
        name: "다크 모드",
        description: "Dark & Purple",
        emoji: "⚫",
        colors: {
            gradient: { from: "rgb(17, 24, 39)", via: "rgb(30, 58, 138)", to: "rgb(67, 56, 202)" },
            primary: "#2563eb",
            primaryHover: "#1d4ed8",
            blur: "rgba(59, 130, 246, 0.2)",
            border: "#60a5fa",
            card: "rgba(255, 255, 255, 0.1)"
        },
        tailwind: {
            gradient: "from-gray-900 via-blue-900 to-purple-900",
            button: "bg-blue-600 hover:bg-blue-700",
            checkbox: "data-[state=checked]:bg-blue-600",
            tab: "border-blue-400",
            blur: "bg-blue-500/20",
            preview: "bg-gradient-to-br from-gray-800 to-gray-900"
        }
    }
};

export function useTheme() {
    const [currentThemeKey, setCurrentThemeKey] = useState<ThemeKey>('dark');
    const [themes, setThemes] = useState<ThemeDefinitions['themes']>(defaultThemes);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            setIsLoading(true);

            // 1. 테마 정의 파일 로드 시도 (향후 구현)
            // const themeDefinitions = await invoke<ThemeDefinitions>('load_theme_definitions');
            // setThemes(themeDefinitions.themes);

            // 2. 사용자 설정에서 현재 테마 로드
            const settings = await invoke<AppSettings>('load_settings');
            setCurrentThemeKey((settings.theme as ThemeKey) || 'dark');
        } catch (error) {
            console.error('테마 로드 실패:', error);
            // 기본값 사용
        } finally {
            setIsLoading(false);
        }
    };

    const saveTheme = async (themeKey: ThemeKey) => {
        try {
            const settings = await invoke<AppSettings>('load_settings');
            settings.theme = themeKey;
            await invoke('save_settings', { settings });
            setCurrentThemeKey(themeKey);
        } catch (error) {
            console.error('테마 저장 실패:', error);
        }
    };

    const currentTheme = themes[currentThemeKey];

    return {
        themes,
        currentTheme,
        currentThemeKey,
        setTheme: saveTheme,
        isLoading
    };
}