import { GoogleGenAI, Type } from "@google/genai";
import { Piece, PlayerColor } from "../types";

// Ensure API_KEY is set in your environment variables for this to work.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });
const model = "gemini-2.5-flash";

export async function getFunFact(): Promise<string> {
    if (!API_KEY) {
        return "Did you know? Ludo originated from an ancient Indian game called Pachisi.";
    }
    
    try {
        const response = await ai.models.generateContent({
            model,
            contents: "Tell me a surprising or little-known fun fact about a classic board game like Ludo, Chess, or Monopoly. Make it sound exciting and keep it to one or two sentences.",
             config: {
                temperature: 1,
                topP: 0.95,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        return "Ludo boards were sometimes made of cloth in the past, making them easy to transport.";
    }
}

interface AIMoveParams {
    pieces: Piece[];
    movablePieces: string[];
    diceValue: number;
    playerColor: PlayerColor;
}

const basePrompt = (playerColor: PlayerColor, diceValue: number, pieces: Piece[], movablePieces: string[]) => `
    You are a Ludo AI expert. Based on the current game state, decide the best move.
    Your goal is to win by getting all your pieces to the final home position (position > 56).
    
    Current player color: ${playerColor}
    Dice roll: ${diceValue}

    Game state:
    - Piece positions: -1 is base, 0-51 is the main path, 52-57 is the home path for your color.
    - Your start position is ${playerColor === 'RED' ? 0 : playerColor === 'GREEN' ? 13 : playerColor === 'BLUE' ? 26 : 39}.
    - Your home entrance is at position ${playerColor === 'RED' ? 51 : playerColor === 'GREEN' ? 12 : playerColor === 'BLUE' ? 25 : 38}.
    - Safe positions (cannot be captured) are: 0, 8, 13, 21, 26, 34, 39, 47.

    All pieces on board: ${JSON.stringify(pieces.map(p => ({id: p.id, color: p.color, pos: p.position})))}
    Your movable pieces: ${JSON.stringify(movablePieces.map(id => {
        const piece = pieces.find(p => p.id === id);
        return {id: piece?.id, current_pos: piece?.position}
    }))}

    Analyze the situation. Consider these priorities:
    1.  Move a piece into the final home position (position 57).
    2.  Capture an opponent's piece if the move lands on their square (and it's not a safe spot).
    3.  Move a piece out of your base (from -1) if you rolled a 6.
    4.  Move a piece that is closest to entering your home path.
    5.  Avoid moving a piece off a safe spot if other moves are available.
`;

export async function getAIMove({ pieces, movablePieces, diceValue, playerColor }: AIMoveParams): Promise<{ pieceId: string, reason: string }> {
     if (!API_KEY) {
        console.warn("API_KEY not set, returning random AI move.");
        const pieceId = movablePieces[Math.floor(Math.random() * movablePieces.length)];
        return { pieceId, reason: "Random move." };
    }
    
    const prompt = basePrompt(playerColor, diceValue, pieces, movablePieces) + `
    Which piece should be moved? Your response must be ONLY the ID of the piece to move (e.g., 'RED-2'). Do not add any other text or explanation.`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
             config: { temperature: 0.2 }
        });
        const moveId = response.text.trim();

        if (movablePieces.includes(moveId)) {
            return { pieceId: moveId, reason: "Strategic decision." };
        } else {
            console.warn("Gemini returned an invalid move:", moveId, "Falling back.");
            return { pieceId: movablePieces[0], reason: "Fallback decision." };
        }
    } catch (error) {
        console.error("Gemini AI move generation failed:", error);
        const fallbackMove = movablePieces.sort((a,b) => pieces.find(p=>p.id===b)!.position - pieces.find(p=>p.id===a)!.position)[0];
        return { pieceId: fallbackMove, reason: "Error fallback." };
    }
}

export async function getAIHint({ pieces, movablePieces, diceValue, playerColor }: AIMoveParams): Promise<{ pieceId: string, reason: string }> {
    if (!API_KEY) {
        return { pieceId: movablePieces[0], reason: "Ludo is a game of luck and strategy!" };
    }
    
     const prompt = basePrompt(playerColor, diceValue, pieces, movablePieces) + `
    Which piece should the human player move? Respond in JSON format. Provide the 'pieceId' of the best move and a short, encouraging 'reason' (max 10 words) for why it's a good move.
    Example Response: {"pieceId": "RED-2", "reason": "This move captures an opponent's piece!"}`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        pieceId: { type: Type.STRING },
                        reason: { type: Type.STRING }
                    }
                }
            }
        });
        
        const jsonText = response.text.trim();
        const hint = JSON.parse(jsonText);
        
        if (hint.pieceId && hint.reason && movablePieces.includes(hint.pieceId)) {
            return hint;
        } else {
             console.warn("Gemini returned an invalid hint:", hint, "Falling back.");
            return { pieceId: movablePieces[0], reason: "Every move is a step towards victory." };
        }

    } catch (error) {
        console.error("Gemini AI hint generation failed:", error);
        return { pieceId: movablePieces[0], reason: "Sometimes the simplest move is best." };
    }
}