import { render } from "react-dom";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import { createBrowserHistory } from "history";
import ScenarioReplayContext from "../features/scenario-replays/react-context";
import ComponentRegistry from "../features/scenario-replays/registry";
import { getRoutes } from "../router";
import { GlobalQueryParams } from "./types";
import { replayScenario } from "../features/scenario-replays/replay";

export function runMainProgram(options: { queryParams: GlobalQueryParams }) {
  console.log("main prog");
  const history = createBrowserHistory();
  const componentRegistry = new ComponentRegistry();
  if (options.queryParams.scenario) {
    replayScenario(options.queryParams.scenario, {
      history,
      componentRegistry,
    });
  }

  const rootElement = document.getElementById("root");
  render(
    <ScenarioReplayContext.Provider value={{ componentRegistry }}>
      <HistoryRouter history={history}>{getRoutes()}</HistoryRouter>
    </ScenarioReplayContext.Provider>,
    rootElement
  );
}
