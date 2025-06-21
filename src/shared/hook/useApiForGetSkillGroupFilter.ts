import { useQuery } from '@tanstack/react-query';
import { apiForGetSkillGroupFilter } from '../api/apiForRedisTest';

export const useApiForGetSkillGroupFilter = (params: any, enabled = true) => {
    return useQuery({
        queryKey: ['skillGroupFilter', params], // 파라미터 포함해서 캐싱 구분
        queryFn: () => apiForGetSkillGroupFilter(params),
        enabled, // 필요할 때만 실행
        staleTime: 1000 * 60, // 1분간 캐시 유지
    });
};
