
// src/app/panel-mode/store/useAgentConsultantStatus.ts
import { create } from 'zustand';

interface AgentStatusData1 {
    statusIndex: number;         // Radar 상태 인덱스
    waitingCalls: number;        // 대기호
    waitingAgents: number;       // 대기 상담사 수
}

interface AgentConsultantStatusStore {
    data1: AgentStatusData1;
    updateData1: (partial: Partial<AgentStatusData1>) => void;
    resetData1: () => void;
}

const initialData1: AgentStatusData1 = {
    statusIndex: 0,
    waitingCalls: 0,
    waitingAgents: 0,
};

export const useAgentConsultantStatus = create<AgentConsultantStatusStore>((set) => ({
    data1: initialData1,
    updateData1: (partial) => set((state) => ({
        data1: { ...state.data1, ...partial },
    })),
    resetData1: () => set({ data1: initialData1 }),
}));