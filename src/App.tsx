import { Arena } from "./components/ui/Arena";
import { type Character, type Enemy, type Skill } from "./types/game";

// A quick dummy skill to test your Enemy AI!
const heavySmash: Skill = {
    id: "skill_heavy_smash",
    name: "Heavy Smash",
    description: "A brutal, slow swing.",
    type: "PHYSICAL",
    targetMode: "SINGLE",
    powerMultiplier: 1.5, // 150% damage!
    manaCost: 0,
    cooldownTicks: 40,    // 4 second cooldown
    currentCooldown: 0,
    animationSpeed: 1000
};

export default function App() {
    // 1. DUMMY PLAYER
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
        equippedSkills: [], // <--- ADDED THIS! Since it is empty, it will trigger Desperate Struggle!
        artifacts: [],
        inventory: [],
        statusEffects: []
    };

    // 2. DUMMY ENEMY SQUAD (Array)
    const dummyEnemies: Enemy[] = [
        {
            id: 1,
            name: "Goblin Grunt",
            maxHP: 80,
            maxMana: 5,
            stats: { str: 8, def: 3, int: 1, agi: 15, lck: 0 },
            attackPattern: [],
            specialAttacks: [], // Grunt just does basic attacks
            description: "A sneaky goblin with a rusty dagger.",
            statusEffects: []
        },
        {
            id: 2,
            name: "Goblin Archer",
            maxHP: 60,
            maxMana: 5,
            stats: { str: 12, def: 2, int: 1, agi: 22, lck: 5 }, 
            attackPattern: [],
            specialAttacks: [],
            description: "A fragile but quick goblin with a bow.",
            statusEffects: []
        },
        {
            id: 3,
            name: "Goblin Brute",
            maxHP: 120,
            maxMana: 5,
            stats: { str: 15, def: 6, int: 1, agi: 8, lck: 0 }, 
            attackPattern: [],
            specialAttacks: [heavySmash], // <--- ADDED THIS! The brute will now use Heavy Smash!
            description: "A massive goblin wielding a club.",
            statusEffects: []
        }
    ];

    // 3. RENDER THE ARENA
    return (
        <div style={{ padding: "40px", backgroundColor: "#121212", minHeight: "100vh" }}>
            <Arena player={dummyPlayer} enemies={dummyEnemies} />
        </div>
    );
}