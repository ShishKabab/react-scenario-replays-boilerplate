import type express from "express";
import type supertest from "supertest";

export async function selfTest(expressApp: express.Application) {
  console.log("Running self test");

  const request: typeof supertest = require("supertest");
  const createAppResponse = await request(expressApp)
    .post("/app/create")
    .set("Content-Type", "application/json")
    .send({ appName: "cms" });
  const { appId } = createAppResponse.body;

  const loginResponse = await request(expressApp)
    .post("/auth/login")
    .set("X-Application-ID", appId)
    .send({ email: "test@test.com", password: "testtest" });
  const sessionId = loginResponse.headers["x-session-id"];

  const todoItemsResponse = await request(expressApp)
    .get("/todo/items/default")
    .set("X-Application-ID", appId)
    .set("X-Session-ID", sessionId);
  console.log(todoItemsResponse.body);
}
