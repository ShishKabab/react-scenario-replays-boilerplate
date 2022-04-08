import { AuthPageMethods } from "../features/auth/pages/types";
import { ScenarioMap, ScenarioStep, step } from "../features/scenario-replays/types";

type ScenarioComponents = {
  AuthPage: AuthPageMethods;
};

function fillLoginForm(): ScenarioStep<ScenarioComponents>[] {
  return [
    step(
      "email",
      async (context) => await context.componentMethod("AuthPage", "changeEmail", { value: "test@test.com" })
    ),
    step(
      "password",
      async (context) => await context.componentMethod("AuthPage", "changePassword", { value: "spamhameggs" })
    ),
  ];
}

export const SCENARIOS: ScenarioMap<ScenarioComponents> = {
  "login/success": () => [
    step("start", async (context) => await context.navigateTo("/auth")),
    ...fillLoginForm(),
    step("submit", async (context) => {
      context.blockBackendPath("/auth/login");
      context.componentMethod("AuthPage", "submit", {});
    }),
    step("authenticated", async (context) => {
      context.restoreBackendPath("/auth/login");
    }),
  ],
  "login/submit-error": () => [
    step("start", async (context) => await context.navigateTo("/auth")),
    ...fillLoginForm(),
    step("submit", async (context) => {
      context.sabotageBackendPath("/auth/login");
      context.blockBackendPath("/auth/login");
      context.componentMethod("AuthPage", "submit", {});
    }),
    step("error", async (context) => {
      context.restoreBackendPath("/auth/login");
    }),
  ],
};
