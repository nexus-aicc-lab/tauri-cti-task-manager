// // src/App.tsx
// import { useState, useEffect } from 'react';
// import { emit, listen } from '@tauri-apps/api/event';
// import LoginComponent from './pages/LoginMode';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import PanelModePage from './app/panel-mode';
// import BarModePage from './app/bar-mode';
// import { Launcher } from './app/launcher';
// import SettingsComponent from './app/settings-mode';

// type Mode = 'launcher' | 'bar' | 'panel' | 'login' | 'settings';

// function App() {
//   const [mode, setMode] = useState<Mode>('launcher');

//   // URL 파라미터에서 모드 감지
//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const urlMode = urlParams.get('mode') as Mode;

//     if (urlMode && ['launcher', 'bar', 'panel', 'login', 'settings'].includes(urlMode)) {
//       setMode(urlMode);
//       console.log(`🎯 URL에서 모드 감지: ${urlMode}`);
//     }
//   }, []);

//   // 자동 모드 전환 이벤트 리스너
//   useEffect(() => {
//     const unlisten = listen('auto-switch-mode', (event) => {
//       const newMode = event.payload as Mode;
//       console.log(`🔄 자동 모드 전환: ${newMode}`);
//       // 자동 전환은 Rust에서 새 창을 생성하므로 여기서는 처리하지 않음
//     });

//     return () => {
//       unlisten.then((fn) => fn());
//     };
//   }, []);

//   // 모드 전환 요청 (Rust에게 이벤트 전송)
//   const requestModeSwitch = async (newMode: Mode) => {
//     try {
//       await emit('switch-mode', newMode);
//       console.log(`📤 모드 전환 요청 전송: ${newMode}`);
//     } catch (error) {
//       console.error('❌ 모드 전환 요청 실패:', error);
//     }
//   };

//   console.log(`🎨 현재 렌더링 모드: ${mode}`);

//   // 모드별 배경색
//   const getBackgroundColor = () => {
//     switch (mode) {
//       case 'launcher':
//         return '#f3f4f6';
//       case 'bar':
//         return '#1e40af';
//       case 'panel':
//         return '#059669';
//       case 'login':
//         return '#7c3aed';
//       case 'settings':
//         return '#f59e0b';
//       default:
//         return '#f3f4f6';
//     }
//   };

//   return (
//     <div
//       style={{
//         backgroundColor: getBackgroundColor(),
//         minHeight: '100vh',
//         width: '100%',
//         overflow: 'hidden',
//       }}
//     >
//       {mode === 'launcher' && <Launcher onModeChange={requestModeSwitch} />}

//       {mode === 'bar' && (
//         <BarModePage onModeChange={requestModeSwitch} />
//       )}

//       {mode === 'panel' && (
//         <div style={{ color: 'white' }}>
//           <PanelModePage
//           // onBackToLauncher={function (): void {
//           //   throw new Error('Function not implemented.');
//           // }} 
//           />
//         </div>
//       )}

//       {mode === 'login' && <LoginComponent />}

//       {mode === 'settings' && <SettingsComponent />}

//       {/* ✅ Toast UI는 항상 렌더링! */}
//       <ToastContainer
//         position="top-center"
//         autoClose={2000}
//         closeOnClick
//         pauseOnHover
//         theme="light"
//       />
//     </div>
//   );
// }

// export default App;

// src/App.tsx
import { useState, useEffect } from 'react';
import { emit, listen } from '@tauri-apps/api/event';
import LoginComponent from './pages/LoginMode';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PanelModePage from './app/panel-mode';
import BarModePage from './app/bar-mode';
import { Launcher } from './app/launcher';
import SettingsComponent from './app/settings-mode';
import SystemSettingWindow from './app/system-setting-window';  // 새로 추가

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
        return '#ffffff';  // 바 모드는 흰색 배경
      case 'panel':
        return '#059669';
      case 'login':
        return '#7c3aed';
      case 'settings':
        return '#f5f5f5';  // 설정 창은 연한 회색 배경
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
        <BarModePage onModeChange={requestModeSwitch} />
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

      {/* 기존 설정 컴포넌트 대신 새로운 시스템 설정 창 사용 */}
      {mode === 'settings' && <SystemSettingWindow />}

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