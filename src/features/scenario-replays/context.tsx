import { createContext } from "react";
import ComponentRegistry from "./registry";

export interface ScenarioReplayContextData {
  componentRegistry?: ComponentRegistry;
}
const ScenarioReplayContext = createContext<ScenarioReplayContextData>({});

export default ScenarioReplayContext;
