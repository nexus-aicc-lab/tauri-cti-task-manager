import React from 'react';
import { Card, CardContent } from "@/shared/ui/card";

interface StatsCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    variant?: 'default' | 'warning'; // 확장 가능성을 위해 variant 추가
}

const StatsCard: React.FC<StatsCardProps> = ({
    icon,
    label,
    value,
    variant = 'default'
}) => {
    // 🎯 라벨에 따른 색상 결정 (기존 로직 유지)
    const getValueColor = () => {
        if (variant === 'warning' || label === '대기호') {
            return 'text-red-600';
        }
        return 'text-gray-800';
    };

    return (
        <Card className="rounded-md p-2 hover:shadow-sm transition-all duration-300">
            <CardContent className="p-0">
                <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-gray-100 border flex items-center justify-center">
                        {icon}
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 font-medium">{label}</div>
                        <div className={`text-sm font-bold ${getValueColor()}`}>
                            {value}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default StatsCard;