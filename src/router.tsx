import { Routes, Route } from "react-router-dom";
import AuthPage from "./features/auth/pages/auth";
import TodoListPage from "./features/todo-lists/pages/todo-list";

export function getRoutes() {
  return (
    <Routes>
      <Route path="auth" element={<AuthPage />} />
      <Route path="todo" element={<TodoListPage />} />
    </Routes>
  );
}
