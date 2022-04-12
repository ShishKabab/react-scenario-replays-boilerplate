import { render } from "react-dom";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import { createBrowserHistory, History } from "history";
import ScenarioReplayContext from "../features/scenario-replays/react-context";
import ComponentRegistry from "../features/scenario-replays/component-registry";
import { getRoutes } from "../router";
import { GlobalQueryParams } from "./types";
import { replayScenario } from "../features/scenario-replays/replay";
import AppContext from "../react-context";
import { createBackendConnection, createBackendGate } from "../backend";
import { ScenarioIdentifier } from "../features/scenario-replays/types";
import { parseScenarioIdentifier } from "../features/scenario-replays/utils";

export async function runMainProgram(options?: {
  queryParams?: GlobalQueryParams;
  rootElement?: HTMLElement;
  history?: History;
  scenarioIdentifier?: ScenarioIdentifier;
}) {
  const history = options?.history ?? createBrowserHistory();
  const componentRegistry = new ComponentRegistry();

  let backend = await createBackendConnection();
  if (process.env.NODE_ENV === "development") {
    const backendGate = createBackendGate(backend);
    if (backendGate) {
      backend = backendGate.backend;
    }

    let scenarioIdentifier = options?.scenarioIdentifier;
    if (!scenarioIdentifier && options?.queryParams?.scenario) {
      scenarioIdentifier = parseScenarioIdentifier(options.queryParams.scenario);
    }
    if (scenarioIdentifier) {
      replayScenario(scenarioIdentifier, {
        history,
        componentRegistry,
        backendGate,
      });
    }
  }

  const rootElement = options?.rootElement ?? document.getElementById("root");
  render(
    <ScenarioReplayContext.Provider value={{ componentRegistry }}>
      <AppContext.Provider
        value={{
          backend,
          history,
        }}
      >
        <HistoryRouter history={history}>{getRoutes()}</HistoryRouter>
      </AppContext.Provider>
    </ScenarioReplayContext.Provider>,
    rootElement
  );
}
