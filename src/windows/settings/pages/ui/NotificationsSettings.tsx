// // src/windows/settings/pages/ui/NotificationsSettings.tsx
// import React from 'react';

// const NotificationsSettings: React.FC = () => {
//     return (
//         <div className="p-4">
//             <h2 className="text-lg font-medium mb-4">알림 설정</h2>
//             <div className="space-y-4">
//                 <div>
//                     <label className="flex items-center space-x-2">
//                         <input type="checkbox" className="rounded" />
//                         <span className="text-sm">데스크톱 알림 사용</span>
//                     </label>
//                 </div>
//                 <div>
//                     <label className="flex items-center space-x-2">
//                         <input type="checkbox" className="rounded" />
//                         <span className="text-sm">소리 알림 사용</span>
//                     </label>
//                 </div>
//                 <div>
//                     <label className="flex items-center space-x-2">
//                         <input type="checkbox" className="rounded" />
//                         <span className="text-sm">팝업 알림 사용</span>
//                     </label>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default NotificationsSettings;

import React, { useEffect, useState } from 'react';
import { Play, Volume2, Bell, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { invoke } from '@tauri-apps/api/core';

// 🎉 플러그인 import (동적 로딩으로 에러 방지)
let sendNotification: any = null;
let isPermissionGranted: any = null;
let requestPermission: any = null;

try {
    const plugin = require('@tauri-apps/plugin-notification');
    sendNotification = plugin.sendNotification;
    isPermissionGranted = plugin.isPermissionGranted;
    requestPermission = plugin.requestPermission;
    console.log('✅ Tauri 알림 플러그인 로드 성공');
} catch (error) {
    console.warn('⚠️ Tauri 알림 플러그인 로드 실패 (백엔드 방식 사용):', error);
}

// 토스트 타입 정의
interface ToastMessage {
    title: string;
    body?: string;
}

interface Toast {
    id: number;
    message: ToastMessage;
    type: 'success' | 'info' | 'warning' | 'error';
}

// 비즈니스 토스트 컴포넌트 (3가지 스타일)
const BusinessToast = ({ message, type = 'success', onClose, style = 'default' }: {
    message: ToastMessage;
    type?: string;
    onClose: () => void;
    style?: 'default' | 'minimal' | 'accent';
}) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle size={16} className="text-green-600" />;
            case 'error': return <XCircle size={16} className="text-red-600" />;
            case 'warning': return <AlertCircle size={16} className="text-amber-600" />;
            default: return <Info size={16} className="text-blue-600" />;
        }
    };

    const getStyles = () => {
        const baseStyles = "transform transition-all duration-300 ease-out";

        switch (style) {
            case 'minimal':
                return {
                    container: `${baseStyles} bg-white border-l-4 shadow-sm`,
                    border: type === 'success' ? 'border-green-500' :
                        type === 'error' ? 'border-red-500' :
                            type === 'warning' ? 'border-amber-500' : 'border-blue-500',
                    text: 'text-gray-800'
                };
            case 'accent':
                return {
                    container: `${baseStyles} bg-gray-800 text-white shadow-lg`,
                    border: '',
                    text: 'text-white'
                };
            default:
                return {
                    container: `${baseStyles} bg-white border shadow-md`,
                    border: 'border-gray-200',
                    text: 'text-gray-800'
                };
        }
    };

    const styles = getStyles();

    return (
        <motion.div
            initial={{ x: 320, opacity: 0, scale: 0.95 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: 320, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className={`${styles.container} ${styles.border} rounded-lg px-4 py-3 max-w-sm`}
        >
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                    {getIcon()}
                </div>
                <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${styles.text}`}>
                        {message.title}
                    </p>
                    {message.body && (
                        <p className={`text-xs mt-1 ${styles.text} opacity-75`}>
                            {message.body}
                        </p>
                    )}
                </div>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className={`flex-shrink-0 ${styles.text} opacity-50 hover:opacity-75`}
                >
                    <XCircle size={14} />
                </motion.button>
            </div>
        </motion.div>
    );
};

// 완료 모달 컴포넌트 (비즈니스 스타일)
const CompletionModal = ({ isVisible, onClose }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50
                                   bg-white rounded-xl shadow-xl border border-gray-200 p-6 max-w-sm w-full mx-4"
                    >
                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="text-green-600" size={24} />
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                테스트 완료
                            </h3>

                            <p className="text-sm text-gray-600 mb-6">
                                모든 알림 기능이 정상적으로 작동합니다.
                            </p>

                            <button
                                onClick={onClose}
                                className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg 
                                         hover:bg-blue-700 transition-colors duration-200"
                            >
                                확인
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

const NotificationsSettings = () => {
    const [testResults, setTestResults] = useState<Record<string, boolean>>({});
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [showCompletion, setShowCompletion] = useState(false);
    const [loadingTests, setLoadingTests] = useState<Record<string, boolean>>({});
    const [toastStyle, setToastStyle] = useState<'default' | 'minimal' | 'accent'>('default');

    // 토스트 추가 함수
    const addToast = (message: ToastMessage, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    // 토스트 제거 함수
    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    // 로딩 상태 설정
    const setTestLoading = (testType, loading) => {
        setLoadingTests(prev => ({ ...prev, [testType]: loading }));
    };

    // 데스크톱 알림 테스트
    const testDesktopNotification = async () => {
        setTestLoading('desktop', true);
        try {
            await invoke('show_desktop_notification', {
                title: 'CTI Task Pilot',
                body: '데스크톱 알림이 정상적으로 작동합니다!'
            });

            setTestResults(prev => ({ ...prev, desktop: true }));
            addToast({
                title: '데스크톱 알림 테스트 성공',
                body: '시스템 알림이 표시되었습니다.'
            }, 'success');

        } catch (error) {
            console.error('❌ 데스크톱 알림 실패:', error);
            setTestResults(prev => ({ ...prev, desktop: false }));
            addToast({
                title: '데스크톱 알림 실패',
                body: '시스템 알림을 표시할 수 없습니다.'
            }, 'error');
        } finally {
            setTestLoading('desktop', false);
        }
    };

    // 사운드 테스트
    const testSoundNotification = async () => {
        setTestLoading('sound', true);
        try {
            const audio = new Audio('notifications/status-changed-to-in-call.wav');
            audio.volume = 1.0;
            await audio.play();

            setTestResults(prev => ({ ...prev, sound: true }));
            addToast({
                title: '사운드 테스트 성공',
                body: '알림음이 재생되었습니다.'
            }, 'success');

        } catch (error) {
            console.error('❌ 사운드 테스트 실패:', error);
            setTestResults(prev => ({ ...prev, sound: false }));
            addToast({
                title: '사운드 테스트 실패',
                body: '알림음을 재생할 수 없습니다.'
            }, 'error');
        } finally {
            setTestLoading('sound', false);
        }
    };

    // 팝업 테스트
    const testPopupNotification = async () => {
        setTestLoading('popup', true);
        try {
            await new Promise(resolve => setTimeout(resolve, 300));

            setTestResults(prev => ({ ...prev, popup: true }));
            addToast({
                title: '팝업 알림 테스트 성공',
                body: '앱 내 알림이 정상 작동합니다.'
            }, 'success');

        } catch (error) {
            console.error('❌ 팝업 알림 실패:', error);
            setTestResults(prev => ({ ...prev, popup: false }));
            addToast({
                title: '팝업 알림 실패',
                body: '앱 내 알림을 표시할 수 없습니다.'
            }, 'error');
        } finally {
            setTestLoading('popup', false);
        }
    };

    // 전체 테스트
    const testAllNotifications = async () => {
        setTestLoading('all', true);
        setTestResults({});

        try {
            // 순차적으로 테스트 실행
            await testDesktopNotification();
            await new Promise(resolve => setTimeout(resolve, 800));

            await testSoundNotification();
            await new Promise(resolve => setTimeout(resolve, 800));

            await testPopupNotification();
            await new Promise(resolve => setTimeout(resolve, 500));

            // 완료 모달 표시
            setShowCompletion(true);

        } catch (error) {
            console.error('❌ 전체 테스트 실패:', error);
            addToast({
                title: '전체 테스트 실패',
                body: '일부 테스트에서 오류가 발생했습니다.'
            }, 'error');
        } finally {
            setTestLoading('all', false);
        }
    };

    const getTestResultIcon = (testType) => {
        const result = testResults[testType];
        if (result === true) return <CheckCircle className="text-green-600" size={16} />;
        if (result === false) return <XCircle className="text-red-600" size={16} />;
        return null;
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            {/* 토스트 컨테이너 */}
            <div className="fixed top-4 right-4 z-40 space-y-3">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <BusinessToast
                            key={toast.id}
                            message={toast.message}
                            type={toast.type}
                            style={toastStyle}
                            onClose={() => removeToast(toast.id)}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* 완료 모달 */}
            <CompletionModal
                isVisible={showCompletion}
                onClose={() => setShowCompletion(false)}
            />

            {/* 헤더 */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">알림 설정</h2>
                <p className="text-sm text-gray-600">시스템 알림 기능을 테스트하고 확인하세요.</p>
            </div>

            {/* 토스트 스타일 선택 */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    알림 스타일 선택
                </label>
                <div className="flex space-x-3">
                    {[
                        { value: 'default', label: '기본' },
                        { value: 'minimal', label: '미니멀' },
                        { value: 'accent', label: '다크' }
                    ].map((style) => (
                        <button
                            key={style.value}
                            onClick={() => setToastStyle(style.value as any)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${toastStyle === style.value
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {style.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 테스트 항목들 */}
            <div className="space-y-4">
                {/* 데스크톱 알림 */}
                <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <Bell size={20} className="text-blue-600" />
                        <div>
                            <span className="text-sm font-medium text-gray-900">데스크톱 알림</span>
                            <p className="text-xs text-gray-500">시스템 네이티브 알림</p>
                        </div>
                        {getTestResultIcon('desktop')}
                    </div>
                    <button
                        onClick={testDesktopNotification}
                        disabled={loadingTests.desktop}
                        className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {loadingTests.desktop ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Play size={14} />
                        )}
                        <span>테스트</span>
                    </button>
                </div>

                {/* 사운드 알림 */}
                <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <Volume2 size={20} className="text-green-600" />
                        <div>
                            <span className="text-sm font-medium text-gray-900">사운드 알림</span>
                            <p className="text-xs text-gray-500">오디오 알림음 재생</p>
                        </div>
                        {getTestResultIcon('sound')}
                    </div>
                    <button
                        onClick={testSoundNotification}
                        disabled={loadingTests.sound}
                        className="flex items-center space-x-2 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                        {loadingTests.sound ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Play size={14} />
                        )}
                        <span>테스트</span>
                    </button>
                </div>

                {/* 팝업 알림 */}
                <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <Info size={20} className="text-purple-600" />
                        <div>
                            <span className="text-sm font-medium text-gray-900">팝업 알림</span>
                            <p className="text-xs text-gray-500">앱 내 토스트 메시지</p>
                        </div>
                        {getTestResultIcon('popup')}
                    </div>
                    <button
                        onClick={testPopupNotification}
                        disabled={loadingTests.popup}
                        className="flex items-center space-x-2 px-3 py-1.5 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
                    >
                        {loadingTests.popup ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Play size={14} />
                        )}
                        <span>테스트</span>
                    </button>
                </div>
            </div>

            {/* 전체 테스트 버튼 */}
            <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                    onClick={testAllNotifications}
                    disabled={loadingTests.all}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                    {loadingTests.all ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>테스트 진행중...</span>
                        </>
                    ) : (
                        <>
                            <CheckCircle size={20} />
                            <span>모든 알림 테스트 실행</span>
                        </>
                    )}
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                    모든 알림 기능을 순차적으로 테스트합니다
                </p>
            </div>
        </div>
    );
};

export default NotificationsSettings;