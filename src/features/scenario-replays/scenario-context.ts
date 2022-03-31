import { ScenarioComponentMap } from "./types";

export default class ScenarioContext<Components extends ScenarioComponentMap> {
  async navigateTo(path: string) {}

  async waitForComponent(componentName: keyof Components) {}

  async componentMethod<ComponentName extends keyof Components, MethodName extends keyof Components[ComponentName]>(
    componentName: ComponentName,
    methodName: MethodName,
    data: Parameters<Components[ComponentName][MethodName]>[0]
  ) {}
}
