import { SCENARIOS } from "../../scenarios";
import ScenarioContext from "./scenario-context";
import { ScenarioIdentifier, ScenarioReplayDependencies } from "./types";
import { parseScenarioIdentifier } from "./utils";

export function getScenarioMap(identfier: ScenarioIdentifier) {
  return SCENARIOS[identfier.modulePath!];
}

export function getScenario(identfier: ScenarioIdentifier) {
  const scenarioMap = getScenarioMap(identfier);
  return scenarioMap[identfier.scenarioName!];
}

export async function replayScenario(identfierString: string, dependencies: ScenarioReplayDependencies) {
  const identfier = parseScenarioIdentifier(identfierString);
  const scenario = getScenario(identfier);
  const context = new ScenarioContext(dependencies);
  const steps = await scenario();
  for (const step of steps) {
    await step.execute(context);
    if (identfier.stepName && step.name === identfier.stepName) {
      break;
    }
  }
}
