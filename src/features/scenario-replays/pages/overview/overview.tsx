import { createMemoryHistory } from "history";
import React from "react";
import styled from "styled-components";
import { SCENARIOS } from "../../../../scenarios";
import { runMainProgram } from "../../../../setup/main";
import { getScenario, getScenarioMap } from "../../replay";
import { ScenarioIdentifier } from "../../types";
import { ScenarioInfo, ScenarioMapInfo, ScenarioOverviewProps } from "./types";

const MapContainer = styled.div``;
const MapTitle = styled.h1``;

const ScenarioOuterContainer = styled.div``;

const ScenarioInnerContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const ScenarioTitle = styled.h2``;

const StepOuterContainer = styled.div``;

const StepInnerContainer = styled.div`
  margin: 10px 20px;
  margin-left: 0px;
  width: 320px;
  height: 640px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
`;
const StepTitle = styled.div``;

const ScenarioLink = styled.a`
  color: inherit;
`;

export class ScenarioOverview extends React.Component<ScenarioOverviewProps> {
  scenariosMaps: ScenarioMapInfo[] = [];

  constructor(props: ScenarioOverviewProps) {
    super(props);

    const { identifier } = props;
    if (!identifier.modulePath) {
      for (const modulePath of Object.keys(SCENARIOS)) {
        this.pushScenarioMap({ modulePath });
      }
    } else {
      this.pushScenarioMap(identifier);
    }
  }

  pushScenarioMap(identifier: ScenarioIdentifier) {
    const mapInfo: ScenarioMapInfo = { name: identifier.modulePath!, scenarios: [] };
    if (!identifier.scenarioName) {
      const scenarioMap = getScenarioMap(identifier);
      for (const [name, scenario] of Object.entries(scenarioMap)) {
        const steps = scenario();
        mapInfo.scenarios.push({ name, steps: steps.map((step) => step.name) });
      }
    } else {
      const scenario = getScenario(identifier);
      const steps = scenario();
      mapInfo.scenarios.push({ name: identifier.scenarioName, steps: steps.map((step) => step.name) });
    }
    this.scenariosMaps.push(mapInfo);
  }

  handleStepRef(map: ScenarioMapInfo, scenario: ScenarioInfo, stepName: string) {
    return (rootElement: HTMLElement | null) => {
      if (!rootElement) {
        return;
      }

      const history = createMemoryHistory();
      const scenarioIdentifier: ScenarioIdentifier = {
        modulePath: map.name,
        scenarioName: scenario.name,
        stepName,
      };
      runMainProgram({
        history,
        scenarioIdentifier,
        rootElement,
      });
    };
  }

  render() {
    return (
      <div>
        {this.scenariosMaps.map((map) => (
          <MapContainer key={map.name}>
            <MapTitle>
              <ScenarioLink href={`/?meta=true&scenario=${map.name}`}>{map.name}</ScenarioLink>
            </MapTitle>
            {map.scenarios.map((scenario) => (
              <ScenarioOuterContainer key={scenario.name}>
                <ScenarioTitle>
                  <ScenarioLink href={`/?meta=true&scenario=${map.name}.${encodeURIComponent(scenario.name)}`}>
                    {scenario.name}
                  </ScenarioLink>
                </ScenarioTitle>
                <ScenarioInnerContainer>
                  {scenario.steps.map((step) => (
                    <StepOuterContainer key={step}>
                      <StepTitle>
                        <ScenarioLink
                          href={`/?scenario=${map.name}.${encodeURIComponent(scenario.name)}.${encodeURIComponent(
                            step
                          )}`}
                        >
                          {step}
                        </ScenarioLink>
                      </StepTitle>
                      <StepInnerContainer ref={this.handleStepRef(map, scenario, step)}></StepInnerContainer>
                    </StepOuterContainer>
                  ))}
                </ScenarioInnerContainer>
              </ScenarioOuterContainer>
            ))}
          </MapContainer>
        ))}
      </div>
    );
  }
}
