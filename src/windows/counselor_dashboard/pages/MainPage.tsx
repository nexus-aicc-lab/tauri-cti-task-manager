// // src/windows/counselor_dashboard/pages/MainPage.tsx 수정
// 'use client';

// import React from 'react';
// import CustomTitlebar from '../components/CustomTitlebar';
// import AgentDashboardContent from '../ui/AgentDashboardContent';
// import { StatusUpdater } from '../components/StatusUpdater'; // ✅ 추가
// import { useUser } from '../hooks/useUserQueries';

// const MainPage = () => {
//     const { data: user, isLoading, error } = useUser(2);

//     if (isLoading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div>사용자 데이터 로딩 중...</div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-red-500">에러: {error.message}</div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50">
//             <CustomTitlebar
//                 title={`CTI Task Master - 상담사 대시보드 (${user?.name || '사용자'})`}
//                 onBackToLauncher={() => { }}
//             />

//             {/* ✅ 상태 변경 컴포넌트 추가 */}
//             <div className="px-4 pt-6">
//                 <StatusUpdater userId={2} />
//             </div>

//             <AgentDashboardContent user={user} />
//         </div>
//     );
// };

// export default MainPage;

'use client';

import React, { useState } from 'react';
import CustomTitlebar from '../components/CustomTitlebar';
import AgentDashboardContent from '../ui/AgentDashboardContent';
import { StatusUpdater } from '../components/StatusUpdater';
import { useUser } from '../hooks/useUserQueries';
import { UserProfileUpdate } from '../../../lib/redis-events';
import { useRedisEvents } from '@/hooks/useRedisEvents';
import { Toast } from '@/windows/panel/components/ToastNotification';

const MainPage = () => {
    const { data: user, isLoading, error } = useUser(2);
    const [toastData, setToastData] = useState<UserProfileUpdate | null>(null);

    // ✅ Redis 이벤트 리스너 설정
    useRedisEvents({
        onUserUpdate: (data) => {
            // 토스트 알림 표시
            setToastData(data);

            // 콘솔에도 로그 출력
            console.log('🔔 실시간 업데이트 수신:', {
                userId: data.userId,
                field: data.field,
                newValue: data.newValue,
                timestamp: new Date(data.timestamp).toLocaleString()
            });
        }
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div>사용자 데이터 로딩 중...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-red-500">에러: {error.message}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <CustomTitlebar
                title={`CTI Task Master - 상담사 대시보드 (${user?.name || '사용자'})`}
                onBackToLauncher={() => { }}
            />

            {/* ✅ 상태 변경 컴포넌트 */}
            <div className="px-4 pt-6">
                <StatusUpdater userId={2} />
            </div>

            <AgentDashboardContent user={user} />

            {/* ✅ 토스트 알림 */}
            {toastData && (
                <Toast
                    data={toastData}
                    onClose={() => setToastData(null)}
                />
            )}
        </div>
    );
};

export default MainPage;