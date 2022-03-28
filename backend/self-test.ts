import type express from "express";
import type supertest from "supertest";

export async function selfTest(expressApp: express.Application) {
  const request: typeof supertest = require("supertest");
  const createAppResponse = await request(expressApp)
    .post("/app/create")
    .set("Content-Type", "application/json")
    .send({ appName: "cms" });
  const { appId } = createAppResponse.body;
}
