'use client';

import React from 'react';
import { Phone, Users } from 'lucide-react';
import RadarStyles from '../../../app/panel-mode/ui/styles/RadarStyles';
import RadarDisplay from './RadarDisplay';
import StatsCard from './StatsCard';
import { useAgentCurrentStatus } from '@/hooks/useAgentCurrentStatus';

const AgentStatusInfoBoxForPanelMode1: React.FC = () => {
    const status = useAgentCurrentStatus();

    const isConnected = !!status;

    // callStatus 값을 RadarDisplay의 statusIndex로 변환
    const getStatusIndex = (callStatus?: string): number => {
        switch (callStatus) {
            case 'READY':
                return 0;
            case 'BUSY':
                return 1;
            case 'AFTER_CALL':
                return 2;
            case 'BREAK':
                return 3;
            default:
                return -1;
        }
    };

    const statusIndex = getStatusIndex(status?.callStatus ?? '');

    return (
        <>
            <RadarStyles />
            <div className="h-full bg-gray-50 p-2 rounded-lg shadow-md border flex flex-col min-h-0 relative">
                {/* 상담원 연결 상태 및 이름 */}
                <div className="text-xs text-center mb-1">
                    {isConnected ? (
                        <span className="text-green-600">
                            📡 {status?.name} (ID: {status?.agentId})
                        </span>
                    ) : (
                        <span className="text-gray-400">연결 대기중...</span>
                    )}
                </div>

                {/* 레이더 디스플레이 */}
                <RadarDisplay
                    statusIndex={statusIndex}
                    onClick={() => {
                        console.log('레이더 클릭됨 (임시 상태 변경 기능)');
                    }}
                />

                {/* 통계 카드 - 현재는 더미 값 */}
                <div className="grid grid-cols-2 gap-2 flex-shrink-0">
                    <StatsCard
                        icon={<Phone className="w-3 h-3 text-gray-600" />}
                        label="대기호"
                        value={3} // TODO: 실시간 데이터 연동 예정
                    />
                    <StatsCard
                        icon={<Users className="w-3 h-3 text-gray-600" />}
                        label="대기 상담"
                        value={2} // TODO: 실시간 데이터 연동 예정
                    />
                </div>
            </div>
        </>
    );
};

export default AgentStatusInfoBoxForPanelMode1;
