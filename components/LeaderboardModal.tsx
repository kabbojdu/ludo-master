import React from 'react';

interface LeaderboardModalProps {
    onClose: () => void;
}

const mockLeaderboard = [
    { rank: 1, name: 'LudoKing99', level: 87, winRate: '78%', avatar: 'https://i.pravatar.cc/150?u=LudoKing99' },
    { rank: 2, name: 'DiceMaster', level: 85, winRate: '75%', avatar: 'https://i.pravatar.cc/150?u=DiceMaster' },
    { rank: 3, name: 'You', level: 52, winRate: '62%', avatar: 'https://i.pravatar.cc/150?u=player0' },
    { rank: 4, name: 'StrategicAI', level: 99, winRate: '90%', avatar: 'https://i.pravatar.cc/150?u=ai' },
    { rank: 5, name: 'LuckyCharm', level: 48, winRate: '55%', avatar: 'https://i.pravatar.cc/150?u=LuckyCharm' },
    { rank: 6, name: 'RivalPlayer', level: 50, winRate: '58%', avatar: 'https://i.pravatar.cc/150?u=player1' },
    { rank: 7, name: 'Sixer', level: 45, winRate: '53%', avatar: 'https://i.pravatar.cc/150?u=Sixer' },
];

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-lg bg-gray-900/80 rounded-2xl border-2 border-indigo-500 shadow-2xl shadow-indigo-500/30">
                <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">🏆 Global Leaderboard</h2>
                    <button onClick={onClose} className="text-2xl text-gray-500 hover:text-white">&times;</button>
                </div>
                <div className="p-4 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-2">
                        {mockLeaderboard.sort((a,b) => a.rank - b.rank).map((player, index) => (
                             <div key={index} className={`flex items-center gap-4 p-3 rounded-lg ${player.name === 'You' ? 'bg-indigo-600/30 border-2 border-indigo-500' : 'bg-gray-800/50'}`}>
                                <span className="text-xl font-bold w-8 text-center text-gray-400">{player.rank}</span>
                                <img src={player.avatar} alt={player.name} className="w-12 h-12 rounded-full border-2 border-gray-600"/>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg text-white">{player.name}</h3>
                                    <p className="text-sm text-gray-400">Level {player.level}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-green-400">{player.winRate}</p>
                                    <p className="text-xs text-gray-500">Win Rate</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardModal;
