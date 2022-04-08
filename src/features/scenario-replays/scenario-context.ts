import { navigateTo } from "../../router";
import { login } from "../auth/utils";
import {
  ComponentSelector,
  ComponentSignal,
  ScenarioComponentMap,
  ScenarioReplayDependencies,
  StringKeyOf,
} from "./types";

export default class ScenarioContext<Components extends ScenarioComponentMap<Components>> {
  _undoBackendModifications: { [url: string]: () => void } = {};

  constructor(public deps: ScenarioReplayDependencies) {}

  async navigateTo(path: string) {
    navigateTo(this.deps.history, path);
  }

  async login(email: string) {
    await login(this.deps.backendGate.backend, email, "testtest");
  }

  waitForSignal<ComponentName extends StringKeyOf<Components>>(
    componentName: ComponentName,
    componentSelector: ComponentSelector,
    searchSignal: ComponentSignal
  ) {
    return this.deps.componentRegistry.waitForSignal(componentName, componentSelector, searchSignal);
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

  blockBackendPath(path: string) {
    const { undo } = this.deps.backendGate.blockPath(path);
    this._undoBackendModifications[path] = undo;
  }

  sabotageBackendPath(path: string) {
    const { undo } = this.deps.backendGate.sabotagePath(path);
    this._undoBackendModifications[path] = undo;
  }

  restoreBackendPath(path: string) {
    this._undoBackendModifications[path]?.();
    delete this._undoBackendModifications[path];
  }
}
