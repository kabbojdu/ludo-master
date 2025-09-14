import React, { useState, useEffect } from 'react';
import { Piece, Theme } from '../types';
import { THEME_COLORS, THEME_FANTASY_COLORS, THEME_FUTURISTIC_COLORS } from '../constants';

interface PieceProps {
    piece: Piece;
    isMovable: boolean;
    onClick: (pieceId: string) => void;
    positionStyle: { top: string; left: string };
    theme: Theme;
    isHinted: boolean;
}

const PieceComponent: React.FC<PieceProps> = ({ piece, isMovable, onClick, positionStyle, theme, isHinted }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    
    const getColorSet = () => {
        if (theme === 'fantasy') return THEME_FANTASY_COLORS;
        if (theme === 'futuristic') return THEME_FUTURISTIC_COLORS;
        return THEME_COLORS;
    }
    const colorTheme = getColorSet()[piece.color];

    useEffect(() => {
        setIsAnimating(true);
        const timer = setTimeout(() => setIsAnimating(false), 500); // Duration of the hop animation
        return () => clearTimeout(timer);
    }, [positionStyle]);

    const baseStyle = "w-full h-full flex items-center justify-center border-2 shadow-lg relative";
    const shapeStyle = {
        'classic': 'rounded-full',
        'neon': 'rounded-full',
        'fantasy': '',
        'futuristic': 'rounded-t-full rounded-b-full',
    }[theme];
    
    const movableStyle = isMovable ? `cursor-pointer z-30 ${theme === 'futuristic' ? 'scale-150' : 'scale-125'}` : '';

    const fantasyClipPath = { clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' };
    
    const futuristicBaseStyle = {
        background: `linear-gradient(to top, color-mix(in srgb, ${colorTheme.glowVar} 60%, black), ${colorTheme.glowVar})`,
        height: '130%', // Make it taller for 3D effect
        boxShadow: `0 5px 15px 0 ${colorTheme.glowVar}66`,
    };

    return (
        <div
            className={`absolute w-[5.5%] h-[5.5%] cursor-pointer transition-all duration-500 ease-in-out transform -translate-x-1/2 -translate-y-1/2 z-10 ${isAnimating ? 'animate-hop' : ''}`}
            style={{ ...positionStyle, transition: 'top 0.5s ease-in-out, left 0.5s ease-in-out' }}
            onClick={() => isMovable && onClick(piece.id)}
        >
            <div
                className={`${baseStyle} ${colorTheme.bg} ${colorTheme.border} ${shapeStyle} ${movableStyle}`}
                 style={{
                    background: theme !== 'futuristic' ? `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5), transparent), ${colorTheme.bg.startsWith('bg-') ? '' : colorTheme.bg}` : 'transparent',
                    ...(theme === 'fantasy' && fantasyClipPath),
                    ...(theme === 'futuristic' && futuristicBaseStyle)
                 }}
            >
                {theme === 'futuristic' && (
                    <>
                        {/* Top surface highlight */}
                        <div className={`absolute top-0 w-full h-1/2 rounded-t-full`} style={{ background: `radial-gradient(ellipse at center top, rgba(255,255,255,0.7), transparent 70%)`}}></div>
                        {/* Core glow */}
                        <div className="w-1/2 h-1/2 rounded-full bg-white/50 blur-md"></div>
                    </>
                )}

                {theme !== 'futuristic' && (
                    <div className={`w-3/4 h-3/4 bg-black/20 shadow-inner ${shapeStyle}`} style={theme === 'fantasy' ? fantasyClipPath : {}}></div>
                )}
                
                {(isMovable || isHinted) && (
                    <div 
                        className={`absolute -inset-0.5 pulse-glow ${shapeStyle}`}
                        style={{
                            '--glow-color': isHinted ? '#8b5cf6' : colorTheme.glowVar,
                            animationDuration: isHinted ? '0.8s' : '1.5s',
                             ...(theme === 'fantasy' && fantasyClipPath),
                             ...(theme === 'futuristic' && { borderRadius: '9999px' })
                        } as React.CSSProperties}
                    ></div>
                )}
            </div>
        </div>
    );
};

export default PieceComponent;