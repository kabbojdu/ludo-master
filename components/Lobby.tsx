import React, { useState, useEffect } from 'react';
import { Player, PlayerColor } from '../types';
import { THEME_FUTURISTIC_COLORS } from '../constants';

interface LobbyProps {
    players: Player[];
    onStartGame: (players: Player[]) => void;
    onExitLobby: () => void;
    gameCode: string;
}

const LobbyPlayerCard: React.FC<{ player: Player; isHost: boolean }> = ({ player, isHost }) => {
    const colorTheme = THEME_FUTURISTIC_COLORS[player.color];
    const isEmpty = player.name === 'Waiting...';

    return (
        <div className={`p-4 rounded-xl border-2 ${isEmpty ? 'border-dashed border-purple-500/30' : `${colorTheme.border} bg-black/40 backdrop-blur-md`} flex items-center justify-between`}>
            {isEmpty ? (
                 <div className="flex items-center gap-3 text-gray-500">
                    <div className="w-12 h-12 rounded-full bg-gray-700/50"></div>
                    <span>Waiting for player...</span>
                 </div>
            ) : (
                <>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <img src={player.avatar} alt={player.name} className={`w-12 h-12 rounded-full border-2 ${colorTheme.border}`} style={{backgroundColor: colorTheme.bg}}/>
                            {isHost && <span className="absolute -top-1 -left-1 text-lg">👑</span>}
                        </div>
                        <div>
                            <h3 className={`text-lg font-bold ${colorTheme.text} truncate`}>{player.name}</h3>
                            <p className="text-xs text-gray-400">{isHost ? 'Host' : 'Player'}</p>
                        </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${player.isReady ? 'bg-green-500/80 text-white' : 'bg-gray-600 text-gray-300'}`}>
                        {player.isReady ? 'Ready' : 'Not Ready'}
                    </div>
                </>
            )}
        </div>
    );
};


const Lobby: React.FC<LobbyProps> = ({ players: initialPlayers, onStartGame, onExitLobby, gameCode }) => {
    const [players, setPlayers] = useState(initialPlayers);
    
    // Simulate other players joining and getting ready
    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];
        timers.push(setTimeout(() => {
            setPlayers(p => p.map((player, i) => i === 1 ? {...player, name: 'RivalPlayer', status: 'online', avatar: 'https://i.pravatar.cc/150?u=player1' } : player));
        }, 1500));
        
        timers.push(setTimeout(() => {
             setPlayers(p => p.map((player, i) => i === 1 ? {...player, isReady: true } : player));
        }, 3000));
        
         timers.push(setTimeout(() => {
             setPlayers(p => p.map((player, i) => i === 0 ? {...player, isReady: true } : player));
        }, 500));

        return () => timers.forEach(clearTimeout);
    }, []);

    const isHost = players[0]?.isHost ?? false;
    const allReady = players.filter(p => p.name !== 'Waiting...').every(p => p.isReady);
    const canStart = isHost && allReady && players.filter(p => p.name !== 'Waiting...').length >= 2;
    
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-fixed bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            <div className="relative z-10 w-full max-w-2xl bg-black/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-purple-500/50">
                <h1 className="text-4xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">Game Lobby</h1>
                <p className="text-center text-cyan-200/70 mb-6">Waiting for players to get ready...</p>

                <div className="space-y-3 mb-6">
                    {players.map((p, index) => (
                         <LobbyPlayerCard key={p.id} player={p} isHost={p.id === 0} />
                    ))}
                </div>

                <div className="bg-black/40 p-4 rounded-lg text-center mb-6 border border-purple-500/30">
                    <h3 className="text-gray-400 font-semibold">SHARE GAME CODE</h3>
                    <p className="text-4xl font-bold tracking-[0.3em] text-cyan-200">{gameCode}</p>
                </div>

                <div className="flex gap-4">
                    <button onClick={onExitLobby} className="flex-1 text-lg font-bold py-4 px-6 rounded-lg transition-all duration-300 border-2 text-white bg-black/30 border-purple-500/50 hover:bg-purple-900/40">
                        Leave Lobby
                    </button>
                    <button 
                        onClick={() => onStartGame(players)} 
                        disabled={!canStart}
                        className={`flex-1 text-lg font-bold py-4 px-6 rounded-lg transition-all duration-300 border-2 text-black transform
                        ${!canStart ? 'bg-gray-600 border-gray-500 opacity-50 cursor-not-allowed' : 'bg-cyan-500 border-cyan-300 hover:bg-cyan-400 shadow-lg shadow-cyan-500/50 hover:scale-105'}`}
                    >
                        {isHost ? 'Start Game' : (players[0]?.isReady ? 'Waiting for Host...' : 'Ready Up')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Lobby;