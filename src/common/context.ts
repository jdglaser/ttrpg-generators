import { createContext } from "react";
import { AppState, Tables, Tags } from "./types";

export const AppStateContext = createContext<AppState>({
  tables: {} as Tables,
  tags: {} as Tags,
});