import { useContext } from "react";
import { AppStateContext } from "./context";

export function useAppState() {
    const appState = useContext(AppStateContext)

    return appState;
}