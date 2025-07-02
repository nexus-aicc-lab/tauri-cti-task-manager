
// // C:\tauri\cti-task-manager-tauri\src\windows\settings\components\SideMenuForEnvironmentSettingWindow.tsx

// import React from 'react';

// interface ExtendedCSSProperties extends React.CSSProperties {
//     WebkitAppRegion?: 'drag' | 'no-drag';
// }

// interface SideMenuForEnvironmentSettingWindowProps {
//     selectedCategory: string;
//     onCategoryChange: (categoryName: string) => void;
// }

// const SideMenuForEnvironmentSettingWindow: React.FC<SideMenuForEnvironmentSettingWindowProps> = ({
//     selectedCategory,
//     onCategoryChange
// }) => {
//     const categories = [
//         { name: '일반', iconPath: '/icons/environment_setting/settings_on_gear.svg' },
//         { name: '개인', iconPath: '/icons/environment_setting/profile_on_avatar.svg' },
//         { name: '큐 통계범위', iconPath: '/icons/environment_setting/statistics_lange_on.svg' },
//         { name: '통계보기', iconPath: '/icons/environment_setting/statistics_view_on.svg' },
//         { name: '통계항목', iconPath: '/icons/environment_setting/statistics_list_on.svg' },
//         { name: '미니바', iconPath: '/icons/environment_setting/minibar_on_panel.svg' },
//         { name: '알림', iconPath: '/icons/environment_setting/notifications_on_bell.svg' },
//     ];

//     return (
//         <div
//             // Updated style for fixed width and height, and added borderBottom
//             style={{
//                 width: '120px',
//                 height: '300px',
//                 backgroundColor: '#FFFFFF',
//                 border: '1px solid #EBEBEB',
//                 borderBottom: '1px solid #EBEBEB', // Added border to the container bottom
//             }}
//         >
//             {categories.map((cat, index) => (
//                 <div
//                     key={cat.name}
//                     onClick={() => onCategoryChange(cat.name)}
//                     className="flex items-center px-3 cursor-pointer text-sm"
//                     style={{
//                         backgroundColor: selectedCategory === cat.name ? '#F1FBFC' : '#FFFFFF',
//                         color: '#333',
//                         // Apply borderBottom only if it's not the last item
//                         borderBottom: index < categories.length - 1 ? '1px solid #EBEBEB' : 'none',
//                         height: '32px',
//                         fontSize: '12px',
//                     } as ExtendedCSSProperties}
//                 >
//                     <img
//                         src={cat.iconPath}
//                         alt={cat.name}
//                         style={{ width: '12px', height: '12px', marginRight: '8px', filter: 'grayscale(60%) brightness(80%)' }}
//                     />
//                     <span>{cat.name}</span>
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default SideMenuForEnvironmentSettingWindow;

// src/windows/settings/components/SideMenuForEnvironmentSettingWindow.tsx 업데이트
import React from 'react';
import { useRouter } from '@tanstack/react-router';

interface ExtendedCSSProperties extends React.CSSProperties {
    WebkitAppRegion?: 'drag' | 'no-drag';
}

interface SideMenuForEnvironmentSettingWindowProps {
    selectedCategory: string;
    onCategoryChange: (categoryName: string) => void;
}

const SideMenuForEnvironmentSettingWindow: React.FC<SideMenuForEnvironmentSettingWindowProps> = ({
    selectedCategory,
    onCategoryChange
}) => {
    const router = useRouter();

    const categories = [
        {
            name: '일반',
            iconPath: '/icons/environment_setting/settings_on_gear.svg',
            route: '/settings/general'
        },
        {
            name: '개인',
            iconPath: '/icons/environment_setting/profile_on_avatar.svg',
            route: '/settings/personal'
        },
        {
            name: '큐 통계범위',
            iconPath: '/icons/environment_setting/statistics_lange_on.svg',
            route: '/settings/communication'
        },
        {
            name: '통계보기',
            iconPath: '/icons/environment_setting/statistics_view_on.svg',
            route: '/settings/statistics-view'
        },
        {
            name: '통계항목',
            iconPath: '/icons/environment_setting/statistics_list_on.svg',
            route: '/settings/statistics-items'
        },
        {
            name: '미니바',
            iconPath: '/icons/environment_setting/minibar_on_panel.svg',
            route: '/settings/minimap'
        },
        {
            name: '알림',
            iconPath: '/icons/environment_setting/notifications_on_bell.svg',
            route: '/settings/notifications'
        },
    ];

    const handleCategoryClick = async (cat: typeof categories[0]) => {
        // TanStack Router를 사용해 직접 네비게이션
        await router.navigate({ to: cat.route });
        // 부모 컴포넌트의 콜백도 호출
        onCategoryChange(cat.name);
    };

    return (
        <div
            style={{
                width: '120px',
                height: '300px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #EBEBEB',
                borderBottom: '1px solid #EBEBEB',
            }}
        >
            {categories.map((cat, index) => (
                <div
                    key={cat.name}
                    onClick={() => handleCategoryClick(cat)}
                    className="flex items-center px-3 cursor-pointer text-sm"
                    style={{
                        backgroundColor: selectedCategory === cat.name ? '#F1FBFC' : '#FFFFFF',
                        color: '#333',
                        borderBottom: index < categories.length - 1 ? '1px solid #EBEBEB' : 'none',
                        height: '32px',
                        fontSize: '12px',
                    } as ExtendedCSSProperties}
                >
                    <img
                        src={cat.iconPath}
                        alt={cat.name}
                        style={{
                            width: '12px',
                            height: '12px',
                            marginRight: '8px',
                            filter: 'grayscale(60%) brightness(80%)'
                        }}
                    />
                    <span>{cat.name}</span>
                </div>
            ))}
        </div>
    );
};

export default SideMenuForEnvironmentSettingWindow;