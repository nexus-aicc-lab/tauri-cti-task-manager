// // src/App.tsx

// import { useState, useEffect } from "react";
// import { LayoutGrid, Minus as BarIcon } from "lucide-react";
// import "./App.css";
// import Titlebar from "./components/Titlebar";

// type ViewMode = 'bar' | 'panel';

// function App() {
//   const [status, setStatus] = useState<'대기중' | '통화중' | '후처리'>('대기중');
//   const [time, setTime] = useState('');
//   const [taskCount, setTaskCount] = useState(0);
//   const [viewMode, setViewMode] = useState<ViewMode>('panel');

//   useEffect(() => {
//     // 컴포넌트 마운트 시 현재 시간으로 초기화
//     setTime(new Date().toLocaleTimeString('ko-KR'));

//     const timer = setInterval(() => {
//       setTime(new Date().toLocaleTimeString('ko-KR'));
//     }, 1000);

//     // 컴포넌트 언마운트 시 타이머 정리
//     return () => clearInterval(timer);
//   }, []);

//   const nextStatus = () => {
//     setStatus(prev => {
//       if (prev === '대기중') return '통화중';
//       if (prev === '통화중') return '후처리';
//       return '대기중';
//     });

//     // 상태가 '후처리'에서 '대기중'으로 바뀔 때 카운트를 증가
//     if (status === '후처리') {
//       setTaskCount(prev => prev + 1);
//     }
//   };

//   const getStatusColor = () => {
//     switch (status) {
//       case '대기중': return 'status-waiting';
//       case '통화중': return 'status-calling';
//       case '후처리': return 'status-processing';
//       default: return 'status-default';
//     }
//   };

//   const toggleViewMode = async () => {
//     const newMode = viewMode === 'bar' ? 'panel' : 'bar';
//     setViewMode(newMode);

//     // Tauri 환경에서 창 크기 조정 (권한이 있는 경우에만)
//     const isTauriEnv = '__TAURI__' in window || '__TAURI_INTERNALS__' in window || navigator.userAgent.includes('tauri');

//     if (isTauriEnv) {
//       try {
//         const { getCurrentWindow, LogicalSize } = await import('@tauri-apps/api/window');
//         const appWindow = getCurrentWindow();

//         // 모드에 따라 창 높이 조정
//         if (newMode === 'bar') {
//           await appWindow.setSize(new LogicalSize(1000, 38));
//         } else {
//           await appWindow.setSize(new LogicalSize(800, 320));
//         }
//       } catch (error) {
//         console.warn('창 크기 자동 조정을 사용할 수 없습니다. 수동으로 창 크기를 조정해주세요.', error);
//         // 창 크기 조정이 실패해도 모드 전환은 정상 작동
//       }
//     }
//   };

//   return (
//     <div className="app-container">
//       {/* 커스텀 타이틀바 */}
//       <Titlebar viewMode={viewMode} onToggleMode={toggleViewMode} />
//       hi

//       {/* 메인 컨텐츠 */}
//       {/* <main className={`task-master ${viewMode}-mode`}>
//         {viewMode === 'panel' ? (
//           // 패널 모드 (기존 레이아웃)
//           <div className="content panel-content">
//             <div className="left-section">
//               <h1 className="title">CTI Task Master</h1>
//               <div className="time">{time || '로딩중...'}</div>
//             </div>

//             <div className="center-section">
//               <div
//                 className={`status ${getStatusColor()}`}
//                 onClick={nextStatus}
//                 title="상태 변경"
//               >
//                 {status}
//               </div>
//             </div>

//             <div className="right-section">
//               <div className="counter">처리 완료: {taskCount}건</div>
//             </div>
//           </div>
//         ) : (
//           // 바 모드 (아이콘 레이아웃)
//           <div className="content bar-content">
//             <div className="bar-item time-item" title={`현재 시간: ${time}`}>
//               🕐 {time.split(':').slice(0, 2).join(':')}
//             </div>

//             <div
//               className={`bar-item status-item ${getStatusColor()}`}
//               onClick={nextStatus}
//               title="상태 변경"
//             >
//               <span className="status-icon">
//                 {status === '대기중' ? '⏸️' : status === '통화중' ? '📞' : '⚙️'}
//               </span>
//               <span className="status-text">{status}</span>
//             </div>

//             <div className="bar-item counter-item" title={`처리 완료: ${taskCount}건`}>
//               ✅ {taskCount}
//             </div>
//           </div>
//         )}
//       </main> */}
//     </div>
//   );
// }

// export default App;

// src/App.tsx

import { useState, useEffect } from "react";
import { LayoutGrid, Minus as BarIcon, Phone, PhoneCall, Clock, User, Settings } from "lucide-react";
import "./App.css";
import Titlebar from "./components/Titlebar";

type ViewMode = 'bar' | 'panel';

