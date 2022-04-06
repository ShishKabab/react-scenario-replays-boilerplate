import { Application, Session } from "./types";
import type express from "express";

const SESSION_HEADER = "X-Session-Id";

export function getSession(app: Application, req: Pick<express.Request, "get">) {
  const sessionIdFromHeader = req.get(SESSION_HEADER);
  if (!sessionIdFromHeader) {
    return null;
  }
  const sessionId = parseInt(sessionIdFromHeader);
  return app.sessions[sessionId] ?? null;
}

export function ensureSession(
  app: Application,
  req: Pick<express.Request, "get">,
  res: Pick<express.Response, "header">
) {
  const existingSession = getSession(app, req);
  if (existingSession) {
    return existingSession;
  }

  const newSessionId = ++app.sessionsGenerated;
  const newSession: Session = {};
  app.sessions[newSessionId] = newSession;
  res.header(SESSION_HEADER, newSessionId.toString());
  return newSession;
}
