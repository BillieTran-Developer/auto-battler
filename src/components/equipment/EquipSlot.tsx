// src/components/equipment/EquipSlot.tsx
import { useDroppable, useDndContext } from "@dnd-kit/core";
import { type Equipment, type Slot } from "../../types/game";
import { RARITY_COLORS } from "../../ui/theme";
import { ItemCard } from "./ItemCard";

const SLOT_ICONS: Record<Slot, string> = {
    HEAD: "🪖",
    BODY: "🥋",
    BOOTS: "👢",
    WEAPON: "⚔️",
    NECKLACE: "📿",
    RING: "💍",
};

interface EquipSlotProps {
    slotId: Slot;
    item: Equipment | null;
    onUnequip: (slot: Slot) => void;
    // We need onEquip here so we can pass it into the ItemCard
    // sitting inside an occupied slot — handles swapping via double click
    onEquip: (item: Equipment, slot: Slot) => void;
    onTooltipEnter: (item: Equipment, e: React.MouseEvent) => void;
    onTooltipLeave: () => void;
    onTooltipMove: (e: React.MouseEvent) => void;
}

export function EquipSlot({
    slotId,
    item,
    onUnequip,
    onEquip,
    onTooltipEnter,
    onTooltipLeave,
    onTooltipMove,
}: EquipSlotProps) {

    const { setNodeRef, isOver } = useDroppable({
        id: `slot-${slotId}`,
        data: { slot: slotId },
    });

    const { active } = useDndContext();
    const draggedItem = active?.data.current?.item as Equipment | undefined;
    const isValidDrop = draggedItem?.slot === slotId;
    const isHovering = isOver;

    const getBorderColor = () => {
        if (isHovering && isValidDrop) return "#34d399";
        if (isHovering && !isValidDrop) return "#ef4444";
        if (item) return RARITY_COLORS[item.rarity];
        return "rgba(255,255,255,0.1)";
    };

    const getBackgroundColor = () => {
        if (isHovering && isValidDrop) return "rgba(52,211,153,0.1)";
        if (isHovering && !isValidDrop) return "rgba(239,68,68,0.1)";
        return "rgba(255,255,255,0.03)";
    };

    return (
        <div
            ref={setNodeRef}
            style={{
                width: "140px",
                height: "60px",
                borderRadius: "8px",
                border: `1px ${item ? "solid" : "dashed"} ${getBorderColor()}`,
                backgroundColor: getBackgroundColor(),
                display: "flex",
                alignItems: "center",
                padding: "4px",
                transition: "border-color 0.15s, background-color 0.15s",
                position: "relative",
            }}
        >
            {item ? (
                <div style={{ width: "100%" }}>
                    <ItemCard
                        item={item}
                        source="equipped"
                        onTooltipEnter={onTooltipEnter}
                        onTooltipLeave={onTooltipLeave}
                        onTooltipMove={onTooltipMove}
                        // Pass both handlers so double clicking an
                        // equipped item unequips it, and dragging a
                        // different item onto this slot swaps correctly
                        onEquip={onEquip}
                        onUnequip={onUnequip}
                    />
                </div>
            ) : (
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "4px 6px",
                    width: "100%",
                }}>
                    <span style={{ fontSize: "20px", opacity: 0.4 }}>
                        {SLOT_ICONS[slotId]}
                    </span>
                    <div>
                        <div style={{
                            fontSize: "9px",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            color: "rgba(255,255,255,0.25)",
                        }}>
                            {slotId}
                        </div>
                        <div style={{
                            fontSize: "10px",
                            color: "rgba(255,255,255,0.2)",
                            fontStyle: "italic",
                        }}>
                            empty
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}