// src/windows/counselor_dashboard/hooks/useUpdateCallStatusById.ts
import { User, userApi } from '@/windows/counselor_dashboard/api/userApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateCallStatusById() {
    const queryClient = useQueryClient();

    return useMutation<
        User,
        unknown,
        { userId: number; callStatus: User['callStatus'] }
    >({
        mutationFn: ({ userId, callStatus }) => {
            // ✅ 1. 상태 변경 시각을 로컬에 미리 저장
            localStorage.setItem('agent_status_started_at', JSON.stringify({
                status: callStatus,
                startedAt: new Date().toISOString(),
            }));

            // ✅ 2. 커스텀 이벤트 발생 (같은 탭 내 실시간 반영)
            window.dispatchEvent(new CustomEvent('agent-status-updated'));

            // ✅ 3. 백엔드에 상태 변경 요청
            return userApi.updateCallStatusById(userId, callStatus);
        },
        onSuccess: (updated) => {
            console.log('상태 업데이트 성공 🎉', updated);
        },
        onError: (err) => {
            console.error('상태 업데이트 실패 😢', err);
            // 에러 시 이벤트를 다시 발생시켜 상태 재동기화
            window.dispatchEvent(new CustomEvent('agent-status-updated'));
        },
    });
}