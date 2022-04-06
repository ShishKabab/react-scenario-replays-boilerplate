import { navigateTo } from "../../router";
import {
  ComponentSelector,
  ScenarioComponentMap,
  ScenarioReplayDependencies,
  ScenarioStep,
  StringKeyOf,
} from "./types";

export default class ScenarioContext<Components extends ScenarioComponentMap<Components>> {
  constructor(public deps: ScenarioReplayDependencies) {}

  async navigateTo(path: string) {
    navigateTo(this.deps.history, path);
  }

  componentMethod<
    ComponentName extends StringKeyOf<Components>,
    MethodName extends StringKeyOf<Components[ComponentName]>
  >(
    componentName: ComponentName,
    methodName: MethodName,
    data: Parameters<Components[ComponentName][MethodName]>[0]
  ): Promise<void>;
  componentMethod<
    ComponentName extends StringKeyOf<Components>,
    MethodName extends StringKeyOf<Components[ComponentName]>
  >(
    componentName: ComponentName,
    selector: ComponentSelector,
    methodName: MethodName,
    data: Parameters<Components[ComponentName][MethodName]>[0]
  ): Promise<void>;
  async componentMethod<
    ComponentName extends StringKeyOf<Components>,
    MethodName extends StringKeyOf<Components[ComponentName]>
  >(
    componentName: ComponentName,
    methodNameOrSelector: MethodName | ComponentSelector,
    dataOrMethodName: Parameters<Components[ComponentName][MethodName]>[0] | MethodName,
    maybeData?: Parameters<Components[ComponentName][MethodName]>[0]
  ) {
    const data: Parameters<Components[ComponentName][MethodName]>[0] =
      typeof dataOrMethodName === "string" ? maybeData! : dataOrMethodName;
    const methodName: MethodName =
      typeof methodNameOrSelector === "string"
        ? (methodNameOrSelector as MethodName)
        : (dataOrMethodName as MethodName);
    const selector: ComponentSelector = typeof methodNameOrSelector !== "string" ? methodNameOrSelector : {};
    await this.deps.componentRegistry.componentMethod(componentName, methodName, data, selector);
  }
}
