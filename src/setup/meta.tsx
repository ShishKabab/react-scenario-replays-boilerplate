import { render } from "react-dom";
import { ScenarioOverview } from "../features/scenario-replays/pages/overview/overview";
import { parseScenarioIdentifier } from "../features/scenario-replays/utils";
import { GlobalQueryParams } from "./types";

export function runMetaProgram(options: { queryParams: GlobalQueryParams }) {
  const identifier = parseScenarioIdentifier(options.queryParams.scenario);
  const rootElement = document.getElementById("root");
  render(<ScenarioOverview identifier={identifier} />, rootElement);
}
