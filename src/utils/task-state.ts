import React from "react";

export type TaskState = "pristine" | "running" | "done" | "error";

export async function executeUITask<Component extends React.Component>(
  component: Component,
  stateKey: keyof Component["state"],
  f: () => Promise<void>
) {
  component.setState({ [stateKey]: "running" });
  try {
    await f();
    component.setState({ [stateKey]: "done" });
  } catch (err) {
    console.error(err);
    component.setState({ [stateKey]: "error" });
  }
}
