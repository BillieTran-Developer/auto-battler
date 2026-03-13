import { useEffect, useRef, useState } from "react";
import { type Character, type Enemy } from "../../types/game";
import { useCombatEngine } from "../../hooks/useCombatEngine"; 
import { CharacterStatsModal } from "./CharacterStatsModal";

interface ArenaProps {
  player: Character;
  enemy: Enemy;
}

export const Arena = ({ player, enemy }: ArenaProps) => {
  const {
    playerHP,
    enemyHP,
    playerMana,
    enemyMana,
    playerEnergy,
    enemyEnergy,
    combatLog,
  } = useCombatEngine(player, enemy);

  // --- UI STATE ---
  const [showPlayerStats, setShowPlayerStats] = useState(false);

  // --- ANIMATION STATE (TS Logic) ---
  const [playerAnim, setPlayerAnim] = useState("idle");
  const [enemyAnim, setEnemyAnim] = useState("idle");

  const prevEnemyHP = useRef(enemyHP);
  const prevPlayerHP = useRef(playerHP);

  // Watch Enemy HP: If it drops, Player attacks, Enemy gets hurt
  useEffect(() => {
    if (enemyHP < prevEnemyHP.current) {
      setPlayerAnim("attack-right");
      setEnemyAnim("hurt-right");
      setTimeout(() => {
        setPlayerAnim("idle");
        setEnemyAnim("idle");
      }, 200); // Reset after 200ms
    }
    prevEnemyHP.current = enemyHP;
  }, [enemyHP]);

  // Watch Player HP: If it drops, Enemy attacks, Player gets hurt
  useEffect(() => {
    if (playerHP < prevPlayerHP.current) {
      setEnemyAnim("attack-left");
      setPlayerAnim("hurt-left");
      setTimeout(() => {
        setPlayerAnim("idle");
        setEnemyAnim("idle");
      }, 200); // Reset after 200ms
    }
    prevPlayerHP.current = playerHP;
  }, [playerHP]);

  // Auto-scroll the combat log
  const logEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [combatLog]);

  // Helper for the UI bars
  const Bar = ({ label, current, max, color }: { label: string, current: number, max: number, color: string }) => {
    const percentage = Math.min(100, Math.max(0, (current / max) * 100));
    return (
      <div style={{ marginBottom: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "bold" }}>
          <span>{label}</span>
          <span>{Math.floor(current)} / {max}</span>
        </div>
        <div style={{ height: "16px", width: "100%", backgroundColor: "#333", borderRadius: "4px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${percentage}%`, backgroundColor: color, transition: "width 0.1s linear" }} />
        </div>
      </div>
    );
  };

  // --- INLINE CSS FOR ANIMATIONS ---
  const getAnimationClass = (animState: string) => {
    switch (animState) {
      case "attack-right": return "rotate(20deg) translateX(20px)";
      case "hurt-right": return "rotate(15deg) translateX(10px)";
      case "attack-left": return "rotate(-20deg) translateX(-20px)";
      case "hurt-left": return "rotate(-15deg) translateX(-10px)";
      default: return "rotate(0deg) translateX(0px)";
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif", backgroundColor: "#1e1e1e", color: "white", borderRadius: "8px" }}>
      
      {/* THE BATTLE STAGE */}
      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "flex-end", height: "200px", marginBottom: "30px", borderBottom: "4px solid #444", paddingBottom: "20px" }}>
        
        {/* Player Graphic */}
        <div style={{ 
            fontSize: "100px", 
            transform: getAnimationClass(playerAnim), 
            transition: "transform 0.1s ease-in-out" 
        }}>
          🤺
        </div>

        {/* Enemy Graphic */}
        <div style={{ 
            fontSize: "100px", 
            transform: getAnimationClass(enemyAnim), 
            transition: "transform 0.1s ease-in-out" 
        }}>
          👹
        </div>
      </div>

      {/* STATS & BARS */}
      <div style={{ display: "flex", gap: "40px", marginBottom: "20px" }}>
        <div style={{ flex: 1, padding: "15px", backgroundColor: "#2a2a2a", borderRadius: "8px" }}>
          
          {/* Added Header with Stats Button */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <h2 style={{ margin: 0 }}>{player.name}</h2>
            <button 
                onClick={() => setShowPlayerStats(true)}
                style={{ padding: "4px 10px", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
            >
                View Stats
            </button>
          </div>

          <Bar label="HP" current={playerHP} max={player.maxHP} color="#ef4444" />
          <Bar label="Mana" current={playerMana} max={player.maxMana} color="#3b82f6" />
          <Bar label="Energy" current={playerEnergy} max={100} color="#eab308" />
        </div>

        <div style={{ display: "flex", alignItems: "center", fontWeight: "bold", fontSize: "24px", color: "#666" }}>
          VS
        </div>

        <div style={{ flex: 1, padding: "15px", backgroundColor: "#2a2a2a", borderRadius: "8px" }}>
          <h2 style={{ margin: "0 0 15px 0" }}>{enemy.name}</h2>
          <Bar label="HP" current={enemyHP} max={enemy.maxHP} color="#ef4444" />
          <Bar label="Mana" current={enemyMana} max={enemy.maxMana} color="#3b82f6" />
          <Bar label="Energy" current={enemyEnergy} max={100} color="#eab308" />
        </div>
      </div>

      {/* COMBAT LOG */}
      <div style={{ backgroundColor: "#000", padding: "15px", borderRadius: "8px", height: "150px", overflowY: "auto", border: "1px solid #444" }}>
        {combatLog.length === 0 ? (
          <div style={{ color: "#666", fontStyle: "italic" }}>Battle is starting...</div>
        ) : (
          combatLog.map((log, index) => (
            <div key={index} style={{ marginBottom: "5px", fontSize: "14px", borderBottom: "1px solid #222", paddingBottom: "4px" }}>
              {log}
            </div>
          ))
        )}
        <div ref={logEndRef} />
      </div>
      
      {/* RENDER THE MODAL */}
      <CharacterStatsModal 
        character={player} 
        isOpen={showPlayerStats} 
        onClose={() => setShowPlayerStats(false)} 
      />

    </div>
  );
};