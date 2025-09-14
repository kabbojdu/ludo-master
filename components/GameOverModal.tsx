import React from 'react';
import { PlayerColor, GameStats } from '../types';
import { THEME_COLORS } from '../constants';

interface GameOverModalProps {
    winner: PlayerColor;
    gameStats: GameStats;
    onPlayAgain: () => void;
    onGoToMenu: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ winner, gameStats, onPlayAgain, onGoToMenu }) => {
    const colorTheme = THEME_COLORS[winner];
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className={`bg-gray-900/80 rounded-2xl p-8 text-center border-4 ${colorTheme.border} shadow-2xl ${colorTheme.shadow} w-full max-w-md mx-auto`}>
                <h2 className="text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Game Over!</h2>
                <p className={`text-2xl font-semibold ${colorTheme.text} mb-6`}>
                    Player {winner} is the winner!
                </p>

                <div className="bg-gray-800/50 p-4 rounded-lg mb-6 text-left">
                    <h3 className="font-bold text-lg mb-2 text-white">Match Stats</h3>
                    <div className="space-y-2 text-sm">
                        {Object.entries(gameStats).map(([color, stats]) => (
                             <div key={color} className={`flex justify-between items-center p-2 rounded ${THEME_COLORS[color as PlayerColor].text.replace('text-', 'bg-').replace('400', '900/50')}`}>
                                <span className={`font-bold ${THEME_COLORS[color as PlayerColor].text}`}>{color}</span>
                                <div className="flex gap-4">
                                    <span>Rolls: {stats.rolls}</span>
                                    <span>Sixes: {stats.sixes}</span>
                                    <span>Captures: {stats.captures}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col space-y-4">
                    <button
                        onClick={onPlayAgain}
                        className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-indigo-500 transition-transform duration-200 transform hover:scale-105 shadow-lg shadow-indigo-600/30"
                    >
                        Play Again
                    </button>
                    <button
                        onClick={onGoToMenu}
                        className="bg-gray-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-gray-500 transition-transform duration-200 transform hover:scale-105"
                    >
                        Main Menu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameOverModal;
