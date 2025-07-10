import React, { useState, useEffect } from 'react';
import { UserProfileUpdate } from '../../../lib/redis-events';

interface ToastProps {
  data: UserProfileUpdate;
  onClose: () => void;
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'READY': return '대기중';
    case 'BUSY': return '통화중';
    case 'BREAK': return '휴식중';
    case 'OFFLINE': return '오프라인';
    default: return status;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'READY': return 'bg-green-500';
    case 'BUSY': return 'bg-red-500';
    case 'BREAK': return 'bg-yellow-500';
    case 'OFFLINE': return 'bg-gray-500';
    default: return 'bg-blue-500';
  }
};

export const Toast: React.FC<ToastProps> = ({ data, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // 4초 후 자동 닫기

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[300px]">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(data.newValue)}`}></div>
          <div className="flex-1">
            <div className="font-medium text-sm">
              사용자 {data.userId} 상태 변경
            </div>
            <div className="text-xs text-gray-600">
              {data.field}: {getStatusText(data.newValue)}
            </div>
            <div className="text-xs text-gray-400">
              {new Date(data.timestamp).toLocaleTimeString()}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};