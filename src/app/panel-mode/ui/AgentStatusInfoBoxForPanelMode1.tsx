import React from 'react';
import { Timer } from 'lucide-react';

const AgentStatusInfoBoxForPanelMode1 = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">대기중 상태</h2>
            <div className="w-32 h-32 bg-blue-200 rounded-full flex items-center justify-center border-4 border-blue-300">
                <Timer size={48} className="text-blue-700" />
            </div>
            <div className="mt-4 text-center">
                <div className="text-xl font-bold text-gray-800">대기중</div>
                <div className="text-blue-600 font-semibold">00:03:44</div>
            </div>
        </div>
    );
};

export default AgentStatusInfoBoxForPanelMode1;
