
'use client';

import React from 'react';
import { Phone, Users, Hourglass, Coffee, WifiOff } from 'lucide-react';
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import RadarStyles from '../../../app/panel-mode/ui/styles/RadarStyles';
import { useAgentConsultantStatus } from '../../../app/panel-mode/store/useAgentConsultantStatus';

type Status = {
    label: string;
    time: string;
    icon: React.ReactNode;
    color: string;
    callStatus: string;
};

// 🎯 Java enum (READY, BUSY, BREAK, OFFLINE)에 맞춘 상태 배열
const statuses: Status[] = [
    {
        label: '통화중',
        time: '00:03:45',
        icon: <Phone className="w-4 h-4 text-gray-600" />,
        color: '#3698A2',
        callStatus: 'BUSY'
    },
    {
        label: '대기중',
        time: '12:03:45',
        icon: <Hourglass className="w-4 h-4 text-gray-600" />,
        color: '#4199E0',
        callStatus: 'READY'
    },
    {
        label: '휴식중',
        time: '00:01:45',
        icon: <Coffee className="w-4 h-4 text-gray-600" />,
        color: '#8B68A5',
        callStatus: 'BREAK'
    },
    {
        label: '오프라인',
        time: '00:00:00',
        icon: <WifiOff className="w-4 h-4 text-gray-600" />,
        color: '#6B7280',
        callStatus: 'OFFLINE'
    },
];

const RadarDisplay: React.FC<{
    statusIndex: number;
    onClick: () => void;
}> = ({ statusIndex, onClick }) => {
    const current = statuses[statusIndex];
    // 🎯 4개 상태에 맞춘 CSS 클래스 (후처리 제거, 오프라인 추가)
    const bgClasses = ['green-bg', 'blue-bg', 'purple-bg', 'gray-bg'];
    const sweepClasses = ['green-sweep', 'blue-sweep', 'purple-sweep', 'gray-sweep'];

    return (
        <div className="flex-1 flex justify-center items-center mb-2 relative">
            <div className="radar-container shadow-md">
                <div className={`radar-background ${bgClasses[statusIndex]}`} />
                <div className={`radar-sweep ${sweepClasses[statusIndex]}`} />
                <div className="inner-white-mask" />
                <Button
                    onClick={onClick}
                    variant="ghost"
                    className="relative z-20 w-20 h-20 rounded-full flex flex-col items-center justify-center bg-white shadow-lg transition-all duration-500 hover:scale-110 active:scale-95"
                    style={{
                        boxShadow: `
                            0 2px 6px rgba(0,0,0,0.1),
                            0 3px 15px rgba(0,0,0,0.15),
                            0 0 0 2px ${current.color}20,
                            0 0 15px ${current.color}30
                        `
                    }}
                >
                    <div className="mb-1">{current.icon}</div>
                    <div className="text-xs font-bold text-gray-800">{current.label}</div>
                    <div className="text-xs font-medium text-gray-600">{current.time}</div>
                </Button>
            </div>
        </div>
    );
};

const StatsCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string | number;
}> = ({ icon, label, value }) => (
    <Card className="rounded-md p-2 hover:shadow-sm transition-all duration-300">
        <CardContent className="p-0">
            <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-gray-100 border flex items-center justify-center">
                    {icon}
                </div>
                <div>
                    <div className="text-xs text-gray-500 font-medium">{label}</div>
                    <div className={`text-sm font-bold ${label === '대기호' ? 'text-red-600' : 'text-gray-800'}`}>
                        {value}
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
);

const AgentStatusInfoBoxForPanelMode1: React.FC = () => {
    const { data1, updateData1 } = useAgentConsultantStatus();

    return (
        <>
            <RadarStyles />
            <div className="h-full bg-gray-50 p-2 rounded-lg shadow-md border flex flex-col min-h-0 relative">
                {/* 🎯 Radar - PanelModeContent에서 자동 업데이트됨 */}
                <RadarDisplay
                    statusIndex={data1.statusIndex}
                    onClick={() =>
                        updateData1({
                            statusIndex: (data1.statusIndex + 1) % statuses.length,
                        })
                    }
                />

                {/* 🎯 StatsCard - 고정값 유지 */}
                <div className="grid grid-cols-2 gap-2 flex-shrink-0">
                    <StatsCard
                        icon={<Phone className="w-3 h-3 text-gray-600" />}
                        label="대기호"
                        value={data1.waitingCalls}
                    />
                    <StatsCard
                        icon={<Users className="w-3 h-3 text-gray-600" />}
                        label="대기 상담"
                        value={data1.waitingAgents}
                    />
                </div>

                {/* 상태 표시 */}
                {/* <div className="mt-2 text-center">
                    <div className="text-xs text-gray-500">
                        현재 상태: <span className="font-medium text-blue-600">{statuses[data1.statusIndex]?.label || '알 수 없음'}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                        ID 2번 상담원 실시간 추적 중 (Index: {data1.statusIndex})
                    </div>
                    <div className="text-xs text-gray-300 mt-1">
                        매핑: 0=통화중, 1=대기중, 2=휴식중, 3=오프라인
                    </div>
                </div> */}
            </div>
        </>
    );
};

export default AgentStatusInfoBoxForPanelMode1;