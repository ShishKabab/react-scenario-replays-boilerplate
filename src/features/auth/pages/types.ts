import { TaskState } from "../../../utils/task-state";

export interface AuthPageState {
  email: string;
  password: string;
  submitState: TaskState;
}
export interface AuthPageMethods {
  changeEmail(data: { value: string }): void;
  changePassword(data: { value: string }): void;
  submit(data: {}): void;
}
