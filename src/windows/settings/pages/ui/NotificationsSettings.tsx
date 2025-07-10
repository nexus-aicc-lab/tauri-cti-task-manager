import React from 'react';
import { Play, Volume2, Bell, Zap } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';

const NotificationsSettings: React.FC = () => {
    const testDesktopNotification = async () => {
        try {
            // 🚀 Tauri 백엔드 네이티브 알림 우선 시도
            await invoke('show_desktop_notification', {
                title: 'CTI Task Pilot',
                body: '데스크톱 알림이 정상적으로 작동합니다!'
            });
            console.log('✅ 네이티브 데스크톱 알림 전송 성공');
        } catch (error) {
            console.warn('⚠️ 네이티브 알림 실패, 브라우저 알림으로 폴백:', error);

            // 브라우저 알림으로 폴백
            // if (Notification.permission === 'granted') {
            //     new Notification('CTI Task Pilot', {
            //         body: '데스크톱 알림이 정상적으로 작동합니다!',
            //         icon: '/app-icon.png'
            //     });
            // } else if (Notification.permission !== 'denied') {
            //     Notification.requestPermission().then(permission => {
            //         if (permission === 'granted') {
            //             new Notification('CTI Task Pilot', {
            //                 body: '데스크톱 알림이 정상적으로 작동합니다!',
            //                 icon: '/app-icon.png'
            //             });
            //         }
            //     });
            // } else {
            //     alert('브라우저 알림 권한이 거부되었습니다.');
            // }
        }
    }; const testSoundNotification = async () => {
        console.log('🔊 소리 알림 테스트 시작...');

        // 🎯 방법 1: 기존 오디오 플레이어 사용
        // try {
        //     const existingAudio = document.querySelector('audio') as HTMLAudioElement;
        //     if (existingAudio) {
        //         console.log('🎵 기존 오디오 플레이어로 재생 시도');
        //         existingAudio.currentTime = 0;
        //         await existingAudio.play();
        //         console.log('✅ 기존 오디오 플레이어 재생 성공');
        //         alert('🎉 오디오 재생 성공! (기존 플레이어)');
        //         return;
        //     }
        // } catch (playerError) {
        //     console.warn('⚠️ 기존 플레이어 재생 실패:', playerError);
        // }

        // 🎯 방법 2: 새 Audio 객체로 간단 재생
        try {
            console.log('🎵 새 Audio 객체로 재생 시도 !');
            const audio = new Audio('notifications/status-changed-to-in-call.wav');
            audio.volume = 1.0;
            await audio.play();
            // console.log('✅ 새 Audio 객체 재생 성공');
            // alert('🎉 오디오 재생 성공! (새 Audio 객체)');
            return;
        } catch (audioError) {
            console.warn('⚠️ 새 Audio 객체 재생 실패:', audioError);
        }

        // 🎯 방법 3: Web Audio API 비프음
        // try {
        //     console.log('🔔 Web Audio API 비프음 생성');
        //     const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        //     const oscillator = audioContext.createOscillator();
        //     const gainNode = audioContext.createGain();

        //     oscillator.connect(gainNode);
        //     gainNode.connect(audioContext.destination);

        //     oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        //     gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);

        //     oscillator.start();
        //     oscillator.stop(audioContext.currentTime + 0.5);

        //     console.log('✅ Web Audio API 비프음 재생 성공');
        //     alert('🎉 비프음 재생 성공! (Web Audio API)');
        //     return;
        // } catch (beepError) {
        //     console.warn('⚠️ Web Audio API 비프음 실패:', beepError);
        // }

        // 🎯 방법 4: TTS 음성
        try {
            console.log('🗣️ TTS 음성 재생');
            if (window.speechSynthesis) {
                const utterance = new SpeechSynthesisUtterance('알림음 테스트');
                utterance.rate = 1.5;
                utterance.pitch = 1.2;
                utterance.volume = 1.0;
                utterance.lang = 'ko-KR';
                window.speechSynthesis.speak(utterance);
                console.log('✅ TTS 음성 재생 성공');
                alert('🎉 TTS 음성 재생 성공!');
                return;
            }
        } catch (ttsError) {
            console.warn('⚠️ TTS 음성 재생 실패:', ttsError);
        }

        // 🎯 방법 5: Tauri 백엔드 시스템 사운드
        try {
            console.log('🚀 Tauri 백엔드 시스템 사운드 시도');
            await invoke('play_notification_sound');
            console.log('✅ Tauri 백엔드 사운드 재생 성공');
            alert('🎉 시스템 사운드 재생 성공! (Tauri 백엔드)');
            return;
        } catch (backendError) {
            console.warn('⚠️ Tauri 백엔드 사운드 실패:', backendError);
        }

        // 🎯 최종: 모든 방법 실패
        console.error('❌ 모든 사운드 재생 방법 실패');
        alert('❌ 모든 사운드 재생 방법이 실패했습니다.\n브라우저 설정이나 권한을 확인해주세요.');
    };

    const testPopupNotification = () => {
        // 📱 앱 내 팝업 알림 (항상 작동)
        const popup = document.createElement('div');
        popup.className = `
            fixed top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-600 
            text-white px-6 py-3 rounded-lg shadow-xl z-50 
            transform transition-all duration-300 ease-in-out
            animate-bounce
        `;
        popup.innerHTML = `
            <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span class="font-medium">🔔 팝업 알림 테스트 성공!</span>
            </div>
        `;

        document.body.appendChild(popup);

        // 입장 애니메이션
        setTimeout(() => {
            popup.style.transform = 'translateX(0) scale(1)';
        }, 10);

        // 3초 후 퇴장 애니메이션과 함께 제거
        setTimeout(() => {
            popup.style.transform = 'translateX(100%) scale(0.8)';
            popup.style.opacity = '0';

            setTimeout(() => {
                if (document.body.contains(popup)) {
                    document.body.removeChild(popup);
                }
            }, 300);
        }, 3000);

        console.log('✅ 팝업 알림 표시 완료');
    };

    const testAllNotifications = async () => {
        try {
            console.log('🧪 모든 알림 테스트 시작...');

            // 🚀 백엔드에서 모든 네이티브 알림 테스트
            const result = await invoke('test_all_notifications');
            console.log('✅ 백엔드 알림 테스트 결과:', result);

            // 1초 후 팝업 알림도 추가 (시각적 효과)
            setTimeout(() => {
                testPopupNotification();
            }, 1000);

            // 전체 테스트 완료 메시지
            setTimeout(() => {
                const completionPopup = document.createElement('div');
                completionPopup.className = `
                    fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                    bg-green-500 text-white px-8 py-4 rounded-xl shadow-2xl z-50
                    font-bold text-lg animate-pulse
                `;
                completionPopup.innerHTML = `
                    <div class="text-center">
                        <div class="text-2xl mb-2">🎉</div>
                        <div>모든 알림 테스트 완료!</div>
                    </div>
                `;

                document.body.appendChild(completionPopup);

                setTimeout(() => {
                    if (document.body.contains(completionPopup)) {
                        document.body.removeChild(completionPopup);
                    }
                }, 2000);
            }, 2000);

        } catch (error) {
            console.error('❌ 전체 알림 테스트 실패:', error);

            // 개별 테스트로 폴백
            console.log('🔄 개별 테스트로 폴백 실행...');
            testDesktopNotification();
            setTimeout(() => testSoundNotification(), 500);
            setTimeout(() => testPopupNotification(), 1000);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">알림 설정</h2>

            <div className="space-y-5">
                {/* 데스크톱 알림 */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            defaultChecked
                        />
                        <div className="flex items-center space-x-2">
                            <Bell size={18} className="text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">데스크톱 알림 사용</span>
                        </div>
                    </label>
                    <button
                        onClick={testDesktopNotification}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 hover:scale-105"
                    >
                        <Play size={14} />
                        <span className="text-sm font-medium">테스트</span>
                    </button>
                </div>

                {/* 소리 알림 */}
                <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                defaultChecked
                            />
                            <div className="flex items-center space-x-2">
                                <Volume2 size={18} className="text-green-600" />
                                <span className="text-sm font-medium text-gray-700">소리 알림 사용</span>
                            </div>
                        </label>
                        <button
                            onClick={testSoundNotification}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 hover:scale-105"
                        >
                            <Play size={14} />
                            <span className="text-sm font-medium">테스트</span>
                        </button>
                    </div>

                    {/* 직접 오디오 플레이어 */}
                    {/* <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                        <div className="text-xs text-gray-600 mb-2">🎵 직접 재생 테스트:</div>
                        <audio
                            controls
                            className="w-full h-8"
                            preload="auto"
                        >
                            <source src="notifications/status-changed-to-in-call.wav" type="audio/wav" />
                            <source src="/notifications/status-changed-to-in-call.wav" type="audio/wav" />
                            <source src="./notifications/status-changed-to-in-call.wav" type="audio/wav" />
                            브라우저가 오디오를 지원하지 않습니다.
                        </audio>
                        <div className="text-xs text-gray-500 mt-1">
                            ↑ 여기서 직접 재생해보세요. 재생되면 파일 경로가 올바른 것입니다.
                        </div>
                    </div> */}
                </div>

                {/* 팝업 알림 */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="checkbox"
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                            defaultChecked
                        />
                        <div className="flex items-center space-x-2">
                            <Zap size={18} className="text-purple-600" />
                            <span className="text-sm font-medium text-gray-700">팝업 알림 사용</span>
                        </div>
                    </label>
                    <button
                        onClick={testPopupNotification}
                        className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-200 hover:scale-105"
                    >
                        <Play size={14} />
                        <span className="text-sm font-medium">테스트</span>
                    </button>
                </div>

                {/* 구분선 */}
                <div className="border-t border-gray-300 my-6"></div>

                {/* 전체 테스트 버튼 */}
                <div className="text-center">
                    <button
                        onClick={testAllNotifications}
                        className="flex items-center justify-center space-x-3 mx-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                        <Zap size={20} className="animate-pulse" />
                        <span>모든 알림 테스트 실행</span>
                        <Zap size={20} className="animate-pulse" />
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                        데스크톱, 소리, 팝업 알림을 순차적으로 테스트합니다
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotificationsSettings;