import { createContext } from "react";
import ComponentRegistry from "./component-registry";

export interface ScenarioReplayContextData {
  componentRegistry?: ComponentRegistry;
}
const ScenarioReplayContext = createContext<ScenarioReplayContextData>({});

export default ScenarioReplayContext;
