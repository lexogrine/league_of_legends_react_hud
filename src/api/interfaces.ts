export interface LHMPlayer {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  avatar: string;
  country: string;
  steamid: string;
  team: string;
  extra: Record<string, string>;
}

export interface LHMTeam {
  _id: string;
  name: string;
  country: string;
  shortName: string;
  logo: string;
  extra: Record<string, string>;
}

export interface LHMMatch {
  id: string;
  current: boolean;
  left: {
    id: string | null;
    wins: number;
  };
  right: {
    id: string | null;
    wins: number;
  };
  matchType: "bo1" | "bo2" | "bo3" | "bo5";
}

export interface Rune {
  id: number;
  displayName: string;
  rawDescription: string;
  rawDisplayName: string;
}

export interface SummonerSpell {
  displayName: string;
  rawDisplayName: string;
  rawDescription: string;
}

export interface LOLStatistics {
  blue: {
    kills: number;
    dragons: any[];
    turretsDestroyed: number;
    inhibitorsDestroyed: number;
    barons: number;
    heralds: number;
  };
  red: {
    kills: number;
    dragons: any[];
    turretsDestroyed: number;
    inhibitorsDestroyed: number;
    barons: number;
    heralds: number;
  };
}

export interface LOLPlayer {
  championName: string;
  isBot: boolean;
  isDead: boolean;
  level: number;
  position: string;
  rawChampionName: string;
  respawnTimer: number;
  runes: {
    keystone: Rune;
    primaryRuneTree: Rune;
    secondaryRuneTree: Rune;
  };
  scores: {
    assists: number;
    creepScore: number;
    deaths: number;
    kills: number;
    wardScore: number;
  };
  skinID: number;
  summonerName: string;
  summonerSpells: {
    summonerSpellOne: SummonerSpell;
    summonerSpellTwo: SummonerSpell;
  };
  team: string;
}

export interface Event {
  EventID: number;
  EventName: string;
  EventTime: number;
}

export interface GameData {
  gameMode: string;
  gameTime: number;
  mapName: string;
  mapNumber: number;
  mapTerrain: string;
}

export interface LOLPickPlayer {
  assignedPosition: string;
  cellId: number;
  championId: number;
  championPickIntent: number;
  entitledFeatureType: string;
  nameVisibilityType: string;
  obfuscatedPuuid: string;
  obfuscatedSummonerId: number;
  puuid: string;
  selectedSkinId: number;
  spell1Id: number;
  spell2Id: number;
  summonerId: number;
  team: number;
  wardSkinId: number;
  summonerName: string;
}

export interface LOLPicks {
  actions: Array<
    Array<{
      actorCellId: number;
      championId: number;
      championIntent: number;
      completed: boolean;
      id: number;
      isAllyAction: boolean;
      isInProgress: boolean;
      pickTurn: number;
      type: "ban" | "pick" | "ten_bans_reveal";
    }>
  >;
  allowBattleBoost: boolean;
  allowDuplicatePicks: boolean;
  allowLockedEvents: boolean;
  allowRerolling: boolean;
  allowSkinSelection: boolean;
  bans: {
    myTeamBans: number[];
    theirTeamBans: number[];
    numBans: number;
  };
  benchChampions: [];
  benchEnabled: boolean;
  boostableSkinCount: number;
  chatDetails: {
    multiUserChatId: string;
    multiUserChatPassword: string;
    [key: string]:
      | string
      | {
          channelClaim: string;
          domain: string;
          jwt: string;
          targetRegion: string;
        };
  };
  counter: number;
  entitledFeatureState: {
    additionalRerolls: number;
    unlockedSkinIds: [];
  };
  gameId: number;
  hasSimultaneousBans: boolean;
  hasSimultaneousPicks: boolean;
  isCustomGame: boolean;
  isSpectating: boolean;
  localPlayerCellId: number;
  lockedEventIndex: number;
  myTeam: Array<LOLPickPlayer>;
  pickOrderSwaps: Array<any>;
  recoveryCounter: number;
  rerollsRemaining: number;
  skipChampionSelect: boolean;
  theirTeam: Array<LOLPickPlayer>;
  timer: {
    adjustedTimeLeftInPhase: number;
    internalNowInEpochMs: number;
    isInfinite: boolean;
    phase: string;
    totalTimeInPhase: number;
  };
  trades: Array<{
    cellId: number;
    id: number;
    state: string;
  }>;
}

export type JoinedPlayer = LOLPlayer & { lhm?: LHMPlayer };

export type Status = {
  status: "AWAITING" | "CHAMP_SELECT" | "IN_PROGRESS" | "ENDED" | "ERROR";
};
