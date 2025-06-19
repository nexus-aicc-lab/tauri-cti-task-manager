import {
    createRootRoute,
    createRoute,
    createRouter,
    Outlet,
} from '@tanstack/react-router';
import HelloPage from './pages/hello';
import App from './App'; // 👈 기존 메인 앱
import SettingsPage from './pages/settings';

const rootRoute = createRootRoute({
    component: () => <Outlet />,
});

const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/', // ✅ 루트 경로
    component: App,
});

const helloRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/hello',
    component: HelloPage,
});

const settingsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/settings',
    component: SettingsPage,
});

const routeTree = rootRoute.addChildren([
    homeRoute, // ✅ 루트 추가
    helloRoute,
    settingsRoute
]);

export const router = createRouter({ routeTree });
