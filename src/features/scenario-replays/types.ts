import ScenarioContext from "./scenario-context";

export interface ScenarioIdentifier {
  modulePath: string;
  scenarioName: string;
}

export type ScenarioMap<Components extends ScenarioComponentMap> = {
  [name: string]: (context: ScenarioContext<Components>) => Promise<void>;
};
export type ScenarioComponentMap = Record<string, {}>;
// export type ScenarioComponentMap = { [ComponentName: string]: { [MethodName: string]: Function } };

export type ComponentSelector = { [key: string]: any };
export interface WithComponentSelector {
  componentSelector?: ComponentSelector;
}

export type StringKeyOf<T> = Extract<keyof T, string>;
