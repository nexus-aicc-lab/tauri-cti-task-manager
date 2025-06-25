// src/app/panel-mode/ui/PanelModeContent.tsx
import React from 'react';
import AgentStatusInfoBoxForPanelMode1 from './AgentStatusInfoBoxForPanelMode1';
import AgentStatusInfoBoxForPanelMode2 from './AgentStatusInfoBoxForPanelMode2';
import AgentStatusInfoBoxForPanelMode3 from './AgentStatusInfoBoxForPanelMode3';
import AgentStatusInfoBoxForPanelMode4 from './AgentStatusInfoBoxForPanelMode4';

const PanelModeContent = () => {
    return (
        <div className="flex-1 p-4 flex flex-col gap-4">
            {/* 상단 3개 박스 */}
            <div className="flex-1 grid grid-cols-3 gap-4">
                <AgentStatusInfoBoxForPanelMode1 /> {/* Box 1: 대기중 상태 타이머 */}
                <AgentStatusInfoBoxForPanelMode2 /> {/* Box 2: 상담사 상태별 카운트 */}
                <AgentStatusInfoBoxForPanelMode3 /> {/* Box 3: 성과 지표 (게이지) */}
            </div>

            {/* 하단 박스 */}
            <AgentStatusInfoBoxForPanelMode4 /> {/* Box 4: 그룹호 전환 리스트 + LogOn */}
        </div>
    );
};

export default PanelModeContent;
