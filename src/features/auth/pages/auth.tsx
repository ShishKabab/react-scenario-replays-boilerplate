import * as React from "react";
import { enableScenarios, scenarioCallable } from "../../scenario-replays/decorators";
import { AuthPageMethods } from "./types";

interface AuthPageState {
  email: string;
  password: string;
}
class AuthPage extends React.Component<{}, AuthPageState> implements AuthPageMethods {
  state = {
    email: "",
    password: "",
  };

  @scenarioCallable()
  changeEmail(data: { value: string }) {
    this.setState({ email: data.value });
  }

  @scenarioCallable()
  changePassword(data: { value: string }) {
    this.setState({ password: data.value });
  }

  render() {
    return (
      <div>
        Log in with any e-mail address and password. The dummy backend will accept any e-mail/password combination
        <div>
          <label>
            Email:
            <br />
            <input
              type="email"
              value={this.state.email}
              onChange={(event) =>
                this.changeEmail({
                  value: event.target.value,
                })
              }
            />
          </label>
        </div>
        <div>
          Password:
          <br />
          <input
            type="password"
            value={this.state.password}
            onChange={(event) =>
              this.changePassword({
                value: event.target.value,
              })
            }
          />
        </div>
      </div>
    );
  }
}

export default enableScenarios()(AuthPage);
