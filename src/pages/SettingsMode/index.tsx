// C:\tauri\cti-task-manager-tauri\src\pages\SettingsMode\index.tsx
// C:\tauri\cti-task-manager-tauri\src\pages\SettingsMode\index.tsx
import React, { useState, useEffect } from 'react'
import { switchViewMode } from '../../entry'
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow'
import { loadViewMode, saveViewMode } from '../../shared/lib/fs/viewModeStorage'

const SettingsComponent = () => {
    const [currentMode, setCurrentMode] = useState<'bar' | 'panel'>('bar')
    const [windowSettings, setWindowSettings] = useState({
        alwaysOnTop: false,
        startWithWindows: false,
        minimizeToTray: false,
    })
    const [isLoading, setIsLoading] = useState(true)

    // 컴포넌트 마운트 시 현재 설정 로드
    useEffect(() => {
        const loadCurrentSettings = async () => {
            try {
                const savedMode = await loadViewMode()
                if (savedMode) {
                    setCurrentMode(savedMode as 'bar' | 'panel')
                }
                // TODO: 다른 설정들도 로드
                setIsLoading(false)
            } catch (error) {
                console.error('설정 로드 실패:', error)
                setIsLoading(false)
            }
        }

        loadCurrentSettings()
    }, [])

    const handleModeChange = async (mode: 'bar' | 'panel') => {
        try {
            setCurrentMode(mode)
            await saveViewMode(mode)
            await switchViewMode(mode)
            console.log(`모드 변경: ${mode}`)
        } catch (error) {
            console.error('모드 변경 실패:', error)
        }
    }

    const handleWindowSettingChange = (setting: keyof typeof windowSettings) => {
        setWindowSettings(prev => ({
            ...prev,
            [setting]: !prev[setting]
        }))
    }

    const handleSave = async () => {
        try {
            // 모든 설정 저장
            await saveViewMode(currentMode)

            // TODO: 윈도우 설정들도 저장
            console.log('모든 설정 저장 완료:', {
                mode: currentMode,
                windowSettings
            })

            // 저장 완료 알림
            alert('설정이 저장되었습니다!')
        } catch (error) {
            console.error('설정 저장 실패:', error)
            alert('설정 저장에 실패했습니다.')
        }
    }

    const handleReset = () => {
        setCurrentMode('bar')
        setWindowSettings({
            alwaysOnTop: false,
            startWithWindows: false,
            minimizeToTray: false,
        })
    }

    const handleClose = async () => {
        try {
            const currentWindow = getCurrentWebviewWindow()
            await currentWindow.close()
        } catch (error) {
            console.error('윈도우 닫기 실패:', error)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">설정을 불러오는 중...</div>
            </div>
        )
    }

    return (
        <div className="settings-container p-6 min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">
                    CTI Task Master - Settings
                </h1>

                {/* View Mode Section */}
                <div className="settings-section mb-8 bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">
                        View Mode
                    </h2>
                    <div className="space-y-3">
                        <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                                type="radio"
                                name="viewMode"
                                value="bar"
                                checked={currentMode === 'bar'}
                                onChange={() => handleModeChange('bar')}
                                className="mr-3 text-blue-600"
                            />
                            <div>
                                <div className="font-medium">Bar Mode (Compact)</div>
                                <div className="text-sm text-gray-500">
                                    작고 간결한 바 형태의 인터페이스
                                </div>
                            </div>
                        </label>
                        <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                                type="radio"
                                name="viewMode"
                                value="panel"
                                checked={currentMode === 'panel'}
                                onChange={() => handleModeChange('panel')}
                                className="mr-3 text-blue-600"
                            />
                            <div>
                                <div className="font-medium">Panel Mode (Full)</div>
                                <div className="text-sm text-gray-500">
                                    전체 기능을 사용할 수 있는 패널 인터페이스
                                </div>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Window Settings Section */}
                <div className="settings-section mb-8 bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">
                        Window Settings
                    </h2>
                    <div className="space-y-4">
                        <label className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                            <div>
                                <div className="font-medium">Always on top</div>
                                <div className="text-sm text-gray-500">
                                    다른 창 위에 항상 표시
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={windowSettings.alwaysOnTop}
                                onChange={() => handleWindowSettingChange('alwaysOnTop')}
                                className="text-blue-600 focus:ring-blue-500"
                            />
                        </label>
                        <label className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                            <div>
                                <div className="font-medium">Start with Windows</div>
                                <div className="text-sm text-gray-500">
                                    Windows 시작 시 자동 실행
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={windowSettings.startWithWindows}
                                onChange={() => handleWindowSettingChange('startWithWindows')}
                                className="text-blue-600 focus:ring-blue-500"
                            />
                        </label>
                        <label className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                            <div>
                                <div className="font-medium">Minimize to tray</div>
                                <div className="text-sm text-gray-500">
                                    최소화 시 시스템 트레이로 이동
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={windowSettings.minimizeToTray}
                                onChange={() => handleWindowSettingChange('minimizeToTray')}
                                className="text-blue-600 focus:ring-blue-500"
                            />
                        </label>
                    </div>
                </div>

                {/* Actions Section */}
                <div className="settings-actions flex flex-wrap gap-3 justify-end">
                    <button
                        onClick={handleReset}
                        className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        Reset
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Save Settings
                    </button>
                    <button
                        onClick={handleClose}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SettingsComponent