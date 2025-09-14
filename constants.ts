import { PlayerColor, PathCoordinates } from './types';

export const PLAYER_COLORS: PlayerColor[] = [PlayerColor.RED, PlayerColor.GREEN, PlayerColor.BLUE, PlayerColor.YELLOW];

export const THEME_COLORS: { [key in PlayerColor]: { bg: string; border: string; text: string, shadow: string, glowVar: string } } = {
    [PlayerColor.RED]: { bg: 'bg-red-500', border: 'border-red-300', text: 'text-red-400', shadow: 'shadow-[0_0_20px_rgba(239,68,68,0.9)]', glowVar: 'var(--glow-red)'},
    [PlayerColor.GREEN]: { bg: 'bg-green-500', border: 'border-green-300', text: 'text-green-400', shadow: 'shadow-[0_0_20px_rgba(34,197,94,0.9)]', glowVar: 'var(--glow-green)'},
    [PlayerColor.BLUE]: { bg: 'bg-blue-500', border: 'border-blue-300', text: 'text-blue-400', shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.9)]', glowVar: 'var(--glow-blue)'},
    [PlayerColor.YELLOW]: { bg: 'bg-yellow-500', border: 'border-yellow-300', text: 'text-yellow-400', shadow: 'shadow-[0_0_20px_rgba(234,179,8,0.9)]', glowVar: 'var(--glow-yellow)'},
};

export const THEME_FANTASY_COLORS: { [key in PlayerColor]: { bg: string; border: string; text: string, shadow: string, glowVar: string } } = {
    [PlayerColor.RED]: { bg: 'bg-rose-600', border: 'border-rose-400', text: 'text-rose-300', shadow: 'shadow-[0_0_20px_rgba(225,29,72,0.9)]', glowVar: '#e11d48'},
    [PlayerColor.GREEN]: { bg: 'bg-emerald-600', border: 'border-emerald-400', text: 'text-emerald-300', shadow: 'shadow-[0_0_20px_rgba(5,150,105,0.9)]', glowVar: '#059669'},
    [PlayerColor.BLUE]: { bg: 'bg-sky-600', border: 'border-sky-400', text: 'text-sky-300', shadow: 'shadow-[0_0_20px_rgba(2,132,199,0.9)]', glowVar: '#0284c7'},
    [PlayerColor.YELLOW]: { bg: 'bg-amber-500', border: 'border-amber-300', text: 'text-amber-300', shadow: 'shadow-[0_0_20px_rgba(245,158,11,0.9)]', glowVar: '#f59e0b'},
};

export const THEME_FUTURISTIC_COLORS: { [key in PlayerColor]: { bg: string; border: string; text: string, shadow: string, glowVar: string } } = {
    [PlayerColor.RED]: { bg: 'bg-[#ff3b6a]', border: 'border-[#ff7895]', text: 'text-[#ff3b6a]', shadow: 'shadow-[0_0_20px_#ff3b6a]', glowVar: 'var(--futuristic-red)'},
    [PlayerColor.GREEN]: { bg: 'bg-[#00f5a0]', border: 'border-[#6bffc9]', text: 'text-[#00f5a0]', shadow: 'shadow-[0_0_20px_#00f5a0]', glowVar: 'var(--futuristic-green)'},
    [PlayerColor.BLUE]: { bg: 'bg-[#00d4ff]', border: 'border-[#7ceaff]', text: 'text-[#00d4ff]', shadow: 'shadow-[0_0_20px_#00d4ff]', glowVar: 'var(--futuristic-blue)'},
    [PlayerColor.YELLOW]: { bg: 'bg-[#ffc900]', border: 'border-[#ffe16b]', text: 'text-[#ffc900]', shadow: 'shadow-[0_0_20px_#ffc900]', glowVar: 'var(--futuristic-yellow)'},
};

export const START_POSITIONS: { [key in PlayerColor]: number } = {
    [PlayerColor.RED]: 0,
    [PlayerColor.GREEN]: 13,
    [PlayerColor.BLUE]: 26,
    [PlayerColor.YELLOW]: 39,
};

export const HOME_ENTRANCE: { [key in PlayerColor]: number } = {
    [PlayerColor.RED]: 51,
    [PlayerColor.GREEN]: 12,
    [PlayerColor.BLUE]: 25,
    [PlayerColor.YELLOW]: 38,
};

export const SAFE_POSITIONS: number[] = [0, 8, 13, 21, 26, 34, 39, 47];

