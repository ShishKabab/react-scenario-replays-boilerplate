export type BackendRequester = (url: string, init?: RequestInit) => Promise<Response>;

export async function createBackendConnection(): Promise<BackendRequester> {
  const appCreation = await fetch("/app/create");
  const { appId } = await appCreation.json();
  return (url, init?) => {
    init = init ?? {};
    init.headers = init.headers ?? {};
    (init.headers as any)["X-Application-ID"] = appId;
    return fetch(url, init);
  };
}
