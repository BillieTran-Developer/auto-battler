import React from "react";
import { type Character } from "../../types/game";
import { calculateCombatStats } from "../../logic/combat";
import { GAME_CONFIG } from "../../config/gameConfig";

interface CharacterStatsModalProps {
    character: Character;
    isOpen: boolean;
    onClose: () => void;
}

export const CharacterStatsModal: React.FC<CharacterStatsModalProps> = ({ character, isOpen, onClose }) => {
    if (!isOpen) return null;

    // Fetch the total stats including all equipped gear!
    const stats = calculateCombatStats(character);

    // -------------------------------------------------------------
    // DERIVED STATS (Show the player the math!)
    // -------------------------------------------------------------
    const critIncrease = (GAME_CONFIG.MAX_CRIT_CHANCE - GAME_CONFIG.BASE_CRIT_CHANCE) / GAME_CONFIG.MAX_STAT_VALUE;
    const currentCritChance = Math.min(GAME_CONFIG.MAX_CRIT_CHANCE, GAME_CONFIG.BASE_CRIT_CHANCE + (stats.lck * critIncrease));
    
    // Convert the 0.2 decimal into a clean "20%"
    const piercePercentage = (stats.pierce * 100).toFixed(0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-slate-800 text-white p-6 rounded-lg shadow-xl w-96 border-2 border-slate-600">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-4 border-b border-slate-600 pb-2">
                    <h2 className="text-2xl font-bold text-amber-400">{stats.name}'s Stats</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-xl">
                        ✕
                    </button>
                </div>

                {/* Vitals */}
                <div className="mb-4 bg-slate-900 p-3 rounded">
                    <div className="flex justify-between text-green-400 font-bold">
                        <span>Max HP:</span>
                        <span>{stats.maxHp}</span>
                    </div>
                    <div className="flex justify-between text-blue-400 font-bold mt-1">
                        <span>Max Mana:</span>
                        <span>{stats.maxMana}</span>
                    </div>
                </div>

                {/* Core Attributes */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-700 p-2 rounded flex justify-between">
                        <span className="text-slate-300">STR:</span>
                        <span className="font-bold">{stats.str}</span>
                    </div>
                    <div className="bg-slate-700 p-2 rounded flex justify-between">
                        <span className="text-slate-300">DEF:</span>
                        <span className="font-bold">{stats.def}</span>
                    </div>
                    <div className="bg-slate-700 p-2 rounded flex justify-between">
                        <span className="text-slate-300">INT:</span>
                        <span className="font-bold">{stats.int}</span>
                    </div>
                    <div className="bg-slate-700 p-2 rounded flex justify-between">
                        <span className="text-slate-300">AGI:</span>
                        <span className="font-bold">{stats.agi}</span>
                    </div>
                </div>

                {/* Advanced Combat Mechanics */}
                <div className="border-t border-slate-600 pt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-400">Luck:</span>
                        <span className="font-bold">{stats.lck}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-amber-200">Crit Chance:</span>
                        <span className="font-bold text-amber-400">{currentCritChance.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-red-300">Armor Pierce:</span>
                        <span className="font-bold text-red-400">{piercePercentage}%</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">Base Evasion:</span>
                        <span className="font-bold">{GAME_CONFIG.BASE_EVASION_CHANCE}%</span>
                    </div>
                </div>

            </div>
        </div>
    );
};