// src/windows/counselor_dashboard/ui/AgentStatus1.tsx
'use client';

import React, { useEffect } from 'react';
import { Phone, Users } from 'lucide-react';
import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { toast } from 'react-toastify';
import RadarStyles from '../../../app/panel-mode/ui/styles/RadarStyles';
import { useAgentConsultantStatus } from '../../../app/panel-mode/store/useAgentConsultantStatus';
import { useSingleAgentStatus } from '@/hooks/useRedisEvents';
import RadarDisplayForAgentStatus, { statuses } from '../ui/RadarDisplayForAgentStatus';
import { useUpdateCallStatusById } from '@/shared/hooks/useUpdateCallStatusById';

interface AgentStatus1Props {
    user: {
        id: number;
        email: string;
        name: string;
        callStatus?: 'READY' | 'BUSY' | 'AFTER_CALL' | 'BREAK';
    } | null;
}

export default function AgentStatus1({ user }: AgentStatus1Props) {
    const { data1, updateData1 } = useAgentConsultantStatus();
    const latest = useSingleAgentStatus();

    console.log('🚀 AgentStatus1 컴포넌트 렌더링', { data1, latest });


    const { mutate: updateCallStatus, isPending } = useUpdateCallStatusById();

    // Redis 이벤트로 들어온 상태 반영
    useEffect(() => {
        if (latest) {
            const idx = statuses.findIndex((s) => s.callStatus === latest.callStatus);
            if (idx >= 0) {
                updateData1({ statusIndex: idx });
            }
        }
    }, [latest, updateData1]);

    // 버튼 클릭 시 UI랑 서버 동시 업데이트
    const handleStatusUpdate = (statusIndex: number) => {
        const selected = statuses[statusIndex];

        // UI 즉시 업데이트
        updateData1({ statusIndex });

        // 토스트 안내
        toast.success(`상태가 “${selected.label}”로 변경되었습니다.`, {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });

        // 서버 반영
        if (user) {
            const callStatus = selected.callStatus as 'READY' | 'BUSY' | 'AFTER_CALL' | 'BREAK';
            updateCallStatus(
                { userId: user.id, callStatus },
                {
                    onSuccess: () => {
                        toast.info(`서버 동기화 완료: ${selected.label}`, {
                            position: 'top-right',
                            autoClose: 1500,
                        });
                    },
                    onError: (error) => {
                        const msg = error instanceof Error ? error.message : '알 수 없는 오류';
                        toast.error(`상태 업데이트 실패: ${msg}`, {
                            position: 'top-right',
                            autoClose: 3000,
                        });
                    },
                }
            );
        }
    };

    return (
        <>
            <RadarStyles />
            <div className="h-full bg-gray-50 p-2 rounded-lg shadow-md border flex flex-col min-h-0 relative">
                {/* Radar Display */}
                <RadarDisplayForAgentStatus
                    statusIndex={data1.statusIndex}
                    onClick={() => handleStatusUpdate((data1.statusIndex + 1) % statuses.length)}
                />

                {/* 통계 카드 */}
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

                {/* 상태 업데이트 버튼들 (로그인 유저만) */}
                {user && (
                    <div className="grid grid-cols-4 gap-1 flex-shrink-0">
                        {statuses.map((status, index) => (
                            <Button
                                key={status.callStatus}
                                onClick={() => handleStatusUpdate(index)}
                                disabled={isPending}
                                variant={data1.statusIndex === index ? 'default' : 'outline'}
                                size="sm"
                                className={`text-xs py-1 px-2 transition-all duration-200 ${data1.statusIndex === index ? 'text-white' : 'hover:scale-105'
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
                )}
            </div>
        </>
    );
}

// 하단 통계 카드 컴포넌트
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
                    <div className="text-sm font-bold">
                        {value}
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
);
