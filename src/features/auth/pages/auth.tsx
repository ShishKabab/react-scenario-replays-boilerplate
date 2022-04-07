import * as React from "react";
import AppContext, { AppContextData } from "../../../react-context";
import { scenarioComponent, scenarioCallable } from "../../scenario-replays/decorators";
import { AuthPageMethods, AuthPageState } from "./types";
import * as logic from "./logic";
import { navigateTo } from "../../../router";

class AuthPage extends React.Component<{}, AuthPageState> implements AuthPageMethods {
  static contextType = AppContext;
  declare context: AppContextData;

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

  @scenarioCallable()
  async submit() {
    if (!logic.isValid(this.state)) {
      return;
    }
    await this.context.backend("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
    });
    navigateTo(this.context.history, "/todo");
  }

  render() {
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
