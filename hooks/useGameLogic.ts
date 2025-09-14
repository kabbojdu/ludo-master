import { useState, useCallback, useEffect } from 'react';
import { GameState, Player, Piece, PlayerColor, AIDifficulty, GameStats } from '../types';
import { PLAYER_COLORS, START_POSITIONS, HOME_ENTRANCE, SAFE_POSITIONS } from '../constants';
import { getAIMove } from '../services/geminiService';

const playSound = (sound: 'roll' | 'move' | 'capture' | 'win' | 'home') => {
    // In a real app, you would use an audio library like Howler.js
    // console.log(`Playing sound: ${sound}`);
};

interface GameHistory {
    pieces: Piece[];
    currentPlayerIndex: number;
    gameStats: GameStats;
}

export const useGameLogic = (onTriggerFunFact: () => void) => {
    const [gameState, setGameState] = useState<GameState>(GameState.MENU);
    const [players, setPlayers] = useState<Player[]>([]);
    const [pieces, setPieces] = useState<Piece[]>([]);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [diceValue, setDiceValue] = useState<number | null>(null);
    const [isRolling, setIsRolling] = useState(false);
    const [movablePieces, setMovablePieces] = useState<string[]>([]);
    const [winner, setWinner] = useState<PlayerColor | null>(null);
    const [gameStats, setGameStats] = useState<GameStats>({});
    const [history, setHistory] = useState<GameHistory[]>([]);

    const currentPlayer = players[currentPlayerIndex];
    const canUndo = history.length > 0;

    const resetGame = useCallback(() => {
        setGameState(GameState.MENU);
        setPlayers([]);
        setPieces([]);
        setCurrentPlayerIndex(0);
        setDiceValue(null);
        setIsRolling(false);
        setMovablePieces([]);
        setWinner(null);
        setGameStats({});
        setHistory([]);
    }, []);

    const initializeGame = useCallback((playerCount: number, aiCount: number, aiDifficulty: AIDifficulty = AIDifficulty.EASY, predefinedPlayers?: Player[]) => {
        let gamePlayers: Player[] = [];
        if (predefinedPlayers) {
            gamePlayers = predefinedPlayers;
        } else {
            const activeColors = PLAYER_COLORS.slice(0, playerCount + aiCount);
            for (let i = 0; i < playerCount; i++) {
                gamePlayers.push({ id: i, color: activeColors[i], name: `Player ${i + 1}`, type: 'human', avatar: `https://i.pravatar.cc/150?u=player${i}`, status: 'online' });
            }
            for (let i = 0; i < aiCount; i++) {
                const playerIndex = playerCount + i;
                gamePlayers.push({ id: playerIndex, color: activeColors[playerIndex], name: `AI ${i + 1}`, type: 'ai', difficulty: aiDifficulty, avatar: `https://i.pravatar.cc/150?u=ai${i}`, status: 'in-game' });
            }
        }
        setPlayers(gamePlayers);

        const stats: GameStats = {};
        gamePlayers.forEach(p => {
            stats[p.color] = { rolls: 0, sixes: 0, captures: 0 };
        });
        setGameStats(stats);

        const initialPieces: Piece[] = gamePlayers.flatMap(player =>
            Array.from({ length: 4 }, (_, i) => ({
                id: `${player.color}-${i}`,
                color: player.color,
                position: -1, // in base
                isHome: false,
            }))
        );
        setPieces(initialPieces);

        setCurrentPlayerIndex(0);
        setDiceValue(null);
        setGameState(GameState.PLAYING);
        setWinner(null);
        setMovablePieces([]);
        setHistory([]);
    }, []);

    const nextTurn = useCallback(() => {
        setDiceValue(null);
        setMovablePieces([]);
        setCurrentPlayerIndex(prev => (prev + 1) % players.length);
    }, [players.length]);
    
    const undoMove = useCallback(() => {
        if (history.length === 0) return;
        
        const lastState = history[history.length - 1];
        setPieces(lastState.pieces);
        setCurrentPlayerIndex(lastState.currentPlayerIndex);
        setGameStats(lastState.gameStats);
        
        setDiceValue(null);
        setMovablePieces([]);
        setHistory(prev => prev.slice(0, -1));

    }, [history]);

    const getMovablePiecesForRoll = useCallback((playerColor: PlayerColor, roll: number) => {
       const playerPieces = pieces.filter(p => p.color === playerColor && !p.isHome);
        const movable: string[] = [];

        playerPieces.forEach(piece => {
            if (piece.position === -1) {
                if (roll === 6) movable.push(piece.id);
            } else {
                const newPos = piece.position + roll;
                if (piece.position >= 52 && newPos <= 57) {
                    movable.push(piece.id);
                } else if (piece.position < 52) {
                     const homeEntrance = HOME_ENTRANCE[playerColor];
                    let isEnteringHome = false;
                     if (piece.color === PlayerColor.RED) {
                        isEnteringHome = piece.position <= homeEntrance && newPos > homeEntrance;
                     } else {
                        isEnteringHome = piece.position <= homeEntrance && newPos > homeEntrance && piece.position < START_POSITIONS[playerColor];
                     }
                      if (piece.position > homeEntrance) isEnteringHome = false;

                    if (isEnteringHome) {
                         const stepsIntoHome = (newPos - homeEntrance - 1);
                         if (52 + stepsIntoHome <= 57) movable.push(piece.id);
                    } else {
                         movable.push(piece.id);
                    }
                }
            }
        });
        
        const uniqueMovable = [...new Set(movable)];
        return uniqueMovable;
    }, [pieces]);


    const rollDice = useCallback(() => {
        if (isRolling || movablePieces.length > 0 || !currentPlayer) return;
        
        setIsRolling(true);
        playSound('roll');
        setTimeout(() => {
            const roll = Math.floor(Math.random() * 6) + 1;
            setDiceValue(roll);
            setIsRolling(false);

            setGameStats(prev => ({
                ...prev,
                [currentPlayer.color]: {
                    ...prev[currentPlayer.color],
                    rolls: prev[currentPlayer.color].rolls + 1,
                    sixes: roll === 6 ? prev[currentPlayer.color].sixes + 1 : prev[currentPlayer.color].sixes,
                }
            }));
            
            const possibleMoves = getMovablePiecesForRoll(currentPlayer.color, roll);

            if (possibleMoves.length > 0) {
                setMovablePieces(possibleMoves);
            } else {
                setTimeout(() => nextTurn(), 1000);
            }
             if (roll === 6) {
                onTriggerFunFact();
            }

        }, 700);
    }, [isRolling, movablePieces.length, getMovablePiecesForRoll, currentPlayer, nextTurn, onTriggerFunFact]);

    const movePiece = useCallback((pieceId: string) => {
        if (!movablePieces.includes(pieceId) || !diceValue || !currentPlayer) return;

        // Save current state for undo
        const currentState: GameHistory = { pieces, currentPlayerIndex, gameStats };
        setHistory(prev => [...prev.slice(-5), currentState]); // Keep last 5 states
        
        playSound('move');
        let tempGameStats = {...gameStats};

        setPieces(prevPieces => {
            let newPieces = [...prevPieces];
            const pieceIndex = newPieces.findIndex(p => p.id === pieceId);
            const piece = { ...newPieces[pieceIndex] };
            
            if (piece.position === -1 && diceValue === 6) {
                piece.position = START_POSITIONS[piece.color];
            } else if (piece.position !== -1) {
                 const newPos = piece.position + diceValue;
                if (piece.position >= 52) {
                    if (newPos <= 57) {
                        piece.position = newPos;
                        if(newPos === 57) {
                            piece.isHome = true;
                            playSound('home');
                        }
                    }
                } else {
                    const homeEntrance = HOME_ENTRANCE[piece.color];
                    let isEnteringHome = false;
                     if (piece.color === PlayerColor.RED) {
                         isEnteringHome = piece.position <= homeEntrance && newPos > homeEntrance;
                     } else {
                         isEnteringHome = piece.position <= homeEntrance && newPos > homeEntrance && piece.position < START_POSITIONS[piece.color];
                     }

                     if (piece.position > homeEntrance) isEnteringHome = false;

                    if (isEnteringHome) {
                        const stepsIntoHome = (newPos - homeEntrance - 1);
                        const homePos = 52 + stepsIntoHome;
                        piece.position = homePos;
                        if (homePos === 57) {
                            piece.isHome = true;
                            playSound('home');
                        }
                    } else {
                        piece.position = newPos % 52;
                    }
                }
            }
            
            newPieces[pieceIndex] = piece;

            if (piece.position < 52 && !SAFE_POSITIONS.includes(piece.position)) {
                let captured = false;
                newPieces = newPieces.map(otherPiece => {
                    if (otherPiece.color !== piece.color && otherPiece.position === piece.position) {
                        captured = true;
                        playSound('capture');
                        return { ...otherPiece, position: -1 };
                    }
                    return otherPiece;
                });
                if (captured) {
                     tempGameStats = {
                        ...tempGameStats,
                        [currentPlayer.color]: { ...tempGameStats[currentPlayer.color], captures: tempGameStats[currentPlayer.color].captures + 1 }
                    };
                    setGameStats(tempGameStats);
                    onTriggerFunFact();
                }
            }

            return newPieces;
        });

        if (diceValue !== 6) {
            setTimeout(() => nextTurn(), 500);
        } else {
            setDiceValue(null);
            setMovablePieces([]);
        }
    }, [movablePieces, diceValue, nextTurn, onTriggerFunFact, currentPlayer, pieces, currentPlayerIndex, gameStats]);

    useEffect(() => {
        if (!currentPlayer) return;
        const homePieces = pieces.filter(p => p.color === currentPlayer.color && p.isHome);
        if (homePieces.length === 4 && winner === null) {
            setWinner(currentPlayer.color);
            setGameState(GameState.GAME_OVER);
            playSound('win');
        }
    }, [pieces, currentPlayer, winner]);

    useEffect(() => {
        const performAIMove = async () => {
             if (gameState === GameState.PLAYING && currentPlayer?.type === 'ai' && !isRolling && movablePieces.length === 0 && !winner) {
                setTimeout(() => rollDice(), 1000);
            } else if (gameState === GameState.PLAYING && currentPlayer?.type === 'ai' && movablePieces.length > 0 && diceValue) {
                let bestMove = movablePieces[0];
                const difficulty = currentPlayer.difficulty;
                
                if (difficulty === AIDifficulty.HARD) {
                    try {
                        const moveData = await getAIMove({pieces, movablePieces, diceValue, playerColor: currentPlayer.color });
                        bestMove = moveData.pieceId;
                        if (!movablePieces.includes(bestMove)) {
                           bestMove = movablePieces[0];
                        }
                    } catch (e) {
                        console.error("AI move generation failed, falling back to medium", e);
                        bestMove = movablePieces.sort((a,b) => pieces.find(p=>p.id===b)!.position - pieces.find(p=>p.id===a)!.position)[0];
                    }
                } else if (difficulty === AIDifficulty.MEDIUM) {
                    bestMove = movablePieces.sort((a,b) => pieces.find(p=>p.id===b)!.position - pieces.find(p=>p.id===a)!.position)[0];
                }

                setTimeout(() => {
                    movePiece(bestMove);
                }, 1000);
            }
        };

        performAIMove();

    }, [gameState, currentPlayer, isRolling, movablePieces, rollDice, movePiece, winner, pieces, diceValue]);

    return {
        gameState,
        players,
        pieces,
        currentPlayer,
        diceValue,
        isRolling,
        movablePieces,
        winner,
        gameStats,
        canUndo,
        initializeGame,
        rollDice,
        movePiece,
        resetGame,
        undoMove,
    };
};