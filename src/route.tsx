// // 📄 src/route.tsx
// import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router'
// import BarComponent from './pages/BarMode'      // ✅ 상대 경로로 수정
// import PanelComponent from './pages/PanelMode'   // ✅ 상대 경로로 수정  
// import SettingsComponent from './pages/SettingsMode'

// const rootRoute = createRootRoute({
//     component: () => <Outlet />,
// })

// // 각 윈도우별 전용 라우트
// const barRoute = createRoute({
//     getParentRoute: () => rootRoute,
//     path: '/bar',
//     component: BarComponent
// })

// const panelRoute = createRoute({
//     getParentRoute: () => rootRoute,
//     path: '/panel',
//     component: PanelComponent
// })

// const settingsRoute = createRoute({
//     getParentRoute: () => rootRoute,
//     path: '/settings',
//     component: SettingsComponent
// })

// // 런처용
// const launcherRoute = createRoute({
//     getParentRoute: () => rootRoute,
//     path: '/',
//     component: BarComponent
// })

// const routeTree = rootRoute.addChildren([
//     launcherRoute,
//     barRoute,
//     panelRoute,
//     settingsRoute
// ])

// export const router = createRouter({ routeTree })

// 📄 src/route.tsx (수정된 디버그 버전)
import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router'
import { Launcher } from './pages/Launcher'  // 기존 런처 유지

// 간단한 바 모드 테스트
const SimpleBar = () => {
    console.log('SimpleBar 렌더링!');
    return (
        <div style={{
            width: '100%',
            height: '32px',
            backgroundColor: 'blue',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px'
        }}>
            🔵 SIMPLE BAR MODE WORKING!
        </div>
    );
};

const SimplePanel = () => {
    console.log('SimplePanel 렌더링!');
    return (
        <div style={{
            width: '100%',
            height: '100vh',
            backgroundColor: 'green',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
        }}>
            🟢 SIMPLE PANEL MODE WORKING!
        </div>
    );
};

const rootRoute = createRootRoute({
    component: () => {
        console.log('Root component 렌더링!');
        return <Outlet />;
    },
})

// 런처는 기존 것 사용
const launcherRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: Launcher  // 기존 런처 컴포넌트
})

const launcherRoute2 = createRoute({
    getParentRoute: () => rootRoute,
    path: '/launcher',
    component: Launcher
})

// 바/패널은 간단한 테스트 버전
const barRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/bar',
    component: SimpleBar
})

const panelRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/panel',
    component: SimplePanel
})

const routeTree = rootRoute.addChildren([
    launcherRoute,
    launcherRoute2,
    barRoute,
    panelRoute
])

export const router = createRouter({
    routeTree,
    defaultNotFoundComponent: () => {
        console.log('404 Not Found!', window.location.href);
        return <div style={{ backgroundColor: 'red', color: 'white', padding: '20px' }}>
            404 NOT FOUND: {window.location.href}
        </div>;
    }
})