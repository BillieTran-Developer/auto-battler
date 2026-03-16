// Kingdoms
export type Kingdom = "HUMAN" | "ELF" | "DWARF" | "DEMON";
// Items
export type Rarity = "COMMON" | "RARE" | "LEGENDARY";
// EquipmentSlots
export type Slot = "HEAD" | "BODY" | "BOOTS" | "WEAPON" | "NECKLACE" | "RING";

export interface Artifact {
    id: number;
    name: string;
    description: string;
    effect: string;
}
// Classes
export type HumanClass = "KNIGHT" | "BARBARIAN" | "MAGE";
export type ElfClass = "ARCHER" | "DRUID" | "DARK_ELF";
export type DwarfClass = null; // Placeholder for future Dwarf classes

// Master BaseClass Bucket
export type BaseClass = HumanClass | ElfClass | DwarfClass | "GENERAL" | null;

// SubClasses
export type HumanSubClass = "KNIGHT" | "PALADIN" | "GLADIATOR" | "BERSERKER" | "CHIEFTAIN" | "SHAMAN" | "MAGE" | "ALCHEMIST" | "NECROMANCER";
export type ElfSubClass = "ARCHER" | null; // Placeholder for future elves sub classes
export type DwarfSubClass = null; // Placeholder for future Dwarf sub classes

// Master SubClass Bucket (Added GENERAL here too)
export type SubClass = HumanSubClass | ElfSubClass | DwarfSubClass | "ALL" | null; 


export interface Character {
    kingdom: Kingdom;
    name: string;
    maxHP: number;
    maxMana: number;
    stats: {
        str: number;
        def: number;
        int: number;
        agi: number;
        lck: number;
    };
    equipped: Record<Slot, Equipment | null>;
    artifacts: Artifact[];
    inventory: Equipment[];
    equippedSkills: Skill[];
    statusEffects: any[];
}

export interface Equipment {
  id: number;
  kingdom: Kingdom | "GENERAL";
  rarity: Rarity;
  name: string;
  slot: Slot;
  baseClass: BaseClass; // Use the new Master Bucket!
  subClass: SubClass;
  stats: { 
    hp?: number;
    mana?: number;
    str?: number; 
    pierce?: number;
    def?: number;
    int?: number;
    agi?: number;
    lck?: number;
  };
  description: string;
  effect: string;
}

// The master blueprint for every attack
export interface Skill {
    id: string;
    name: string;
    description: string;
    
    // THE MECHANICS
    type: "PHYSICAL" | "MAGICAL" | "HEAL" | "BUFF";
    targetMode: "SINGLE" | "ALL_ENEMIES" | "SELF" | "ALL_ALLIES";
    
    // THE MATH
    powerMultiplier: number; 
    manaCost: number;     
    hpCost?: number; // Optional: Only used for self-damaging moves like Desperate Struggle
    
    // THE COOLDOWN SYSTEM
    cooldownTicks: number;   // Max cooldown (1 tick = 100ms. So 20 = 2 seconds)
    currentCooldown: number; // Live tracker that counts down to 0
    
    // THE TIMING
    animationSpeed: number;  
}

export interface Enemy {
    id: number;
    name: string;
    maxHP: number;
    maxMana: number;
    stats: {
        str: number;
        pierce?: number;
        def: number;
        int: number;
        agi: number;
        lck: number;
    };
    attackPattern: string[]; 
    specialAttacks: Skill[];
    description: string;
    statusEffects: any[];
}