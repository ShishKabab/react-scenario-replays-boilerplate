import { ComponentSelector, ScenarioIdentifier } from "./types";

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
