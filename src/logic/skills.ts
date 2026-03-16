import { type Skill } from "../types/game";

// The Naked Fallback
export const desperateStruggle: Skill = {
    id: "skill_naked_struggle",
    name: "Desperate Struggle",
    description: "You flail wildly. It hurts you almost as much as them. Please put some clothes on.",
    type: "PHYSICAL",
    targetMode: "SINGLE",
    powerMultiplier: 0.5,    
    manaCost: 20,            
    hpCost: 5,               
    cooldownTicks: 20,       
    currentCooldown: 0,     
    animationSpeed: 600      
};

// A Trash Tier Weapon Attack
export const rockSmash: Skill = {
    id: "skill_trash_rock",
    name: "Rock Smash",
    description: "A crude, desperate swing with a dirty rock.",
    type: "PHYSICAL",
    targetMode: "SINGLE",
    powerMultiplier: 0.8,    
    manaCost: 0,             
    cooldownTicks: 10,      
    currentCooldown: 0,
    animationSpeed: 800
};