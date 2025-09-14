import React, { useState } from 'react';
import { Player, Piece, PlayerColor, Theme } from '../types';
import PieceComponent from './Piece';
import Dice from './Dice';
import PlayerInfo from './PlayerInfo';
import Chat from './Chat';
import Settings from './Settings';
import { BOARD_PATH_COORDINATES, HOME_PATH_COORDINATES, BASE_COORDINATES, SAFE_POSITIONS, START_POSITIONS, THEME_FUTURISTIC_COLORS } from '../constants';

interface GameBoardProps {
    players: Player[];
    pieces: Piece[];
    currentPlayer: Player;
    diceValue: number | null;
    isRolling: boolean;
    movablePieces: string[];
    onRollDice: () => void;
    onMovePiece: (pieceId: string) => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
    soundEnabled: boolean;
    setSoundEnabled: (enabled: boolean) => void;
    onUndo: () => void;
    canUndo: boolean;
    onGetHint: () => void;
    aiHint: { pieceId: string, reason: string } | null;
}

const GameBoard: React.FC<GameBoardProps> = (props) => {
    const { players, pieces, currentPlayer, diceValue, isRolling, movablePieces, onRollDice, onMovePiece, theme, setTheme, soundEnabled, setSoundEnabled, onUndo, canUndo, onGetHint, aiHint } = props;

    const [activeReactions, setActiveReactions] = useState<{id: number, reaction: string, playerId: number}[]>([]);

    const handleReaction = (reaction: string) => {
        const newReaction = { id: Date.now(), reaction, playerId: currentPlayer.id };
        setActiveReactions(prev => [...prev, newReaction]);
        setTimeout(() => {
            setActiveReactions(prev => prev.filter(r => r.id !== newReaction.id));
        }, 2000);
    };
    
    const isFuturistic = theme === 'futuristic';

    const renderBoardCells = () => {
        const cells = [];
        for (let i = 0; i < 52; i++) {
            const pos = BOARD_PATH_COORDINATES[i];
            const isSafe = SAFE_POSITIONS.includes(i);
            const isStart = Object.values(START_POSITIONS).includes(i);
            const startColor = Object.keys(START_POSITIONS).find(c => START_POSITIONS[c as PlayerColor] === i) as PlayerColor;

            cells.push(
                <div
                    key={`path-${i}`}
                    className={`absolute w-[6.66%] h-[6.66%] flex items-center justify-center transition-colors
                    ${isFuturistic ? 'border-t-2 border-[var(--futuristic-border)]' : 'border border-[var(--cell-border)] rounded-sm'}`}
                    style={{ top: pos.top, left: pos.left, transform: 'translate(-50%, -50%)' }}
                >
                    {isSafe && !isStart && <div className={`w-4 h-4 rounded-full ${isFuturistic ? '' : 'bg-white/20'} flex items-center justify-center text-xs`}>
                        {isFuturistic ? '🛡️' : theme === 'fantasy' ? '✧' : '*'}
                        </div>}
                    {isStart && <div className={`w-full h-full ${isFuturistic ? '' : 'rounded-sm'}`} style={{backgroundColor: isFuturistic ? `color-mix(in srgb, ${THEME_FUTURISTIC_COLORS[startColor].glowVar} 30%, transparent)` : `var(--bg-start-${startColor.toLowerCase()})`}} />}
                </div>
            );
        }

        players.forEach(player => {
            const homePathCoords = HOME_PATH_COORDINATES[player.color];
            for (let i = 52; i <= 57; i++) {
                const pos = homePathCoords[i];
                if (pos) {
                    cells.push(
                        <div
                            key={`home-${player.color}-${i}`}
                            className={`absolute w-[6.66%] h-[6.66%] ${isFuturistic ? 'border-t-2 border-opacity-50' : 'border border-[var(--cell-border)] rounded-sm'}`}
                            style={{ 
                                top: pos.top, left: pos.left, transform: 'translate(-50%, -50%)',
                                backgroundColor: isFuturistic ? `color-mix(in srgb, ${THEME_FUTURISTIC_COLORS[player.color].glowVar} 50%, transparent)` : `var(--bg-start-${player.color.toLowerCase()})`,
                                borderColor: isFuturistic ? THEME_FUTURISTIC_COLORS[player.color].glowVar : 'var(--cell-border)'
                            }}
                        ></div>
                    );
                }
            }
        });

        return cells;
    };

    const getPiecePosition = (piece: Piece) => {
        if (piece.position === -1) {
            const baseIndex = pieces.filter(p => p.color === piece.color && p.position === -1).findIndex(p => p.id === piece.id);
            return BASE_COORDINATES[piece.color][baseIndex];
        }
        if (piece.position >= 52 && piece.position <= 57) {
            return HOME_PATH_COORDINATES[piece.color][piece.position];
        }
        if (piece.position >= 0 && piece.position < 52) {
            return BOARD_PATH_COORDINATES[piece.position];
        }
        return { top: '50%', left: '50%' }; // Finished pieces
    };
    
    const p1 = players.find(p => p.color === 'BLUE');
    const p2 = players.find(p => p.color === 'YELLOW');
    const p3 = players.find(p => p.color === 'GREEN');
    const p4 = players.find(p => p.color === 'RED');

    return (
        <div className={`w-full h-screen p-4 grid grid-cols-5 grid-rows-4 gap-4 ${isFuturistic ? 'text-cyan-100' : ''}`}>
            {/* Header */}
            <header className="col-span-5 row-span-1 flex justify-between items-start">
                 <div className="flex items-center gap-4">
                     <h1 className={`text-4xl font-black ${isFuturistic ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400' : 'text-white'}`}>Ludo Ultimate</h1>
                 </div>
                 <Settings theme={theme} setTheme={setTheme} soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled} />
            </header>

            {/* Side Panels */}
            <aside className="col-span-1 row-span-2 flex flex-col justify-around relative">
                {p1 && <PlayerInfo player={p1} isCurrent={currentPlayer.id === p1.id} reactions={activeReactions.filter(r => r.playerId === p1.id)} theme={theme}/>}
                {p3 && <PlayerInfo player={p3} isCurrent={currentPlayer.id === p3.id} reactions={activeReactions.filter(r => r.playerId === p3.id)} theme={theme}/>}
            </aside>

            {/* Main Game Area */}
            <main className="col-span-3 row-span-3 flex items-center justify-center" style={{ perspective: isFuturistic ? '2000px' : 'none'}}>
                 <div className={`relative w-[700px] h-[700px] max-w-full max-h-full aspect-square transition-transform duration-1000 ${isFuturistic ? 'animate-board-enter' : ''}`}
                    style={{transformStyle: isFuturistic ? 'preserve-3d' : 'initial', transform: isFuturistic ? 'rotateX(55deg) rotateZ(45deg)' : 'none'}}>
                     
                    <div className={`w-full h-full rounded-2xl shadow-2xl border-4 aspect-square ${isFuturistic ? 'bg-black/50 border-[var(--futuristic-border)]' : 'bg-[var(--board-bg)] border-gray-700'}`}>
                        {renderBoardCells()}
                        {pieces.filter(p => !p.isHome).map(piece => (
                            <PieceComponent
                                key={piece.id}
                                piece={piece}
                                isMovable={movablePieces.includes(piece.id)}
                                onClick={onMovePiece}
                                positionStyle={getPiecePosition(piece)}
                                theme={theme}
                                isHinted={aiHint?.pieceId === piece.id}
                            />
                        ))}
                    </div>

                    <div className={`absolute top-1/2 left-1/2 z-20 ${isFuturistic ? '' : 'transform -translate-x-1/2 -translate-y-1/2'}`}
                        style={{transform: isFuturistic ? 'translate3d(-50%, -50%, 50px) rotateZ(-45deg) rotateX(-55deg)' : 'none' }}>
                        <Dice
                            value={diceValue}
                            isRolling={isRolling}
                            onClick={onRollDice}
                            isCurrentPlayerHuman={currentPlayer.type === 'human'}
                            theme={theme}
                        />
                    </div>
                </div>
            </main>

            <aside className="col-span-1 row-span-2 flex flex-col justify-around relative">
                 {p2 && <PlayerInfo player={p2} isCurrent={currentPlayer.id === p2.id} reactions={activeReactions.filter(r => r.playerId === p2.id)} theme={theme}/>}
                 {p4 && <PlayerInfo player={p4} isCurrent={currentPlayer.id === p4.id} reactions={activeReactions.filter(r => r.playerId === p4.id)} theme={theme}/>}
            </aside>
            
            {/* Game Controls & Ads */}
            <div className="col-start-2 col-span-3 row-start-4 flex justify-between items-end gap-4">
                <div className="flex gap-2">
                    <button onClick={onUndo} disabled={!canUndo} className="px-4 py-2 bg-gray-700/80 backdrop-blur-sm border border-gray-600 rounded-lg font-semibold hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
                        ↩️ Undo
                    </button>
                    <button onClick={onGetHint} disabled={currentPlayer.type !== 'human' || movablePieces.length === 0} className="px-4 py-2 bg-purple-600/80 backdrop-blur-sm border border-purple-400 rounded-lg font-semibold hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed">
                        💡 Hint
                    </button>
                </div>

                {/* Mock Ad Banner */}
                <div className="h-14 flex-grow bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 border border-gray-700">
                    Banner Ad - Go Premium to Remove!
                </div>

                 <button onClick={() => alert("Imagine you watched an ad and got a bonus roll!")} className="px-4 py-2 bg-yellow-500/80 backdrop-blur-sm border border-yellow-300 text-black rounded-lg font-semibold hover:bg-yellow-400">
                    ⭐️ Bonus Roll
                </button>
            </div>
             {aiHint && (
                 <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 p-4 bg-black/80 backdrop-blur-md border-2 border-purple-500 rounded-xl shadow-lg z-50 text-center animate-hint-reveal">
                    <h4 className="font-bold text-lg text-purple-300">💡 AI Suggestion</h4>
                    <p className="text-white mt-1">{aiHint.reason}</p>
                 </div>
             )}
        </div>
    );
};

export default GameBoard;