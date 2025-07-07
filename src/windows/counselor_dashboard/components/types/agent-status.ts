// C:\tauri\cti-task-manager-tauri\src\windows\bar\component\types\agent-status.ts
// C:\tauri\cti-task-manager-tauri\src\windows\bar\component\types\agent-status.ts

/**
 * 상담사의 상태를 나타내는 열거형 타입입니다.
 */
export enum AgentStatus {
    READY = 'READY',           // 대기 중
    CALLING = 'CALLING',       // 통화 중
    AFTER_CALL = 'AFTER_CALL', // 통화 후 처리 중
    BREAK = 'BREAK',           // 휴식 중
}
