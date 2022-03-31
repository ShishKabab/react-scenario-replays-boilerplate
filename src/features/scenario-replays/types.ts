import ScenarioContext from "./scenario-context";

export interface ScenarioIdentifier {
  modulePath: string;
  scenarioName: string;
}

export type ScenarioMap<Components extends ScenarioComponentMap> = {
  [name: string]: (context: ScenarioContext<Components>) => Promise<void>;
};
export type ScenarioComponentMap = { [ComponentName: string]: { [MethodName: string]: Function } };
