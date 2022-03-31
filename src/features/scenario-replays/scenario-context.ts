import ComponentRegistry from "./registry";
import { ComponentSelector, ScenarioComponentMap, StringKeyOf } from "./types";

export default class ScenarioContext<Components extends ScenarioComponentMap> {
  constructor(public deps: { componentRegistry: ComponentRegistry }) {}

  async navigateTo(path: string) {}

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
  }
}
