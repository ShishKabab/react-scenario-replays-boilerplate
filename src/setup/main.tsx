import { render } from "react-dom";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import { createBrowserHistory } from "history";
import ScenarioReplayContext from "../features/scenario-replays/react-context";
import ComponentRegistry from "../features/scenario-replays/registry";
import { getRoutes } from "../router";
import { GlobalQueryParams } from "./types";
import { replayScenario } from "../features/scenario-replays/replay";
import AppContext from "../react-context";
import { createBackendConnection } from "../backend";

export async function runMainProgram(options: { queryParams: GlobalQueryParams }) {
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
      <AppContext.Provider
        value={{
          backend: await createBackendConnection(),
          history,
        }}
      >
        <HistoryRouter history={history}>{getRoutes()}</HistoryRouter>
      </AppContext.Provider>
    </ScenarioReplayContext.Provider>,
    rootElement
  );
}
