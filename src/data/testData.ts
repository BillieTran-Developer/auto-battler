// src/data/testData.ts
import { type Character, type Enemy, type Skill } from "../types/game";
import { HUMAN_KNIGHT_ITEMS } from "./equipment/human_kingdom_equipment";

const heavySmash: Skill = {
    id: "skill_heavy_smash",
    name: "Heavy Smash",
    description: "A brutal, slow swing.",
    type: "PHYSICAL",
    targetMode: "SINGLE",
    powerMultiplier: 1.5,
    manaCost: 0,
    cooldownTicks: 40,
    currentCooldown: 0,
    animationSpeed: 1000
};

export const TEST_PLAYER: Character = {
    kingdom: "HUMAN",
    name: "Hero",
    maxHP: 100,
    maxMana: 15,
    stats: { str: 10, def: 6, int: 3, agi: 20, lck: 10 },
    equipped: {
        HEAD: HUMAN_KNIGHT_ITEMS.VANGUARD_GREATHELM,
        BODY: HUMAN_KNIGHT_ITEMS.VANGUARD_PLATE,
        BOOTS: HUMAN_KNIGHT_ITEMS.VANGUARD_GREAVES,
        WEAPON: HUMAN_KNIGHT_ITEMS.VANGUARD_BASTION,
        NECKLACE: null,
        RING: null,
    },
    equippedSkills: [],
    artifacts: [],
    // A few unequipped items so the inventory grid has something to show
    inventory: [
        HUMAN_KNIGHT_ITEMS.HALO_OF_RADIANCE,
        HUMAN_KNIGHT_ITEMS.SANCTIFIED_PLATE,
        HUMAN_KNIGHT_ITEMS.HALLOWED_GREAVES,
        HUMAN_KNIGHT_ITEMS.SUN_SLAYER_MACE,
        HUMAN_KNIGHT_ITEMS.PIT_FIGHTERS_MASK,
        HUMAN_KNIGHT_ITEMS.TWIN_TIGER_BLADES,
        HUMAN_KNIGHT_ITEMS.ARENA_SANDALS,
        HUMAN_KNIGHT_ITEMS.CHAMPIONS_HARNESS,
    ],
    statusEffects: []
};

export const TEST_ENEMIES: Enemy[] = [
    {
        id: 1,
        name: "Goblin Grunt",
        maxHP: 80,
        maxMana: 5,
        stats: { str: 8, def: 3, int: 1, agi: 15, lck: 0 },
        attackPattern: [],
        specialAttacks: [],
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
        specialAttacks: [heavySmash],
        description: "A massive goblin wielding a club.",
        statusEffects: []
    }
];