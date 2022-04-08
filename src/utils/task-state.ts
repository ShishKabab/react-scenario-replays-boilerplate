import React from "react";
import { emitSignal } from "../features/scenario-replays/utils";

export type TaskState = "pristine" | "running" | "done" | "error";

export async function executeUITask<Component extends React.Component>(
  component: Component,
  stateKey: keyof Component["state"],
  f: () => Promise<void>
) {
  const update = (taskState: TaskState) => {
    emitSignal(component, { name: "taskState", selector: { key: stateKey, taskState } });
    component.setState({ [stateKey]: taskState });
  };
  update("running");
  try {
    await f();
    update("done");
  } catch (err) {
    update("error");
    throw err;
  }
}
