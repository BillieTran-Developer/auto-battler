// src/components/equipment/InventoryGrid.tsx
import { useDroppable } from "@dnd-kit/core";
import { type Equipment, type Slot } from "../../types/game";
import { ItemCard } from "./ItemCard";

interface InventoryGridProps {
    items: Equipment[];
    onEquip: (item: Equipment, slot: Slot) => void;
    onTooltipEnter: (item: Equipment, e: React.MouseEvent) => void;
    onTooltipLeave: () => void;
    onTooltipMove: (e: React.MouseEvent) => void;
}

export function InventoryGrid({
    items,
    onEquip,
    onTooltipEnter,
    onTooltipLeave,
    onTooltipMove,
}: InventoryGridProps) {

    // --- useDroppable ---
    // id is "inventory" — this is what handleDragEnd in
    // EquipmentScreen checks for when an equipped item is
    // dragged back into the inventory area.
    // When isOver is true, we show a subtle highlight so
    // the player knows they can drop here.
    const { setNodeRef, isOver } = useDroppable({
        id: "inventory",
    });

    return (
        <div
            ref={setNodeRef}
            style={{
                // Subtle highlight when dragging over the inventory area
                backgroundColor: isOver
                    ? "rgba(96,165,250,0.05)"
                    : "transparent",
                border: `1px dashed ${isOver
                    ? "rgba(96,165,250,0.4)"
                    : "rgba(255,255,255,0.06)"}`,
                borderRadius: "8px",
                padding: "10px",
                transition: "background-color 0.15s, border-color 0.15s",
                // Minimum height so the drop zone exists even when
                // inventory is empty — otherwise there's nothing to
                // drop onto and the player can't unequip anything
                minHeight: "80px",
            }}
        >
            {/* EMPTY STATE */}
            {items.length === 0 && (
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "60px",
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.2)",
                    fontStyle: "italic",
                }}>
                    All items equipped
                </div>
            )}

            {/* ITEM GRID */}
            {items.length > 0 && (
                <div style={{
                    display: "grid",
                    // auto-fill means as many columns as fit.
                    // minmax(110px, 1fr) means each card is at least
                    // 110px wide but grows to fill available space.
                    gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
                    gap: "6px",
                }}>
                    {items.map(item => (
                        <ItemCard
                            key={item.id}
                            item={item}
                            source="inventory"
                            onEquip={onEquip}
                            onTooltipEnter={onTooltipEnter}
                            onTooltipLeave={onTooltipLeave}
                            onTooltipMove={onTooltipMove}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}