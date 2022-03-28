import type { Database, Statement } from "better-sqlite3";

export interface MetaApplication {
  applicationsGenerated: number;
  applications: { [id: number]: Application };
  defaultApplication: Application;
}

export interface Application {
  id: number;
  db: Database;
  dbStatements: { [name: string]: Statement };
  sessionsGenerated: number;
  sessions: { [id: number]: Session };
}

export interface RequestInfo {
  application: Application;
  userId?: number;
}

export interface Session {
  userId?: number;
}

export interface User {
  id: number;
  email: number;
}
