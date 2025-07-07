'use client';

import React from 'react';
import { Button } from '@/shared/ui/button';
import { AgentStatus } from './types/agent-status';

const AgentStatusButtons = () => {
    const handleChangeStatus = (status: AgentStatus) => {
        console.log(`🔄 상담사 상태 변경 요청: ${status}`);
        // TODO: 나중에 API 호출 추가
    };

    return (
        <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => handleChangeStatus(AgentStatus.READY)} variant="outline">
                🟢 대기중 (READY)
            </Button>
            <Button onClick={() => handleChangeStatus(AgentStatus.CALLING)} variant="outline">
                📞 통화중 (CALLING)
            </Button>
            <Button onClick={() => handleChangeStatus(AgentStatus.AFTER_CALL)} variant="outline">
                📝 후처리 (AFTER_CALL)
            </Button>
            <Button onClick={() => handleChangeStatus(AgentStatus.BREAK)} variant="outline">
                ☕ 휴식중 (BREAK)
            </Button>
        </div>
    );
};

export default AgentStatusButtons;
