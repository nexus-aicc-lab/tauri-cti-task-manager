// src/shared/types/theme.ts

export interface ThemeColors {
    gradient: {
        from: string;
        via: string;
        to: string;
    };
    primary: string;
    primaryHover: string;
    blur: string;
    border: string;
    card: string;
}

export interface ThemeTailwind {
    gradient: string;
    button: string;
    checkbox: string;
    tab: string;
    blur: string;
    preview: string;
}

export interface Theme {
    name: string;
    description: string;
    emoji: string;
    colors: ThemeColors;
    tailwind: ThemeTailwind;
}

export interface ThemeDefinitions {
    themes: {
        red: Theme;
        yellow: Theme;
        green: Theme;
        dark: Theme;
    };
}

export type ThemeKey = keyof ThemeDefinitions['themes'];