import React, { useState } from 'react';
import { PlayerProfile, Achievement } from '../types';

interface ProfileModalProps {
    onClose: () => void;
}

const mockProfile: PlayerProfile = {
    name: 'CyberPlayer',
    avatar: 'https://i.pravatar.cc/150?u=player0',
    level: 52,
    xp: 75,
    stats: {
        gamesPlayed: 128,
        wins: 79,
        winRate: '61.7%',
        captures: 215,
    },
    achievements: [
        { id: 'first_win', name: 'First Victory', description: 'Win your first game', unlocked: true, icon: '🏆' },
        { id: 'capture_10', name: 'Hunter', description: 'Capture 10 pieces', unlocked: true, icon: '🎯' },
        { id: 'six_master', name: 'Six Master', description: 'Roll three 6s in a row', unlocked: false, icon: '🎲' },
        { id: 'all_home', name: 'Home Run!', description: 'Get all your pieces home', unlocked: true, icon: '🏠' },
    ],
    matchHistory: [
        { id: 'm1', result: 'win', opponent: 'DiceMaster', date: '1h ago' },
        { id: 'm2', result: 'loss', opponent: 'RivalPlayer', date: '3h ago' },
        { id: 'm3', result: 'win', opponent: 'LuckyCharm', date: 'Yesterday' },
    ]
};

const StatCard: React.FC<{label: string; value: string | number}> = ({ label, value }) => (
    <div className="bg-black/30 p-3 rounded-lg text-center border border-purple-500/30">
        <div className="text-2xl font-bold text-cyan-300">{value}</div>
        <div className="text-xs text-gray-400">{label}</div>
    </div>
);

const ProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState<'stats' | 'achievements' | 'history'>('stats');

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
             <div className="w-full max-w-2xl bg-gray-900/90 rounded-2xl border-2 border-purple-500 shadow-2xl shadow-purple-500/30">
                <div className="p-6 border-b border-gray-700 flex flex-col items-center gap-4 relative">
                     <button onClick={onClose} className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-white">&times;</button>
                     <img src={mockProfile.avatar} alt={mockProfile.name} className="w-24 h-24 rounded-full border-4 border-cyan-400 shadow-lg shadow-cyan-400/50" />
                     <div>
                        <h2 className="text-3xl font-bold text-white text-center">{mockProfile.name}</h2>
                        <div className="text-center text-yellow-400 font-semibold">Level {mockProfile.level}</div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                            <div className="bg-cyan-400 h-2.5 rounded-full" style={{width: `${mockProfile.xp}%`}}></div>
                        </div>
                     </div>
                </div>

                <div className="flex justify-center border-b border-gray-700">
                    <button onClick={() => setActiveTab('stats')} className={`px-6 py-3 font-semibold ${activeTab === 'stats' ? 'text-cyan-300 border-b-2 border-cyan-300' : 'text-gray-400'}`}>Stats</button>
                    <button onClick={() => setActiveTab('achievements')} className={`px-6 py-3 font-semibold ${activeTab === 'achievements' ? 'text-cyan-300 border-b-2 border-cyan-300' : 'text-gray-400'}`}>Achievements</button>
                    <button onClick={() => setActiveTab('history')} className={`px-6 py-3 font-semibold ${activeTab === 'history' ? 'text-cyan-300 border-b-2 border-cyan-300' : 'text-gray-400'}`}>History</button>
                </div>

                <div className="p-6 max-h-[40vh] overflow-y-auto">
                    {activeTab === 'stats' && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard label="Games Played" value={mockProfile.stats.gamesPlayed} />
                            <StatCard label="Wins" value={mockProfile.stats.wins} />
                            <StatCard label="Win Rate" value={mockProfile.stats.winRate} />
                            <StatCard label="Captures" value={mockProfile.stats.captures} />
                        </div>
                    )}
                    {activeTab === 'achievements' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {mockProfile.achievements.map(ach => (
                                <div key={ach.id} className={`flex items-center gap-4 p-3 rounded-lg ${ach.unlocked ? 'bg-green-900/50' : 'bg-gray-800/50 opacity-60'}`}>
                                    <div className="text-3xl">{ach.icon}</div>
                                    <div>
                                        <h4 className="font-bold text-white">{ach.name}</h4>
                                        <p className="text-sm text-gray-400">{ach.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {activeTab === 'history' && (
                         <div className="space-y-2">
                            {mockProfile.matchHistory.map(match => (
                                 <div key={match.id} className={`flex justify-between items-center p-3 rounded-lg ${match.result === 'win' ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                                     <div>
                                        <span className={`font-bold text-lg ${match.result === 'win' ? 'text-green-400' : 'text-red-400'}`}>{match.result.toUpperCase()}</span>
                                        <span className="text-gray-400"> vs {match.opponent}</span>
                                     </div>
                                    <div className="text-sm text-gray-500">{match.date}</div>
                                 </div>
                            ))}
                         </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
