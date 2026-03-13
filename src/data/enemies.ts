import { type Enemy } from "../types/game";

// This is your Master Encyclopedia of every enemy in the game.
// By using Record<string, Enemy>, TypeScript ensures every single entry perfectly matches your blueprint.
export const MASTER_ENEMIES: Record<string, Enemy> = {

"FOREST_SLIME": {
        id: 1,
        name: "Forest Slime",
        maxHP: 18,
        stats: {
            str: 2,
            def: 3, // Higher defense, harder to crack
            int: 0,
            agi: 1, // Very slow
            lck: 0,
        },
        attackPattern: [],
        specialAttacks: [],
        description: "A gelatinous blob that absorbs physical hits well.",
        statusEffects: []
    }
};