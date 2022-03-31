import { ScenarioComponentMap } from "./types";

export default class ScenarioContext<Components extends ScenarioComponentMap> {
  async navigateTo(path: string) {}

  async waitForComponent(componentName: keyof Components) {}
}
