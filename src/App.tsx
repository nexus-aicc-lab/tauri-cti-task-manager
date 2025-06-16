import { useState, useEffect } from "react";
import { getCurrentWindow } from '@tauri-apps/api/window';
import "./App.css";

function App() {
  const [status, setStatus] = useState<'대기중' | '통화중' | '후처리'>('대기중');
  const [time, setTime] = useState('');
  const [taskCount, setTaskCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(new Date().toLocaleTimeString());

    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClose = async () => {
    try {
      const appWindow = getCurrentWindow();
      await appWindow.close();
    } catch (error) {
      console.error('창 닫기 실패:', error);
    }
  };

  const handleMinimize = async () => {
    try {
      const appWindow = getCurrentWindow();
      await appWindow.minimize();
    } catch (error) {
      console.error('창 최소화 실패:', error);
    }
  };

  const nextStatus = () => {
    setStatus(prev => {
      if (prev === '대기중') return '통화중';
      if (prev === '통화중') return '후처리';
      return '대기중';
    });

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

  if (!mounted) {
    return (
      <main className="task-master">
        <div className="drag-area"></div>
        <div className="window-controls">
          <button className="minimize-btn" onClick={handleMinimize}>−</button>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>
        <div className="content">
          <div className="left-section">
            <h1 className="title">CTI Task Master</h1>
            <div className="time">로딩중...</div>
          </div>
          <div className="center-section">
            <div className="status status-default">대기중</div>
          </div>
          <div className="right-section">
            <div className="counter">처리 완료: 0건</div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="task-master">
      <div className="drag-area"></div>
      <div className="window-controls">
        <button className="minimize-btn" onClick={handleMinimize}>−</button>
        <button className="close-btn" onClick={handleClose}>×</button>
      </div>

      <div className="content">
        <div className="left-section">
          <h1 className="title">CTI Task Master</h1>
          <div className="time">{time}</div>
        </div>

        <div className="center-section">
          <div
            className={`status ${getStatusColor()}`}
            onClick={nextStatus}
          >
            {status}
          </div>
        </div>

        <div className="right-section">
          <div className="counter">처리 완료: {taskCount}건</div>
        </div>
      </div>
    </main>
  );
}

export default App;