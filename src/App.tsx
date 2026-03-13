import { Arena } from "./components/ui/Arena";
import { type Character, type Enemy } from "./types/game";
// (You might need to adjust your import paths depending on your folder structure!)

export default function App() {
    // 1. DUMMY DATA GOES HERE
    const dummyPlayer: Character = {
        kingdom: "HUMAN",
        name: "Hero",
        maxHP: 100,
        maxMana: 15,
        stats: {
            str: 10,
            def: 5,
            int: 3,
            agi: 20,
            lck: 10,
        },
        equipped: {
            HEAD: null,
            BODY: null,
            BOOTS: null,
            WEAPON: null,
            NECKLACE: null,
            RING: null,
        },
        artifacts: [],
        inventory: [],
        statusEffects: []
    };

    const dummyEnemy: Enemy = {
        id: 1,
        name: "Goblin",
        maxHP: 80,
        maxMana: 5,
        stats: {
            str: 8,
            def: 3,
            int: 1,
            agi: 15,
            lck: 0,
        },
        attackPattern: [],
        specialAttacks: [],
        description: "A sneaky goblin that loves to cause trouble.",
        statusEffects: []
    };

    // 2. RENDER GOES HERE
    return (
        <div>
            <Arena player={dummyPlayer} enemy={dummyEnemy} />
        </div>
    );
}