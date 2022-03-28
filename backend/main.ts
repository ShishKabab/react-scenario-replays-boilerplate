import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { createMetaApplication } from "./application";
import { selfTest } from "./self-test";
import { setupRoutes } from "./routes";

export async function main() {
  const expressApp = express();
  expressApp.use(cors());
  expressApp.use(bodyParser.urlencoded({ extended: true }));
  expressApp.use(bodyParser.json());
  expressApp.use(bodyParser.json({ type: "application/vnd.api+json" }));

  const metaApp = createMetaApplication();
  setupRoutes(metaApp, expressApp);
  const port = 3031;
  expressApp.listen(port);
  console.log(`Backend listening on port ${port}`);

  if (process.env.SELF_TEST === "true") {
    await selfTest(expressApp);
  }
}

if (require.main === module) {
  main();
}
