// C:\tauri\cti-task-manager-tauri\src\shared\store\useCTIStore.ts
'use client';

import { create } from 'zustand';

export type CallStatus = '대기' | '통화' | '정지';

interface CTIState {
    status: CallStatus;
    currentTime: string;
    totalTasks: number;
    completedTasks: number;
    efficiency: number;
    callsPerHour: number;
    setStatus: (status: CallStatus) => void;
    setCurrentTime: (time: string) => void;
    setTotalTasks: (count: number) => void;
    setCompletedTasks: (count: number) => void;
    setEfficiency: (value: number) => void;
    setCallsPerHour: (count: number) => void;
}

export const useCTIStore = create<CTIState>((set) => ({
    status: '대기',
    currentTime: '00:00:00',
    totalTasks: 0,
    completedTasks: 0,
    efficiency: 0,
    callsPerHour: 0,
    setStatus: (status) => set({ status }),
    setCurrentTime: (currentTime) => set({ currentTime }),
    setTotalTasks: (totalTasks) => set({ totalTasks }),
    setCompletedTasks: (completedTasks) => set({ completedTasks }),
    setEfficiency: (efficiency) => set({ efficiency }),
    setCallsPerHour: (callsPerHour) => set({ callsPerHour }),
}));
