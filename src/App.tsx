// src/App.tsx
import { useState } from "react";
import { Arena } from "./components/ui/Arena";
import { EquipmentScreen } from "./components/equipment";
import { useCharacter } from "./hooks/useCharacter";
import { TEST_PLAYER, TEST_ENEMIES } from "./data/testData";

// These are the two screens in the game right now.
// Later this will be replaced by a proper router (React Router)
// but a simple string toggle is perfect for now.
type Screen = "equipment" | "arena";

export default function App() {

    // useCharacter owns ALL character state.
    // equipItem and unequipItem are the only ways to change it.
    // Both screens receive character but only EquipmentScreen can mutate it.
    const { character, equipItem, unequipItem } = useCharacter(TEST_PLAYER);

    // Track which screen is currently visible
    const [screen, setScreen] = useState<Screen>("equipment");

    return (
        <div style={{ backgroundColor: "#121212", minHeight: "100vh" }}>

            {/* EQUIPMENT / PREP SCREEN */}
            {screen === "equipment" && (
                <EquipmentScreen
                    character={character}
                    onEquip={equipItem}
                    onUnequip={unequipItem}
                    onEnterBattle={() => setScreen("arena")}
                />
            )}

            {/* ARENA / COMBAT SCREEN */}
            {screen === "arena" && (
                <Arena
                    player={character}
                    enemies={TEST_ENEMIES}
                    onExitBattle={() => setScreen("equipment")}
                />
            )}

        </div>
    );
}