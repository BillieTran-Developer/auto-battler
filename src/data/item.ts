import { type Equipment, type Rarity } from "../types/game";

export const RARITY_COLORS: Record<Rarity, string> = {
  COMMON: "#9ca3af",
  RARE: "#3498db",
  LEGENDARY: "#f1c40f"
};


// ==========================================
// GENERAL EQUIPMENT
// ==========================================
export const GENERAL_ITEMS: Equipment[] = [];

// ==========================================
// HUMAN KINGDOM
// ==========================================
// ==========================================
// KNIGHT EQUIPMENT
// ==========================================
export const HUMAN_KNIGHT_ITEMS: Equipment[] = [
  // ==========================================
  // VANGUARD SET (Knight SubClass)
  // ==========================================
  {
    id: 1001,
    name: "Vanguard Greathelm",
    kingdom: "HUMAN",
    slot: "HEAD",
    baseClass: "KNIGHT",
    subClass: "KNIGHT",
    rarity: "COMMON",
    stats: { str: 0, def: 2, int: 2, agi: 0, lck: 0 },
    description: "A sturdy helm that has seen many battles, offering solid protection to the wearer.",
    effect: "Fortify: Every 10s, gain a temporary shield."
  },
  {
    id: 1002,
    name: "Vanguard Plate",
    kingdom: "HUMAN",
    slot: "BODY",
    baseClass: "KNIGHT",
    subClass: "KNIGHT",
    rarity: "COMMON",
    stats: { str: 0, def: 5, int: 2, agi: -1, lck: 0 },
    description: "Heavy plate armor that provides excellent defense at the cost of agility.",
    effect: "Heavy Plating: Reduces Critical Hit damage."
  },
  {
    id: 1003,
    name: "Vanguard Greaves",
    kingdom: "HUMAN",
    slot: "BOOTS",
    baseClass: "KNIGHT",
    subClass: "KNIGHT",
    rarity: "COMMON",
    stats: { str: 0, def: 2, int: 2, agi: 1, lck: 0 },
    description: "Sturdy greaves that protect the legs, allowing the wearer to hold their ground.",
    effect: "Unstoppable: Hero cannot be knocked back."
  },
  {
    id: 1004,
    name: "Vanguard Bastion",
    kingdom: "HUMAN",
    slot: "WEAPON",
    baseClass: "KNIGHT",
    subClass: "KNIGHT",
    rarity: "COMMON",
    stats: { str: 3, def: 2, int: 2, agi: -2, lck: 0 },
    description: "A massive shield that can be used to bash enemies, providing both offense and defense.",
    effect: "Shield Bash: +15% Block. 4th block stuns."
  },

  // ==========================================
  // RADIANCE SET (Paladin SubClass)
  // ==========================================
  {
    id: 1005,
    name: "Halo of Radiance",
    kingdom: "HUMAN",
    slot: "HEAD",
    baseClass: "KNIGHT",
    subClass: "PALADIN",
    rarity: "RARE",
    stats: { str: 0, def: 1, int: 2, agi: 0, lck: 0 },
    description: "A shining halo that radiates holy energy.",
    effect: "Divine Spark: Every 2nd successful Block, restore HP equal to your Intelligence."
  },
  {
    id: 1006,
    name: "Sanctified Plate",
    kingdom: "HUMAN",
    slot: "BODY",
    baseClass: "KNIGHT",
    subClass: "PALADIN",
    rarity: "RARE",
    stats: { str: 0, def: 2, int: 2, agi: 1, lck: 0 },
    description: "Armor blessed by the clergy, said to be imbued with divine protection.",
    effect: "Righteous Aura: When hit, 20% chance to Blind target. +15% Def vs Demons."
  },
  {
    id: 1007,
    name: "Hallowed Greaves",
    kingdom: "HUMAN",
    slot: "BOOTS",
    baseClass: "KNIGHT",
    subClass: "PALADIN",
    rarity: "RARE",
    stats: { str: 1, def: 1, int: 1, agi: 1, lck: 1 },
    description: "Boots blessed by the clergy, said to carry the wearer with divine protection.",
    effect: "Vanguard: Every Block, gain +1 Agility (Cap +4) for 4s."
  },
  {
    id: 1008,
    name: "Sun-Slayer Mace",
    kingdom: "HUMAN",
    slot: "WEAPON",
    baseClass: "KNIGHT",
    subClass: "PALADIN",
    rarity: "RARE",
    stats: { str: 4, def: 1, int: 2, agi: 0, lck: 0 },
    description: "A mace imbued with the power of the sun, radiating intense heat.",
    effect: "Judgment: Attacks deal +25% Int as Magic damage. Vs Demons: Deals True Damage."
  },

  // ==========================================
  // PIT-FIGHTER SET (Gladiator SubClass)
  // ==========================================
  {
    id: 1009,
    name: "Pit-Fighter’s Mask",
    kingdom: "HUMAN",
    slot: "HEAD",
    baseClass: "KNIGHT",
    subClass: "GLADIATOR",
    rarity: "RARE",
    stats: { str: 0, def: 1, int: 1, agi: 0, lck: 2 },
    description: "A rugged mask worn by pit fighters, stained with the blood of countless battles.",
    effect: "Adrenaline Flow: Every 3rd attack dealt grants +1 Agility and +1 Luck. (Cap +4 each)."
  },
  {
    id: 1010,
    name: "Champion’s Harness",
    kingdom: "HUMAN",
    slot: "BODY",
    baseClass: "KNIGHT",
    subClass: "GLADIATOR",
    rarity: "RARE",
    stats: { str: 0, def: 2, int: 1, agi: 1, lck: 1 },
    description: "A battered harness that once belonged to a champion gladiator, offering a mix of protection and mobility.",
    effect: "Vengeful Reflex: After a Dodge, your next attack deals 50% Attack as True Damage and Heals for the same amount."
  },
  {
    id: 1011,
    name: "Arena Sandals",
    kingdom: "HUMAN",
    slot: "BOOTS",
    baseClass: "KNIGHT",
    subClass: "GLADIATOR",
    rarity: "RARE",
    stats: { str: 1, def: 0, int: 1, agi: 2, lck: 1 },
    description: "Lightweight sandals that allow for quick movements in the arena, though they offer little protection.",
    effect: "Pocket Sand: Successfully Dodging an attack has a 30% chance to Blind the attacker's Next Attack."
  },
  {
    id: 1012,
    name: "Twin Tiger Blades",
    kingdom: "HUMAN",
    slot: "WEAPON",
    baseClass: "KNIGHT",
    subClass: "GLADIATOR",
    rarity: "RARE",
    stats: { str: 6, def: 0, int: 0, agi: 0, lck: 0 },
    description: "A pair of razor-sharp blades that strike with the ferocity of a tiger.",  
    effect: "Twin Strike: 15% chance to strike twice. Chance increases to 50% if the target's last attack Missed."
  }
];
// ==========================================
// BARBARIAN EQUIPMENT
// ==========================================
export const HUMAN_BARBARIAN_ITEMS: Equipment[] = [];
// ==========================================
// MAGE EQUIPMENT
// ==========================================
export const HUMAN_MAGE_ITEMS: Equipment[] = [];

// ==========================================
// HUMAN LOOT POOL
// ==========================================
export const HUMAN_LOOT_POOL: Equipment[] = [
  ...HUMAN_KNIGHT_ITEMS,
  ...HUMAN_BARBARIAN_ITEMS,
  ...HUMAN_MAGE_ITEMS,
  ...GENERAL_ITEMS
];

// Future Elf Array
export const ELF_LOOT_POOL: Equipment[] = [
  ...GENERAL_ITEMS 
];

// Future Dwarf Array
export const DWARF_LOOT_POOL: Equipment[] = [
  ...GENERAL_ITEMS 
];