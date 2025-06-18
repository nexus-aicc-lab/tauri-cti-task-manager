'use client';

import { useState, useEffect } from 'react';
import {
    Phone, Clock, User, Settings, Activity,
    TrendingUp, Headphones, PhoneIncoming, PhoneOutgoing
} from 'lucide-react';
import { InfoHeader } from '@/widgets/info-header/ui/InfoHeader';
import { useCTIStore } from '@/shared/store/useCTIStore';

export default function Dashboard() {
    // CTIStore 대신 로컬 상태로 유지하던 값들
    const [time, setTime] = useState('');
    const [loginTime, setLoginTime] = useState('');
    const [sessionTime, setSessionTime] = useState('00:00:00');
    const [stats, setStats] = useState({
        inbound: 8, outbound: 4, missed: 2,
        avgTalkTime: '02:35', avgWrapTime: '01:20',
        totalCalls: 12, waitingCalls: 3, activeCalls: 1
    });
    const [callQueue, setCallQueue] = useState([
        { id: '001', number: '010-1234-5678', waitTime: '00:45', priority: 'high' },
        { id: '002', number: '02-567-8901', waitTime: '01:12', priority: 'normal' },
        { id: '003', number: '031-234-5678', waitTime: '00:23', priority: 'low' }
    ]);
    const [status, setStatus] = useState<'대기' | '통화' | '정지'>('대기');
    const [currentCall, setCurrentCall] = useState<string | null>(null);
    const [pulseActive, setPulseActive] = useState(false);
    const [statusChangeCount, setStatusChangeCount] = useState(0);

    // 시간, 세션, 통계 업데이트 로직 (App.tsx에서 가져옴)
    useEffect(() => {
        const now = new Date();
        setTime(now.toLocaleTimeString('ko-KR'));
        setLoginTime(now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }));

        const timer = setInterval(() => {
            const cur = new Date();
            setTime(cur.toLocaleTimeString('ko-KR'));

            const elapsed = Math.floor((Date.now() - now.getTime()) / 1000);
            const h = Math.floor(elapsed / 3600),
                m = Math.floor((elapsed % 3600) / 60),
                s = elapsed % 60;
            setSessionTime(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);

            // 통계 변화 시뮬레이션
            if (Math.random() > 0.95) {
                setStats(st => ({
                    ...st,
                    inbound: Math.max(0, st.inbound + (Math.random() > 0.5 ? 1 : -1)),
                    outbound: Math.max(0, st.outbound + (Math.random() > 0.5 ? 1 : -1)),
                    totalCalls: st.totalCalls + 1,
                }));
            }

            // 큐 시간 증가
            setCallQueue(queue =>
                queue.map(c => {
                    const [mm, ss] = c.waitTime.split(':').map(Number);
                    const newS = ss + 1;
                    if (newS >= 60) return { ...c, waitTime: `${String(mm + 1).padStart(2, '0')}:00` };
                    return { ...c, waitTime: `${String(mm).padStart(2, '0')}:${String(newS).padStart(2, '0')}` };
                })
            );
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // 상태 토글 & 펄스
    useEffect(() => {
        if (status !== '대기') {
            setPulseActive(true);
            const t = setTimeout(() => setPulseActive(false), 2000);
            return () => clearTimeout(t);
        }
    }, [status]);

    const nextStatus = () => {
        setStatus(prev => {
            if (prev === '대기') {
                setCurrentCall(callQueue[0]?.number || null);
                return '통화';
            }
            if (prev === '통화') return '정지';
            setCurrentCall(null);
            return '대기';
        });
        setStatusChangeCount(c => c + 1);
    };

    const getStatusColor = () => {
        switch (status) {
            case '대기': return 'bg-gradient-to-br from-amber-500 to-orange-600';
            case '통화': return 'bg-gradient-to-br from-green-500 to-emerald-600';
            case '정지': return 'bg-gradient-to-br from-red-500 to-red-600';
            default: return 'bg-gray-500';
        }
    };

    return (
        <main className="flex-1 flex flex-col p-2 gap-2">
            <InfoHeader
                agentId="NEX3041"
                sessionTime={sessionTime}
                loginTime={loginTime}
                onLogoff={() => console.log('로그오프')}
            />

            <div className="grid grid-cols-[300px_1fr_280px] gap-4 flex-1 min-h-0">
                {/* 좌측 통계 & 큐 */}
                <div className="flex flex-col gap-4">
                    {/* 통계 패널 */}
                    <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
                        <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3 pb-2 border-b-2 border-gray-200">
                            <Activity className="text-indigo-600" size={16} /> 통화 현황
                        </h4>
                        <div className="flex gap-3 mb-3">
                            <div className="flex-1 flex flex-col items-center p-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                                <PhoneIncoming size={16} />
                                <span className="text-[10px] opacity-90 mt-1">인바운드</span>
                                <span className="text-lg font-bold">{stats.inbound}</span>
                            </div>
                            <div className="flex-1 flex flex-col items-center p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                <PhoneOutgoing size={16} />
                                <span className="text-[10px] opacity-90 mt-1">아웃바운드</span>
                                <span className="text-lg font-bold">{stats.outbound}</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex-1 flex flex-col items-center p-3 rounded-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
                                <Phone className="rotate-[135deg]" size={16} />
                                <span className="text-[10px] opacity-90 mt-1">부재중</span>
                                <span className="text-lg font-bold">{stats.missed}</span>
                            </div>
                            <div className="flex-1 flex flex-col items-center p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                                <Headphones size={16} />
                                <span className="text-[10px] opacity-90 mt-1">총 통화</span>
                                <span className="text-lg font-bold">{stats.totalCalls}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 중앙 상태 */}
                <div className="flex justify-center items-center">
                    <div className="relative">
                        <div
                            className={`w-[180px] h-[180px] rounded-full flex flex-col items-center justify-center cursor-pointer shadow-lg ${getStatusColor()} ${pulseActive ? 'animate-pulse' : ''}`}
                            onClick={nextStatus}
                            title="클릭하여 상태 변경"
                        >
                            <div className="absolute inset-0 bg-gradient-conic from-transparent via-white/30 to-transparent animate-spin-slow opacity-30"></div>
                            <div className="text-3xl mb-2 z-10">
                                {status === '대기' ? '⏸️' : status === '통화' ? '📞' : '⏹️'}
                            </div>
                            <div className="text-sm font-bold text-white z-10">{status}</div>
                            {currentCall && <div className="text-[10px] font-mono bg-white/20 rounded-full px-2 py-0.5">{currentCall}</div>}
                            <div className="text-[10px] font-mono text-white/80 z-10">{sessionTime}</div>
                            <div className="absolute top-3 right-3 bg-white/20 text-white text-[8px] px-1.5 py-0.5 rounded-full">#{statusChangeCount}</div>
                        </div>
                    </div>
                </div>

                {/* 우측 성과 */}
                <div className="flex flex-col gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
                        <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-gray-200">
                            <TrendingUp className="text-indigo-600" size={16} /> 성과 지표
                        </h4>
                        <div className="space-y-4">
                            {/* … 이하 Stats 항목 동일 … */}
                        </div>
                    </div>
                </div>
            </div>

            {/* 하단 요약 */}
            <div className="bg-white rounded-t-2xl shadow-md border-t border-gray-200">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-4 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                    <h3 className="text-base font-bold">오늘의 성과</h3>
                    <div className="text-xs opacity-90 mt-1">실시간 업데이트 • 상태 변경 {statusChangeCount}회</div>
                </div>
                {/* … 요약 박스 … */}
            </div>
        </main>
    );
}
