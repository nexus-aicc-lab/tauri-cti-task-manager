'use client';

import Titlebar from '@/widgets/titlebar/ui/Titlebar';

export default function MainWindowWithBarMode() {
    return (
        <div className="h-screen w-screen bg-gradient-to-r from-green-600 to-green-500 text-white select-none">
            <Titlebar />
        </div>
    );
}