function App() {
  const [status, setStatus] = useState<'대기중' | '통화중' | '후처리'>('대기중');
  const [time, setTime] = useState('');
  const [taskCount, setTaskCount] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(15);
  const [efficiency, setEfficiency] = useState(85);
  const [callsPerHour, setCallsPerHour] = useState(12);
  const [viewMode, setViewMode] = useState<ViewMode>('panel');
  const [loginTime, setLoginTime] = useState('');
  const [sessionTime, setSessionTime] = useState('00:00:00');

  // CTI 통계 데이터
  const [stats, setStats] = useState({
    inbound: 8,
    outbound: 4,
    missed: 2,
    avgTalkTime: '02:35',
    avgWrapTime: '01:20',
    totalCalls: 12
  });

  useEffect(() => {
    // 컴포넌트 마운트 시 현재 시간으로 초기화
    const now = new Date();
    setTime(now.toLocaleTimeString('ko-KR'));
    setLoginTime(now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }));

    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('ko-KR'));
      // 세션 시간 업데이트 (실제로는 로그인 시간 기준으로 계산)
      const elapsed = Math.floor((Date.now() - now.getTime()) / 1000);
      const hours = Math.floor(elapsed / 3600);
      const minutes = Math.floor((elapsed % 3600) / 60);
      const seconds = elapsed % 60;
      setSessionTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

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
      setCompletedTasks(prev => prev + 1);
      setStats(prev => ({
        ...prev,
        totalCalls: prev.totalCalls + 1,
        inbound: prev.inbound + (Math.random() > 0.5 ? 1 : 0)
      }));
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

        if (newMode === 'bar') {
          await appWindow.setSize(new LogicalSize(1000, 36));
        } else {
          await appWindow.setSize(new LogicalSize(800, 400));
        }
      } catch (error) {
        console.warn('창 크기 자동 조정을 사용할 수 없습니다.', error);
      }
    }
  };

  return (
    <div className="app-container">
      {/* 커스텀 타이틀바 */}
      <Titlebar
        viewMode={viewMode}
        onToggleMode={toggleViewMode}
        status={status}
        time={time}
        taskCount={taskCount}
        completedTasks={completedTasks}
        efficiency={efficiency}
        callsPerHour={callsPerHour}
      />

      {/* 메인 컨텐츠 */}
      {viewMode === 'panel' && (
        <main className="task-master panel-mode">
          {/* 상단 정보 바 */}
          {/* 개선된 상단 정보 바 */}
          <div className="info-header">
            <div className="agent-section">
              <div className="agent-badge">
                <User size={14} />
                <span className="agent-id">NEX3041</span>
              </div>
              <div className="session-info">
                <Clock size={12} />
                <span className="session-time">{sessionTime}</span>
              </div>
            </div>
            <div className="action-section">
              <div className="login-info">
                <span className="login-label">로그인</span>
                <span className="login-time">{loginTime}</span>
              </div>
              <button className="logout-btn">
                <span>LogOff</span>
              </button>
            </div>
          </div>

          {/* 메인 대시보드 */}
          <div className="dashboard-grid">
            {/* 좌측 통계 패널 */}
            <div className="stats-panel">
              <div className="stat-row">
                <div className="stat-item inbound">
                  <Phone size={16} />
                  <span className="stat-label">인바운드</span>
                  <span className="stat-value">{stats.inbound}</span>
                </div>
                <div className="stat-item outbound">
                  <PhoneCall size={16} />
                  <span className="stat-label">아웃바운드</span>
                  <span className="stat-value">{stats.outbound}</span>
                </div>
              </div>

              <div className="stat-row">
                <div className="stat-item missed">
                  <Phone size={16} className="missed-icon" />
                  <span className="stat-label">부재중</span>
                  <span className="stat-value">{stats.missed}</span>
                </div>
                <div className="stat-item total">
                  <LayoutGrid size={16} />
                  <span className="stat-label">총 통화</span>
                  <span className="stat-value">{stats.totalCalls}</span>
                </div>
              </div>
            </div>

            {/* 중앙 상태 패널 */}
            <div className="status-panel">
              <div
                className={`main-status ${getStatusColor()}`}
                onClick={nextStatus}
                title="클릭하여 상태 변경"
              >
                <div className="status-icon">
                  {status === '대기중' ? '⏸️' : status === '통화중' ? '📞' : '⚙️'}
                </div>
                <div className="status-text">{status}</div>
                <div className="status-timer">{sessionTime}</div>
              </div>
            </div>

            {/* 우측 성과 패널 */}
            <div className="performance-panel">
              <div className="perf-item">
                <Clock size={14} />
                <span className="perf-label">평균 통화시간</span>
                <span className="perf-value">{stats.avgTalkTime}</span>
              </div>
              <div className="perf-item">
                <Settings size={14} />
                <span className="perf-label">평균 후처리</span>
                <span className="perf-value">{stats.avgWrapTime}</span>
              </div>
              <div className="perf-item efficiency-item">
                <User size={14} />
                <span className="perf-label">효율성</span>
                <span className="perf-value">{efficiency}%</span>
              </div>
            </div>
          </div>

          {/* 하단 요약 바 */}
          <div className="summary-bar">
            <div className="summary-item">
              <span className="summary-label">응답률</span>
              <span className="summary-value">{Math.round((stats.totalCalls / (stats.totalCalls + stats.missed)) * 100)}%</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">시간당 통화</span>
              <span className="summary-value">{callsPerHour}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">완료 작업</span>
              <span className="summary-value">{completedTasks}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">대기 작업</span>
              <span className="summary-value">{taskCount - completedTasks}</span>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;