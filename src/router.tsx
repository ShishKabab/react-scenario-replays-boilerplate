import { History } from "history";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./features/auth/pages/auth";
import TodoListPage from "./features/todo-lists/pages/todo-list";

export function navigateTo(history: History, path: string) {
  const { location } = history;
  const currentUrl = new URL(location.pathname + location.search, window.location.origin);
  if (process.env.NODE_ENV === "development") {
    const identifierString = currentUrl.searchParams.get("scenario");
    if (identifierString) {
      const nextUrl = new URL(path, window.location.origin);
      nextUrl.searchParams.set("scenario", identifierString);
      path = nextUrl.pathname + nextUrl.search;
    }
  }
  history.push(path);
}

export function getRoutes() {
  return (
    <Routes>
      <Route path="auth" element={<AuthPage />} />
      <Route path="todo" element={<TodoListPage />} />
    </Routes>
  );
}
