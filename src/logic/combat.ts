import { type Character } from "../types/game";
import { GAME_CONFIG } from "../config/gameConfig";

// This file contains the core combat logic, including damage calculation, critical hits, dodging, blocking, and any other combat-related mechanics. It should be purely focused on the math and rules of combat, without any UI or state management code.

export const getRandomRange = (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
};

export const checkRollSuccess = (targetChance: number): boolean => {
    const roll = Math.random() * 100;
    return roll < targetChance;
};

// Calculates characters stats for combat
export const calculateCombatStats = (character: Character) => {
    const characterName = character.name;
    const characterStats = character.stats;
    let totalMaxHp = character.maxHP;
    let totalMaxMana = character.maxMana;
    let totalStr = characterStats.str;
    let totalPierce = 0;
    let totalDef = characterStats.def;
    let totalInt = characterStats.int;
    let totalAgi = characterStats.agi;
    let totalLck = characterStats.lck;

    // Loop through equipped items and add their stats to the character's total stats
    for (const slot in character.equipped) {
        const item = character.equipped[slot as keyof typeof character.equipped];
        if (item) {
            totalMaxHp += item.stats.hp || 0; 
            totalMaxMana += item.stats.mana || 0;
            totalStr += item.stats.str || 0;
            totalPierce += item.stats.pierce || 0;
            totalDef += item.stats.def || 0;
            totalInt += item.stats.int || 0;
            totalAgi += item.stats.agi || 0;
            totalLck += item.stats.lck || 0;
        }
    }
    return {
        name: characterName,
        maxHp: totalMaxHp,
        maxMana: totalMaxMana,
        str: totalStr,
        pierce: totalPierce,
        def: totalDef,
        int: totalInt,
        agi: totalAgi,
        lck: totalLck
    };
}
// This function calculates the critical hit chance based on the attacker's luck stat. It returns true if the attack is a critical hit, and false otherwise.
export const calculateCritChance = (attackerStats: { lck: number }) => {
    const critIncrease = (GAME_CONFIG.MAX_CRIT_CHANCE - GAME_CONFIG.BASE_CRIT_CHANCE) / GAME_CONFIG.MAX_STAT_VALUE;

    const attackerCritChance = Math.min(GAME_CONFIG.MAX_CRIT_CHANCE, GAME_CONFIG.BASE_CRIT_CHANCE + (attackerStats.lck * critIncrease));

    // Returns true if it's a critical hit
    return checkRollSuccess(attackerCritChance);
}

// This function calculates the damage of an attack based on the attacker's stats and the defender's stats, and also determines if it's a critical hit. It returns an object containing the physical damage, magical damage, and whether it was a critical hit.
export const calculateDamage = (attackerStats: { str: number, pierce: number, int: number, lck: number }, defenderStats: { def: number, int: number }): { physical: number, magical: number, isCrit: boolean } => {
    // If pierce is present, it adds to physical damage and ignores defense
    const pierceDamage = Math.min(1, attackerStats.pierce || 0);
    // Multiply the defender's def by the remaining percentage (e.g., 1 - 0.2 = 0.8)
    const effectiveDef = defenderStats.def * (1 - pierceDamage);
    // Calculate the raw damage (Attacker's Attack minus Defender's Defense)
    const basePhysicalDamage = attackerStats.str - effectiveDef;
    const baseMagicalDamage = attackerStats.int - defenderStats.int;

    const isCriticalHit = calculateCritChance({ lck: attackerStats.lck });
    const actualCritHappened = isCriticalHit && (basePhysicalDamage > 0 || baseMagicalDamage > 0);
    const currentCritMultiplier = actualCritHappened ? GAME_CONFIG.CRIT_DAMAGE_MULTIPLIER : GAME_CONFIG.BASE_CRIT_MULTIPLIER;
    const randomFactor = getRandomRange(GAME_CONFIG.MIN_ATTACK_RANGE, GAME_CONFIG.MAX_ATTACK_RANGE);
    


    // Make sure the damage doesn't go below 1 (we don't want attacks to heal the enemy!)
    const physicalDamage = Math.max(0, Math.floor(currentCritMultiplier * (basePhysicalDamage * randomFactor)));
    const magicalDamage = Math.max(0, Math.floor(currentCritMultiplier * (baseMagicalDamage * randomFactor)));

    const parallelDamage = {
        physical: physicalDamage,
        magical: magicalDamage,
        isCrit: actualCritHappened
    }
    // 3. Return the final damage number
    return parallelDamage;
    
}

//calculateCritChance(luck)

export const calculateEvasion = (attackerStats: { agi: number }, defenderStats: { agi: number }) => {
    const agilityDifference = defenderStats.agi - attackerStats.agi;

    let finalEvasionChance: number;

    // evasion calculation logic here
    // At 8 Agility difference, the evasion chance is 50%
    if (agilityDifference <= 0) {
        finalEvasionChance = GAME_CONFIG.BASE_EVASION_CHANCE; // Base evasion only if attacker is slower or equal
    } else if (agilityDifference <= 8) {
        finalEvasionChance = GAME_CONFIG.BASE_EVASION_CHANCE + (agilityDifference * 5);
    } else {
    // Beyond 8 Agility difference, the evasion chance increases more slowly to prevent it from becoming too high
        finalEvasionChance = 50 + ((agilityDifference - 8) * 1.8);     
    }
    const evasionChance = Math.min(GAME_CONFIG.MAX_EVASION_CHANCE, finalEvasionChance);
    
    // If the random roll is LESS than the chance, it's a successful dodge
    return checkRollSuccess(evasionChance); // Returns true if the attack is evaded
};


//calculateBlock(defense, equipment)

//export const rollBlindChance = (accuracy, evasion) => { ... }

//export const calculatePoisonTick = (maxHp, poisonStacks) => { ... }