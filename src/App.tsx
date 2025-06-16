// src/App.tsx

import { useState, useEffect } from "react";
import "./App.css";
import Titlebar from "./components/Titlebar";

function App() {
  const [status, setStatus] = useState<'대기중' | '통화중' | '후처리'>('대기중');
  const [time, setTime] = useState('');
  const [taskCount, setTaskCount] = useState(0);

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

  return (
    <div className="app-container">
      {/* 커스텀 타이틀바 */}
      <Titlebar />

      {/* 메인 컨텐츠 */}
      <main className="task-master">
        <div className="content">
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
      </main>
    </div>
  );
}

export default App;