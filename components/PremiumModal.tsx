import React from 'react';

interface PremiumModalProps {
    onClose: () => void;
}

const PremiumFeature: React.FC<{ icon: string; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="flex items-start gap-4">
        <div className="text-3xl text-cyan-300">{icon}</div>
        <div>
            <h4 className="font-bold text-white">{title}</h4>
            <p className="text-sm text-gray-400">{description}</p>
        </div>
    </div>
);

const PremiumModal: React.FC<PremiumModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
             <div className="w-full max-w-md bg-gradient-to-br from-gray-900 to-purple-900/70 rounded-2xl border-2 border-purple-500 shadow-2xl shadow-purple-500/30 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-white">&times;</button>
                
                <div className="p-8 text-center">
                    <h2 className="text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400">
                       ✨ GO PREMIUM ✨
                    </h2>
                    <p className="text-yellow-200/80 mb-8">Unlock the Ultimate Ludo Experience!</p>

                    <div className="space-y-6 text-left mb-8">
                        <PremiumFeature icon="🚫" title="Ad-Free Gameplay" description="Enjoy an uninterrupted, immersive experience with zero ads." />
                        <PremiumFeature icon="🎨" title="Exclusive Themes" description="Access premium-only board themes, including seasonal and special event designs." />
                        <PremiumFeature icon="뱃" title="Unique Profile Badge" description="Show off your premium status with a special badge on your profile." />
                        <PremiumFeature icon="🎁" title="Bonus Daily Rewards" description="Receive extra rewards every day you log in to the game." />
                    </div>
                    
                    <button className="w-full bg-yellow-500 text-black font-bold py-4 px-6 rounded-lg text-xl hover:bg-yellow-400 transition-transform duration-200 transform hover:scale-105 shadow-lg shadow-yellow-500/40">
                        Subscribe Now - $4.99/month
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PremiumModal;
