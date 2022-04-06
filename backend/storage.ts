import { Application, User } from "./types";

export type StorageApplication = Pick<Application, "db" | "dbStatements">;

export async function initSchema(app: Pick<Application, "db">) {
  app.db.exec(`
  CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    passwordHash TEXT NOT NULL
  );
  CREATE TABLE todoList (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    isDefault INTEGER,
    title TEXT
  );
  CREATE TABLE todoItem (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listId INTEGER NOT NULL,
    label TEXT NOT NULL,
    done INTEGER NOT NULL
  );
  `);
}

function ensureStatement(app: StorageApplication, name: string, sql: string) {
  const existing = app.dbStatements[name];
  if (existing) {
    return existing;
  }

  const statement = app.db.prepare(sql);
  app.dbStatements[name] = statement;
  return statement;
}

export async function ensureUserByEmailAndPassword(
  app: StorageApplication,
  params: { email: string; password: string }
): Promise<Pick<User, "id">> {
  const existingUser: (User & { passwordHash: string }) | null = ensureStatement(
    app,
    "findUserByEmail",
    "SELECT * FROM user WHERE email = ?;"
  ).get(params.email);
  if (existingUser) {
    return { id: existingUser.id };
  }

  const userId = ensureStatement(app, "insertUser", "INSERT INTO user (email, passwordHash) VALUES (?, ?)").run(
    params.email,
    params.password
  );
  return { id: userId.lastInsertRowid as number };
}

export async function getDefaultTodoItems(app: StorageApplication, params: { userId: number }) {
  const getItems = ensureStatement(app, "getTodoItems", "SELECT * FROM todoItem WHERE listId = ?");
  const existingDefaultList = ensureStatement(
    app,
    "getDefaultList",
    "SELECT * FROM todoList WHERE userId = ? AND isDefault = 1"
  ).get(params.userId);
  if (existingDefaultList) {
    const listId = existingDefaultList.id;
    return { listId, items: getItems.all(listId).map((item) => ({ ...item, done: !!item.done })) };
  }
  const listCreated = ensureStatement(
    app,
    "insertDefaultList",
    "INSERT INTO todoList (userId, isDefault) VALUES (?, ?)"
  ).run(params.userId, 1);
  const listId = listCreated.lastInsertRowid;
  const insertItem = ensureStatement(
    app,
    "insertTodoItem",
    "INSERT INTO todoItem (listId, label, done) VALUES (?, ?, ?)"
  );
  insertItem.run(listId, "Check out my default list", 0);
  insertItem.run(listId, "Check out scenario replays", 0);
  return { listId, items: getItems.all(listId).map((item) => ({ ...item, done: !!item.done })) };
}
