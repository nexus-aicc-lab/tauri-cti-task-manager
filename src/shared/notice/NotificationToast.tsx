// src/components/NotificationToast.tsx - 새로 생성
import React, { useEffect, useState } from 'react';
import { X, Bell, Users, Phone, Activity } from 'lucide-react';
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { AgentStatusInfo, UserProfileUpdate } from '../../lib/redis-events';

interface NotificationToastProps {
    agentStatus?: AgentStatusInfo | null;
    userProfile?: UserProfileUpdate | null;
    onClose: () => void;
    autoClose?: boolean;
    duration?: number;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
    agentStatus,
    userProfile,
    onClose,
    autoClose = true,
    duration = 5000
}) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (autoClose) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(onClose, 300); // 애니메이션 완료 후 제거
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [autoClose, duration, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    if (!agentStatus && !userProfile) return null;

    return (
        <div
            className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                }`}
        >
            <Card className="w-80 bg-white shadow-xl border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-2">
                            <Bell className="w-5 h-5 text-blue-500 animate-pulse" />
                            <span className="font-semibold text-gray-800">실시간 업데이트</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClose}
                            className="p-1 h-auto hover:bg-gray-100 rounded-full"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* 상담원 상태 업데이트 알림 */}
                    {agentStatus && (
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <Activity className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-gray-700">상담원 상태 업데이트</span>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 space-y-3">
                                {/* 상단: 주요 통계 */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white rounded-md p-2 shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">총 상담원</span>
                                            <Users className="w-3 h-3 text-gray-400" />
                                        </div>
                                        <div className="text-lg font-bold text-gray-800">{agentStatus.statistics.totalAgents}</div>
                                    </div>
                                    <div className="bg-white rounded-md p-2 shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">대기 콜</span>
                                            <Phone className="w-3 h-3 text-red-400" />
                                        </div>
                                        <div className="text-lg font-bold text-red-600">{agentStatus.statistics.totalWaitingCalls}</div>
                                    </div>
                                </div>

                                {/* 하단: 상담원 상태별 분포 */}
                                <div className="grid grid-cols-4 gap-1 text-xs">
                                    <div className="bg-green-100 rounded p-1 text-center">
                                        <div className="font-semibold text-green-700">{agentStatus.statistics.onCallCount}</div>
                                        <div className="text-green-600">통화중</div>
                                    </div>
                                    <div className="bg-blue-100 rounded p-1 text-center">
                                        <div className="font-semibold text-blue-700">{agentStatus.statistics.availableCount}</div>
                                        <div className="text-blue-600">대기중</div>
                                    </div>
                                    <div className="bg-orange-100 rounded p-1 text-center">
                                        <div className="font-semibold text-orange-700">{agentStatus.statistics.wrapUpCount}</div>
                                        <div className="text-orange-600">후처리</div>
                                    </div>
                                    <div className="bg-purple-100 rounded p-1 text-center">
                                        <div className="font-semibold text-purple-700">{agentStatus.statistics.breakCount}</div>
                                        <div className="text-purple-600">휴식중</div>
                                    </div>
                                </div>

                                {/* 대기시간 정보 */}
                                <div className="bg-white rounded-md p-2 shadow-sm">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500">평균 대기:</span>
                                        <span className="font-medium">{agentStatus.statistics.avgWaitTime}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs mt-1">
                                        <span className="text-gray-500">최대 대기:</span>
                                        <span className="font-medium">{agentStatus.statistics.longestWaitTime}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 사용자 프로필 업데이트 알림 */}
                    {userProfile && (
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4 text-orange-600" />
                                <span className="text-sm font-medium text-gray-700">사용자 프로필 업데이트</span>
                            </div>

                            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-3">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">사용자 ID:</span>
                                        <span className="font-semibold">{userProfile.userId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">변경 필드:</span>
                                        <span className="font-semibold">{userProfile.field}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">새 값:</span>
                                        <span className="font-semibold text-blue-600">{userProfile.newValue}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 시간 정보 */}
                    <div className="mt-3 flex justify-between items-center">
                        <div className="text-xs text-gray-400">
                            {new Date().toLocaleTimeString()}
                        </div>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default NotificationToast;