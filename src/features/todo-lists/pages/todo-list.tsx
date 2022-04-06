import * as React from "react";
import AppContext, { AppContextData } from "../../../react-context";
import { executeUITask } from "../../../utils/task-state";
import { enableScenarios } from "../../scenario-replays/decorators";
import { TodoListPageMethods, TodoListPageState } from "./types";

class TodoListPage extends React.Component implements TodoListPageMethods {
  static contextType = AppContext;
  declare context: AppContextData;

  state: TodoListPageState = {
    loadState: "pristine",
  };

  async componentDidMount() {
    await executeUITask(this, "loadState", async () => {
      const response = await this.context.backend("/todo/items/default");
      this.setState({
        listData: await response.json(),
      });
    });
  }

  render() {
    if (this.state.loadState === "error") {
      return "loading error";
    }
    if (this.state.loadState !== "done") {
      return "loading";
    }
    console.log(this.state.listData);
    return "todo list";
  }
}

export default enableScenarios()(TodoListPage);
