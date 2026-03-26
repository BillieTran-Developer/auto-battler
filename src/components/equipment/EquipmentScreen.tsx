// src/components/equipment/EquipmentScreen.tsx
import { useState } from "react";
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    type DragStartEvent,
    type DragEndEvent,
} from "@dnd-kit/core";
import { type Character, type Equipment, type Slot } from "../../types/game";
import { PaperDoll } from "./PaperDoll";
import { InventoryGrid } from "./InventoryGrid";
import { ItemCard } from "./ItemCard";
import { ItemTooltip } from "./ItemTooltip";

// --- PROPS ---
// These are the values and functions App.tsx passes down to this component.
// EquipmentScreen never owns or creates these — it just uses them.
interface EquipmentScreenProps {
    character: Character;
    onEquip: (item: Equipment, slot: Slot) => void;
    onUnequip: (slot: Slot) => void;
    onEnterBattle: () => void;
}

export function EquipmentScreen({
    character,
    onEquip,
    onUnequip,
    onEnterBattle,
}: EquipmentScreenProps) {

    // Tracks which item is currently being dragged.
    // null means nothing is being dragged right now.
    const [activeItem, setActiveItem] = useState<Equipment | null>(null);

    // Tracks which item the mouse is hovering over (for tooltip).
    const [tooltip, setTooltip] = useState<{
        item: Equipment;
        x: number;
        y: number;
    } | null>(null);

    // --- SENSORS ---
    // PointerSensor handles mouse AND touch input.
    // activationConstraint means the user has to move 5px before a drag starts.
    // This prevents accidental drags when the player just wants to click.
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        })
    );

    // --- DRAG START ---
    // Fires the moment a drag begins.
    // We store the item being dragged so DragOverlay knows what to render.
    function handleDragStart(event: DragStartEvent) {
        const item = event.active.data.current?.item as Equipment;
        setActiveItem(item);
        setTooltip(null); // hide tooltip while dragging
    }

    // --- DRAG END ---
    // This is the most important function — it fires when the user
    // drops an item. We read WHERE it was dropped and act accordingly.
    function handleDragEnd(event: DragEndEvent) {
        // Always clear the active item when drag ends
        setActiveItem(null);

        // If dropped outside any valid target, do nothing
        if (!event.over) return;

        const item = event.active.data.current?.item as Equipment;
        const source = event.active.data.current?.source as "inventory" | "equipped";
        const overId = String(event.over.id);

        // --- DROPPED ON AN EQUIPMENT SLOT ---
        // overId will look like "slot-HEAD" or "slot-WEAPON" etc.
        if (overId.startsWith("slot-")) {
            const targetSlot = overId.replace("slot-", "") as Slot;
            // onEquip handles the slot validation and swap logic
            // (we already wrote this in useCharacter)
            onEquip(item, targetSlot);
            return;
        }

        // --- DROPPED BACK ON INVENTORY ---
        // Only makes sense if the item came FROM an equipment slot
        if (overId === "inventory" && source === "equipped") {
            onUnequip(item.slot);
            return;
        }
    }

    // --- TOOLTIP HANDLERS ---
    // These get passed down to ItemCard and EquipSlot so they can
    // trigger the tooltip on hover. We bundle them into one object
    // to avoid repeating the same three props everywhere.
    const tooltipHandlers = {
        onTooltipEnter: (item: Equipment, e: React.MouseEvent) => {
            // Don't show tooltip while dragging
            if (activeItem) return;
            setTooltip({ item, x: e.clientX, y: e.clientY });
        },
        onTooltipLeave: () => setTooltip(null),
        onTooltipMove: (e: React.MouseEvent) => {
            setTooltip(prev =>
                prev ? { ...prev, x: e.clientX, y: e.clientY } : null
            );
        },
    };

    return (
        // DndContext MUST wrap everything that participates in drag and drop.
        // It's the "arena" that dnd-kit uses to track draggables and droppables.
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div style={{
                padding: "24px",
                backgroundColor: "#1e1e1e",
                minHeight: "100vh",
                color: "#e5e7eb",
                fontFamily: "sans-serif",
            }}>

                {/* SCREEN TITLE */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                }}>
                    <h1 style={{ margin: 0, fontSize: "20px", color: "#e5e7eb" }}>
                        Equipment
                    </h1>

                    {/* ENTER BATTLE BUTTON */}
                    {/* Calls onEnterBattle which lives in App.tsx */}
                    {/* App.tsx then switches the screen to "arena" */}
                    <button
                        onClick={onEnterBattle}
                        style={{
                            padding: "10px 24px",
                            backgroundColor: "#dc2626",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "bold",
                            letterSpacing: "0.05em",
                        }}
                    >
                        ENTER BATTLE →
                    </button>
                </div>

                {/* PAPER DOLL — silhouette + equipment slots */}
                <PaperDoll
                    equipped={character.equipped}
                    onUnequip={onUnequip}
                    onEquip={onEquip}
                    {...tooltipHandlers}
                />

                {/* DIVIDER */}
                <div style={{
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                    margin: "20px 0",
                }} />

                {/* INVENTORY LABEL */}
                <div style={{
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "rgba(255,255,255,0.4)",
                    marginBottom: "10px",
                }}>
                    Inventory ({character.inventory.length} items)
                </div>

                {/* INVENTORY GRID — all unequipped items */}
                <InventoryGrid
                    items={character.inventory}
                    onEquip={onEquip}
                    {...tooltipHandlers}
                />

                {/* DRAG OVERLAY */}
                {/* This renders the floating ghost card while dragging. */}
                {/* It only renders when activeItem is not null. */}
                <DragOverlay>
                    {activeItem && (
                        <div style={{ transform: "rotate(2deg)", opacity: 0.9 }}>
                            <ItemCard
                                item={activeItem}
                                source="inventory"
                            />
                        </div>
                    )}
                </DragOverlay>

                {/* TOOLTIP */}
                {/* Renders near the mouse when hovering an item */}
                <ItemTooltip
                    item={tooltip?.item ?? null}
                    x={tooltip?.x ?? 0}
                    y={tooltip?.y ?? 0}
                />

            </div>
        </DndContext>
    );
}