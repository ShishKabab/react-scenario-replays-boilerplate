import type React from "react";
import type ComponentRegistry from "./component-registry";
import type { ComponentSelector, ComponentSignal, ScenarioIdentifier, SignalSelector } from "./types";

export function parseScenarioIdentifier(identifierString: string): ScenarioIdentifier {
  const [modulePath, scenarioName, stepName] = identifierString.split(".");
  return { modulePath, scenarioName, stepName };
}

export function matchComponentSelector(actual: ComponentSelector, expected: ComponentSelector) {
  for (const key of Object.keys(expected)) {
    if (actual[key] !== expected[key]) {
      return false;
    }
  }

  return true;
}

export function emitSignal(component: React.Component, signal: ComponentSignal) {
  const tryEmit = () => {
    const componentRegistry: ComponentRegistry = (component as any)._componentRegistry;
    if (!componentRegistry) {
      setTimeout(tryEmit, 100);
      return;
    }
    componentRegistry.emitSignal((component as any)._componentId, signal);
  };
  tryEmit();
}
