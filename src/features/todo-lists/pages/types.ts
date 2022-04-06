import { TaskState } from "../../../utils/task-state";
import { TodoItem } from "../types";

export interface TodoListPageState {
  loadState: TaskState;
  listData?: { listId: number; items: TodoItem[] };
}

export interface TodoListPageMethods {}
