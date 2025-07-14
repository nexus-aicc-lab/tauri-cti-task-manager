// // src/windows/counselor_dashboard/hooks/useUpdateCallStatusById.ts
// import { User, userApi } from '@/windows/counselor_dashboard/api/userApi';
// import { useMutation, useQueryClient } from '@tanstack/react-query';

// export function useUpdateCallStatusById() {
//     const queryClient = useQueryClient();

//     return useMutation<
//         User, // 성공 리턴 타입
//         unknown, // 에러 타입
//         { userId: number; callStatus: User['callStatus'] } // mutate 파라미터
//     >({
//         mutationFn: ({ userId, callStatus }) => userApi.updateCallStatusById(userId, callStatus),
//         onSuccess: (updated) => {
//             console.log('상태 업데이트 성공 🎉', updated);
//         },
//         onError: (err) => {
//             console.error('상태 업데이트 실패 😢', err);
//         },
//     });
// }

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
                startedAt: new Date().toISOString(), // ISO 형식으로 저장
            }));

            // ✅ 2. 백엔드에 상태 변경 요청
            return userApi.updateCallStatusById(userId, callStatus);
        },
        onSuccess: (updated) => {
            console.log('상태 업데이트 성공 🎉', updated);
        },
        onError: (err) => {
            console.error('상태 업데이트 실패 😢', err);
        },
    });
}
