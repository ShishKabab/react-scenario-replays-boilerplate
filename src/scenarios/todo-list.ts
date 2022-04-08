import { AuthPageMethods } from "../features/auth/pages/types";
import { ScenarioMap, step } from "../features/scenario-replays/types";

type ScenarioComponents = {
  AuthPage: AuthPageMethods;
};

export const SCENARIOS: ScenarioMap<ScenarioComponents> = {
  default: () => [
    step("start", async (context) => {
      await context.login("test@test.com");
      await context.blockBackendPath("/todo/items/default");
      await context.navigateTo("/todo");
    }),
    step("loaded", async (context) => {
      await context.restoreBackendPath("/todo/items/default");
    }),
  ],
};
