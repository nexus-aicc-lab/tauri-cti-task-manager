// // src/pages/LoginMode.tsx
// import React, { useState } from 'react';

// type Mode = 'launcher' | 'bar' | 'panel' | 'login';

// interface LoginProps {
//     onModeChange: (mode: Mode) => void;
// }

// const LoginComponent: React.FC<LoginProps> = ({ onModeChange }) => {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [message, setMessage] = useState('');

//     const handleLogin = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsLoading(true);
//         setMessage('');

//         // 간단한 로그인 시뮬레이션
//         setTimeout(() => {
//             if (username === 'admin' && password === 'password') {
//                 setMessage('✅ 로그인 성공!');
//                 setTimeout(() => {
//                     onModeChange('launcher'); // 성공시 런처로 돌아가기
//                 }, 1000);
//             } else {
//                 setMessage('❌ 아이디 또는 비밀번호가 잘못되었습니다.');
//             }
//             setIsLoading(false);
//         }, 1500);
//     };

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen p-6"
//             style={{ backgroundColor: '#7c3aed' }}>
//             <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-sm">
//                 <div className="text-center mb-6">
//                     <h1 className="text-2xl font-bold text-gray-800 mb-2">
//                         🔐 로그인
//                     </h1>
//                     <p className="text-gray-600 text-sm">
//                         CTI Task Master 접속
//                     </p>
//                 </div>

//                 <form onSubmit={handleLogin} className="space-y-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             사용자명
//                         </label>
//                         <input
//                             type="text"
//                             value={username}
//                             onChange={(e) => setUsername(e.target.value)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                             placeholder="admin"
//                             required
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             비밀번호
//                         </label>
//                         <input
//                             type="password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                             placeholder="password"
//                             required
//                         />
//                     </div>

//                     <button
//                         type="submit"
//                         disabled={isLoading}
//                         className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
//                     >
//                         {isLoading ? '🔄 로그인 중...' : '🚀 로그인'}
//                     </button>
//                 </form>

//                 {message && (
//                     <div className={`mt-4 p-3 rounded-md text-sm text-center ${message.includes('성공')
//                             ? 'bg-green-100 text-green-700'
//                             : 'bg-red-100 text-red-700'
//                         }`}>
//                         {message}
//                     </div>
//                 )}

//                 <div className="mt-6 pt-4 border-t border-gray-200">
//                     <button
//                         onClick={() => onModeChange('launcher')}
//                         className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
//                     >
//                         🏠 런처로 돌아가기
//                     </button>
//                 </div>

//                 <div className="mt-4 text-xs text-gray-500 text-center">
//                     <p>테스트 계정:</p>
//                     <p>ID: admin / PW: password</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default LoginComponent;

// src/pages/LoginMode.tsx
import React, { useState } from 'react';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';

const LoginComponent: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        // 간단한 로그인 시뮬레이션
        setTimeout(async () => {
            if (username === 'admin' && password === 'password') {
                setMessage('✅ 로그인 성공!');
                setTimeout(async () => {
                    // 로그인 창 닫기
                    const currentWindow = getCurrentWebviewWindow();
                    await currentWindow.close();
                }, 1000);
            } else {
                setMessage('❌ 아이디 또는 비밀번호가 잘못되었습니다.');
            }
            setIsLoading(false);
        }, 1500);
    };

    const closeWindow = async () => {
        const currentWindow = getCurrentWebviewWindow();
        await currentWindow.close();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6"
            style={{ backgroundColor: '#7c3aed' }}>
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-sm">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        🔐 로그인
                    </h1>
                    <p className="text-gray-600 text-sm">
                        CTI Task Master 접속
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            사용자명
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="admin"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            비밀번호
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
                    >
                        {isLoading ? '🔄 로그인 중...' : '🚀 로그인'}
                    </button>
                </form>

                {message && (
                    <div className={`mt-4 p-3 rounded-md text-sm text-center ${message.includes('성공')
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                        {message}
                    </div>
                )}

                <div className="mt-6 pt-4 border-t border-gray-200">
                    <button
                        onClick={closeWindow}
                        className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                    >
                        ✖️ 창 닫기
                    </button>
                </div>

                <div className="mt-4 text-xs text-gray-500 text-center">
                    <p>테스트 계정:</p>
                    <p>ID: admin / PW: password</p>
                </div>
            </div>
        </div>
    );
};

export default LoginComponent;