'use client';

import React, { useEffect } from 'react';
import { Phone, Users } from 'lucide-react';
import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import RadarStyles from '../../../app/panel-mode/ui/styles/RadarStyles';
import { useAgentConsultantStatus } from '../../../app/panel-mode/store/useAgentConsultantStatus';
import { useSingleAgentStatus } from '@/hooks/useRedisEvents';
import RadarDisplayForAgentStatus, { statuses } from '../ui/RadarDisplayForAgentStatus';

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
                    <div
                        className={`text-sm font-bold ${label === '대기호' ? 'text-red-600' : 'text-gray-800'
                            }`}
                    >
                        {value}
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
);

export default function AgentStatus1() {
    const { data1, updateData1 } = useAgentConsultantStatus();
    const latest = useSingleAgentStatus(); // 🔑 Redis에서 받은 최신 상태

    // Redis 이벤트로 들어온 callStatus 에 따라 statusIndex 업데이트
    useEffect(() => {
        if (latest) {
            const idx = statuses.findIndex((s) => s.callStatus === latest.callStatus);
            if (idx >= 0) {
                updateData1({ statusIndex: idx });
            }
        }
    }, [latest, updateData1]);

    // 버튼 클릭으로도 상태 순환
    const handleStatusUpdate = (statusIndex: number) => {
        updateData1({ statusIndex });
    };

    return (
        <>
            <RadarStyles />
            <div className="h-full bg-gray-50 p-2 rounded-lg shadow-md border flex flex-col min-h-0 relative">
                {/* 🎯 Radar Display - 분리된 컴포넌트 사용 */}
                <RadarDisplayForAgentStatus
                    statusIndex={data1.statusIndex}
                    onClick={() =>
                        handleStatusUpdate((data1.statusIndex + 1) % statuses.length)
                    }
                />

                {/* 🎯 Stats Cards */}
                <div className="grid grid-cols-2 gap-2 mb-3 flex-shrink-0">
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

                {/* ✅ 상태 업데이트 버튼들 */}
                <div className="grid grid-cols-2 gap-1 flex-shrink-0">
                    {statuses.map((status, index) => (
                        <Button
                            key={status.callStatus}
                            onClick={() => handleStatusUpdate(index)}
                            variant={data1.statusIndex === index ? 'default' : 'outline'}
                            size="sm"
                            className={`text-xs py-1 px-2 transition-all duration-200 ${data1.statusIndex === index
                                ? 'bg-white text-white' // 기본 hover 효과 대체
                                : 'hover:scale-105'
                                }`}
                            style={{
                                backgroundColor:
                                    data1.statusIndex === index ? status.color : undefined,
                                borderColor:
                                    data1.statusIndex === index ? status.color : undefined,
                            }}
                        >
                            <span className="mr-1">{status.icon}</span>
                            {status.label}
                        </Button>
                    ))}
                </div>
            </div>
        </>
    );
}