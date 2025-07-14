// src/windows/counselor_dashboard/hooks/useUpdateCallStatusById.ts
import { User, userApi } from '@/windows/counselor_dashboard/api/userApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateCallStatusById() {
    const queryClient = useQueryClient();

    return useMutation<
        User, // 성공 리턴 타입
        unknown, // 에러 타입
        { userId: number; callStatus: User['callStatus'] } // mutate 파라미터
    >({
        mutationFn: ({ userId, callStatus }) => userApi.updateCallStatusById(userId, callStatus),
        onSuccess: (updated) => {
            console.log('상태 업데이트 성공 🎉', updated);
        },
        onError: (err) => {
            console.error('상태 업데이트 실패 😢', err);
        },
    });
}
