import { useContext } from "react";
import { AppStateContext } from "./context";

export function useAppState() {
    const appState = useContext(AppStateContext)

    if (!appState) {
        throw Error("useAppState must be used in an AppState context provider")
    }
    return appState;
}