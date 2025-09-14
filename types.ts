export enum PlayerColor {
    RED = 'RED',
    GREEN = 'GREEN',
    BLUE = 'BLUE',
    YELLOW = 'YELLOW',
}

export enum GameState {
    MENU = 'MENU',
    LOBBY = 'LOBBY',
    PLAYING = 'PLAYING',
    GAME_OVER = 'GAME_OVER',
}

export enum GameMode {
    SINGLE_PLAYER = 'SINGLE_PLAYER',
    LOCAL_MULTIPLAYER = 'LOCAL_MULTIPLAYER',
    ONLINE_MULTIPLAYER = 'ONLINE_MULTIPLAYER',
}

export enum AIDifficulty {
    EASY = 'EASY',
    MEDIUM = 'MEDIUM',
    HARD = 'HARD',
}

export type Theme = 'classic' | 'neon' | 'fantasy' | 'futuristic';

export interface Player {
    id: number;
    color: PlayerColor;
    name: string;
    type: 'human' | 'ai';
    difficulty?: AIDifficulty;
    avatar: string;
    status: 'online' | 'offline' | 'in-game' | 'reconnecting';
    isHost?: boolean;
    isReady?: boolean;
}

export interface Piece {
    id: string;
    color: PlayerColor;
    position: number; // -1 for base, 0-51 for path, 52-57 for home run, 100 for finished
    isHome: boolean;
}

export interface PathCoordinates {
    [key: number]: { top: string; left: string };
}

export interface GameStats {
    [key: string]: { // PlayerColor as key
        rolls: number;
        sixes: number;
        captures: number;
    }
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    unlocked: boolean;
    icon: string;
}

export interface PlayerProfile {
    name: string;
    avatar: string;
    level: number;
    xp: number;
    stats: {
        gamesPlayed: number;
        wins: number;
        winRate: string;
        captures: number;
    };
    achievements: Achievement[];
    matchHistory: {
        id: string;
        result: 'win' | 'loss';
        opponent: string;
        date: string;
    }[];
}