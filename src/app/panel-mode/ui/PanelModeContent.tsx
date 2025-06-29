// src/app/panel-mode/ui/PanelModeContent.tsx
import React from 'react';
import AgentStatusInfoBoxForPanelMode1 from './AgentStatusInfoBoxForPanelMode1';
import AgentStatusInfoBoxForPanelMode2 from './AgentStatusInfoBoxForPanelMode2';
import AgentStatusInfoBoxForPanelMode3 from './AgentStatusInfoBoxForPanelMode3';
import AgentStatusInfoBoxForPanelMode4 from './AgentStatusInfoBoxForPanelMode4';

const PanelModeContent: React.FC = () => {
    return (
        // 🔥 p-2 제거, 패딩 없애고 gap만 유지
        <div className="h-full w-full flex flex-col gap-2">
            <style>{`
                .dynamic-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 0.5rem;
                    flex: 1;
                    min-height: 0;
                    height: 240px; /* 🔥 280px → 240px로 줄임 */
                }
                
                .dynamic-bottom {
                    height: 140px; /* 🔥 180px → 140px로 줄임 */
                    min-height: 140px;
                }
                
                @media (max-width: 1200px) {
                    .dynamic-grid { 
                        gap: 0.25rem;
                        height: 220px; /* 🔥 더 줄임 */
                    }
                    .dynamic-bottom {
                        height: 120px; /* 🔥 더 줄임 */
                        min-height: 120px;
                    }
                }
                
                @media (max-width: 1000px) {
                    .dynamic-grid { 
                        gap: 0.25rem;
                        height: 200px; /* 🔥 더 줄임 */
                    }
                    .dynamic-bottom {
                        height: 100px; /* 🔥 더 줄임 */
                        min-height: 100px;
                    }
                }
                
                @media (max-width: 900px) {
                    .dynamic-grid { 
                        grid-template-columns: 1fr;
                        grid-template-rows: repeat(3, 1fr);
                        height: auto;
                    }
                }
            `}</style>

            {/* 상단 3개 박스 */}
            <div className="dynamic-grid">
                <AgentStatusInfoBoxForPanelMode1 />
                <AgentStatusInfoBoxForPanelMode2 />
                <AgentStatusInfoBoxForPanelMode3 />
            </div>

            {/* 하단 박스 */}
            <div className="dynamic-bottom">
                <AgentStatusInfoBoxForPanelMode4 />
            </div>
        </div>
    );
};

export default PanelModeContent;