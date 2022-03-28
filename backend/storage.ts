import { Application, User } from "./types";

export type StorageApplication = Pick<Application, "db" | "dbStatements">;

export async function initSchema(app: Pick<Application, "db">) {
  app.db.exec(`
  CREATE TABLE user (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    passwordHash TEXT NOT NULL,
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
