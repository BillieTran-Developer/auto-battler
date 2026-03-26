// src/components/equipment/ItemCard.tsx
import { useRef } from "react";
import { useDraggable } from "@dnd-kit/core";
import { type Equipment, type Slot } from "../../types/game";
import { RARITY_COLORS } from "../../ui/theme";

interface ItemCardProps {
    item: Equipment;
    source: "inventory" | "equipped";
    onTooltipEnter?: (item: Equipment, e: React.MouseEvent) => void;
    onTooltipLeave?: () => void;
    onTooltipMove?: (e: React.MouseEvent) => void;
    onEquip?: (item: Equipment, slot: Slot) => void;
    onUnequip?: (slot: Slot) => void;
}

export function ItemCard({
    item,
    source,
    onTooltipEnter,
    onTooltipLeave,
    onTooltipMove,
    onEquip,
    onUnequip,
}: ItemCardProps) {

    const lastClickTime = useRef<number>(0);

    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `item-${item.id}-${source}`,
        data: { item, source },
    });

    const rarityColor = RARITY_COLORS[item.rarity];

    const statSummary = Object.entries(item.stats)
        .filter(([, value]) => value !== 0 && value !== undefined)
        .slice(0, 3)
        .map(([key, value]) => `${key.toUpperCase()} ${value! > 0 ? "+" : ""}${value}`);

    function handleDoubleClick() {
        if (source === "inventory") {
            onEquip?.(item, item.slot);
        } else if (source === "equipped") {
            onUnequip?.(item.slot);
        }
    }

    // Merge our double-click detection with dnd-kit's onPointerDown
    // listeners.onPointerDown starts the drag tracking
    // We run our timer check first, then pass the event to dnd-kit
    function handlePointerDown(e: React.PointerEvent) {
        const now = Date.now();
        const timeSinceLastClick = now - lastClickTime.current;

        if (timeSinceLastClick < 300) {
            // Double click detected — block dnd-kit from starting a drag
            e.stopPropagation();
            handleDoubleClick();
            lastClickTime.current = 0; // reset so triple click doesn't re-fire
            return;
        }

        lastClickTime.current = now;

        // Single click — let dnd-kit handle it normally
        listeners?.onPointerDown?.(e);
    }

    return (
        <div
            ref={setNodeRef}
            // Spread attributes but NOT listeners — we handle
            // onPointerDown manually above to avoid the conflict
            {...attributes}
            onPointerDown={handlePointerDown}
            onMouseEnter={e => onTooltipEnter?.(item, e)}
            onMouseLeave={() => onTooltipLeave?.()}
            onMouseMove={e => onTooltipMove?.(e)}
            style={{
                opacity: isDragging ? 0.35 : 1,
                borderTop: `2px solid ${rarityColor}`,
                backgroundColor: "rgba(255,255,255,0.05)",
                border: `1px solid rgba(255,255,255,0.08)`,
                borderTopColor: rarityColor,
                borderRadius: "7px",
                padding: "8px",
                cursor: isDragging ? "grabbing" : "grab",
                userSelect: "none",
                transition: "opacity 0.15s",
                minWidth: 0,
            }}
        >
            {/* TOP ROW — rarity dot + item name */}
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "3px",
            }}>
                <span style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: rarityColor,
                    flexShrink: 0,
                }} />
                <span style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    color: "#e5e7eb",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}>
                    {item.name}
                </span>
            </div>

            {/* SLOT TYPE */}
            <div style={{
                fontSize: "9px",
                color: "rgba(255,255,255,0.35)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "5px",
            }}>
                {item.slot}
            </div>

            {/* STAT BADGES */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
                {statSummary.map(stat => (
                    <span key={stat} style={{
                        fontSize: "9px",
                        padding: "1px 5px",
                        borderRadius: "3px",
                        backgroundColor: "rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.6)",
                    }}>
                        {stat}
                    </span>
                ))}
            </div>
        </div>
    );
}