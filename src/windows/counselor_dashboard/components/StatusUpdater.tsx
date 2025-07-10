// src/windows/counselor_dashboard/components/StatusUpdater.tsx
import React from 'react';
import { useUpdateCallStatusById, useUser } from '../hooks/useUserQueries'; // ✅ 변경
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import {
    UserCheck,
    Phone,
    Coffee,
    UserX
} from 'lucide-react';

interface StatusUpdaterProps {
    userId: number;
}

type CallStatus = 'READY' | 'BUSY' | 'BREAK' | 'OFFLINE';

const statusConfig = {
    READY: {
        label: '대기중',
        icon: UserCheck,
        color: 'bg-green-500 hover:bg-green-600',
        textColor: 'text-green-700'
    },
    BUSY: {
        label: '통화중',
        icon: Phone,
        color: 'bg-red-500 hover:bg-red-600',
        textColor: 'text-red-700'
    },
    BREAK: {
        label: '휴식중',
        icon: Coffee,
        color: 'bg-yellow-500 hover:bg-yellow-600',
        textColor: 'text-yellow-700'
    },
    OFFLINE: {
        label: '오프라인',
        icon: UserX,
        color: 'bg-gray-500 hover:bg-gray-600',
        textColor: 'text-gray-700'
    },
};

export const StatusUpdater: React.FC<StatusUpdaterProps> = ({ userId }) => {
    const { data: user, refetch } = useUser(userId);
    const updateCallStatus = useUpdateCallStatusById(); // ✅ 변경

    const handleStatusChange = async (newStatus: CallStatus) => {
        try {
            // ✅ userId와 callStatus를 함께 전달
            await updateCallStatus.mutateAsync({ userId, callStatus: newStatus });
            console.log(`상태가 ${newStatus}로 변경되었습니다.`);
            await refetch(); // 수동 새로고침
        } catch (error) {
            console.error('상태 변경 실패:', error);
        }
    };

    const currentStatus = user?.callStatus || 'OFFLINE';
    const CurrentIcon = statusConfig[currentStatus].icon;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <CurrentIcon className="w-5 h-5" />
                    상담원 상태 변경 (ID: {userId}) {/* ✅ userId 표시 */}
                </CardTitle>
                <div className={`text-sm font-medium ${statusConfig[currentStatus].textColor}`}>
                    현재 상태: {statusConfig[currentStatus].label}
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-3">
                    {(Object.entries(statusConfig) as [CallStatus, typeof statusConfig[CallStatus]][]).map(([status, config]) => {
                        const Icon = config.icon;
                        const isActive = currentStatus === status;

                        return (
                            <Button
                                key={status}
                                onClick={() => handleStatusChange(status)}
                                disabled={updateCallStatus.isPending || isActive}
                                className={`${config.color} text-white ${isActive ? 'ring-2 ring-blue-400' : ''}`}
                                variant={isActive ? "default" : "outline"}
                            >
                                <Icon className="w-4 h-4 mr-2" />
                                {config.label}
                            </Button>
                        );
                    })}
                </div>

                {updateCallStatus.isPending && (
                    <div className="text-center text-sm text-gray-500 mt-3">
                        상태 변경 중...
                    </div>
                )}
            </CardContent>
        </Card>
    );
};