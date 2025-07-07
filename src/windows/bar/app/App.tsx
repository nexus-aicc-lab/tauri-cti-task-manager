import React from 'react'
import BarMode from '../component/BarMode';

interface Props {

}

const App = (props: Props) => {
    const handleModeChange = async (mode: 'launcher' | 'bar' | 'panel' | 'login' | 'settings') => {
        // Handle mode change logic here
        console.log('Mode changed to:', mode);
    };

    return (
        <BarMode />
    )
}

export default App
