import React from 'react';
import { Player, Theme } from '../types';
import { THEME_COLORS, THEME_FANTASY_COLORS, THEME_FUTURISTIC_COLORS } from '../constants';

interface PlayerInfoProps {
    player: Player;
    isCurrent: boolean;
    reactions: {id: number, reaction: string}[];
    theme: Theme;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ player, isCurrent, reactions, theme }) => {
    const getColorSet = () => {
        if (theme === 'fantasy') return THEME_FANTASY_COLORS;
        if (theme === 'futuristic') return THEME_FUTURISTIC_COLORS;
        return THEME_COLORS;
    }
    const colorTheme = getColorSet()[player.color];
    
    const statusColor = player.status === 'online' ? 'bg-green-500' : player.status === 'in-game' ? 'bg-yellow-500' : player.status === 'reconnecting' ? 'bg-orange-500 animate-pulse' : 'bg-gray-500';
    const isFuturistic = theme === 'futuristic';

    return (
        <div className={`p-3 rounded-xl border-2 transition-all duration-300 relative overflow-hidden ${isCurrent ? `${colorTheme.border} ${colorTheme.shadow}` : (isFuturistic ? 'border-[var(--futuristic-border)]' : 'border-gray-700')} ${isFuturistic ? 'bg-black/40 backdrop-blur-md' : 'bg-gray-800/80 backdrop-blur-sm'}`}>
             {reactions.map(r => (
                <div key={r.id} className="absolute top-0 left-1/2 text-4xl animate-float-up pointer-events-none z-20">
                    {r.reaction}
                </div>
            ))}
            <div className="flex items-center gap-3">
                <div className="relative">
                    <img src={player.avatar} alt={player.name} className={`w-12 h-12 rounded-full border-2 ${colorTheme.border} ${player.status === 'offline' ? 'grayscale' : ''}`} style={{backgroundColor: colorTheme.bg.startsWith('bg-') ? '' : colorTheme.bg}}/>
                    <span className={`absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full ${statusColor} border-2 ${isFuturistic ? 'border-gray-900' : 'border-gray-800'}`}></span>
                </div>
                <div className="flex-1">
                    <h3 className={`text-lg font-bold ${colorTheme.text} truncate`}>{player.name}</h3>
                    <p className="text-xs text-gray-400">
                        {player.status === 'reconnecting' 
                            ? 'Reconnecting...' 
                            : (player.type === 'ai' ? `AI (${player.difficulty})` : 'Human')}
                    </p>
                </div>
            </div>
            {isCurrent && <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/80 rounded-full animate-pulse" style={{backgroundColor: isFuturistic ? colorTheme.glowVar : ''}}></div>}
        </div>
    );
};

export default PlayerInfo;