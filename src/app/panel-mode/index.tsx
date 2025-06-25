// C:\tauri\cti-task-manager-tauri\src\app\panel-mode\index.tsx

import CustomTitlebar from "./ui/CustomTitlebar";
import PanelModeContent from "./ui/PanelModeContent";

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
