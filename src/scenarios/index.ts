import { ScenarioMap } from "../features/scenario-replays/types";

export let SCENARIOS: { [path: string]: ScenarioMap<{}> };
if (process.env.NODE_ENV === "development") {
  SCENARIOS = {
    auth: require("./auth").SCENARIOS,
    "todo-list": require("./todo-list").SCENARIOS,
  };
} else {
  SCENARIOS = {};
}
