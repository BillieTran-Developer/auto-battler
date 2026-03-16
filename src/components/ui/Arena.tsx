import { useEffect, useRef, useState } from "react";
import { type Character, type Enemy } from "../../types/game";
import { useCombatEngine } from "../../hooks/useCombatEngine"; 
import { CharacterStatsModal } from "./CharacterStatsModal";

interface ArenaProps {
  player: Character;
  enemies: Enemy[];
}

export const Arena = ({ player, enemies }: ArenaProps) => {
  const {
    playerHP,
    playerMana,
    playerEnergy,
    combatLog,
    activeEnemies,
  } = useCombatEngine(player, enemies);

  // --- UI STATE ---
  const [showPlayerStats, setShowPlayerStats] = useState(false);

  // --- ANIMATION STATE ---
  const [playerAnim, setPlayerAnim] = useState("idle");
  const prevPlayerHP = useRef(playerHP);

  useEffect(() => {
    if (playerHP < prevPlayerHP.current) {
      setPlayerAnim("hurt-left");
      setTimeout(() => {
        setPlayerAnim("idle");
      }, 200); 
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
    <div style={{ display: "flex", gap: "20px", maxWidth: "1200px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif", backgroundColor: "#1e1e1e", color: "white", borderRadius: "8px", height: "800px" }}>
      
      {/* LEFT COLUMN: STAGE & STATS */}
      <div style={{ flex: "2", display: "flex", flexDirection: "column", gap: "20px" }}>
        
        {/* THE BATTLE STAGE */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: "300px", backgroundColor: "#252525", borderRadius: "8px", padding: "30px", border: "2px solid #333" }}>
          
          {/* Player Graphic */}
          <div style={{ fontSize: "120px", transform: getAnimationClass(playerAnim), transition: "transform 0.1s ease-in-out" }}>
            🤺
          </div>

          {/* Enemy Graphics */}
          <div style={{ display: "flex", gap: "20px" }}>
            {activeEnemies.map(enemy => (
              <div key={enemy.id} style={{ 
                  fontSize: "90px", 
                  opacity: enemy.currentHP > 0 ? 1 : 0.2,
                  transition: "opacity 0.3s ease-in-out"
              }}>
                👹
              </div>
            ))}
          </div>
        </div>

        {/* STATS AREA */}
        <div style={{ display: "flex", gap: "20px", flex: 1 }}>
          
          {/* PLAYER STAT BOX */}
          <div style={{ flex: 1, padding: "20px", backgroundColor: "#2a2a2a", borderRadius: "8px", height: "fit-content" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <h2 style={{ margin: 0 }}>{player.name}</h2>
              <button 
                  onClick={() => setShowPlayerStats(true)}
                  style={{ padding: "6px 12px", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
              >
                  View Stats
              </button>
            </div>
            <Bar label="HP" current={playerHP} max={player.maxHP} color="#ef4444" />
            <Bar label="Mana" current={playerMana} max={player.maxMana} color="#3b82f6" />
            <Bar label="Energy" current={playerEnergy} max={100} color="#eab308" />
          </div>

          {/* ENEMY STAT BOXES (Scrollable!) */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "15px", maxHeight: "300px", overflowY: "auto", paddingRight: "10px" }}>
            {activeEnemies.map(enemy => (
              <div key={enemy.id} style={{ 
                  padding: "15px", 
                  backgroundColor: "#2a2a2a", 
                  borderRadius: "8px",
                  opacity: enemy.currentHP > 0 ? 1 : 0.4,
                  border: "1px solid #444"
              }}>
                <h3 style={{ margin: "0 0 10px 0" }}>{enemy.name}</h3>
                <Bar label="HP" current={enemy.currentHP} max={enemy.maxHP} color="#ef4444" />
                <Bar label="Energy" current={enemy.currentEnergy} max={100} color="#eab308" />
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* RIGHT COLUMN: COMBAT LOG */}
      <div style={{ flex: "1", backgroundColor: "#000", padding: "20px", borderRadius: "8px", border: "2px solid #333", display: "flex", flexDirection: "column" }}>
        <h3 style={{ margin: "0 0 15px 0", color: "#888", borderBottom: "1px solid #333", paddingBottom: "10px" }}>Combat Log</h3>
        
        <div style={{ flex: 1, overflowY: "auto", paddingRight: "10px" }}>
          {combatLog.length === 0 ? (
            <div style={{ color: "#666", fontStyle: "italic" }}>Battle is starting...</div>
          ) : (
            combatLog.map((log, index) => (
              <div key={index} style={{ marginBottom: "8px", fontSize: "14px", borderBottom: "1px solid #1a1a1a", paddingBottom: "6px", lineHeight: "1.4" }}>
                {log}
              </div>
            ))
          )}
          <div ref={logEndRef} />
        </div>
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