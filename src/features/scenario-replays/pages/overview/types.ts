import { ScenarioIdentifier } from "../../types";

export interface ScenarioOverviewProps {
  identifier: ScenarioIdentifier;
}

export interface ScenarioMapInfo {
  name: string;
  scenarios: ScenarioInfo[];
}

export interface ScenarioInfo {
  name: string;
  steps: string[];
}
