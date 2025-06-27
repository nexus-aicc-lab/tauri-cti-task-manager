// // src/app/panel-mode/ui/PanelModeContent.tsx
// import React from 'react';
// import AgentStatusInfoBoxForPanelMode1 from './AgentStatusInfoBoxForPanelMode1';
// import AgentStatusInfoBoxForPanelMode2 from './AgentStatusInfoBoxForPanelMode2';
// import AgentStatusInfoBoxForPanelMode3 from './AgentStatusInfoBoxForPanelMode3';
// import AgentStatusInfoBoxForPanelMode4 from './AgentStatusInfoBoxForPanelMode4';

// const PanelModeContent: React.FC = () => {
//     return (
//         <div className="h-full w-full p-4 flex flex-col gap-4">
//             <style>{`
//                 .dynamic-grid {
//                     display: grid;
//                     grid-template-columns: repeat(3, 1fr);
//                     gap: 1rem;
//                     flex: 1;
//                     min-height: 0;
//                 }

//                 .dynamic-bottom {
//                     height: auto;
//                     min-height: 200px;
//                 }

//                 @media (max-width: 1200px) {
//                     .dynamic-grid { gap: 0.75rem; }
//                     .panel-content { padding: 0.75rem; }
//                 }

//                 @media (max-width: 1000px) {
//                     .dynamic-grid { gap: 0.5rem; }
//                     .panel-content { padding: 0.5rem; }
//                 }

//                 @media (max-width: 900px) {
//                     .dynamic-grid { 
//                         grid-template-columns: 1fr;
//                         grid-template-rows: repeat(3, 1fr);
//                     }
//                 }
//             `}</style>

//             {/* 상단 3개 박스 */}
//             <div className="dynamic-grid">
//                 <AgentStatusInfoBoxForPanelMode1 />
//                 <AgentStatusInfoBoxForPanelMode2 />
//                 <AgentStatusInfoBoxForPanelMode3 />
//             </div>

//             {/* 하단 박스 */}
//             <div className="dynamic-bottom">
//                 <AgentStatusInfoBoxForPanelMode4 />
//             </div>
//         </div>
//     );
// };

// export default PanelModeContent;

// src/app/panel-mode/ui/PanelModeContent.tsx
import React from 'react';
import AgentStatusInfoBoxForPanelMode1 from './AgentStatusInfoBoxForPanelMode1';
import AgentStatusInfoBoxForPanelMode2 from './AgentStatusInfoBoxForPanelMode2';
import AgentStatusInfoBoxForPanelMode3 from './AgentStatusInfoBoxForPanelMode3';
import AgentStatusInfoBoxForPanelMode4 from './AgentStatusInfoBoxForPanelMode4';

const PanelModeContent: React.FC = () => {
    return (
        <div className="h-full w-full p-2 flex flex-col gap-2">
            <style>{`
                .dynamic-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 0.5rem;
                    flex: 1;
                    min-height: 0;
                    height: 280px; /* 고정 높이로 상단 영역 제한 */
                }
                
                .dynamic-bottom {
                    height: 180px; /* 하단 영역 높이 제한 */
                    min-height: 180px;
                }
                
                @media (max-width: 1200px) {
                    .dynamic-grid { 
                        gap: 0.25rem;
                        height: 260px;
                    }
                    .dynamic-bottom {
                        height: 160px;
                        min-height: 160px;
                    }
                }
                
                @media (max-width: 1000px) {
                    .dynamic-grid { 
                        gap: 0.25rem;
                        height: 240px;
                    }
                    .dynamic-bottom {
                        height: 140px;
                        min-height: 140px;
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