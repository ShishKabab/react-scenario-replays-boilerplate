import { SCENARIOS } from "../../scenarios";
import ScenarioContext from "./scenario-context";
import { ScenarioReplayDependencies } from "./types";
import { parseScenarioIdentifier } from "./utils";

export async function replayScenario(identfierString: string, dependencies: ScenarioReplayDependencies) {
  const identfier = parseScenarioIdentifier(identfierString);
  const scenarioMap = SCENARIOS[identfier.modulePath];
  const scenario = scenarioMap[identfier.scenarioName];
  const context = new ScenarioContext(dependencies);
  await scenario(context);
}
