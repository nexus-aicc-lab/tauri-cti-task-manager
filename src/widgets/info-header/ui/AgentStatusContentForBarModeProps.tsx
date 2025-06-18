'use client';

import { User, Clock, Phone, Users, FileCheck, Coffee } from 'lucide-react';

interface AgentStatusContentForBarModeProps {
    status: '대기중' | '통화중' | '정지중';
    time: string;
    taskCount: number;
    completedTasks: number;
    efficiency: number;
    callsPerHour: number;
}

export default function AgentStatusContentForBarMode({
    status,
    time,
    taskCount,
    completedTasks,
    efficiency,
    callsPerHour
}: AgentStatusContentForBarModeProps) {
    return (
        <>
            {/* LogOff 버튼 */}
            <button className="bg-white/90 text-green-700 px-3 py-0.5 rounded text-xs font-bold hover:bg-white transition-colors">
                LogOff
            </button>

            {/* 구분선 */}
            <div className="w-px h-4 bg-green-400/50" />

            {/* 통계 항목들 */}
            <div className="flex items-center gap-4 px-2 text-xs">
                {/* 대기 인원 */}
                <div className="flex items-center gap-1">
                    <Users size={14} className="text-yellow-300" />
                    <span className="font-mono">00:00:00(0)</span>
                </div>

                {/* 통화 시간 */}
                <div className="flex items-center gap-1">
                    <Phone size={14} className="text-blue-300" />
                    <span className="font-mono">00:00:00(0)</span>
                </div>

                {/* 처리 건수 */}
                <div className="flex items-center gap-1">
                    <FileCheck size={14} className="text-orange-300" />
                    <span className="font-mono">00:00:00(0)</span>
                </div>

                {/* 후처리 */}
                <div className="flex items-center gap-1">
                    <Clock size={14} className="text-purple-300" />
                    <span className="font-mono">00:00:00(0)</span>
                </div>

                {/* 휴식 */}
                <div className="flex items-center gap-1">
                    <Coffee size={14} className="text-red-300" />
                    <span className="font-mono">00:00:00(0)</span>
                </div>
            </div>

            {/* 오른쪽 여백 */}
            <div className="flex-1" />

            {/* 상태 표시 (선택사항) */}
            <div className="flex items-center gap-2 px-3">
                <div className={`w-2 h-2 rounded-full ${status === '대기중' ? 'bg-yellow-400' :
                    status === '통화중' ? 'bg-green-400 animate-pulse' :
                        'bg-red-400'
                    }`} />
                <span className="text-xs font-medium">{status}</span>
            </div>
        </>
    );
}