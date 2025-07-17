// C:\tauri\cti-task-manager-tauri\src\windows\panel\app\App.tsx

import React from 'react'
import PanelModeContainer from '../pages/PanelModeContainer'
import { useAutoUpdate } from '../../../hooks/useAutoUpdate'

interface Props {

}

const App = (props: Props) => {
    const { updateInfo, checkForUpdates, isTauri } = useAutoUpdate()

    return (
        <div style={{ position: 'relative' }}>
            {/* 업데이트 상태 표시 (Tauri 환경에서만) */}
            {isTauri && (updateInfo.checking || updateInfo.downloading || updateInfo.available || updateInfo.error) && (
                <div
                    style={{
                        position: 'fixed',
                        top: '10px',
                        right: '10px',
                        background: '#ffffff',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 9999,
                        minWidth: '250px',
                        fontSize: '14px',
                        border: '1px solid #e0e0e0',
                    }}
                >
                    {updateInfo.checking && (
                        <div style={{ color: '#007ACC' }}>🔍 업데이트 확인 중...</div>
                    )}

                    {updateInfo.downloading && (
                        <div style={{ color: '#28a745' }}>⬇️ 업데이트 다운로드 중...</div>
                    )}

                    {updateInfo.available && !updateInfo.downloading && (
                        <div style={{ color: '#28a745' }}>
                            🆕 새 버전 {updateInfo.latestVersion} 사용 가능!
                        </div>
                    )}

                    {updateInfo.error && (
                        <div style={{ color: '#dc3545' }}>❌ {updateInfo.error}</div>
                    )}
                </div>
            )}

            {/* 수동 업데이트 확인 버튼 (Tauri 환경에서만) */}
            {isTauri && (
                <button
                    onClick={checkForUpdates}
                    disabled={updateInfo.checking || updateInfo.downloading}
                    style={{
                        position: 'fixed',
                        top: '10px',
                        left: '10px',
                        padding: '8px 12px',
                        fontSize: '12px',
                        backgroundColor: '#007ACC',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: updateInfo.checking || updateInfo.downloading ? 'not-allowed' : 'pointer',
                        opacity: updateInfo.checking || updateInfo.downloading ? 0.6 : 1,
                        zIndex: 9999,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                    title="업데이트 확인"
                >
                    {updateInfo.checking ? '확인중...' : '🔄 업데이트'}
                </button>
            )}

            <PanelModeContainer />
        </div>
    )
}

export default App