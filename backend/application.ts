import type express from "express";
import Database from "better-sqlite3";
import { MetaApplication, Application } from "./types";

export function createAppplication(metaApp: Omit<MetaApplication, "defaultApplication">) {
  const id = metaApp.applicationsGenerated++;
  const dbOptions: Database.Options = {};
  if (process.env.LOG_SQL === "true") {
    dbOptions.verbose = (...args: any[]) => console.log("SQL:", ...args);
  }
  const app: Application = {
    id,
    db: new Database(":memory:", dbOptions),
    dbStatements: {},
    sessionsGenerated: 0,
    sessions: {},
  };
  metaApp.applications[id] = app;
  return app;
}

export function createMetaApplication(): MetaApplication {
  const metaApp: Omit<MetaApplication, "defaultApplication"> = {
    applicationsGenerated: 0,
    applications: {},
  };
  const defaultApplication = createAppplication(metaApp);
  return {
    ...metaApp,
    defaultApplication,
  };
}

export function getApplication(
  metaApp: MetaApplication,
  req: Pick<express.Request, "body">,
  res: Pick<express.Response, "status" | "send">
) {
  const appId = process.env.NODE_ENV === "development" && req.body.appId;
  const app = appId ? metaApp.applications[appId] : metaApp.defaultApplication;
  if (app) {
    return app;
  }

  res.status(403);
  res.send(`App ID not found: ${appId}`);
  return null;
}
