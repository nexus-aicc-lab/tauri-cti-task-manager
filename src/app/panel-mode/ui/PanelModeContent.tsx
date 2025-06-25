// src/app/panel-mode/ui/PanelModeContent.tsx
import React from 'react';
import AgentStatusInfoBoxForPanelMode1 from './AgentStatusInfoBoxForPanelMode1';
import AgentStatusInfoBoxForPanelMode2 from './AgentStatusInfoBoxForPanelMode2';
import AgentStatusInfoBoxForPanelMode3 from './AgentStatusInfoBoxForPanelMode3';
import AgentStatusInfoBoxForPanelMode4 from './AgentStatusInfoBoxForPanelMode4';

const PanelModeContent: React.FC = () => {
    return (
        <div className="h-full w-full p-4 flex flex-col gap-4">
            <style>{`
                .dynamic-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1rem;
                    flex: 1;
                    min-height: 0;
                }
                
                .dynamic-bottom {
                    height: auto;
                    min-height: 200px;
                }
                
                @media (max-width: 1200px) {
                    .dynamic-grid { gap: 0.75rem; }
                    .panel-content { padding: 0.75rem; }
                }
                
                @media (max-width: 1000px) {
                    .dynamic-grid { gap: 0.5rem; }
                    .panel-content { padding: 0.5rem; }
                }
                
                @media (max-width: 900px) {
                    .dynamic-grid { 
                        grid-template-columns: 1fr;
                        grid-template-rows: repeat(3, 1fr);
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