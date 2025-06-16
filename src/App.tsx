// src/App.tsx

import { useState, useEffect } from "react";
import { LayoutGrid, Minus as BarIcon } from "lucide-react";
import "./App.css";
import Titlebar from "./components/Titlebar";

type ViewMode = 'bar' | 'panel';

function App() {
  const [status, setStatus] = useState<'대기중' | '통화중' | '후처리'>('대기중');
  const [time, setTime] = useState('');
  const [taskCount, setTaskCount] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('panel');

  useEffect(() => {
    // 컴포넌트 마운트 시 현재 시간으로 초기화
    setTime(new Date().toLocaleTimeString('ko-KR'));

    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('ko-KR'));
    }, 1000);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearInterval(timer);
  }, []);

  const nextStatus = () => {
    setStatus(prev => {
      if (prev === '대기중') return '통화중';
      if (prev === '통화중') return '후처리';
      return '대기중';
    });

    // 상태가 '후처리'에서 '대기중'으로 바뀔 때 카운트를 증가
    if (status === '후처리') {
      setTaskCount(prev => prev + 1);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case '대기중': return 'status-waiting';
      case '통화중': return 'status-calling';
      case '후처리': return 'status-processing';
      default: return 'status-default';
    }
  };

  const toggleViewMode = async () => {
    const newMode = viewMode === 'bar' ? 'panel' : 'bar';
    setViewMode(newMode);

    // Tauri 환경에서 창 크기 조정
    const isTauriEnv = '__TAURI__' in window || '__TAURI_INTERNALS__' in window || navigator.userAgent.includes('tauri');

    if (isTauriEnv) {
      try {
        const { getCurrentWindow, LogicalSize } = await import('@tauri-apps/api/window');
        const appWindow = getCurrentWindow();

        // 모드에 따라 창 높이 조정
        if (newMode === 'bar') {
          await appWindow.setSize(new LogicalSize(800, 80));
        } else {
          await appWindow.setSize(new LogicalSize(800, 120));
        }
      } catch (error) {
        console.error('창 크기 조정 실패:', error);
      }
    }
  };

  return (
    <div className="app-container">
      {/* 커스텀 타이틀바 */}
      <Titlebar viewMode={viewMode} onToggleMode={toggleViewMode} />

      {/* 메인 컨텐츠 */}
      <main className={`task-master ${viewMode}-mode`}>
        {viewMode === 'panel' ? (
          // 패널 모드 (기존 레이아웃)
          <div className="content panel-content">
            <div className="left-section">
              <h1 className="title">CTI Task Master</h1>
              <div className="time">{time || '로딩중...'}</div>
            </div>

            <div className="center-section">
              <div
                className={`status ${getStatusColor()}`}
                onClick={nextStatus}
                title="상태 변경"
              >
                {status}
              </div>
            </div>

            <div className="right-section">
              <div className="counter">처리 완료: {taskCount}건</div>
            </div>
          </div>
        ) : (
          // 바 모드 (아이콘 레이아웃)
          <div className="content bar-content">
            <div className="bar-item time-item" title={`현재 시간: ${time}`}>
              🕐 {time.split(':').slice(0, 2).join(':')}
            </div>

            <div
              className={`bar-item status-item ${getStatusColor()}`}
              onClick={nextStatus}
              title="상태 변경"
            >
              <span className="status-icon">
                {status === '대기중' ? '⏸️' : status === '통화중' ? '📞' : '⚙️'}
              </span>
              <span className="status-text">{status}</span>
            </div>

            <div className="bar-item counter-item" title={`처리 완료: ${taskCount}건`}>
              ✅ {taskCount}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;