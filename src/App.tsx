// src/App.tsx
import { useState, useEffect } from 'react';
import { emit, listen } from '@tauri-apps/api/event';
import { Launcher } from './pages/Launcher';
import LoginComponent from './pages/LoginMode';
import SettingsComponent from './pages/SettingsMode';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PanelModePage from './app/panel-mode';

type Mode = 'launcher' | 'bar' | 'panel' | 'login' | 'settings';

function App() {
  const [mode, setMode] = useState<Mode>('launcher');

  // URL 파라미터에서 모드 감지
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlMode = urlParams.get('mode') as Mode;

    if (urlMode && ['launcher', 'bar', 'panel', 'login', 'settings'].includes(urlMode)) {
      setMode(urlMode);
      console.log(`🎯 URL에서 모드 감지: ${urlMode}`);
    }
  }, []);

  // 자동 모드 전환 이벤트 리스너
  useEffect(() => {
    const unlisten = listen('auto-switch-mode', (event) => {
      const newMode = event.payload as Mode;
      console.log(`🔄 자동 모드 전환: ${newMode}`);
      // 자동 전환은 Rust에서 새 창을 생성하므로 여기서는 처리하지 않음
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  // 모드 전환 요청 (Rust에게 이벤트 전송)
  const requestModeSwitch = async (newMode: Mode) => {
    try {
      await emit('switch-mode', newMode);
      console.log(`📤 모드 전환 요청 전송: ${newMode}`);
    } catch (error) {
      console.error('❌ 모드 전환 요청 실패:', error);
    }
  };

  console.log(`🎨 현재 렌더링 모드: ${mode}`);

  // 모드별 배경색
  const getBackgroundColor = () => {
    switch (mode) {
      case 'launcher':
        return '#f3f4f6';
      case 'bar':
        return '#1e40af';
      case 'panel':
        return '#059669';
      case 'login':
        return '#7c3aed';
      case 'settings':
        return '#f59e0b';
      default:
        return '#f3f4f6';
    }
  };

  return (
    <div
      style={{
        backgroundColor: getBackgroundColor(),
        minHeight: '100vh',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {mode === 'launcher' && <Launcher onModeChange={requestModeSwitch} />}

      {mode === 'bar' && (
        <div
          style={{
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            backgroundColor: '#1e40af',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: 'white', marginRight: '16px', fontSize: '14px' }}>
              📊 BAR MODE
            </span>
            <span style={{ color: '#93c5fd', fontSize: '12px' }}>
              CTI Task Master 작업 표시줄
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => requestModeSwitch('panel')}
              style={{
                backgroundColor: '#1e3a8a',
                color: 'white',
                border: 'none',
                padding: '4px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              📋 패널
            </button>

            <button
              onClick={() => requestModeSwitch('launcher')}
              style={{
                backgroundColor: '#1e3a8a',
                color: 'white',
                border: 'none',
                padding: '4px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              🏠 런처
            </button>
          </div>
        </div>
      )}

      {mode === 'panel' && (
        <div style={{ color: 'white' }}>
          <PanelModePage
          // onBackToLauncher={function (): void {
          //   throw new Error('Function not implemented.');
          // }} 
          />
        </div>
      )}

      {mode === 'login' && <LoginComponent />}

      {mode === 'settings' && <SettingsComponent />}

      {/* ✅ Toast UI는 항상 렌더링! */}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