export const BOARD_PATH_COORDINATES: PathCoordinates = {
    // Red path
    0: { top: '60%', left: '93.33%' }, 1: { top: '60%', left: '86.66%' }, 2: { top: '60%', left: '80%' }, 3: { top: '60%', left: '73.33%' }, 4: { top: '60%', left: '66.66%' },
    5: { top: '66.66%', left: '60%' }, 6: { top: '73.33%', left: '60%' }, 7: { top: '80%', left: '60%' }, 8: { top: '86.66%', left: '60%' }, 9: { top: '93.33%', left: '60%' },
    10: { top: '93.33%', left: '53.33%' }, 11: { top: '93.33%', left: '46.66%' }, 12: { top: '86.66%', left: '46.66%' },
    // Green path
    13: { top: '93.33%', left: '40%' }, 14: { top: '86.66%', left: '40%' }, 15: { top: '80%', left: '40%' }, 16: { top: '73.33%', left: '40%' }, 17: { top: '66.66%', left: '40%' },
    18: { top: '60%', left: '33.33%' }, 19: { top: '60%', left: '26.66%' }, 20: { top: '60%', left: '20%' }, 21: { top: '60%', left: '13.33%' }, 22: { top: '60%', left: '6.66%' },
    23: { top: '53.33%', left: '6.66%' }, 24: { top: '46.66%', left: '6.66%' }, 25: { top: '46.66%', left: '13.33%' },
    // Blue path
    26: { top: '40%', left: '6.66%' }, 27: { top: '40%', left: '13.33%' }, 28: { top: '40%', left: '20%' }, 29: { top: '40%', left: '26.66%' }, 30: { top: '40%', left: '33.33%' },
    31: { top: '33.33%', left: '40%' }, 32: { top: '26.66%', left: '40%' }, 33: { top: '20%', left: '40%' }, 34: { top: '13.33%', left: '40%' }, 35: { top: '6.66%', left: '40%' },
    36: { top: '6.66%', left: '46.66%' }, 37: { top: '6.66%', left: '53.33%' }, 38: { top: '13.33%', left: '53.33%' },
    // Yellow path
    39: { top: '6.66%', left: '60%' }, 40: { top: '13.33%', left: '60%' }, 41: { top: '20%', left: '60%' }, 42: { top: '26.66%', left: '60%' }, 43: { top: '33.33%', left: '60%' },
    44: { top: '40%', left: '66.66%' }, 45: { top: '40%', left: '73.33%' }, 46: { top: '40%', left: '80%' }, 47: { top: '40%', left: '86.66%' }, 48: { top: '40%', left: '93.33%' },
    49: { top: '46.66%', left: '93.33%' }, 50: { top: '53.33%', left: '93.33%' }, 51: { top: '53.33%', left: '86.66%' },
};

export const HOME_PATH_COORDINATES: { [key in PlayerColor]: PathCoordinates } = {
    [PlayerColor.RED]: {
        52: { top: '53.33%', left: '86.66%' }, 53: { top: '53.33%', left: '80%' }, 54: { top: '53.33%', left: '73.33%' }, 55: { top: '53.33%', left: '66.66%' }, 56: { top: '53.33%', left: '60%' }, 57: { top: '53.33%', left: '53.33%' },
    },
    [PlayerColor.GREEN]: {
        52: { top: '86.66%', left: '46.66%' }, 53: { top: '80%', left: '46.66%' }, 54: { top: '73.33%', left: '46.66%' }, 55: { top: '66.66%', left: '46.66%' }, 56: { top: '60%', left: '46.66%' }, 57: { top: '53.33%', left: '46.66%' },
    },
    [PlayerColor.BLUE]: {
        52: { top: '46.66%', left: '13.33%' }, 53: { top: '46.66%', left: '20%' }, 54: { top: '46.66%', left: '26.66%' }, 55: { top: '46.66%', left: '33.33%' }, 56: { top: '46.66%', left: '40%' }, 57: { top: '46.66%', left: '46.66%' },
    },
    [PlayerColor.YELLOW]: {
        52: { top: '13.33%', left: '53.33%' }, 53: { top: '20%', left: '53.33%' }, 54: { top: '26.66%', left: '53.33%' }, 55: { top: '33.33%', left: '53.33%' }, 56: { top: '40%', left: '53.33%' }, 57: { top: '46.66%', left: '53.33%' },
    },
};

export const BASE_COORDINATES: { [key in PlayerColor]: { top: string; left: string }[] } = {
    [PlayerColor.RED]: [ { top: '73.33%', left: '73.33%' }, { top: '73.33%', left: '86.66%' }, { top: '86.66%', left: '73.33%' }, { top: '86.66%', left: '86.66%' } ],
    [PlayerColor.GREEN]: [ { top: '73.33%', left: '13.33%' }, { top: '73.33%', left: '26.66%' }, { top: '86.66%', left: '13.33%' }, { top: '86.66%', left: '26.66%' } ],
    [PlayerColor.BLUE]: [ { top: '13.33%', left: '13.33%' }, { top: '13.33%', left: '26.66%' }, { top: '26.66%', left: '13.33%' }, { top: '26.66%', left: '26.66%' } ],
    [PlayerColor.YELLOW]: [ { top: '13.33%', left: '73.33%' }, { top: '13.33%', left: '86.66%' }, { top: '26.66%', left: '73.33%' }, { top: '26.66%', left: '86.66%' } ],
};