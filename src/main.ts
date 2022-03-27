import * as qs from "qs";
import { runMainProgram } from "./setup/main";
import { runMetaProgram } from "./setup/meta";
import { GlobalQueryParams } from "./setup/types";

export function main() {
  const allQueryParams = qs.parse(window.location.search, { ignoreQueryPrefix: true });
  const queryParams = allQueryParams as any as GlobalQueryParams;
  if (process.env.NODE_ENV === "development") {
    if (allQueryParams["meta"] === "true") {
      return runMetaProgram({ queryParams });
    }
  }
  return runMainProgram({ queryParams });
}
