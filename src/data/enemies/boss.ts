import { type Enemy } from "../../types/game";

export const BOSS_ENEMIES: Record<string, Enemy> = {
    "PIT_COMMANDER": {
        id: 999,
        name: "Pit Commander",
        maxHP: 60, // A beefy health pool for a small-number game
        stats: {
            str: 6,   // Hits hard!
            def: 4,   // Hard to scratch with a basic sword
            int: 2,
            agi: 8,   // Very fast—he will attack often
            lck: 3,
        },
        attackPattern: ["CLEAVE", "STOMP"],
        specialAttacks: [],
        description: "A towering demon clad in scorched obsidian armor.",
        statusEffects: []
    }
};