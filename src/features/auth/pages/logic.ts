import { AuthPageState } from "./types";

export function isValid(state: AuthPageState) {
  return state.email.length > 3 && state.email.includes("@") && state.password.length > 3;
}
