import type { History } from "history";
import { BackendGate } from "../../backend";
import type ComponentRegistry from "./component-registry";
import ScenarioContext from "./scenario-context";

export interface ScenarioIdentifier {
  modulePath?: string;
  scenarioName?: string;
  stepName?: string;
}

export type Scenario<Components extends ScenarioComponentMap<Components>> = () => Array<ScenarioStep<Components>>;

export type ScenarioMap<Components extends ScenarioComponentMap<Components>> = {
  [name: string]: Scenario<Components>;
};
// export type ScenarioComponentMap = Record<string, {}>;
export type ScenarioComponentMap<Components> = {
  [ComponentName in keyof Components]: { [MethodName in keyof Components[ComponentName]]: (...args: any[]) => void };
};

export interface ScenarioStep<Components extends ScenarioComponentMap<Components>> {
  name: string;
  execute: (context: ScenarioContext<Components>) => Promise<void>;
}
export function step<Components extends ScenarioComponentMap<Components>>(
  name: ScenarioStep<Components>["name"],
  execute: ScenarioStep<Components>["execute"]
): ScenarioStep<Components> {
  return { name, execute };
}

export type ComponentSelector = { [key: string]: any };
export type SignalSelector = ComponentSelector;
export interface ComponentSignal {
  name: string;
  selector?: SignalSelector;
}
export interface WithComponentSelector {
  componentSelector?: ComponentSelector;
}

export type StringKeyOf<T> = Extract<keyof T, string>;

export interface ScenarioReplayDependencies {
  history: History;
  backendGate: BackendGate;
  componentRegistry: ComponentRegistry;
}
