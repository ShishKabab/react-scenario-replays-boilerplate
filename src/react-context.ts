import type { History } from "history";
import { createContext } from "react";
import { BackendRequester } from "./backend";

export interface AppContextData {
  backend: BackendRequester;
  history: History;
}
const AppContext = createContext<AppContextData | null>(null);

export default AppContext;
