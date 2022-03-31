import { AuthPageMethods } from "../features/auth/pages/types";
import { ScenarioMap } from "../features/scenario-replays/types";

export const SCENARIOS: ScenarioMap<{ AuthPage: AuthPageMethods }> = {
  "login/success": async (context) => {
    await context.waitForComponent("AuthPage");
  },
};
