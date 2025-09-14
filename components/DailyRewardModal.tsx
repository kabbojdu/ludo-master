import React from 'react';

interface DailyRewardModalProps {
    onClose: () => void;
    onClaim: () => void;
}

const DailyRewardModal: React.FC<DailyRewardModalProps> = ({ onClose, onClaim }) => {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-sm bg-gradient-to-br from-gray-900 to-purple-900/70 rounded-2xl border-2 border-purple-500 shadow-2xl shadow-purple-500/30 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-white">&times;</button>
                
                <div className="p-8 text-center">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">
                        Daily Reward!
                    </h2>
                    <p className="text-cyan-200/80 mb-6">Come back tomorrow for another prize!</p>

                    <div className="text-7xl mb-6 animate-pulse">🎁</div>
                    
                    <p className="text-lg font-semibold text-white mb-1">You've received:</p>
                    <p className="text-xl font-bold text-yellow-300 mb-8">1x Bonus Roll Token</p>
                    
                    <button 
                        onClick={onClaim}
                        className="w-full bg-cyan-500 text-black font-bold py-3 px-6 rounded-lg text-lg hover:bg-cyan-400 transition-transform duration-200 transform hover:scale-105 shadow-lg shadow-cyan-500/40"
                    >
                        Claim Reward
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DailyRewardModal;
