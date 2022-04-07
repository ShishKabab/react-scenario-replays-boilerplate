import * as React from "react";
import AppContext, { AppContextData } from "../../../react-context";
import { executeUITask } from "../../../utils/task-state";
import { scenarioComponent, scenarioCallable } from "../../scenario-replays/decorators";
import { TodoItem } from "../types";
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

  @scenarioCallable()
  toggleItem(data: { id: number }) {
    const { items } = this.state.listData!;
    const item = items.find((item) => item.id === data.id)!;
    const isDone = item.done;
    const shouldBeDone = !isDone;
    item.done = shouldBeDone;
    this.forceUpdate();
  }

  @scenarioCallable()
  changeLabel(data: { id: number; label: string }) {
    const { items } = this.state.listData!;
    const item = items.find((item) => item.id === data.id)!;
    item.label = data.label;
    this.forceUpdate();
  }

  renderItems(items: TodoItem[]) {
    return items.map((item) => (
      <div key={item.id}>
        <input type="checkbox" checked={item.done} onChange={() => this.toggleItem({ id: item.id })} />
        <input
          type="text"
          value={item.label}
          onChange={(evt) => this.changeLabel({ id: item.id, label: evt.target.value })}
        />
      </div>
    ));
  }

  render() {
    if (this.state.loadState === "error") {
      return "loading error";
    }
    if (this.state.loadState !== "done" || !this.state.listData) {
      return "loading";
    }
    return this.renderItems(this.state.listData.items);
  }
}

export default scenarioComponent()(TodoListPage);
