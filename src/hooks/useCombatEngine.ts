import {useState, useEffect, useRef, useMemo} from "react";
import {type Character, type Enemy, type Skill} from "../types/game";
import { desperateStruggle } from "../logic/skills";
import { calculateCombatStats, calculateDamage, calculateEvasion } from "../logic/combat";

export const useCombatEngine = (player: Character, enemies: Enemy[]) => {
    // Fetch calcualted stats for equipped player
    const playerStats = useMemo(() => { 
        return calculateCombatStats(player) 
    }, [player]);
    // Set up state for player
    const [playerHP, setPlayerHP] = useState(playerStats.maxHp);

    //Set up state for player
    const [playerMana, setPlayerMana] = useState(0);

    // Set up state for player
    const [playerEnergy, setPlayerEnergy] = useState(0);

    // Set up combat log
    const [combatLog, setCombatLog] = useState<string[]>([]);

    //Set up realtime energy
    const playerEnergyRef = useRef(playerEnergy);
    //Set up realtime health
    const playerHPRef = useRef(playerHP);
    //Set up realtime mana
    const playerManaRef = useRef(playerMana);

    // Create a safe clone of the player's skills to prevent mutatations of the raw Prop
    const playerSkillsRef = useRef<Skill[]>(
        player.equippedSkills ? player.equippedSkills.map(skill => ({ ...skill })) : []
    );

    // Keep the player skills ref updated if the player changes gear in the UI later
    // useEffect(() => {
    //     playerSkillsRef.current = player.equippedSkills ? player.equippedSkills.map(skill => ({ ...skill })) : [];
    // }, [player.equippedSkills]);

    // Set up the enemies stats
    const initialEnemyStates = enemies.map(enemy => ({
        ...enemy,
        specialAttacks: enemy.specialAttacks ? enemy.specialAttacks.map(skill => ({ ...skill })) : [],
        currentHP: enemy.maxHP,
        currentMana: 0,
        currentEnergy: 0,
    }));

    const [activeEnemies, setActiveEnemies] = useState(initialEnemyStates);
    const activeEnemiesRef = useRef(activeEnemies);

    // Pause and execute ATB logic pauser
    const isPauseRef = useRef(false);

    useEffect(() => {
        const combatClock = setInterval(() => {
            // This is where the combat logic will go, it will run every second (1000ms)

            // If the combat is currently paused (e.g., waiting for an animation to finish), skip this tick
            if (isPauseRef.current) return; 

            // Accumulate Player primitives (This mutation is safe)
            playerEnergyRef.current += playerStats.agi;
            playerManaRef.current = Math.min(playerStats.maxMana, playerManaRef.current + ((1 + 0.5 * playerStats.int) / 10));

            // Tick player cooldown immutably
            playerSkillsRef.current = playerSkillsRef.current.map(skill => ({
                ...skill,
                currentCooldown: Math.max(0, skill.currentCooldown - 1)
            }));
            
            // Tick enemy stats and cooldown immutably
            activeEnemiesRef.current = activeEnemiesRef.current.map(enemy => {
                if(enemy.currentHP <= 0) return enemy; // Skip dead enemies

                return {
                    ...enemy,
                    currentEnergy: enemy.currentEnergy + enemy.stats.agi,
                    currentMana: Math.min(enemy.maxMana, enemy.currentMana + ((1 + 0.5 * enemy.stats.int) / 10)),
                    specialAttacks: enemy.specialAttacks
                        ? enemy.specialAttacks.map(skill => ({...skill, currentCooldown: Math.max(0, skill.currentCooldown - 1)}))
                        : []
                };
            });

            // Check for death
            // If enemies are all dead
            const allEnemiesDead = activeEnemiesRef.current.every(enemy => enemy.currentHP <= 0);
            // Check if user or enemies are all dead then exit
            if (playerHPRef.current <= 0 || allEnemiesDead) {
                clearInterval(combatClock);
                return;
            }

            // Helper function to calculate damage and apply it to the opponent, then reset energy
            const executeAttack = (
                attacker: { name: string, str: number, pierce: number, int: number, lck: number },
                defender: { name: string, def: number , int: number },
                skillMultiplier: number = 1.0
            ) => {
                const damage = calculateDamage(
                    { str: attacker.str, pierce: attacker.pierce || 0, int: attacker.int, lck: attacker.lck }, 
                    { def: defender.def, int: defender.int }
                );

                const physDmg = Math.floor(damage.physical * skillMultiplier);
                const magDmg = Math.floor(damage.magical * skillMultiplier);

                if(damage.isCrit) {
                    if (physDmg > 0 && magDmg > 0) {
                    setCombatLog(prev => [...prev, `Critical Hit! ${attacker.name} attacks ${defender.name} for ${physDmg} physical and ${magDmg} magical damage`]);
                    } else if (physDmg > 0 && magDmg === 0) {
                        setCombatLog(prev => [...prev, `Critical Hit! ${attacker.name} attacks ${defender.name} for ${physDmg} physical damage and ${defender.name} blocks magical damage`]);
                    } else if (physDmg === 0 && magDmg > 0) {
                        setCombatLog(prev => [...prev, `Critical Hit! ${attacker.name} attacks ${defender.name} for ${magDmg} magical damage and ${defender.name} blocks physical damage`]);
                    } else {
                        setCombatLog(prev => [...prev, `${attacker.name} attacks ${defender.name} but ${defender.name} blocks all damage!`]);
                    }
                } else {    
                    if (physDmg > 0 && magDmg > 0) {
                    setCombatLog(prev => [...prev, `${attacker.name} attacks ${defender.name} for ${physDmg} physical and ${magDmg} magical damage`]);
                    } else if (physDmg > 0 && magDmg === 0) {
                        setCombatLog(prev => [...prev, `${attacker.name} attacks ${defender.name} for ${physDmg} physical damage and ${defender.name} blocks magical damage`]);
                    } else if (physDmg === 0 && magDmg > 0) {
                        setCombatLog(prev => [...prev, `${attacker.name} attacks ${defender.name} for ${magDmg} magical damage and ${defender.name} blocks physical damage`]);
                    } else {
                        setCombatLog(prev => [...prev, `${attacker.name} attacks ${defender.name} but ${defender.name} blocks all damage!`]);
                    }
                }
                const totalDamage = physDmg + magDmg
                return totalDamage
            }

            // Attack flag to track if an attack has occurred this tick, used to manage animation states in the Arena component
            let playerAttack = false;
            let enemyAttack = false;
            let attackHappened = false;
            let currentAnimationSpeed = 800;

            // Finding enemies based on criterias
            // Finding the living enemies
            const aliveEnemies = activeEnemiesRef.current.filter(enemy => enemy.currentHP > 0);

            // Finding lowest HP enemy among a group
            const lowestHPEnemy = aliveEnemies.length > 0 
                ? aliveEnemies.reduce((min, enemy) => enemy.currentHP < min.currentHP ? enemy : min)
                : null;
            // Front to back
            // const firstEnemy
            // Biggest threat
            //const biggestThreat

            //let focusOnAnyEnemy = activeEnemiesRef.current.find(enemy => enemy.currentHP > 0);

            let currentTargetEnemy = lowestHPEnemy; // For now, we just target the lowest HP enemy. Future: Add more complex targeting logic here

            // --- PLAYER ATTACK LOGIC ---

            // Check if player can attack
            if (playerEnergyRef.current >= 100 && currentTargetEnemy) {

                // Character skills selections
                let selectedSkill: Skill | null = null;

                if(playerSkillsRef.current.length === 0) {
                    selectedSkill = desperateStruggle;
                } else {
                    const readySkills = playerSkillsRef.current.filter(skill => skill.currentCooldown === 0 && playerManaRef.current >= skill.manaCost);

                    if(readySkills.length > 0) {
                        selectedSkill = readySkills.reduce((prev, current) => (prev.manaCost > current.manaCost) ? prev : current );
                        // Put skill on cooldown immutably
                        playerSkillsRef.current = playerSkillsRef.current.map(skill =>
                            skill.id == selectedSkill!.id ? { ...skill, currentCooldown: skill.cooldownTicks } : skill
                        );
                    }
                }
                // Safely pay the costs ONLY if a special skill or struggle was actually used
                if(selectedSkill) {
                    // Deduct Mana
                    if(selectedSkill.manaCost > 0){
                        playerManaRef.current = Math.max(0, playerManaRef.current - selectedSkill.manaCost);
                    }
                    //Deduct HP(*Special skills, example: desperate struggle)
                    if(selectedSkill.hpCost){
                        playerHPRef.current = Math.max(0, playerHPRef.current - selectedSkill.hpCost)
                        setCombatLog(prev => [...prev, `${player.name} suffers ${selectedSkill.hpCost} recoil damage from ${selectedSkill.name}!`])
                    }
                }

                const isEvasionSuccessful = calculateEvasion({ agi: playerStats.agi }, { agi: currentTargetEnemy.stats.agi });

                if (isEvasionSuccessful) {
                    setCombatLog(prev => [...prev, `${currentTargetEnemy.name} evades ${player.name}'s attack! (+5 Mana)`]);
                    activeEnemiesRef.current = activeEnemiesRef.current.map(enemy => 
                        enemy.id === currentTargetEnemy.id ? { ...enemy, currentMana: Math.min(enemy.maxMana, enemy.currentMana + 5)}
                        : enemy
                    );
                } else {
                    const damageDealt = executeAttack({ name: player.name, str: playerStats.str, pierce: playerStats.pierce || 0, int: playerStats.int, lck: playerStats.lck }, 
                        { name: currentTargetEnemy.name, def: currentTargetEnemy.stats.def, int: currentTargetEnemy.stats.int }, 
                        selectedSkill?.powerMultiplier || 1.0);

                    activeEnemiesRef.current = activeEnemiesRef.current.map(enemy => 
                        enemy.id === currentTargetEnemy.id
                        ? { ...enemy, currentHP: Math.max(0, enemy.currentHP - damageDealt)}
                        : enemy
                    );
                    if(playerManaRef.current > 0) {
                        // For now, just do a magical attack that uses mana instead of energy
                    }
                }

                // Resume the combat loop after processing the attack
                playerAttack = true;
                attackHappened = true;

                // * Future: Replace setTimeout for exactly the length of your animation (e.g., 800ms) to unlock the engine: isPausedRef.current = false;
                // If a skill was selected, use its speed. Otherwise, fallback to 800ms!
                currentAnimationSpeed = selectedSkill?.animationSpeed || 800;
            }


            // --- ENEMY ATTACK LOGIC ---

            // Find and check if enemy can attack
            const readyEnemy = aliveEnemies.find(enemy => enemy.currentEnergy >= 100);

            if (readyEnemy && !playerAttack) {
                let enemySkill: Skill | null = null;

                if(readyEnemy.specialAttacks && readyEnemy.specialAttacks.length > 0){
                    const readySpecialAttacks = readyEnemy.specialAttacks.filter(skill => skill.currentCooldown === 0);

                    if (readySpecialAttacks.length > 0){
                        const randomIndex = Math.floor(Math.random() * readySpecialAttacks.length);
                        enemySkill = readySpecialAttacks[randomIndex];
                        
                        // Put the enemy's skill on cooldown immutably
                        activeEnemiesRef.current = activeEnemiesRef.current.map(enemy => {
                            if (enemy.id === readyEnemy.id) {
                                return {
                                    ...enemy, 
                                    specialAttacks: enemy.specialAttacks!.map(skill => 
                                        skill.id === enemySkill!.id ? { ...skill, currentCooldown: skill.cooldownTicks } : skill
                                    )
                                };
                            }
                            return enemy;
                        });
                    }
                }

                const isEvasionSuccessful = calculateEvasion({ agi: readyEnemy.stats.agi }, { agi: playerStats.agi });

                if (isEvasionSuccessful) {
                    setCombatLog(prev => [...prev, `${player.name} evades ${readyEnemy.name}'s attack! (+5 Mana)`]);
                    playerManaRef.current = Math.min(playerStats.maxMana, playerManaRef.current + 5);
                } else {
                    const damageDealt = executeAttack(
                        { name: readyEnemy.name, str: readyEnemy.stats.str, pierce: readyEnemy.stats.pierce || 0, int: readyEnemy.stats.int, lck: readyEnemy.stats.lck }, 
                        playerStats,
                        enemySkill?.powerMultiplier || 1.0
                    );
                    playerHPRef.current = Math.max(0, playerHPRef.current - damageDealt);
                }
                enemyAttack = true;
                attackHappened = true;
                currentAnimationSpeed = enemySkill?.animationSpeed || 800
            }
            // Sync the primitive refs to state
            setPlayerEnergy(Math.min(100,playerEnergyRef.current));
            setPlayerMana(playerManaRef.current);
            setActiveEnemies(activeEnemiesRef.current);

            if (attackHappened) {
                // Pause the combat loop to process the attack
                isPauseRef.current = true;
                setTimeout(() => {
                    //Reset the Engine Refs AFTER the animation
                    if(playerAttack) {
                        playerEnergyRef.current = 0;
                        setPlayerEnergy(0);
                    }
                    if(enemyAttack && readyEnemy) {
                        // Reset THIS specific enemy's energy Immutably
                        activeEnemiesRef.current = activeEnemiesRef.current.map(enemy => 
                            enemy.id === readyEnemy.id ? {...enemy, currentEnergy: 0 } : enemy
                        );
                    }
                    setPlayerHP(playerHPRef.current);
                    // Update the enemy array UI again so the attacking enemy's bar drops to 0
                    setActiveEnemies([...activeEnemiesRef.current]);

                    isPauseRef.current = false; // Resume the combat loop after the animation delay
                }, currentAnimationSpeed); // Adjust this delay to match your animation length
            }

        }, 100);
        // Clean up the interval on component unmount
        return () => clearInterval(combatClock);
    }, [playerStats, enemies]);

    return {
        playerHP,
        playerMana,
        playerEnergy,
        combatLog,
        activeEnemies
    }
}
