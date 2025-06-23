'use client';

import { Clock, Phone, Users, FileCheck, Coffee } from 'lucide-react';

interface AgentStatusContentForBarModeProps {
    status: '대기' | '통화' | '정지';
    time: string;
    taskCount: number;
    completedTasks: number;
    efficiency: number;
    callsPerHour: number;
}

export default function AgentStatusContentForBarMode({
    status,

}: AgentStatusContentForBarModeProps) {
    return (
        <>
            {/* LogOff 버튼 */}
            <button
                className="bg-white/90 text-green-700 px-3 py-0.5 rounded text-xs font-bold hover:bg-white transition-colors"
                onMouseDown={(e) => e.stopPropagation()}
            >
                LogOff
            </button>

            {/* 구분선 */}
            <div className="w-px h-4 bg-green-400/50 pointer-events-none" />

            {/* 통계 항목들 - 드래그 가능 영역 */}
            <div className="flex items-center gap-4 px-2 text-xs" data-tauri-drag-region>
                {/* 대기 인원 */}
                <div className="flex items-center gap-1" data-tauri-drag-region>
                    <Users size={14} className="text-yellow-300 pointer-events-none" />
                    <span className="font-mono pointer-events-none">00:00:00(0)</span>
                </div>

                {/* 통화 시간 */}
                <div className="flex items-center gap-1" data-tauri-drag-region>
                    <Phone size={14} className="text-blue-300 pointer-events-none" />
                    <span className="font-mono pointer-events-none">00:00:00(0)</span>
                </div>

                {/* 처리 건수 */}
                <div className="flex items-center gap-1" data-tauri-drag-region>
                    <FileCheck size={14} className="text-orange-300 pointer-events-none" />
                    <span className="font-mono pointer-events-none">00:00:00(0)</span>
                </div>

                {/* 후처리 */}
                <div className="flex items-center gap-1" data-tauri-drag-region>
                    <Clock size={14} className="text-purple-300 pointer-events-none" />
                    <span className="font-mono pointer-events-none">00:00:00(0)</span>
                </div>

                {/* 휴식 */}
                <div className="flex items-center gap-1" data-tauri-drag-region>
                    <Coffee size={14} className="text-red-300 pointer-events-none" />
                    <span className="font-mono pointer-events-none">00:00:00(0)</span>
                </div>
            </div>

            {/* 오른쪽 여백 - 드래그 가능 영역 */}
            <div className="flex-1" data-tauri-drag-region />

            {/* 상태 표시 - 드래그 가능 영역 */}
            <div className="flex items-center gap-2 px-3" data-tauri-drag-region>
                <div className={`w-2 h-2 rounded-full pointer-events-none ${status === '대기' ? 'bg-yellow-400' :
                    status === '통화' ? 'bg-green-400 animate-pulse' :
                        'bg-red-400'
                    }`} />
                <span className="text-xs font-medium pointer-events-none">{status}</span>
            </div>
        </>
    );
}