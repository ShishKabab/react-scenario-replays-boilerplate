import type express from "express";
import { createAppplication, getApplication } from "./application";
import { ensureSession, getSession } from "./sessions";
import { initSchema, ensureUserByEmailAndPassword } from "./storage";
import { Application, MetaApplication, RequestInfo } from "./types";

function getRequestInfo(
  metaApp: MetaApplication,
  req: express.Request,
  res: Pick<express.Response, "status" | "send">
): RequestInfo {
  const application = getApplication(metaApp, req, res);
  if (!application) {
    return;
  }

  const session = getSession(application, req);
  return { application, userId: session?.userId };
}

function withApp(
  metaApp: MetaApplication,
  f: (ctx: { req: express.Request; res: express.Response; app: Application }) => Promise<void>
) {
  return async (req: express.Request, res: express.Response) => {
    const app = getApplication(metaApp, req, res);
    if (!app) {
      return null;
    }
    await f({ req, res, app });
  };
}

export function setupRoutes(metaApp: MetaApplication, expressApp: express.Application) {
  expressApp.post("/app/create", async (req, res) => {
    const app = createAppplication(metaApp);
    await initSchema(app);
    res.send({ appId: app.id });
  });
  expressApp.post(
    "/auth/login",
    withApp(metaApp, async ({ app, req, res }) => {
      const { email, password } = req.body;
      const { id: userId } = await ensureUserByEmailAndPassword(app, { email, password });
      const session = ensureSession(app, req, res);
      session.userId = userId;
      res.send("OK");
    })
  );
}
