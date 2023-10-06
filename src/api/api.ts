import * as I from "./interfaces";
import queryString from "query-string";

const query = queryString.parseUrl(window.location.href).query;
export const port = (query && Number(query.port)) || 1349;
export const addonPort = (query && Number(query.addonPort)) || 1350;

export const isDev = !query.isProd;

export const config = { apiAddress: isDev ? `http://localhost:${port}/` : "/" };
export const lhmApiUrl = config.apiAddress;
export const addonApiUrl = `http://localhost:${addonPort}/`;

export const apiCall = async (
  apiUrl: string,
  url: string,
  method = "GET",
  body?: any
) => {
  const options: RequestInit = {
    method,
    headers: { Accept: "application/json", "Content-Type": "application/json" },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  let data: any = null;
  return fetch(`${apiUrl}api/${url}`, options).then((res) => {
    data = res;
    return res.json().catch((_e) => data && data.status < 300);
  });
};

export const lhmApi = {
  match: {
    get: async (): Promise<I.LHMMatch[]> => apiCall(lhmApiUrl, `match`),
    getCurrent: async (): Promise<I.LHMMatch> =>
      apiCall(lhmApiUrl, `match/current`),
  },
  camera: {
    get: (): Promise<{
      availablePlayers: { steamid: string; label: string }[];
      uuid: string;
    }> => apiCall(lhmApiUrl, "camera"),
  },
  teams: {
    getOne: async (id: string): Promise<I.LHMTeam> =>
      apiCall(lhmApiUrl, `teams/${id}`),
    get: (): Promise<I.LHMTeam[]> => apiCall(lhmApiUrl, `teams`),
    getDirectLogo: (filename: string) =>
      `${lhmApiUrl}api/teams/logo/direct/${filename}`,
  },
  players: {
    get: async (steamids?: string[]): Promise<I.LHMPlayer[]> =>
      apiCall(
        lhmApiUrl,
        steamids ? `players?steamids=${steamids.join(";")}` : `players`
      ),
    getAvatarURLs: async (
      steamid: string
    ): Promise<{ custom: string; steam: string }> =>
      apiCall(lhmApiUrl, `players/avatar/steamid/${steamid}`),
  },
  tournaments: {
    get: () => apiCall(lhmApiUrl, "tournament"),
  },
};

export const addonApi = {
  events: {
    get: async (): Promise<I.Event[]> => apiCall(addonApiUrl, `events`),
    markAsHandled: async (eventIds: number[]) =>
      apiCall(addonApiUrl, `events`, "POST", { events: eventIds }),
  },
  players: {
    get: async (): Promise<I.LOLPlayer[]> => apiCall(addonApiUrl, "players"),
  },
  game: {
    get: async (): Promise<I.GameData> => apiCall(addonApiUrl, "game"),
  },
  status: {
    get: async (): Promise<I.Status> => apiCall(addonApiUrl, `status`),
  },
  picks: {
    get: async (): Promise<I.LOLPicks> => apiCall(addonApiUrl, `picks`),
  },
  statistics: {
    get: async (): Promise<any> => apiCall(addonApiUrl, `statistics`),
  },
  resource: {
    get: async (type: string, id: string): Promise<Buffer> =>
      apiCall(addonApiUrl, `resources/${type}/${id}`),
  },
};
