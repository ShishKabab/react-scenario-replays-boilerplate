export type BackendRequester = (url: string, init?: RequestInit) => Promise<Response>;

const BACKEND_ORIGIN = process.env.NODE_ENV === "development" ? "http://localhost:3031" : "https://backend.example.com";

export async function createBackendConnection(): Promise<BackendRequester> {
  const appCreation = await fetch(BACKEND_ORIGIN + "/app/create", {
    method: "POST",
  });
  const { appId } = await appCreation.json();
  return (url, init?) => {
    init = init ?? {};
    init.headers = init.headers ?? {};
    (init.headers as any)["X-Application-ID"] = appId;
    return fetch(BACKEND_ORIGIN + url, init);
  };
}
