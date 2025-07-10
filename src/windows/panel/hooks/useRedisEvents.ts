import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { setupRedisEventListener, UserProfileUpdate } from '../../../lib/redis-events';

interface UseRedisEventsOptions {
    onUserUpdate?: (data: UserProfileUpdate) => void;
}

export const useRedisEvents = (options?: UseRedisEventsOptions) => {
    const queryClient = useQueryClient();

    useEffect(() => {
        let unlisten: (() => void) | undefined;

        const handleUserProfileUpdate = (data: UserProfileUpdate) => {
            console.log('👤 사용자 프로필 업데이트:', data);

            // React Query 캐시 무효화 - 사용자 목록 새로고침
            queryClient.invalidateQueries({ queryKey: ['users'] });

            // 특정 사용자 캐시도 업데이트
            queryClient.invalidateQueries({ queryKey: ['user', data.userId] });

            // 커스텀 콜백 실행 (토스트 알림 등)
            if (options?.onUserUpdate) {
                options.onUserUpdate(data);
            }
        };

        // 이벤트 리스너 설정
        setupRedisEventListener(handleUserProfileUpdate).then((unlistenFn) => {
            unlisten = unlistenFn;
        });

        // 컴포넌트 언마운트 시 리스너 정리
        return () => {
            if (unlisten) {
                unlisten();
            }
        };
    }, [queryClient, options?.onUserUpdate]);
};