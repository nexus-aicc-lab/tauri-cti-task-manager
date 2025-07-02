// // src/windows/settings/app/App.tsx
// import React from 'react';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // ✅ FSD Pages 가져오기
// import MainPage from '../pages/MainPage';

// const App: React.FC = () => {
//     console.log('⚙️ 설정 윈도우 앱 시작 (FSD 구조)');

//     return (
//         <div
//             style={{
//                 backgroundColor: '#f5f5f5',
//                 minHeight: '100vh',
//                 width: '100%',
//                 overflow: 'hidden',
//             }}
//         >
//             {/* ✅ MainPage 컴포넌트 사용 */}
//             <MainPage />

//             {/* Toast UI */}
//             <ToastContainer
//                 position="top-center"
//                 autoClose={2000}
//                 closeOnClick
//                 pauseOnHover
//                 theme="light"
//             />
//         </div>
//     );
// };

// export default App;

// src/windows/settings/app/App.tsx
import React from 'react';
import { RouterProvider } from '@tanstack/react-router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { router } from './router';


const App: React.FC = () => {
    console.log('⚙️ 설정 윈도우 앱 시작 (FSD 구조 + TanStack Router)');

    return (
        <div
            style={{
                backgroundColor: '#f5f5f5',
                minHeight: '100vh',
                width: '100%',
                overflow: 'hidden',
            }}
        >
            <RouterProvider router={router} />

            {/* Toast UI */}
            <ToastContainer
                position="top-center"
                autoClose={2000}
                closeOnClick
                pauseOnHover
                theme="light"
            />
        </div>
    );
};

export default App;