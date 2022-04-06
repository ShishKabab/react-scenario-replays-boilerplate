export interface TodoList {
  id: number;
  userId: number;
  isDefault?: boolean;
  title?: string;
}

export interface TodoItem {
  id: number;
  listId: number;
  label: string;
  done: boolean;
}
