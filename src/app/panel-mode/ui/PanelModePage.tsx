// src/app/panel-mode/ui/PanelModePage.tsx

import CustomTitlebar from './CustomTitlebar';
import PanelModeContent from './PanelModeContent';

interface PanelModePageProps {
    onBackToLauncher?: () => void;
}

export default function PanelModePage({ onBackToLauncher }: PanelModePageProps) {
    return (
        <div className="h-screen flex flex-col bg-white">
            <CustomTitlebar
                title="CTI Task Master – 패널 모드"
                onBackToLauncher={onBackToLauncher || (() => { })}
            />
            <div className="flex-1 p-4 flex flex-col gap-4">
                <PanelModeContent />
            </div>
        </div>
    );
}
