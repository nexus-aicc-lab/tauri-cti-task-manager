// src/windows/settings/app/router.tsx
import { createRouter, createRoute, createRootRoute, redirect, createHashHistory } from '@tanstack/react-router';
import MainLayout from '../layouts/MainLayout';
import GeneralSettings from '../pages/ui/GeneralSettings';
import PersonalSettings from '../pages/ui/PersonalSettings';
import CommunicationSettings from '../pages/ui/CommunicationSettings';
import CallSettings from '../pages/ui/CallSettings';
import StatisticsItemsSettings from '../pages/ui/StatisticsItemsSettings';
import MinimapSettings from '../pages/ui/MinimapSettings';
import NotificationsSettings from '../pages/ui/NotificationsSettings';

// 루트 라우트 정의
const rootRoute = createRootRoute({
    component: MainLayout,
});

// 설정 라우트들 정의
const settingsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/settings',
});

const generalRoute = createRoute({
    getParentRoute: () => settingsRoute,
    path: '/general',
    component: GeneralSettings,
});

const personalRoute = createRoute({
    getParentRoute: () => settingsRoute,
    path: '/personal',
    component: PersonalSettings,
});

const communicationRoute = createRoute({
    getParentRoute: () => settingsRoute,
    path: '/communication',
    component: CommunicationSettings,
});

const statisticsViewRoute = createRoute({
    getParentRoute: () => settingsRoute,
    path: '/statistics-view',
    component: CallSettings,
});

const statisticsItemsRoute = createRoute({
    getParentRoute: () => settingsRoute,
    path: '/statistics-items',
    component: StatisticsItemsSettings,
});

const minimapRoute = createRoute({
    getParentRoute: () => settingsRoute,
    path: '/minimap',
    component: MinimapSettings,
});

const notificationsRoute = createRoute({
    getParentRoute: () => settingsRoute,
    path: '/notifications',
    component: NotificationsSettings,
});

// 인덱스 라우트 (리다이렉트)
const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    beforeLoad: () => {
        throw redirect({
            to: '/settings/general',
        });
    },
});

const settingsIndexRoute = createRoute({
    getParentRoute: () => settingsRoute,
    path: '/',
    beforeLoad: () => {
        throw redirect({
            to: '/settings/general',
        });
    },
});

// 라우트 트리 생성
const routeTree = rootRoute.addChildren([
    indexRoute,
    settingsRoute.addChildren([
        settingsIndexRoute,
        generalRoute,
        personalRoute,
        communicationRoute,
        statisticsViewRoute,
        statisticsItemsRoute,
        minimapRoute,
        notificationsRoute,
    ]),
]);

// 라우터 생성
export const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    history: createHashHistory(), // 🔥 이게 있어야 해시 읽음
});

// 타입 정의
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}