import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import ScenarioReplayContext from "../features/scenario-replays/react-context";
import ComponentRegistry from "../features/scenario-replays/registry";
import { getRoutes } from "../router";
import { GlobalQueryParams } from "./types";

export function runMainProgram(options: { queryParams: GlobalQueryParams }) {
  console.log("main prog");
  if (options.queryParams.scenario) {
  }

  const componentRegistry = new ComponentRegistry();
  const rootElement = document.getElementById("root");
  render(
    <ScenarioReplayContext.Provider value={{ componentRegistry }}>
      <BrowserRouter>{getRoutes()}</BrowserRouter>
    </ScenarioReplayContext.Provider>,
    rootElement
  );
}
