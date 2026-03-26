  import { type Equipment, type Rarity, type Kingdom } from "../types/game";
  import { HUMAN_LOOT_POOL, ELF_LOOT_POOL, DWARF_LOOT_POOL } from "../data";

  // Rolls a random number to determine the rarity of the item found
  export const rarityRoller =(luckBonus: number = 0): Rarity => {
    const roll = Math.floor(Math.random() * 100) + 1 + luckBonus;
    const COMMON_CHANCE = 70;
    const RARE_CHANCE = 25;

    const finalRoll = Math.min(roll, 100);

    if (finalRoll <= COMMON_CHANCE) return "COMMON"
    if (finalRoll <= COMMON_CHANCE + RARE_CHANCE) return "RARE"
    return "LEGENDARY"
  }

  export const fetchKingdom = (kingdom: Kingdom): Equipment[] => {
    switch (kingdom) {
      case "HUMAN":
        return HUMAN_LOOT_POOL;
      case "ELF":
        return ELF_LOOT_POOL;
      case "DWARF":
        return DWARF_LOOT_POOL;
      default:
        return [];
    }
  }

  // Rolls a random item from the MASTER_ITEMS list based on the kingdom and rarity chosen
export const lootRoller = (kingdom: Kingdom): Equipment => {
  const rarity = rarityRoller();
  const playerKingdomItemsPool = fetchKingdom(kingdom);

  let pool = playerKingdomItemsPool.filter(item => item.rarity === rarity);

  if (pool.length === 0) {
    console.warn(`No items found for ${kingdom} with rarity ${rarity}. Falling back to common pool.`);
    // Overwrite 'pool' with a safer list
    pool = playerKingdomItemsPool.filter(item => item.rarity === "COMMON");
  }

  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}
    