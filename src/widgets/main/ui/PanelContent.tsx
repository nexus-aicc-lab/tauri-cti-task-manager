'use client';

import { useUIStore } from '@/shared/store/useUIStore';
import Dashboard from '@/widgets/dashboard/ui/Dashboard';
import SettingsPage from '@/widgets/settings/ui/SettingsPage';

export default function PanelContent() {
    const activePage = useUIStore((s) => s.activePage);

    switch (activePage) {
        case 'settings':
            return <SettingsPage />;
        case 'dashboard':
            return <Dashboard />;
        default:
            return null;
    }
}
