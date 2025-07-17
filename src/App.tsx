import React from 'react';
import LoginForm from './shared/ui/LoginForm/LoginForm';

const App: React.FC = () => {
    return (
        <div
            style={{
                minHeight: '80vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #00bcd4 0%, #008ba3 100%)',
                padding: '20px',
            }}
        >
            <div
                style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    padding: '40px 32px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    width: '60%',
                    maxWidth: '800px',
                    minWidth: '360px',
                    position: 'relative',
                }}
            >
                <LoginForm />
            </div>
        </div>
    );
};

export default App;