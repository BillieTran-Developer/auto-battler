import {useState, useEffect, useRef} from "react";
import {type Character, type Enemy} from "../types/game";
import { calculateCombatStats, calculateDamage, calculateEvasion } from "../logic/combat";

export const useCombatEngine = (player: Character, enemy: Enemy) => {
    // Fetch calcualted stats for equipped player
    const playerStats = calculateCombatStats(player);
    // Set up state for player and enemy HP
    const [playerHP, setPlayerHP] = useState(playerStats.maxHp);
    const [enemyHP, setEnemyHP] = useState(enemy.maxHP);

    //Set up state for player and enemy mana
    const [playerMana, setPlayerMana] = useState(0);
    const [enemyMana, setEnemyMana] = useState(0);

    // Set up state for player and enemy energy
    const [playerEnergy, setPlayerEnergy] = useState(0);
    const [enemyEnergy, setEnemyEnergy] = useState(0);

    // Set up combat log
    const [combatLog, setCombatLog] = useState<string[]>([]);

    //Set up realtime energy
    const playerEnergyRef = useRef(playerEnergy);
    const enemyEnergyRef = useRef(enemyEnergy);
    //Set up realtime health
    const playerHPRef = useRef(playerHP);
    const enemyHPRef = useRef(enemyHP);
    //Set up realtime mana
    const playerManaRef = useRef(playerMana);
    const enemyManaRef = useRef(enemyMana);

    // Pause and execute ATB logic pauser
    const isPauseRef = useRef(false);


    useEffect(() => {
        

        const combatClock = setInterval(() => {
            // This is where the combat logic will go, it will run every second (1000ms)

            // If the combat is currently paused (e.g., waiting for an animation to finish), skip this tick
            if (isPauseRef.current) return; 

            // ACCUMULATE ENERGY
            playerEnergyRef.current += playerStats.agi;
            enemyEnergyRef.current += enemy.stats.agi;

            // Check for death
            if (playerHPRef.current <= 0 || enemyHPRef.current <= 0) {
                clearInterval(combatClock);
                return;
            }

            // ADD MANA
            playerManaRef.current = Math.min(
                playerStats.maxMana, 
                playerManaRef.current + ((1 + 0.5 * playerStats.int) / 10)
            );
            enemyManaRef.current = Math.min(
                enemy.maxMana, 
                enemyManaRef.current + ((1 + 0.5 * enemy.stats.int) / 10)
            );

            // Helper function to calculate damage and apply it to the opponent, then reset energy
            const executeAttack = (
                attacker: { name: string, str: number, pierce: number, int: number, lck: number },
                defender: { name: string, def: number , int: number },
                defenderHPRef: React.MutableRefObject<number>,
                setDefenderHP: React.Dispatch<React.SetStateAction<number>>,
            ) => {
                const damage = calculateDamage({ str: attacker.str, pierce: attacker.pierce, int: attacker.int, lck: attacker.lck }, { def: defender.def, int: defender.int });
                defenderHPRef.current = Math.max(0, defenderHPRef.current - (damage.physical + damage.magical));
                setDefenderHP(defenderHPRef.current);
                if(damage.isCrit) {
                    if (damage.physical > 0 && damage.magical > 0) {
                    setCombatLog(prev => [...prev, `Critical Hit! ${attacker.name} attacks ${defender.name} for ${damage.physical} physical and ${damage.magical} magical damage`]);
                    } else if (damage.physical > 0 && damage.magical === 0) {
                        setCombatLog(prev => [...prev, `Critical Hit! ${attacker.name} attacks ${defender.name} for ${damage.physical} physical damage and ${defender.name} blocks magical damage`]);
                    } else if (damage.physical === 0 && damage.magical > 0) {
                        setCombatLog(prev => [...prev, `Critical Hit! ${attacker.name} attacks ${defender.name} for ${damage.magical} magical damage and ${defender.name} blocks physical damage`]);
                    } else {
                        setCombatLog(prev => [...prev, `${attacker.name} attacks ${defender.name} but ${defender.name} blocks all damage!`]);
                    }
                } else {    
                    if (damage.physical > 0 && damage.magical > 0) {
                    setCombatLog(prev => [...prev, `${attacker.name} attacks ${defender.name} for ${damage.physical} physical and ${damage.magical} magical damage`]);
                    } else if (damage.physical > 0 && damage.magical === 0) {
                        setCombatLog(prev => [...prev, `${attacker.name} attacks ${defender.name} for ${damage.physical} physical damage and ${defender.name} blocks magical damage`]);
                    } else if (damage.physical === 0 && damage.magical > 0) {
                        setCombatLog(prev => [...prev, `${attacker.name} attacks ${defender.name} for ${damage.magical} magical damage and ${defender.name} blocks physical damage`]);
                    } else {
                        setCombatLog(prev => [...prev, `${attacker.name} attacks ${defender.name} but ${defender.name} blocks all damage!`]);
                    }
                }
            }

            // Attack flag to track if an attack has occurred this tick, used to manage animation states in the Arena component
            let playerAttack = false;
            let enemyAttack = false;
            let attackHappened = false;

            // Check if player can attack
            if (playerEnergyRef.current >= 100) {

                const isEvasionSuccessful = calculateEvasion({ agi: playerStats.agi }, { agi: enemy.stats.agi });

                if (isEvasionSuccessful) {
                    setCombatLog(prev => [...prev, `${enemy.name} evades ${player.name}'s attack! (+5 Mana)`]);
                    enemyManaRef.current = Math.min(enemy.maxMana, enemyManaRef.current + 5);
                } else {
                    executeAttack(playerStats, { name: enemy.name, int: enemy.stats.int, def: enemy.stats.def },enemyHPRef, setEnemyHP);
                    if(playerManaRef.current > 0) {
                        // For now, just do a magical attack that uses mana instead of energy
                    }
                }
                // Resume the combat loop after processing the attack
                // * Future: Replace setTimeout for exactly the length of your animation (e.g., 800ms) to unlock the engine: isPausedRef.current = false;
                playerAttack = true;
                attackHappened = true;
            }

            // Check if enemy can attack
            if (enemyEnergyRef.current >= 100) {

                const isEvasionSuccessful = calculateEvasion({ agi: enemy.stats.agi }, { agi: playerStats.agi });

                if (isEvasionSuccessful) {
                    setCombatLog(prev => [...prev, `${player.name} evades ${enemy.name}'s attack! (+5 Mana)`]);
                    playerManaRef.current = Math.min(playerStats.maxMana, playerManaRef.current + 5);
                } else {
                    executeAttack({ name: enemy.name, str: enemy.stats.str, pierce: enemy.stats.pierce, int: enemy.stats.int, lck: enemy.stats.lck }, playerStats, playerHPRef, setPlayerHP);
                    if(enemyManaRef.current > 0) {
                        // For now, just do a magical attack that uses mana instead of energy
                    }
                }

                enemyAttack = true;
                attackHappened = true;
            }

            setPlayerEnergy(Math.min(100,playerEnergyRef.current));
            setPlayerMana(playerManaRef.current);
            setEnemyEnergy(Math.min(100,enemyEnergyRef.current));
            setEnemyMana(enemyManaRef.current);

            if (attackHappened) {
                // Pause the combat loop to process the attack
                isPauseRef.current = true;
                setTimeout(() => {
                    //Reset the Engine Refs AFTER the animation
                    if(playerAttack) playerEnergyRef.current = 0;
                    if(enemyAttack) enemyEnergyRef.current = 0;
                    //Reset the UI Dashboard so it instantly drains
                    if(playerAttack) setPlayerEnergy(playerEnergyRef.current);
                    if(enemyAttack) setEnemyEnergy(enemyEnergyRef.current);

                    isPauseRef.current = false; // Resume the combat loop after the animation delay
                }, 800); // Adjust this delay to match your animation length
            }

        }, 100);
        // Clean up the interval on component unmount
        return () => clearInterval(combatClock);
    }, [playerStats, enemy.stats]);

    return {
        playerHP,
        enemyHP,    
        playerMana,
        enemyMana,
        playerEnergy,
        enemyEnergy,
        combatLog
    }
}
