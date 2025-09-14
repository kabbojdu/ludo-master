import React from 'react';

interface FunFactToastProps {
    fact: string;
}

const FunFactToast: React.FC<FunFactToastProps> = ({ fact }) => {
    return (
        <div className="fixed bottom-5 right-5 max-w-sm bg-gray-900/70 backdrop-blur-lg text-white p-4 rounded-xl shadow-2xl border-2 border-indigo-500/50 z-50">
            <h4 className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">AI Fun Fact! ✨</h4>
            <p className="text-sm text-gray-300 mt-1">{fact}</p>
        </div>
    );
};

export default FunFactToast;
