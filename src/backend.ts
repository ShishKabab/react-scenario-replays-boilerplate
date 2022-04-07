import createResolvable, { Resolvable } from "@josephg/resolvable";
export type BackendRequester = (url: string, init?: RequestInit) => Promise<Response>;
export interface BackendGate {
  backend: BackendRequester;
  blockUrl(url: string): { undo: () => void };
  sabotageUrl(url: string): { undo: () => void };
}

const BACKEND_ORIGIN = process.env.NODE_ENV === "development" ? "http://localhost:3031" : "https://backend.example.com";

export async function createBackendConnection(): Promise<BackendRequester> {
  const appId = await createAppId();
  let sessionId: string | undefined;
  return async (url, init?) => {
    init = init ?? {};
    init.headers = init.headers ?? {};
    (init.headers as any)["X-Application-ID"] = appId;
    if (sessionId) {
      (init.headers as any)["X-Session-Id"] = sessionId;
    }
    const response = await fetch(BACKEND_ORIGIN + url, init);
    const newSessionId = response.headers.get("X-Session-Id");
    if (newSessionId) {
      sessionId = newSessionId;
    }
    return response;
  };
}

export function createBackendGate(backend: BackendRequester): BackendGate {
  const blocked: { [url: string]: Array<Resolvable<void>> } = {};
  const sabotaged = new Set<string>();
  return {
    backend: async (url, init?) => {
      if (blocked[url]) {
        const resolvable = createResolvable();
        blocked[url].push(resolvable);
        await resolvable;
      }
      if (sabotaged.has(url)) {
        throw new Error(`URL '${url}' has been sabotaged for debugging purposes`);
      }
      return backend(url, init);
    },
    blockUrl: (url) => {
      blocked[url] = [];
      return {
        undo: () => {
          for (const resolvable of blocked[url]) {
            resolvable.resolve();
          }
          delete blocked[url];
        },
      };
    },
    sabotageUrl: (url) => {
      sabotaged.add(url);
      return {
        undo: () => {
          sabotaged.delete(url);
        },
      };
    },
  };
}

async function createAppId() {
  for (let attempt = 0; attempt < 5; ++attempt) {
    try {
      const appCreation = await fetch(BACKEND_ORIGIN + "/app/create", {
        method: "POST",
      });
      const { appId } = await appCreation.json();
      return appId;
    } catch (err) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  throw new Error(`Could not create backend app after 5 attempts`);
}
