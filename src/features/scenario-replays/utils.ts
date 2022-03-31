import { ScenarioIdentifier } from "./types";

export function parseScenarioIdentifier(identifierString: string): ScenarioIdentifier {
  const [modulePath, scenarioName] = identifierString.split(".");
  return { modulePath, scenarioName };
}
