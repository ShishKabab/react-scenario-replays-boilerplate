import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { getRoutes } from "../router";
import { GlobalQueryParams } from "./types";

export function runMainProgram(options: { queryParams: GlobalQueryParams }) {
  console.log("main prog");
  if (options.queryParams.scenario) {
  }

  const rootElement = document.getElementById("root");
  render(<BrowserRouter>{getRoutes()}</BrowserRouter>, rootElement);
}
