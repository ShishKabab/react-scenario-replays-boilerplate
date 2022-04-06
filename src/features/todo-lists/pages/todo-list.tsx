import * as React from "react";
import AppContext, { AppContextData } from "../../../react-context";
import { enableScenarios } from "../../scenario-replays/decorators";

class TodoListPage extends React.Component {
  static contextType = AppContext;
  declare context: AppContextData;

  async componentDidMount() {
    await this.context.backend("/todo/items/default");
  }

  render() {
    return "todo list";
  }
}

export default enableScenarios()(TodoListPage);
