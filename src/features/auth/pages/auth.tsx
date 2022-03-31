import * as React from "react";
import { enableScenarios, scenarioCallable } from "../../scenario-replays/decorators";
import { AuthPageMethods } from "./types";

class AuthPage extends React.Component implements AuthPageMethods {
  @scenarioCallable()
  changeEmail(data: { value: string }) {
    console.log("boo!");
  }

  render() {
    return <div onClick={() => this.changeEmail({ value: "test" })}>Auth</div>;
  }
}

export default enableScenarios()(AuthPage);
