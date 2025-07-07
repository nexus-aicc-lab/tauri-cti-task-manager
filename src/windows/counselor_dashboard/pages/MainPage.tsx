'use client';

import React from 'react';
import CustomTitlebar from '../components/CustomTitlebar';
import AgentDashboardContent from '../ui/AgentDashboardContent';

const MainPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <CustomTitlebar title="CTI Task Master - 상담사 대시보드" onBackToLauncher={() => { }} />
            <AgentDashboardContent />
        </div>
    );
};

export default MainPage;
