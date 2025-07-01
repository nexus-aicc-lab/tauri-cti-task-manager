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
//             // Updated style for fixed width and height
//             style={{ width: '120px', height: '320px', backgroundColor: '#FFFFFF', borderRight: '1px solid #EBEBEB' }}
//         >
//             {categories.map(cat => (
//                 <div
//                     key={cat.name}
//                     onClick={() => onCategoryChange(cat.name)}
//                     // Removed py-2 and added fixed height to style
//                     className="flex items-center px-3 cursor-pointer text-sm"
//                     style={{
//                         backgroundColor: selectedCategory === cat.name ? '#F1FBFC' : '#FFFFFF',
//                         color: '#333',
//                         borderBottom: '1px solid #EBEBEB',
//                         height: '32px' // Set fixed height for each item
//                     } as ExtendedCSSProperties}
//                 >
//                     <img
//                         src={cat.iconPath}
//                         alt={cat.name}
//                         // Changed icon size to 12x12px using inline style
//                         style={{ width: '12px', height: '12px', marginRight: '8px', filter: 'grayscale(60%) brightness(80%)' }}
//                     />
//                     <span>{cat.name}</span>
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default SideMenuForEnvironmentSettingWindow;

// C:\tauri\cti-task-manager-tauri\src\windows\settings\components\SideMenuForEnvironmentSettingWindow.tsx

import React from 'react';

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
    const categories = [
        { name: '일반', iconPath: '/icons/environment_setting/settings_on_gear.svg' },
        { name: '개인', iconPath: '/icons/environment_setting/profile_on_avatar.svg' },
        { name: '큐 통계범위', iconPath: '/icons/environment_setting/statistics_lange_on.svg' },
        { name: '통계보기', iconPath: '/icons/environment_setting/statistics_view_on.svg' },
        { name: '통계항목', iconPath: '/icons/environment_setting/statistics_list_on.svg' },
        { name: '미니바', iconPath: '/icons/environment_setting/minibar_on_panel.svg' },
        { name: '알림', iconPath: '/icons/environment_setting/notifications_on_bell.svg' },
    ];

    return (
        <div
            // Updated style for fixed width and height, and added borderBottom
            style={{
                width: '120px',
                height: '300px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #EBEBEB',
                borderBottom: '1px solid #EBEBEB', // Added border to the container bottom
            }}
        >
            {categories.map((cat, index) => (
                <div
                    key={cat.name}
                    onClick={() => onCategoryChange(cat.name)}
                    className="flex items-center px-3 cursor-pointer text-sm"
                    style={{
                        backgroundColor: selectedCategory === cat.name ? '#F1FBFC' : '#FFFFFF',
                        color: '#333',
                        // Apply borderBottom only if it's not the last item
                        borderBottom: index < categories.length - 1 ? '1px solid #EBEBEB' : 'none',
                        height: '32px',
                        fontSize: '12px',
                    } as ExtendedCSSProperties}
                >
                    <img
                        src={cat.iconPath}
                        alt={cat.name}
                        style={{ width: '12px', height: '12px', marginRight: '8px', filter: 'grayscale(60%) brightness(80%)' }}
                    />
                    <span>{cat.name}</span>
                </div>
            ))}
        </div>
    );
};

export default SideMenuForEnvironmentSettingWindow;