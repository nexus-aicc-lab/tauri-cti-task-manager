'use client';

import { Clock, User } from 'lucide-react';

interface AgentStatusPanelProps {
    status: '대기중' | '통화중' | '정지중';
    time: string;
    taskCount: number;
    completedTasks: number;
    efficiency: number;
    callsPerHour: number;
}

export default function AgentStatusPanel({
    status,
    time,
    taskCount,
    completedTasks,
    efficiency,
    callsPerHour
}: AgentStatusPanelProps) {
    const getStatusColor = () => {
        switch (status) {
            case '대기중':
                return 'bg-amber-500';
            case '통화중':
                return 'bg-green-500';
            case '정지중':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className="flex flex-col gap-2 px-4 py-2 bg-slate-800 text-white rounded shadow w-full">
            {/* <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
                <span className="text-sm font-semibold">{status}</span>
            </div>

            <div className="flex gap-4 flex-wrap text-sm">
                <div className="flex items-center gap-1">
                    <User size={14} />
                    <span>작업: {taskCount}</span>
                </div>

                <div className="flex items-center gap-1">
                    <span>완료: {completedTasks}</span>
                </div>

                <div className="flex items-center gap-1">
                    <span>효율: {efficiency}%</span>
                </div>

                <div className="flex items-center gap-1">
                    <span>통화/시간: {callsPerHour}</span>
                </div>

                <div className="flex items-center gap-1 ml-auto">
                    <Clock size={14} />
                    <span className="font-mono">{time}</span>
                </div>
            </div> */}
        </div>
    );
}
