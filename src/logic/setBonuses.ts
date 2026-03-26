import { type Character } from "../types/game";

export const calculateSetBonuses = (equipped: Character["equipped"]) => {
    const baseClassCounts: Record<string, number> = {};
    const subClassCounts: Record<string, number> = {};

    const equipmentArray = Object.values(equipped).filter(item => 
        item !== null && item.slot !== "NECKLACE" && item.slot !== "RING"
    );

    for (const item of equipmentArray) {
        if(item?.baseClass) {
            baseClassCounts[item.baseClass] = (baseClassCounts[item.baseClass] || 0) + 1;
        }
        if(item?.subClass) {
                    subClassCounts[item.subClass] = (subClassCounts[item.subClass] || 0) + 1;
        }
    }

    // class bonus — needs all 4 pieces from same base class
    const activeClassBonus = Object.entries(baseClassCounts).find(([name, count]) => {
        return count === 4
    });

    // subclass bonus — needs 2 or more pieces from same subclass
    const activeSubclassBonuses = Object.entries(subClassCounts).filter(([name, count]) => count > 1);

    return {
        activeClassBonus,
        activeSubclassBonuses
    }
}