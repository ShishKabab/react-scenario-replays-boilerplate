import createResolvable, { Resolvable } from "@josephg/resolvable";
export type BackendRequester = (url: string, init?: RequestInit) => Promise<Response>;
export interface BackendGate {
  backend: BackendRequester;
  blockPath(path: string): { undo: () => void };
  sabotagePath(path: string): { undo: () => void };
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
  const blocked: { [path: string]: Array<Resolvable<void>> } = {};
  const sabotaged = new Set<string>();
  return {
    backend: async (path, init?) => {
      if (blocked[path]) {
        const resolvable = createResolvable();
        blocked[path].push(resolvable);
        await resolvable;
      }
      if (sabotaged.has(path)) {
        throw new Error(`Backend path '${path}' has been sabotaged for debugging purposes`);
      }
      return backend(path, init);
    },
    blockPath: (path) => {
      blocked[path] = [];
      return {
        undo: () => {
          for (const resolvable of blocked[path]) {
            resolvable.resolve();
          }
          delete blocked[path];
        },
      };
    },
    sabotagePath: (path) => {
      sabotaged.add(path);
      return {
        undo: () => {
          sabotaged.delete(path);
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
