import React from 'react';
import { Theme } from '../types';

interface DiceProps {
    value: number | null;
    isRolling: boolean;
    onClick: () => void;
    isCurrentPlayerHuman: boolean;
    theme: Theme;
}

const DiceFace: React.FC<{ value: number, theme: Theme }> = ({ value, theme }) => {
    const dotPositions: { [key: number]: string[] } = {
        1: ['center'],
        2: ['top-left', 'bottom-right'],
        3: ['top-left', 'center', 'bottom-right'],
        4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
        5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
        6: ['top-left', 'top-right', 'mid-left', 'mid-right', 'bottom-left', 'bottom-right'],
    };

    const positionClasses: { [key: string]: string } = {
        'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
        'top-left': 'top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2',
        'top-right': 'top-1/4 right-1/4 translate-x-1/2 -translate-y-1/2',
        'bottom-left': 'bottom-1/4 left-1/4 -translate-x-1/2 translate-y-1/2',
        'bottom-right': 'bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2',
        'mid-left': 'top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2',
        'mid-right': 'top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2',
    };
    
    const dotColor = theme === 'futuristic' ? `bg-cyan-300 shadow-[0_0_8px_#00d4ff]` : 'bg-white';

    return (
        <div className="w-full h-full relative" style={{ transform: 'translateZ(32px)'}}>
            {dotPositions[value].map(pos => (
                <div key={pos} className={`absolute w-3 h-3 ${dotColor} rounded-full ${positionClasses[pos]}`}></div>
            ))}
        </div>
    );
};


const Dice: React.FC<DiceProps> = ({ value, isRolling, onClick, isCurrentPlayerHuman, theme }) => {
    const canClick = !isRolling && isCurrentPlayerHuman;

    const themeClasses = {
        'classic': 'bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-gray-600',
        'neon': 'bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-gray-600',
        'fantasy': 'bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-500',
        'futuristic': 'bg-black/40 backdrop-blur-sm border-2 border-cyan-500/50',
    }[theme];

    return (
        <div style={{ perspective: '1000px' }}>
            <button
                onClick={onClick}
                disabled={!canClick}
                className={`w-16 h-16 rounded-lg shadow-2xl transition-transform duration-200 transform-style-preserve-3d
                    ${canClick ? 'cursor-pointer hover:scale-110 active:scale-100' : 'cursor-wait'}
                    ${isRolling ? 'animate-roll' : ''}
                    ${themeClasses}`}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {value && !isRolling ? <DiceFace value={value} theme={theme} /> : <div className={`text-lg font-bold flex items-center justify-center h-full ${theme === 'futuristic' ? 'text-cyan-200' : 'text-white'}`}>Roll</div>}
            </button>
        </div>
    );
};

export default Dice;