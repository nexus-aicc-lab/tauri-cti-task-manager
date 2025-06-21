// 📄 src/shared/api/apiForRedisTest.ts
import { axiosInstance } from './axiosInstance';

export const apiForGetSkillGroupFilter = async (params: any) => {
    const response = await axiosInstance.post(
        '/uconnect/redisData/testEcho',
        params
    );
    return response.data;
};
