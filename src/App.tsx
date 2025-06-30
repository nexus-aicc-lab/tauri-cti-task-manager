import React from 'react';

const App: React.FC = () => {
    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>🚀 Tauri 멀티윈도우 개발 중...</h1>
            <p>각 윈도우별 독립 앱으로 이동 중입니다!</p>

            <div style={{ marginTop: '20px' }}>
                <h3>개발 중인 윈도우들:</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li>🎯 <a href="/launcher.html">런처 윈도우</a></li>
                    <li>📊 <a href="/bar.html">바 윈도우</a></li>
                    <li>📋 <a href="/panel.html">패널 윈도우</a></li>
                    <li>⚙️ <a href="/settings.html">설정 윈도우</a></li>
                    <li>🔐 <a href="/login.html">로그인 윈도우</a></li>
                </ul>
            </div>
        </div>
    );
};

export default App;
