import { History } from "history";
import ComponentRegistry from "./registry";

export async function replayScenario(
  identfierString: string,
  dependencies: {
    history: History;
    componentRegistry: ComponentRegistry;
  }
) {}
