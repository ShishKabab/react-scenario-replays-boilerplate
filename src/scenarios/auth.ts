import { AuthPageMethods } from "../features/auth/pages/types";
import { ScenarioMap } from "../features/scenario-replays/types";

export const SCENARIOS: ScenarioMap<{ AuthPage: AuthPageMethods }> = {
  "login/success": async (context) => [
    context.step("start", async () => await context.navigateTo("/auth")),
    context.step(
      "email",
      async () => await context.componentMethod("AuthPage", "changeEmail", { value: "test@test.com" })
    ),
    context.step(
      "password",
      async () => await context.componentMethod("AuthPage", "changePassword", { value: "spamhameggs" })
    ),
    context.step("submit", async () => await context.componentMethod("AuthPage", "submit", {})),
  ],
};
