import React from 'react';
import { Theme } from '../types';

interface SettingsProps {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    soundEnabled: boolean;
    setSoundEnabled: (enabled: boolean) => void;
}

const themes: Theme[] = ['futuristic', 'classic', 'neon', 'fantasy'];

const Settings: React.FC<SettingsProps> = ({ theme, setTheme, soundEnabled, setSoundEnabled }) => {
    
    const cycleTheme = () => {
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex]);
    };

    const isFuturistic = theme === 'futuristic';

    return (
        <div className={`flex items-center gap-4 p-2 rounded-lg border ${isFuturistic ? 'bg-black/40 backdrop-blur-md border-cyan-500/30' : 'bg-gray-800/50 border-gray-700'}`}>
            <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`text-xl p-2 rounded-md transition-colors ${isFuturistic ? 'hover:bg-cyan-500/20' : 'hover:bg-gray-700'}`}
                aria-label={soundEnabled ? "Mute sound" : "Unmute sound"}
            >
                {soundEnabled ? '🔊' : '🔇'}
            </button>
             <button
                className={`text-xl p-2 rounded-md transition-colors ${isFuturistic ? 'hover:bg-cyan-500/20' : 'hover:bg-gray-700'}`}
                aria-label="Toggle music"
            >
                🎵
            </button>
             <button
                className={`text-xl p-2 rounded-md transition-colors ${isFuturistic ? 'hover:bg-cyan-500/20' : 'hover:bg-gray-700'}`}
                aria-label="Toggle notifications"
            >
                🔔
            </button>
            <div className="h-8 w-px bg-gray-600"></div>
            <div className="flex items-center gap-2">
                <span className="font-semibold text-sm hidden sm:inline">Theme:</span>
                <button
                    onClick={cycleTheme}
                    className={`px-3 py-1 rounded-md transition-colors text-sm font-bold w-24 capitalize ${isFuturistic ? 'bg-cyan-500/80 text-black hover:bg-cyan-400' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
                >
                    {theme}
                </button>
            </div>
        </div>
    );
};

export default Settings;