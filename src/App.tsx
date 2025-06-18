// src/App.tsx

import { useState, useEffect } from "react";
import { Phone, Clock, User, Settings, Activity, TrendingUp, Headphones, PhoneIncoming, PhoneOutgoing } from "lucide-react";
import Titlebar from "./components/Titlebar";
import { InfoHeader } from "./widgets/info-header/ui/InfoHeader";
import { WINDOW_CONFIG } from "./config/windowConfig";

type ViewMode = 'bar' | 'panel';

function App() {
  const [status, setStatus] = useState<'대기' | '통화' | '정지'>('대기');
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
    if (status === '통화' || status === '정지') {
      setPulseActive(true);
      const timer = setTimeout(() => setPulseActive(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const nextStatus = () => {
    setStatus(prev => {
      if (prev === '대기') {
        setCurrentCall(callQueue[0]?.number || '010-1234-5678');
        return '통화';
      }
      if (prev === '통화') {
        return '정지';
      }
      setCurrentCall(null);
      return '대기';
    });

    setStatusChangeCount(prev => prev + 1);

    // 상태가 '정지중'에서 '대기중'으로 바뀔 때 카운트를 증가
    if (status === '정지') {
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
      case '대기': return 'bg-gradient-to-br from-amber-500 to-orange-600';
      case '통화': return 'bg-gradient-to-br from-green-500 to-emerald-600';
      case '정지': return 'bg-gradient-to-br from-red-500 to-red-600';
      default: return 'bg-gray-500';
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

        const config = WINDOW_CONFIG[newMode];
        await appWindow.setSize(new LogicalSize(config.width, config.height));
      } catch (error) {
        console.warn('창 크기 자동 조정을 사용할 수 없습니다.', error);
      }
    }
  };

  const handleLogoff = () => {
    // 로그오프 처리 로직
    console.log('로그오프 처리');
    // 여기에 실제 로그오프 로직 추가
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
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
        <main className="flex-1 flex flex-col p-2 gap-2">
          {/* InfoHeader 위젯 사용 */}
          <InfoHeader
            agentId="NEX3041"
            sessionTime={sessionTime}
            loginTime={loginTime}
            onLogoff={handleLogoff}
          />

          {/* 메인 대시보드 */}
          <div className="grid grid-cols-[300px_1fr_280px] gap-4 flex-1 min-h-0">
            {/* 좌측 통계 + 실시간 큐 */}
            <div className="flex flex-col gap-4">
              {/* 통계 패널 */}
              <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3 pb-2 border-b-2 border-gray-200">
                  <Activity className="text-indigo-600" size={16} />
                  통화 현황
                </h4>
                <div className="flex gap-3 mb-3">
                  <div className="flex-1 flex flex-col items-center p-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg">
                    <PhoneIncoming size={16} />
                    <span className="text-[10px] opacity-90 mt-1">인바운드</span>
                    <span className="text-lg font-bold">{stats.inbound}</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg">
                    <PhoneOutgoing size={16} />
                    <span className="text-[10px] opacity-90 mt-1">아웃바운드</span>
                    <span className="text-lg font-bold">{stats.outbound}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-1 flex flex-col items-center p-3 rounded-lg bg-gradient-to-br from-red-500 to-red-600 text-white cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg">
                    <Phone className="rotate-[135deg]" size={16} />
                    <span className="text-[10px] opacity-90 mt-1">부재중</span>
                    <span className="text-lg font-bold">{stats.missed}</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg">
                    <Headphones size={16} />
                    <span className="text-[10px] opacity-90 mt-1">총 통화</span>
                    <span className="text-lg font-bold">{stats.totalCalls}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 중앙 상태 패널 */}
            <div className="flex justify-center items-center">
              <div className="relative">
                <div
                  className={`w-[180px] h-[180px] rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.15)] ${getStatusColor()} ${pulseActive ? 'animate-pulse' : ''} hover:scale-105 relative overflow-hidden`}
                  onClick={nextStatus}
                  title="클릭하여 상태 변경"
                >
                  {/* 회전 효과 오버레이 */}
                  <div className="absolute inset-0 bg-gradient-conic from-transparent via-white/30 to-transparent animate-spin-slow opacity-30"></div>

                  <div className="text-3xl mb-2 z-10">
                    {status === '대기' ? '⏸️' : status === '통화' ? '📞' : '⏹️'}
                  </div>
                  <div className="text-sm font-bold text-white z-10">{status}</div>
                  {currentCall && (
                    <div className="text-[10px] font-mono opacity-90 z-10 bg-white/20 px-2 py-0.5 rounded-full mt-1">
                      {currentCall}
                    </div>
                  )}
                  <div className="text-[10px] font-mono text-white/80 z-10">{sessionTime}</div>
                  <div className="absolute top-3 right-3 bg-white/20 text-white text-[8px] px-1.5 py-0.5 rounded-full font-semibold">
                    #{statusChangeCount}
                  </div>
                </div>
              </div>
            </div>

            {/* 우측 성과 패널 */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-gray-200">
                  <TrendingUp className="text-indigo-600" size={16} />
                  <span className="text-lg font-extrabold bg-gradient-to-r from-indigo-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg tracking-widest animate-pulse px-3 py-1 rounded border-2 border-white/30 shadow-xl">
                    성과 지표
                  </span>
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 transition-colors">
                    <Clock className="text-indigo-600" size={14} />
                    <span className="flex-1 text-xs text-gray-600">평균 통화시간</span>
                    <span className="font-bold text-gray-700 text-xs">{stats.avgTalkTime}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 transition-colors">
                    <Settings className="text-indigo-600" size={14} />
                    <span className="flex-1 text-xs text-gray-600">평균 정지 시간</span>
                    <span className="font-bold text-gray-700 text-xs">{stats.avgWrapTime}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 transition-colors">
                    <User className="text-indigo-600" size={14} />
                    <span className="flex-1 text-xs text-gray-600">효율성</span>
                    <div className="flex flex-col gap-1 w-full">
                      <span className="font-bold text-green-600 text-xs">{efficiency}%</span>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full transition-all duration-1000 relative"
                          style={{ width: `${efficiency}%` }}
                        >
                          <div className="absolute inset-0 bg-white/40 animate-shimmer"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 transition-colors">
                    <Activity className="text-indigo-600" size={14} />
                    <span className="flex-1 text-xs text-gray-600">시간당 통화</span>
                    <span className="font-bold text-gray-700 text-xs font-mono transition-all duration-300">{callsPerHour}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 하단 요약 섹션 */}
          <div className="bg-white rounded-t-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
              <h3 className="text-base font-bold mb-1 relative z-10">오늘의 성과</h3>
              <div className="text-xs opacity-90 relative z-10">실시간 업데이트 • 상태 변경 {statusChangeCount}회</div>
            </div>

            <div className="grid grid-cols-4 divide-x divide-gray-200 bg-gray-50">
              {/* 응답률 */}
              <div className="bg-white p-5 flex items-center gap-4 transition-all hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-600 to-purple-600 scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></div>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white">
                    <Phone size={16} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-600 font-medium tracking-wider uppercase mb-1">응답률</div>
                  <div className="text-2xl font-bold text-gray-900 font-mono">{Math.round((stats.totalCalls / (stats.totalCalls + stats.missed)) * 100)}%</div>
                  <div className="mt-2">
                    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full relative"
                        style={{ width: `${Math.round((stats.totalCalls / (stats.totalCalls + stats.missed)) * 100)}%` }}
                      >
                        <div className="absolute inset-0 bg-white/40 animate-shimmer"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 시간당 통화 */}
              <div className="bg-white p-5 flex items-center gap-4 transition-all hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-600 to-purple-600 scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></div>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                    <Clock size={16} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-600 font-medium tracking-wider uppercase mb-1">시간당 통화</div>
                  <div className="text-2xl font-bold text-gray-900 font-mono">{callsPerHour}</div>
                  <div className="text-xs text-green-600 font-semibold mt-1">↗ +{(callsPerHour - 10).toFixed(1)}%</div>
                </div>
              </div>

              {/* 완료 작업 */}
              <div className="bg-white p-5 flex items-center gap-4 transition-all hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-600 to-purple-600 scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></div>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white">
                    <Settings size={16} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-600 font-medium tracking-wider uppercase mb-1">완료 작업</div>
                  <div className="text-2xl font-bold text-gray-900 font-mono">{completedTasks}</div>
                  <div className="mt-2">
                    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full relative"
                        style={{ width: `${(completedTasks / (completedTasks + Math.max(0, taskCount - completedTasks))) * 100}%` }}
                      >
                        <div className="absolute inset-0 bg-white/40 animate-shimmer"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 대기 작업 */}
              <div className="bg-white p-5 flex items-center gap-4 transition-all hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-600 to-purple-600 scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></div>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white">
                    <User size={16} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-600 font-medium tracking-wider uppercase mb-1">대기 작업</div>
                  <div className="text-2xl font-bold text-gray-900 font-mono">{Math.max(0, callQueue.length)}</div>
                  <div className={`text-xs font-semibold mt-1 ${callQueue.length > 2 ? 'text-green-600' : 'text-red-600'}`}>
                    {callQueue.length > 2 ? '↗' : '↘'} {callQueue.length > 2 ? '+' : '-'}1.2%
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-5 py-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  활성 세션 {sessionTime}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                  마지막 업데이트: 방금 전
                </span>
                <span className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
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