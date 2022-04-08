import { BackendRequester } from "../../backend";

export async function login(backend: BackendRequester, email: string, password: string) {
  return backend("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
}
