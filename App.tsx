import React, { useState, useCallback, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import MainMenu from './components/MainMenu';
import Lobby from './components/Lobby';
import { GameMode, Player, AIDifficulty, Theme, Piece } from './types';
import { useGameLogic } from './hooks/useGameLogic';
import GameOverModal from './components/GameOverModal';
import { getFunFact, getAIHint } from './services/geminiService';
import FunFactToast from './components/FunFactToast';
import { PLAYER_COLORS } from './constants';
import DailyRewardModal from './components/DailyRewardModal';
import ProfileModal from './components/ProfileModal';
import FriendsModal from './components/FriendsModal';
import PremiumModal from './components/PremiumModal';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<'MENU' | 'LOBBY' | 'GAME'>('MENU');
    const [gameMode, setGameMode] = useState<GameMode | null>(null);
    const [funFact, setFunFact] = useState<string | null>(null);
    const [theme, setTheme] = useState<Theme>('futuristic');
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [lobbyPlayers, setLobbyPlayers] = useState<Player[]>([]);
    
    // New Modal States
    const [showDailyReward, setShowDailyReward] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showFriends, setShowFriends] = useState(false);
    const [showPremium, setShowPremium] = useState(false);

    // AI Hint State
    const [aiHint, setAiHint] = useState<{pieceId: string, reason: string} | null>(null);

    useEffect(() => {
        // Simulate checking for daily reward on app load
        const lastClaimed = localStorage.getItem('dailyRewardClaimed');
        const today = new Date().toDateString();
        if (lastClaimed !== today) {
            setShowDailyReward(true);
        }
    }, []);

    const handleClaimReward = () => {
        localStorage.setItem('dailyRewardClaimed', new Date().toDateString());
        setShowDailyReward(false);
    };

    const handleFunFact = useCallback(async () => {
        try {
            const fact = await getFunFact();
            setFunFact(fact);
            setTimeout(() => setFunFact(null), 7000);
        } catch (error) {
            console.error("Failed to fetch fun fact:", error);
        }
    }, []);

    const {
        players,
        pieces,
        currentPlayer,
        diceValue,
        isRolling,
        movablePieces,
        winner,
        gameStats,
        initializeGame,
        rollDice,
        movePiece,
        resetGame,
        undoMove,
        canUndo,
    } = useGameLogic(handleFunFact);
    
     const handleGetHint = useCallback(async () => {
        if (!currentPlayer || currentPlayer.type !== 'human' || movablePieces.length === 0 || !diceValue) return;
        try {
            const hint = await getAIHint({
                pieces,
                movablePieces,
                diceValue,
                playerColor: currentPlayer.color,
            });
            setAiHint(hint);
            setTimeout(() => setAiHint(null), 8000); // Hide hint after 8 seconds
        } catch (error) {
            console.error("Failed to get AI hint:", error);
        }
    }, [currentPlayer, pieces, movablePieces, diceValue]);

    const handleStartLobby = (mode: GameMode, playerCount: number, isHost: boolean) => {
        setGameMode(mode);
        const newLobbyPlayers: Player[] = [];
        newLobbyPlayers.push({ id: 0, color: PLAYER_COLORS[0], name: 'CyberPlayer', type: 'human', avatar: `https://i.pravatar.cc/150?u=player0`, status: 'online', isHost: true });
        
        for (let i = 1; i < playerCount; i++) {
             newLobbyPlayers.push({ id: i, color: PLAYER_COLORS[i], name: `Waiting...`, type: 'human', avatar: ``, status: 'offline', isReady: false });
        }
        setLobbyPlayers(newLobbyPlayers);
        setGameState('LOBBY');
    };
    
    const handleStartGameFromLobby = (lobbyPlayers: Player[]) => {
        const humanPlayers = lobbyPlayers.filter(p => p.type === 'human' && p.name !== 'Waiting...');
        const aiPlayers = lobbyPlayers.filter(p => p.type === 'ai');
        initializeGame(humanPlayers.length, aiPlayers.length, AIDifficulty.MEDIUM, humanPlayers.concat(aiPlayers));
        setGameState('GAME');
    };

    const handleStartLocalGame = (mode: GameMode, playerCount: number, aiCount: number, aiDifficulty?: AIDifficulty) => {
        setGameMode(mode);
        initializeGame(playerCount, aiCount, aiDifficulty);
        setGameState('GAME');
    };

    const handleExitToMenu = () => {
        resetGame();
        setGameState('MENU');
        setGameMode(null);
    };
    
    const handlePlayAgain = () => {
        if (gameMode) {
             const playerCount = players.filter(p => p.type === 'human').length;
             const aiCount = players.filter(p => p.type === 'ai').length;
             const aiDifficulty = players.find(p => p.type === 'ai')?.difficulty;
             initializeGame(playerCount, aiCount, aiDifficulty);
        }
    };

    const renderContent = () => {
        switch (gameState) {
            case 'LOBBY':
                return <Lobby 
                    players={lobbyPlayers} 
                    onStartGame={handleStartGameFromLobby}
                    onExitLobby={handleExitToMenu}
                    gameCode="XF42K"
                />;
            case 'GAME':
                const futuristicBg = `min-h-screen bg-fixed bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]`;
                const classicBg = `bg-gradient-to-br from-gray-900 to-black`;

                return (
                    <div className={`flex flex-col items-center justify-center p-4 font-sans theme-${theme} ${theme === 'futuristic' ? futuristicBg : classicBg}`}>
                        <GameBoard
                            players={players}
                            pieces={pieces}
                            currentPlayer={currentPlayer}
                            diceValue={diceValue}
                            isRolling={isRolling}
                            movablePieces={movablePieces}
                            onRollDice={rollDice}
                            onMovePiece={movePiece}
                            theme={theme}
                            setTheme={setTheme}
                            soundEnabled={soundEnabled}
                            setSoundEnabled={setSoundEnabled}
                            onUndo={undoMove}
                            canUndo={canUndo && gameMode !== GameMode.ONLINE_MULTIPLAYER}
                            onGetHint={handleGetHint}
                            aiHint={aiHint}
                        />
                        {winner && (
                            <GameOverModal
                                winner={winner}
                                gameStats={gameStats}
                                onPlayAgain={handlePlayAgain}
                                onGoToMenu={handleExitToMenu}
                            />
                        )}
                        {funFact && <FunFactToast fact={funFact} />}
                    </div>
                );
            case 'MENU':
            default:
                return (
                    <>
                        <MainMenu 
                            onStartLocalGame={handleStartLocalGame} 
                            onStartLobby={handleStartLobby}
                            onShowProfile={() => setShowProfile(true)}
                            onShowFriends={() => setShowFriends(true)}
                            onShowPremium={() => setShowPremium(true)}
                        />
                        {showDailyReward && <DailyRewardModal onClose={() => setShowDailyReward(false)} onClaim={handleClaimReward} />}
                        {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
                        {showFriends && <FriendsModal onClose={() => setShowFriends(false)} />}
                        {showPremium && <PremiumModal onClose={() => setShowPremium(false)} />}
                    </>
                );
        }
    };
    
    return renderContent();
};

export default App;