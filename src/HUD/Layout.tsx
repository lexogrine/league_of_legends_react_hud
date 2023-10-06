import React, { useEffect, useMemo } from "react";
import { addonApi, lhmApi } from "../api/api";
import {
  GameData,
  LOLPlayer,
  Event,
  LHMPlayer,
  JoinedPlayer,
  LHMTeam,
  LHMMatch,
  LOLPicks,
  LOLStatistics,
} from "../api/interfaces";
import Events from "./Events";
import Game from "./Game";
import Player from "./Player";
import SidePick from "./SidePick";
import ChampSelect from "./ChampSelect";
import InGame from "./InGame";
import ActionManager, { ConfigManager } from "../api/actionManager";

import "./styles.scss";

interface Props {
  configs: ConfigManager;
  actions: ActionManager;
}

const joinPlayers = (
  lolPlayers: LOLPlayer[],
  lhmPlayers: LHMPlayer[]
): JoinedPlayer[] => {
  const result = lolPlayers.map((lolPlayer) => ({
    ...lolPlayer,
    lhm: lhmPlayers.find(
      (lhmPlayer) => lhmPlayer.steamid === lolPlayer.summonerName
    ),
  }));

  return result;
};

const Layout = (props: Props) => {
  const [time, setTime] = React.useState(0);
  const [status, setStatus] = React.useState("");

  const [lolPlayers, setLolPlayers] = React.useState<LOLPlayer[]>([]);
  const [lhmPlayers, setLhmPlayers] = React.useState<LHMPlayer[]>([]);
  const [teams, setTeams] = React.useState<LHMTeam[]>([]);
  const [match, setMatch] = React.useState<LHMMatch | null>(null);
  const [gameData, setGameData] = React.useState<GameData | null>(null);
  const [events, setEvents] = React.useState<Event[]>([]);
  const [picks, setPicks] = React.useState<LOLPicks | null>(null);
  const [statistics, setStatistics] = React.useState<LOLStatistics | null>(
    null
  );

  const [observedPlayerLeft, setObservedPlayerLeft] =
    React.useState<LHMPlayer | null>(null);
  const [observedPlayerRight, setObservedPlayerRight] =
    React.useState<LHMPlayer | null>(null);

  const [tournamentImage, setTournamentImage] = React.useState<string | null>(
    null
  );
  const [tournamentName, setTournamentName] = React.useState<string | null>(
    null
  );
  const [tournamentRightText, setTournamentRightText] = React.useState<
    string | null
  >(null);
  const [championSelectBottomImage, setChampionSelectBottomImage] =
    React.useState<string | null>(null);
  const [ingameBottomLeftImage, setIngameBottomLeftImage] = React.useState<
    string | null
  >(null);
  const [ingameBottomImages, setIngameBottomImages] = React.useState<
    string[] | null
  >(null);
  const [hideIngameTopBar, setHideIngameTopBar] =
    React.useState<boolean>(false);
  const [hidePlayerAvatars, setHidePlayerAvatars] =
    React.useState<boolean>(false);
  const [showPlayerPositions, setShowPlayerPositions] =
    React.useState<boolean>(false);

  const updateLHMData = async () => {
    const lhmMatch = await lhmApi.match.getCurrent();
    const lhmTeams = await lhmApi.teams.get();
    const lhmPlayersResult = await lhmApi.players.get();

    setMatch(lhmMatch);
    setTeams(lhmTeams);
    setLhmPlayers(lhmPlayersResult);
  };

  useEffect(() => {
    const otherInterval = setInterval(async () => {
      updateLHMData();
    }, 5000);
    updateLHMData();

    const interval = setInterval(async () => {
      const { status } = await addonApi.status.get();
      // const status: string = "CHAMP_SELECT";

      if (status === "IN_PROGRESS") {
        const newPlayers = await addonApi.players.get();

        const newGameData = await addonApi.game.get();
        const newStatistics = await addonApi.statistics.get();
        // const newEvents = events.concat(await addonApi.events.get());

        // console.log("newEvents", newEvents, newGameData.gameTime);

        // addonApi.events.markAsHandled(newEvents.map((x) => x.EventID));
        // const filteredEvents = newEvents.filter(
        //   (x) => newGameData.gameTime < 40 + x.EventTime
        // );

        setStatus(status);
        // setEvents(filteredEvents);
        setGameData(newGameData);
        setStatistics(newStatistics);
        setLolPlayers(newPlayers);

        setTime((t) => newGameData?.gameTime ?? t + 0.2);
      } else if (status === "CHAMP_SELECT") {
        const picks = await addonApi.picks.get();
        setStatus(status);
        setPicks(picks);
        setTime((t) => t + 0.2);
      } else {
        setStatus(status);
        setTime((t) => t + 0.2);
      }
      return () => {
        clearInterval(interval);
        clearInterval(otherInterval);
      };
    }, 200);

    props.configs.onChange((data: any) => {
      // console.log("Config change:", data);

      const left = data.ingame_settings?.left_player_preview?.player;
      const right = data.ingame_settings?.right_player_preview?.player;

      setObservedPlayerLeft(left || null);
      setObservedPlayerRight(right || null);

      setTournamentImage(
        data.champion_select_settings?.tournament_image || null
      );
      setTournamentName(
        data.champion_select_settings?.tournament_title || null
      );
      setTournamentRightText(
        data.champion_select_settings?.tournament_right_text || null
      );
      setChampionSelectBottomImage(
        data.champion_select_settings?.champion_select_image || null
      );

      setIngameBottomLeftImage(data.ingame_settings?.bottom_left_image || null);
      setIngameBottomImages(
        [
          data.ingame_settings?.center_image,
          data.ingame_settings?.center_image_2,
          data.ingame_settings?.center_image_3,
        ].filter((i) => i) || null
      );
      setHideIngameTopBar(data.ingame_settings?.hide_top_bar || false);
      setHidePlayerAvatars(
        data.champion_select_settings?.hide_player_avatars || false
      );
      setShowPlayerPositions(
        data.champion_select_settings?.show_player_positions || false
      );
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "IN_PROGRESS") {
    return (
      <InGame
        leftTeam={teams.find((x) => x._id === match?.left?.id)}
        rightTeam={teams.find((x) => x._id === match?.right?.id)}
        match={match || undefined}
        time={time}
        statistics={statistics || undefined}
        observedPlayerLeft={observedPlayerLeft || undefined}
        observedPlayerRight={observedPlayerRight || undefined}
        bottomLeftImage={ingameBottomLeftImage || undefined}
        bottomImages={ingameBottomImages || undefined}
        hideTopBar={hideIngameTopBar}
      />
    );
  }

  // @ts-ignore
  if (status === "CHAMP_SELECT" && picks) {
    // if (status === "CHAMP_SELECT" && (picks?.myTeam || picks?.theirTeam)) {
    const leftTeam = teams.find((x) => x._id === match?.left?.id);
    const rightTeam = teams.find((x) => x._id === match?.right?.id);

    return (
      <ChampSelect
        lhmPlayers={lhmPlayers}
        leftTeam={leftTeam}
        rightTeam={rightTeam}
        match={match}
        time={time}
        picks={picks || undefined}
        tournamentName={tournamentName || undefined}
        tournamentRightText={tournamentRightText || undefined}
        tournamentImage={tournamentImage || undefined}
        bottomImage={championSelectBottomImage || undefined}
        hidePlayerAvatars={hidePlayerAvatars}
        showPositions={showPlayerPositions}
      />
    );
  }

  return null;
};

export default Layout;
