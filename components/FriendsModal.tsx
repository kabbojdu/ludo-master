import React from 'react';

interface FriendsModalProps {
    onClose: () => void;
}

const mockFriends = [
    { name: 'DiceMaster', status: 'online', avatar: 'https://i.pravatar.cc/150?u=DiceMaster' },
    { name: 'RivalPlayer', status: 'in-game', avatar: 'https://i.pravatar.cc/150?u=player1' },
    { name: 'LuckyCharm', status: 'offline', avatar: 'https://i.pravatar.cc/150?u=LuckyCharm' },
    { name: 'Sixer', status: 'offline', avatar: 'https://i.pravatar.cc/150?u=Sixer' },
];

const FriendRow: React.FC<{friend: typeof mockFriends[0]}> = ({ friend }) => {
    const statusClasses = {
        online: 'bg-green-500 text-green-100',
        'in-game': 'bg-yellow-500 text-yellow-100',
        offline: 'bg-gray-500 text-gray-200',
    };
    return (
        <div className="flex items-center gap-4 p-3 rounded-lg bg-black/20">
            <img src={friend.avatar} alt={friend.name} className={`w-12 h-12 rounded-full border-2 ${friend.status === 'offline' ? 'border-gray-600 grayscale' : 'border-green-400'}`} />
            <div className="flex-1">
                <h3 className="font-bold text-lg text-white">{friend.name}</h3>
            </div>
            <div className="flex items-center gap-4">
                 <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusClasses[friend.status as keyof typeof statusClasses]}`}>
                    {friend.status.replace('-', ' ')}
                </span>
                <button className="px-3 py-1 bg-purple-600 rounded-md text-sm font-semibold hover:bg-purple-500 disabled:bg-gray-600" disabled={friend.status !== 'online'}>
                    Invite
                </button>
            </div>
        </div>
    );
};

const FriendsModal: React.FC<FriendsModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
             <div className="w-full max-w-lg bg-gray-900/90 rounded-2xl border-2 border-purple-500 shadow-2xl shadow-purple-500/30">
                <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">👥 Friends</h2>
                    <button onClick={onClose} className="text-2xl text-gray-500 hover:text-white">&times;</button>
                </div>
                <div className="p-4">
                     <div className="flex gap-2 mb-4">
                        <input type="text" placeholder="Enter Friend ID..." className="flex-1 bg-black/50 border-2 border-purple-500/50 rounded-lg px-4 py-2 text-cyan-200" />
                        <button className="px-4 py-2 bg-purple-600 rounded-lg font-semibold hover:bg-purple-500">Add</button>
                    </div>
                </div>
                <div className="p-4 max-h-[50vh] overflow-y-auto">
                    <div className="space-y-2">
                       {mockFriends.map(friend => <FriendRow key={friend.name} friend={friend} />)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FriendsModal;
