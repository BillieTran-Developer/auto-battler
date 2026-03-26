import { type Equipment } from "../types/game";
import { GENERAL_ITEMS } from "./equipment/general_equipment";
import { HUMAN_KNIGHT_ITEMS, HUMAN_BARBARIAN_ITEMS, HUMAN_MAGE_ITEMS } from "./equipment/human_kingdom_equipment";

// ==========================================
// HUMAN LOOT POOL
// ==========================================
export const HUMAN_LOOT_POOL: Equipment[] = [
    ...Object.values(HUMAN_KNIGHT_ITEMS),
    ...Object.values(HUMAN_BARBARIAN_ITEMS),
    ...Object.values(HUMAN_MAGE_ITEMS),
    ...Object.values(GENERAL_ITEMS)
];

// Future Elf Array
export const ELF_LOOT_POOL: Equipment[] = [
  ...Object.values(GENERAL_ITEMS)
];

// Future Dwarf Array
export const DWARF_LOOT_POOL: Equipment[] = [
  ...Object.values(GENERAL_ITEMS)
];