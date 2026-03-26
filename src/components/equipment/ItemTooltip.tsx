// src/components/equipment/ItemTooltip.tsx
import { type Equipment } from "../../types/game";
import { RARITY_COLORS } from "../../ui/theme";

interface ItemTooltipProps {
    item: Equipment | null;
    x: number;
    y: number;
}

export function ItemTooltip({ item, x, y }: ItemTooltipProps) {

    // If no item is being hovered, render nothing at all
    if (!item) return null;

    const rarityColor = RARITY_COLORS[item.rarity];

    // Build the full stat list — unlike ItemCard which shows 3 max,
    // the tooltip shows everything including negatives like AGI -1
    const allStats = Object.entries(item.stats)
        .filter(([, value]) => value !== undefined && value !== 0)
        .map(([key, value]) => ({
            label: key.toUpperCase(),
            value: value!,
            // Negative stats are red, positive are green
            color: value! > 0 ? "#4ade80" : "#f87171",
        }));

    // Position logic — if the tooltip would go off the right edge
    // of the screen, flip it to the left of the cursor instead.
    // Same for the bottom edge.
    const tooltipWidth = 210;
    const tooltipHeight = 200;
    const adjustedX = x + tooltipWidth > window.innerWidth
        ? x - tooltipWidth - 12
        : x + 14;
    const adjustedY = y + tooltipHeight > window.innerHeight
        ? y - tooltipHeight
        : y + 14;

    return (
        <div style={{
            // fixed positioning means it's relative to the viewport,
            // not the page — so it won't scroll away with the content
            position: "fixed",
            left: adjustedX,
            top: adjustedY,
            zIndex: 9999,
            // pointerEvents none means the tooltip itself won't
            // interfere with mouse events on items below it
            pointerEvents: "none",
            width: tooltipWidth,
            backgroundColor: "#0f0f1a",
            border: `1px solid ${rarityColor}`,
            borderRadius: "8px",
            padding: "10px 12px",
            fontSize: "12px",
            color: "#e5e7eb",
        }}>

            {/* ITEM NAME */}
            <div style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#ffffff",
                marginBottom: "2px",
            }}>
                {item.name}
            </div>

            {/* RARITY + SLOT ROW */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
            }}>
                <span style={{
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: rarityColor,
                }}>
                    {item.rarity}
                </span>
                <span style={{
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "rgba(255,255,255,0.35)",
                }}>
                    {item.slot}
                </span>
            </div>

            {/* DIVIDER */}
            <div style={{
                borderTop: `1px solid rgba(255,255,255,0.08)`,
                marginBottom: "8px",
            }} />

            {/* STATS */}
            {allStats.length > 0 && (
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "3px",
                    marginBottom: "8px",
                }}>
                    {allStats.map(({ label, value, color }) => (
                        <div
                            key={label}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: "11px",
                            }}
                        >
                            <span style={{ color: "rgba(255,255,255,0.5)" }}>
                                {label}
                            </span>
                            <span style={{ color, fontWeight: 500 }}>
                                {value > 0 ? `+${value}` : value}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* DIVIDER */}
            <div style={{
                borderTop: "1px solid rgba(255,255,255,0.08)",
                marginBottom: "8px",
            }} />

            {/* DESCRIPTION */}
            <div style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.5)",
                lineHeight: "1.5",
                marginBottom: "6px",
            }}>
                {item.description}
            </div>

            {/* EFFECT */}
            {item.effect && (
                <div style={{
                    fontSize: "11px",
                    color: "#a78bfa",
                    lineHeight: "1.4",
                    borderTop: "1px solid rgba(167,139,250,0.2)",
                    paddingTop: "6px",
                }}>
                    ✦ {item.effect}
                </div>
            )}

            {/* KINGDOM + CLASS — subtle footer */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "8px",
                paddingTop: "6px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
            }}>
                <span style={{
                    fontSize: "9px",
                    color: "rgba(255,255,255,0.2)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                }}>
                    {item.kingdom}
                </span>
                <span style={{
                    fontSize: "9px",
                    color: "rgba(255,255,255,0.2)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                }}>
                    {item.subClass}
                </span>
            </div>

        </div>
    );
}