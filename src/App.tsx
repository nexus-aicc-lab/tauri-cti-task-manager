
// src/App.tsx (로그인 모드 추가)
import { useState, useEffect } from 'react';
import { emit } from '@tauri-apps/api/event';
import { Launcher } from './pages/Launcher';
import LoginComponent from './pages/LoginMode';

type Mode = 'launcher' | 'bar' | 'panel' | 'login';

function App() {
  const [mode, setMode] = useState<Mode>('launcher');

  // URL 파라미터에서 모드 감지
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlMode = urlParams.get('mode') as Mode;

    if (urlMode && ['launcher', 'bar', 'panel', 'login'].includes(urlMode)) {
      setMode(urlMode);
      console.log(`🎯 URL에서 모드 감지: ${urlMode}`);
    }
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
      case 'launcher': return '#f3f4f6';
      case 'bar': return '#1e40af';
      case 'panel': return '#059669';
      case 'login': return '#7c3aed';
    }
  };

  return (
    <div style={{
      backgroundColor: getBackgroundColor(),
      minHeight: '100vh',
      width: '100%',
      overflow: 'hidden'
    }}>
      {mode === 'launcher' && (
        <Launcher onModeChange={requestModeSwitch} />
      )}

      {mode === 'bar' && (
        <div style={{ height: '40px', display: 'flex', alignItems: 'center', padding: '0 16px' }}>
          <span style={{ color: 'white', marginRight: '16px' }}>📊 BAR MODE</span>
          <button
            onClick={() => requestModeSwitch('launcher')}
            style={{
              backgroundColor: '#1e3a8a',
              color: 'white',
              border: 'none',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🏠 런처
          </button>
        </div>
      )}

      {mode === 'panel' && (
        <div style={{ padding: '20px', color: 'white' }}>
          <h1>📋 PANEL MODE</h1>
          <button
            onClick={() => requestModeSwitch('launcher')}
            style={{
              backgroundColor: '#047857',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '16px'
            }}
          >
            🏠 런처로 돌아가기
          </button>
        </div>
      )}

      {mode === 'login' && (
        <LoginComponent />
      )}
    </div>
  );
}

export default App;