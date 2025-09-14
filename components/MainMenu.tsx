import React, { useState } from 'react';
import { GameMode, AIDifficulty } from '../types';
import LeaderboardModal from './LeaderboardModal';

interface MainMenuProps {
    onStartLocalGame: (mode: GameMode, playerCount: number, aiCount: number, aiDifficulty?: AIDifficulty) => void;
    onStartLobby: (mode: GameMode, playerCount: number, isHost: boolean) => void;
    onShowProfile: () => void;
    onShowFriends: () => void;
    onShowPremium: () => void;
}

type MenuState = 'MAIN' | 'ONLINE' | 'LOCAL';

const MainMenu: React.FC<MainMenuProps> = ({ onStartLocalGame, onStartLobby, onShowProfile, onShowFriends, onShowPremium }) => {
    const [menuState, setMenuState] = useState<MenuState>('MAIN');
    const [localPlayers, setLocalPlayers] = useState(2);
    const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>(AIDifficulty.MEDIUM);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [joinCode, setJoinCode] = useState('');

    const handleStartSinglePlayer = () => {
        onStartLocalGame(GameMode.SINGLE_PLAYER, 1, 1, aiDifficulty);
    };

    const handleStartLocalMultiplayer = () => {
        onStartLocalGame(GameMode.LOCAL_MULTIPLAYER, localPlayers, 0);
    };
    
    const MenuButton: React.FC<{onClick?: () => void; children: React.ReactNode; active?: boolean; disabled?: boolean; variant?: 'primary' | 'secondary' | 'accent'}> = 
        ({onClick, children, active, disabled, variant = 'primary'}) => {
            const styles = {
                primary: 'bg-cyan-500 border-cyan-300 hover:bg-cyan-400 shadow-lg shadow-cyan-500/50 text-black',
                secondary: 'bg-black/30 border-purple-500/50 hover:bg-purple-900/40 hover:border-purple-400',
                accent: 'bg-purple-600 border-purple-400 hover:bg-purple-500 shadow-lg shadow-purple-500/50'
            };
        return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full text-lg font-bold py-4 px-6 rounded-lg transition-all duration-300 border-2 text-white transform hover:scale-105
            ${disabled ? 'bg-gray-600 border-gray-500 opacity-50 cursor-not-allowed' : styles[variant] }`}
        >
            {children}
        </button>
    )};

    const renderMainScreen = () => (
        <>
            <h1 className="text-6xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400 tracking-tighter">
                LUDO ULTIMATE
            </h1>
            <p className="text-cyan-200/70 mb-8 font-semibold">F U T U R E     E D I T I O N</p>
            <div className="space-y-4">
                <MenuButton onClick={() => setMenuState('ONLINE')} variant="primary">
                    <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">🌎 Online Multiplayer</span>
                </MenuButton>
                <MenuButton onClick={() => setMenuState('LOCAL')} variant="secondary">
                    🛋️ Local Game
                </MenuButton>
                 <div className="grid grid-cols-2 gap-4 pt-4">
                    <MenuButton onClick={() => setShowLeaderboard(true)} variant="secondary">🏆 Leaderboard</MenuButton>
                    <MenuButton onClick={onShowProfile} variant="secondary">👤 Profile</MenuButton>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <MenuButton onClick={onShowFriends} variant="secondary">👥 Friends</MenuButton>
                    <MenuButton onClick={() => alert("Tournaments coming soon!")} variant="secondary">⚔️ Tournaments</MenuButton>
                </div>
                <button onClick={onShowPremium} className="mt-4 text-yellow-300 font-bold hover:text-yellow-200 transition-colors">
                    ✨ Go Premium!
                </button>
            </div>
        </>
    );

    const renderOnlineScreen = () => (
        <>
            <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">Online Multiplayer</h2>
            <div className="space-y-4">
                <MenuButton onClick={() => onStartLobby(GameMode.ONLINE_MULTIPLAYER, 4, true)} variant="accent">
                    ➕ Create Private Game
                </MenuButton>
                 <div className="flex gap-2">
                    <input 
                        type="text"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                        placeholder="ENTER CODE"
                        maxLength={5}
                        className="flex-grow bg-black/50 border-2 border-purple-500/50 rounded-lg px-4 py-3 text-lg font-bold text-center tracking-widest text-cyan-200"
                    />
                    <MenuButton onClick={() => joinCode.length === 5 ? alert(`Joining game ${joinCode}...`) : alert("Please enter a 5-digit code.")} disabled={!joinCode} variant="accent">
                        Join
                    </MenuButton>
                </div>
                 <MenuButton onClick={() => alert("Finding a ranked match!")} variant="primary">
                    <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">🔍 Find Ranked Match</span>
                </MenuButton>
                <MenuButton onClick={() => alert("Finding a casual match!")} variant="secondary">
                    Find Casual Match
                </MenuButton>
                <button onClick={() => setMenuState('MAIN')} className="text-cyan-300/70 hover:text-white pt-4">
                    &larr; Back
                </button>
            </div>
        </>
    );
    
    const renderLocalScreen = () => (
         <>
            <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">Local Game</h2>
            <div className="space-y-6">
                 <div>
                     <h3 className="font-semibold text-lg mb-3">Single Player (vs AI)</h3>
                     <div className="p-4 bg-black/30 rounded-lg">
                        <label className="block mb-3 font-semibold text-cyan-200/80">AI Difficulty</label>
                        <div className="flex justify-center space-x-2">
                            {Object.values(AIDifficulty).map(diff => (
                                <button key={diff} onClick={() => setAiDifficulty(diff)} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all duration-300 border-2 ${aiDifficulty === diff ? 'bg-green-600 border-green-400 text-white shadow-lg shadow-green-600/30' : 'bg-gray-700/50 border-gray-600 hover:bg-gray-600'}`}>
                                    {diff} {diff === 'HARD' ? '✨' : ''}
                                </button>
                            ))}
                        </div>
                     </div>
                     <MenuButton onClick={handleStartSinglePlayer} variant="accent">Start vs AI</MenuButton>
                 </div>
                 <div>
                    <h3 className="font-semibold text-lg mb-3">Local Multiplayer (Pass & Play)</h3>
                     <div className="p-4 bg-black/30 rounded-lg">
                        <label className="block mb-3 font-semibold text-cyan-200/80">Number of Players</label>
                        <div className="flex justify-center space-x-4">
                            {[2, 3, 4].map(num => (
                                <button key={num} onClick={() => setLocalPlayers(num)} className={`w-16 h-16 text-2xl font-bold rounded-full transition-all duration-300 border-2 ${localPlayers === num ? 'bg-purple-500 border-purple-400 text-white shadow-lg shadow-purple-500/50' : 'bg-gray-700/50 border-gray-600 hover:bg-gray-600'}`}>
                                    {num}
                                </button>
                            ))}
                        </div>
                     </div>
                     <MenuButton onClick={handleStartLocalMultiplayer} variant="accent">Start Local Game</MenuButton>
                 </div>
                 <button onClick={() => setMenuState('MAIN')} className="text-cyan-300/70 hover:text-white pt-4">
                    &larr; Back
                </button>
            </div>
        </>
    )

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-fixed bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] p-4">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            <div className="w-full max-w-md bg-black/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-purple-500/50 text-center relative z-10">
                {menuState === 'MAIN' && renderMainScreen()}
                {menuState === 'ONLINE' && renderOnlineScreen()}
                {menuState === 'LOCAL' && renderLocalScreen()}
            </div>
            {showLeaderboard && <LeaderboardModal onClose={() => setShowLeaderboard(false)} />}
        </div>
    );
};

export default MainMenu;