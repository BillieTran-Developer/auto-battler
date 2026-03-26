// src/components/equipment/PaperDoll.tsx
import { type Equipment, type Slot } from "../../types/game";
import { EquipSlot } from "./EquipSlot";
import { calculateSetBonuses } from "../../logic/setBonuses";

// Which slots go on each side of the silhouette
const LEFT_SLOTS: Slot[] = ["HEAD", "BODY", "BOOTS"];
const RIGHT_SLOTS: Slot[] = ["WEAPON", "NECKLACE", "RING"];

interface PaperDollProps {
    equipped: Record<Slot, Equipment | null>;
    onUnequip: (slot: Slot) => void;
    onEquip: (item: Equipment, slot: Slot) => void;  // ADD THIS
    onTooltipEnter: (item: Equipment, e: React.MouseEvent) => void;
    onTooltipLeave: () => void;
    onTooltipMove: (e: React.MouseEvent) => void;
}

export function PaperDoll({
    equipped,
    onUnequip,
    onEquip,
    onTooltipEnter,
    onTooltipLeave,
    onTooltipMove,
}: PaperDollProps) {

    // Calculate active set bonuses to display below the silhouette.
    // This recalculates automatically whenever equipped changes because
    // equipped is a prop — any change in App.tsx flows down here.
    const { activeClassBonus, activeSubclassBonuses } = calculateSetBonuses(equipped);

    // Bundle tooltip handlers so we don't repeat them on every EquipSlot
    const slotProps = {
        onUnequip,
        onEquip,
        onTooltipEnter,
        onTooltipLeave,
        onTooltipMove,
    };

    return (
        <div>
            {/* THREE COLUMN LAYOUT */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 160px 1fr",
                gap: "12px",
                alignItems: "center",
            }}>

                {/* LEFT COLUMN — HEAD, BODY, BOOTS */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    alignItems: "flex-end", // slots hug the silhouette
                }}>
                    {LEFT_SLOTS.map(slot => (
                        <EquipSlot
                            key={slot}
                            slotId={slot}
                            item={equipped[slot]}
                            {...slotProps}
                        />
                    ))}
                </div>

                {/* CENTER COLUMN — silhouette + set bonuses */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "12px",
                }}>
                    {/* CHARACTER SILHOUETTE */}
                    {/* Placeholder SVG — swap this out for your vector art later */}
                    <div style={{
                        width: "120px",
                        height: "180px",
                        borderRadius: "12px",
                        border: "1px solid rgba(255,255,255,0.08)",
                        backgroundColor: "rgba(255,255,255,0.03)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        <svg
                            width="60"
                            height="120"
                            viewBox="0 0 60 120"
                            fill="white"
                            opacity={0.15}
                        >
                            {/* Head */}
                            <circle cx="30" cy="14" r="12" />
                            {/* Torso */}
                            <rect x="16" y="28" width="28" height="38" rx="4" />
                            {/* Left arm */}
                            <rect x="4" y="28" width="11" height="32" rx="4" />
                            {/* Right arm */}
                            <rect x="45" y="28" width="11" height="32" rx="4" />
                            {/* Left leg */}
                            <rect x="17" y="66" width="12" height="36" rx="4" />
                            {/* Right leg */}
                            <rect x="31" y="66" width="12" height="36" rx="4" />
                        </svg>
                    </div>

                    {/* SET BONUS PANEL */}
                    <div style={{
                        width: "100%",
                        backgroundColor: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "8px",
                        padding: "8px 10px",
                    }}>
                        <div style={{
                            fontSize: "9px",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            color: "rgba(255,255,255,0.3)",
                            marginBottom: "6px",
                        }}>
                            Set Bonuses
                        </div>

                        {/* No bonuses active */}
                        {!activeClassBonus && activeSubclassBonuses.length === 0 && (
                            <div style={{
                                fontSize: "11px",
                                color: "rgba(255,255,255,0.25)",
                                fontStyle: "italic",
                            }}>
                                None active
                            </div>
                        )}

                        {/* Class bonus — needs all 4 pieces */}
                        {activeClassBonus && (
                            <div style={{
                                fontSize: "11px",
                                color: "#f59e0b",
                                backgroundColor: "rgba(245,158,11,0.1)",
                                border: "1px solid rgba(245,158,11,0.25)",
                                borderRadius: "4px",
                                padding: "2px 8px",
                                marginBottom: "4px",
                                display: "inline-block",
                            }}>
                                ✦ {activeClassBonus[0]} (4pc)
                            </div>
                        )}

                        {/* Subclass bonuses — needs 2+ pieces */}
                        {activeSubclassBonuses.map(([name, count]) => (
                            <div
                                key={name}
                                style={{
                                    fontSize: "11px",
                                    color: "#60a5fa",
                                    backgroundColor: "rgba(96,165,250,0.1)",
                                    border: "1px solid rgba(96,165,250,0.2)",
                                    borderRadius: "4px",
                                    padding: "2px 8px",
                                    marginBottom: "4px",
                                    display: "inline-block",
                                    marginRight: "4px",
                                }}>
                                ◆ {name} ({count}pc)
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT COLUMN — WEAPON, NECKLACE, RING */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    alignItems: "flex-start", // slots hug the silhouette
                }}>
                    {RIGHT_SLOTS.map(slot => (
                        <EquipSlot
                            key={slot}
                            slotId={slot}
                            item={equipped[slot]}
                            {...slotProps}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
}