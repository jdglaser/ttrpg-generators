import { createContext } from "react";
import { AppState, Optional } from "./types";

export const AppStateContext = createContext<Optional<AppState>>(null);