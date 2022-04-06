import React from "react";
import styled from "styled-components";
import { getScenario, getScenarioMap } from "../../replay";
import { ScenarioInfo, ScenarioMapInfo, ScenarioOverviewProps } from "./types";

const MapContainer = styled.div``;
const MapTitle = styled.h1``;

const ScenarioContainer = styled.div`
  display: flex;
`;

const ScenarioTitle = styled.h2``;

const StepOuterContainer = styled.div``;

const StepInnerContainer = styled.div`
  margin-top: 10px;
  margin-right: 20px;
  width: 320px;
  height: 640px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
`;
const StepTitle = styled.div``;

export class ScenarioOverview extends React.Component<ScenarioOverviewProps> {
  scenariosMaps: ScenarioMapInfo[] = [];

  constructor(props: ScenarioOverviewProps) {
    super(props);

    const { identifier } = props;
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

  render() {
    return (
      <div>
        {this.scenariosMaps.map((map) => (
          <MapContainer key={map.name}>
            <MapTitle>{map.name}</MapTitle>
            {map.scenarios.map((scenario) => (
              <>
                <ScenarioTitle>{scenario.name}</ScenarioTitle>
                <ScenarioContainer>
                  {scenario.steps.map((step) => (
                    <StepOuterContainer>
                      <StepTitle>{step}</StepTitle>
                      <StepInnerContainer></StepInnerContainer>
                    </StepOuterContainer>
                  ))}
                </ScenarioContainer>
              </>
            ))}
          </MapContainer>
        ))}
      </div>
    );
  }
}
