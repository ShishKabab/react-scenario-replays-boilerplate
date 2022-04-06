import { AuthPageMethods } from "../features/auth/pages/types";
import { ScenarioMap, step } from "../features/scenario-replays/types";

export const SCENARIOS: ScenarioMap<{ AuthPage: AuthPageMethods }> = {
  "login/success": () => [
    step("start", async (context) => await context.navigateTo("/auth")),
    step(
      "email",
      async (context) => await context.componentMethod("AuthPage", "changeEmail", { value: "test@test.com" })
    ),
    step(
      "password",
      async (context) => await context.componentMethod("AuthPage", "changePassword", { value: "spamhameggs" })
    ),
    step("submit", async (context) => await context.componentMethod("AuthPage", "submit", {})),
  ],
};
