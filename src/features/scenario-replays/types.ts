import type { History } from "history";
import type ComponentRegistry from "./registry";
import ScenarioContext from "./scenario-context";

export interface ScenarioIdentifier {
  modulePath: string;
  scenarioName: string;
  stepName?: string;
}

export type Scenario<Components extends ScenarioComponentMap<Components>> = (
  context: ScenarioContext<Components>
) => Promise<ScenarioStep[]>;

export type ScenarioMap<Components extends ScenarioComponentMap<Components>> = {
  [name: string]: Scenario<Components>;
};
// export type ScenarioComponentMap = Record<string, {}>;
export type ScenarioComponentMap<Components> = {
  [ComponentName in keyof Components]: { [MethodName in keyof Components[ComponentName]]: (...args: any[]) => void };
};

export interface ScenarioStep {
  name: string;
  execute: (...args: any[]) => void;
}

export type ComponentSelector = { [key: string]: any };
export interface WithComponentSelector {
  componentSelector?: ComponentSelector;
}

export type StringKeyOf<T> = Extract<keyof T, string>;

export interface ScenarioReplayDependencies {
  history: History;
  componentRegistry: ComponentRegistry;
}
