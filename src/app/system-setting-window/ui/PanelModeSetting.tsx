import React from 'react';

interface ExtendedCSSProperties extends React.CSSProperties {
    WebkitAppRegion?: 'drag' | 'no-drag';
}

interface Settings {
    startupWithWindows: boolean;
    language: string;
    fontSize: string;
    theme: string;
    serverAddress: string;
    port: string;
    timeout: number;
    recordingPath: string;
    autoRecord: boolean;
    showMinimap: boolean;
    minimapPosition: string;
    version: string;
    buildDate: string;
    panelMode: string;
    panelSize: string;
    panelTransparency: number;
}

interface PanelModeSettingProps {
    settings: Settings;
    updateSetting: (key: string, value: any) => void;
}

const PanelModeSetting: React.FC<PanelModeSettingProps> = ({ settings, updateSetting }) => {
    return (
        <div className="space-y-4" style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}>
            <div>
                <label className="block text-sm font-medium mb-2" style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}>
                    패널 모드
                </label>
                <select
                    value={settings.panelMode || 'floating'}
                    onChange={e => updateSetting('panelMode', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 text-sm"
                    style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}
                >
                    <option value="floating">플로팅</option>
                    <option value="docked">도킹</option>
                    <option value="fullscreen">전체화면</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-2" style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}>
                    패널 크기
                </label>
                <select
                    value={settings.panelSize || 'medium'}
                    onChange={e => updateSetting('panelSize', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 text-sm"
                    style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}
                >
                    <option value="small">소형</option>
                    <option value="medium">중형</option>
                    <option value="large">대형</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-2" style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}>
                    투명도: {settings.panelTransparency || 100}%
                </label>
                <input
                    type="range"
                    min="50"
                    max="100"
                    value={settings.panelTransparency || 100}
                    onChange={e => updateSetting('panelTransparency', parseInt(e.target.value))}
                    className="w-full"
                    style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}
                />
            </div>
        </div>
    );
};

export default PanelModeSetting;