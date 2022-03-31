import * as React from "react";
import { enableScenarios, scenarioCallable } from "../../scenario-replays/decorators";

class AuthPage extends React.Component {
  @scenarioCallable()
  changeEmail() {
    console.log("boo!");
  }

  render() {
    return <div onClick={() => this.changeEmail()}>Auth</div>;
  }
}

export default enableScenarios()(AuthPage);
