import React from 'react';

interface ChatProps {
    onReact: (reaction: string) => void;
}

const Chat: React.FC<ChatProps> = ({ onReact }) => {
    const quickReactions = ['😂', '👍', '🔥', '😭', '🤯', '🤔'];

    return (
        <div className="w-full h-24 bg-gray-800/50 backdrop-blur-md rounded-t-lg border-t border-l border-r border-gray-700 p-2 flex flex-col">
            <div className="flex-1 text-xs text-gray-400 overflow-y-auto">
                <p><span className="font-bold text-red-400">Player 1:</span> Good luck everyone!</p>
                <p><span className="font-bold text-green-400">AI 1:</span> Calculating optimal victory path...</p>
                 <p><span className="font-bold text-blue-400">Player 2:</span> Here we go! Let's see who gets lucky.</p>
            </div>
            <div className="flex gap-2 mt-1 items-center">
                <input
                    type="text"
                    placeholder="Type a message... (Coming Soon)"
                    disabled
                    className="flex-1 bg-gray-900/70 border border-gray-600 rounded-md px-2 py-1.5 text-sm text-white placeholder-gray-500 cursor-not-allowed"
                />
                <div className="flex items-center gap-1">
                    {quickReactions.map(r => (
                        <button key={r} onClick={() => onReact(r)} className="p-1 rounded-md hover:bg-gray-700 transition-colors text-lg">{r}</button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Chat;