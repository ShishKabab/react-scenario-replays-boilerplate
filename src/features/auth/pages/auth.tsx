import * as React from "react";
import AppContext, { AppContextData } from "../../../react-context";
import { scenarioComponent, scenarioCallable } from "../../scenario-replays/decorators";
import { AuthPageMethods, AuthPageState } from "./types";
import * as logic from "./logic";
import { navigateTo } from "../../../router";
import { executeUITask } from "../../../utils/task-state";
import { login } from "../utils";

class AuthPage extends React.Component<{}, AuthPageState> implements AuthPageMethods {
  static contextType = AppContext;
  declare context: AppContextData;

  state: AuthPageState = {
    email: "",
    password: "",
    submitState: "pristine",
  };

  @scenarioCallable()
  changeEmail(data: { value: string }) {
    this.setState({ email: data.value });
  }

  @scenarioCallable()
  changePassword(data: { value: string }) {
    this.setState({ password: data.value });
  }

  @scenarioCallable()
  async submit() {
    if (!logic.isValid(this.state)) {
      return;
    }
    await executeUITask(this, "submitState", async () => {
      await login(this.context.backend, this.state.email, this.state.password);
    });
    navigateTo(this.context.history, "/todo");
  }

  render() {
    if (this.state.submitState === "running") {
      return "Logging in...";
    }
    if (this.state.submitState === "error") {
      return "Error logging in...";
    }

    return (
      <div>
        Log in with any e-mail address and password. The dummy backend will accept any e-mail/password combination.
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
        <button onClick={() => this.submit()}>Login</button>
      </div>
    );
  }
}

export default scenarioComponent()(AuthPage);
