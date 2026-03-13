import { type Equipment } from "../types/game";

// Stat counter, tallies the total stats of the respective attributes
export const statCounter = (userInventory: Equipment[], attribute: keyof Equipment['stats']) => {
    return userInventory.reduce((acc, item)=> {
        acc += item.stats[attribute] || 0; 
        return acc
    }, 0)
}