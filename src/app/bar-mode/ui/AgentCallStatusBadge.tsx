// src/app/bar-mode/ui/AgentCallStatusBadge.tsx
'use client';

import React from 'react';

export interface Status {
    label: string;
    workTime: string;
    icon: string;
    backgroundColor: string;
    color?: string;
}

interface Props {
    status: Status;
    onClick?: () => void;
}

const AgentCallStatusBadge: React.FC<Props> = ({ status, onClick }) => {
    return (
        <div
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '2px 8px',
                borderRadius: 12,
                backgroundColor: status.backgroundColor,
                color: status.color ?? '#ffffff',
                fontSize: 11,
                fontWeight: 500,
                cursor: onClick ? 'pointer' : 'default',
                WebkitAppRegion: 'no-drag'
            } as React.CSSProperties}
        >
            <img src={status.icon} alt={status.label} width={14} height={14} />
            <span>{`${status.label} ${status.workTime}`}</span>
        </div>
    );
};

export default AgentCallStatusBadge;
