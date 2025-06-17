// src/App.tsx

import { useState, useEffect } from "react";
import { Phone, Clock, User, Settings, Activity, TrendingUp, Headphones, PhoneIncoming, PhoneOutgoing } from "lucide-react";
import "./App.css";
import Titlebar from "./components/Titlebar";

type ViewMode = 'bar' | 'panel';

function App() {
  const [status, setStatus] = useState<'대기중' | '통화중' | '정지중'>('대기중');
  const [time, setTime] = useState('');
  const [taskCount, setTaskCount] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(15);
  const [efficiency, setEfficiency] = useState(85);
  const [callsPerHour, setCallsPerHour] = useState(12);
  const [viewMode, setViewMode] = useState<ViewMode>('bar');
  const [loginTime, setLoginTime] = useState('');
  const [sessionTime, setSessionTime] = useState('00:00:00');
  const [currentCall, setCurrentCall] = useState<string | null>(null);

  // 실시간 애니메이션을 위한 상태들
  const [pulseActive, setPulseActive] = useState(false);
  const [statusChangeCount, setStatusChangeCount] = useState(0);

  // CTI 통계 데이터 (더 역동적으로)
  const [stats, setStats] = useState({
    inbound: 8,
    outbound: 4,
    missed: 2,
    avgTalkTime: '02:35',
    avgWrapTime: '01:20',
    totalCalls: 12,
    waitingCalls: 3,
    activeCalls: 1
  });

  // 실시간 통화 큐 시뮬레이션
  const [callQueue, setCallQueue] = useState([
    { id: '001', number: '010-1234-5678', waitTime: '00:45', priority: 'high' },
    { id: '002', number: '02-567-8901', waitTime: '01:12', priority: 'normal' },
    { id: '003', number: '031-234-5678', waitTime: '00:23', priority: 'low' }
  ]);

  useEffect(() => {
    // 컴포넌트 마운트 시 현재 시간으로 초기화
    const now = new Date();
    setTime(now.toLocaleTimeString('ko-KR'));
    setLoginTime(now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }));

    const timer = setInterval(() => {
      const currentTime = new Date();
      setTime(currentTime.toLocaleTimeString('ko-KR'));

      // 세션 시간 업데이트
      const elapsed = Math.floor((Date.now() - now.getTime()) / 1000);
      const hours = Math.floor(elapsed / 3600);
      const minutes = Math.floor((elapsed % 3600) / 60);
      const seconds = elapsed % 60;
      setSessionTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);

      // 랜덤한 통계 변화 시뮬레이션
      if (Math.random() > 0.95) {
        setCallsPerHour(prev => Math.max(8, Math.min(20, prev + (Math.random() > 0.5 ? 1 : -1))));
        setEfficiency(prev => Math.max(60, Math.min(100, prev + (Math.random() - 0.5) * 2)));
      }

      // 대기 큐 시간 업데이트
      setCallQueue(prev => prev.map(call => {
        const [minutes, seconds] = call.waitTime.split(':').map(Number);
        const newSeconds = seconds + 1;
        if (newSeconds >= 60) {
          return { ...call, waitTime: `${String(minutes + 1).padStart(2, '0')}:00` };
        }
        return { ...call, waitTime: `${String(minutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}` };
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 상태 변경시 펄스 효과
  useEffect(() => {
    if (status === '통화중' || status === '정지중') {
      setPulseActive(true);
      const timer = setTimeout(() => setPulseActive(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const nextStatus = () => {
    setStatus(prev => {
      if (prev === '대기중') {
        setCurrentCall(callQueue[0]?.number || '010-1234-5678');
        return '통화중';
      }
      if (prev === '통화중') {
        return '정지중';
      }
      setCurrentCall(null);
      return '대기중';
    });

    setStatusChangeCount(prev => prev + 1);

    // 상태가 '정지중'에서 '대기중'으로 바뀔 때 카운트를 증가
    if (status === '정지중') {
      setTaskCount(prev => prev + 1);
      setCompletedTasks(prev => prev + 1);
      setStats(prev => ({
        ...prev,
        totalCalls: prev.totalCalls + 1,
        inbound: prev.inbound + (Math.random() > 0.3 ? 1 : 0),
        outbound: prev.outbound + (Math.random() > 0.7 ? 1 : 0)
      }));

      // 통화 완료 후 큐에서 제거
      setCallQueue(prev => prev.slice(1));
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case '대기중': return 'status-waiting';
      case '통화중': return 'status-calling';
      case '정지중': return 'status-processing';
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
          await appWindow.setSize(new LogicalSize(900, 500));
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
          <div className="dashboard-grid enhanced">
            {/* 좌측 통계 + 실시간 큐 */}
            <div className="left-column">
              {/* 통계 패널 */}
              <div className="stats-panel">
                <h4 className="panel-title">
                  <Activity size={16} />
                  통화 현황
                </h4>
                <div className="stat-row">
                  <div className="stat-item inbound">
                    <PhoneIncoming size={16} />
                    <span className="stat-label">인바운드</span>
                    <span className="stat-value">{stats.inbound}</span>
                  </div>
                  <div className="stat-item outbound">
                    <PhoneOutgoing size={16} />
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
                    <Headphones size={16} />
                    <span className="stat-label">총 통화</span>
                    <span className="stat-value">{stats.totalCalls}</span>
                  </div>
                </div>
              </div>

              {/* 실시간 대기 큐 */}
              {/* <div className="queue-panel">
                <h4 className="panel-title">
                  <Timer size={16} />
                  대기 큐 ({callQueue.length})
                </h4>
                <div className="queue-list">
                  {callQueue.map((call) => (
                    <div key={call.id} className={`queue-item priority-${call.priority}`}>
                      <div className="queue-info">
                        <span className="queue-number">{call.number}</span>
                        <span className={`queue-priority ${call.priority}`}>
                          {call.priority === 'high' ? '🔴' : call.priority === 'normal' ? '🟡' : '🟢'}
                        </span>
                      </div>
                      <div className="queue-time">
                        <Clock size={12} />
                        <span>{call.waitTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div> */}
            </div>

            {/* 중앙 상태 패널 */}
            <div className="center-column">
              <div className="status-panel">
                <div
                  className={`main-status ${getStatusColor()} ${pulseActive ? 'pulse-active' : ''}`}
                  onClick={nextStatus}
                  title="클릭하여 상태 변경"
                >
                  <div className="status-icon">
                    {status === '대기중' ? '⏸️' : status === '통화중' ? '📞' : '⏹️'}
                  </div>
                  <div className="status-text">{status}</div>
                  {currentCall && (
                    <div className="current-call">
                      {currentCall}
                    </div>
                  )}
                  <div className="status-timer">{sessionTime}</div>
                  <div className="status-count">#{statusChangeCount}</div>
                </div>
              </div>
            </div>

            {/* 우측 성과 패널 */}
            <div className="right-column">
              <div className="performance-panel">
                <h4 className="panel-title">
                  <TrendingUp size={16} />
                  성과 지표
                </h4>
                <div className="perf-item">
                  <Clock size={14} />
                  <span className="perf-label">평균 통화시간</span>
                  <span className="perf-value">{stats.avgTalkTime}</span>
                </div>
                <div className="perf-item">
                  <Settings size={14} />
                  <span className="perf-label">평균 정지 시간</span>
                  <span className="perf-value">{stats.avgWrapTime}</span>
                </div>
                <div className="perf-item efficiency-item">
                  <User size={14} />
                  <span className="perf-label">효율성</span>
                  <div className="efficiency-display">
                    <span className="perf-value">{efficiency}%</span>
                    <div className="efficiency-bar">
                      <div
                        className="efficiency-fill"
                        style={{ width: `${efficiency}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="perf-item">
                  <Activity size={14} />
                  <span className="perf-label">시간당 통화</span>
                  <span className="perf-value animated-number">{callsPerHour}</span>
                </div>
              </div>

              {/* 실시간 알림 */}
              {/* <div className="notification-panel">
                <h4 className="panel-title">알림</h4>
                <div className="notification-item">
                  <span className="notification-dot active"></span>
                  <span className="notification-text">대기 큐: {callQueue.length}건</span>
                </div>
                <div className="notification-item">
                  <span className="notification-dot"></span>
                  <span className="notification-text">목표 달성률: {Math.round((completedTasks / 20) * 100)}%</span>
                </div>
              </div> */}
            </div>
          </div>

          {/* 하단 요약 섹션 */}
          <div className="summary-section">
            <div className="summary-header">
              <h3 className="summary-title">오늘의 성과</h3>
              <div className="summary-subtitle">실시간 업데이트 • 상태 변경 {statusChangeCount}회</div>
            </div>

            <div className="summary-grid">
              <div className="summary-card response-rate">
                <div className="card-icon">
                  <div className="icon-wrapper green">
                    <Phone size={16} />
                  </div>
                </div>
                <div className="card-content">
                  <div className="card-label">응답률</div>
                  <div className="card-value">{Math.round((stats.totalCalls / (stats.totalCalls + stats.missed)) * 100)}%</div>
                  <div className="card-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill green"
                        style={{ width: `${Math.round((stats.totalCalls / (stats.totalCalls + stats.missed)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="summary-card hourly-calls">
                <div className="card-icon">
                  <div className="icon-wrapper blue">
                    <Clock size={16} />
                  </div>
                </div>
                <div className="card-content">
                  <div className="card-label">시간당 통화</div>
                  <div className="card-value animated-stat">{callsPerHour}</div>
                  <div className="card-trend">
                    <span className="trend-indicator up">↗ +{(callsPerHour - 10).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <div className="summary-card completed-tasks">
                <div className="card-icon">
                  <div className="icon-wrapper purple">
                    <Settings size={16} />
                  </div>
                </div>
                <div className="card-content">
                  <div className="card-label">완료 작업</div>
                  <div className="card-value">{completedTasks}</div>
                  <div className="card-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill purple"
                        style={{ width: `${(completedTasks / (completedTasks + Math.max(0, taskCount - completedTasks))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="summary-card pending-tasks">
                <div className="card-icon">
                  <div className="icon-wrapper orange">
                    <User size={16} />
                  </div>
                </div>
                <div className="card-content">
                  <div className="card-label">대기 작업</div>
                  <div className="card-value">{Math.max(0, callQueue.length)}</div>
                  <div className="card-trend">
                    <span className={`trend-indicator ${callQueue.length > 2 ? 'up' : 'down'}`}>
                      {callQueue.length > 2 ? '↗' : '↘'} {callQueue.length > 2 ? '+' : '-'}1.2%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="summary-footer">
              <div className="footer-stats">
                <span className="footer-item">
                  <span className="footer-dot active"></span>
                  활성 세션 {sessionTime}
                </span>
                <span className="footer-item">
                  <span className="footer-dot"></span>
                  마지막 업데이트: 방금 전
                </span>
                <span className="footer-item">
                  <span className="footer-dot pulse"></span>
                  실시간 모니터링 중
                </span>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;