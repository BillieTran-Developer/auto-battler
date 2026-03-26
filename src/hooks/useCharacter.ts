// src/hooks/useCharacter.ts
import { useState } from "react";
import { type Character, type Equipment, type Slot } from "../types/game";

export function useCharacter(initialCharacter: Character) {

    // useState holds the character object and gives us a setter to update it.
    // Whenever setCharacter is called, React re-renders anything using this hook.
    const [character, setCharacter] = useState<Character>(initialCharacter);

    // --- EQUIP AN ITEM INTO A SLOT ---
    // This function handles three situations:
    //   1. Slot is empty → just equip the item
    //   2. Slot already has an item → swap: equip new one, send old one to inventory
    //   3. Wrong slot type (e.g. boots dragged onto head) → do nothing
    function equipItem(item: Equipment, targetSlot: Slot) {

        // Guard: item must match the slot it's being dropped into
        if (item.slot !== targetSlot) return;

        setCharacter(prev => {
            // Check if something is already in that slot
            const displaced = prev.equipped[targetSlot];

            return {
                ...prev, // keep everything else on the character the same

                // Update the equipped slots — put the new item in
                equipped: {
                    ...prev.equipped,
                    [targetSlot]: item
                },

                // Update inventory:
                // - Remove the item being equipped (it's leaving inventory)
                // - Add the displaced item back if there was one
                inventory: [
                    ...prev.inventory.filter(i => i.id !== item.id),
                    ...(displaced ? [displaced] : [])
                ]
            };
        });
    }

    // --- UNEQUIP AN ITEM FROM A SLOT ---
    // Moves an item from an equipment slot back into the inventory
    function unequipItem(slot: Slot) {
        setCharacter(prev => {
            const item = prev.equipped[slot];

            // If the slot is already empty, do nothing
            if (!item) return prev;

            return {
                ...prev,
                equipped: {
                    ...prev.equipped,
                    [slot]: null  // clear the slot
                },
                inventory: [...prev.inventory, item]  // add back to inventory
            };
        });
    }

    // Return everything a component might need
    return {
        character,
        equipItem,
        unequipItem,
    };
}