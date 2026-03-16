import { type Equipment, type Rarity } from "../types/game";
import { GENERAL_ITEMS } from "./equipment/general_equipment";
import { HUMAN_KNIGHT_ITEMS, HUMAN_BARBARIAN_ITEMS, HUMAN_MAGE_ITEMS } from "./equipment/human_kingdom_equipment";

export const RARITY_COLORS: Record<Rarity, string> = {
  COMMON: "#9ca3af",
  RARE: "#3498db",
  LEGENDARY: "#f1c40f"
};

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