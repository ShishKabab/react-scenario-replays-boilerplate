import { AuthPageMethods } from "../features/auth/pages/types";
import { TodoListPageMethods } from "../features/todo-lists/pages/types";

export type ScenarioComponents = {
  AuthPage: AuthPageMethods;
  TodoListPage: TodoListPageMethods;
};
