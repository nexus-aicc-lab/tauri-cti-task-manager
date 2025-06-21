'use client';

import Titlebar from '@/widgets/titlebar/ui/Titlebar';
import PanelContent from '@/widgets/main/ui/PanelContent';

export default function MainWindowWithPanelMode() {
    return (
        <div className="h-screen flex flex-col overflow-hidden bg-white text-black">
            <Titlebar />
            <div className="flex-1 min-h-0 overflow-auto">
                <PanelContent />
            </div>
        </div>
    );
}
