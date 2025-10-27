import React, { useEffect, useRef, useState } from "react";

import TeamBar from "./assets/TeamBar.svg";
import TeamBarAlt from "./assets/TeamBarAlt.svg";

import {
  default as Position1,
  default as Position4,
} from "./assets/Position1or4.svg";
import Position2 from "./assets/Position2.svg";
import Position3 from "./assets/Position3.svg";
import Position5 from "./assets/Position5.svg";

import { LHMMatch, LHMPlayer, LHMTeam, LOLPicks } from "../api/interfaces";

const PositionImages = [Position1, Position2, Position3, Position4, Position5];

const PlayerBox = ({
  picking,
  banning,
  right,
  name,
  championImage,
  avatar,
  spellImages,
  teamId,
  noAvatar,
  position,
  showPosition,
}: {
  picking?: boolean;
  banning?: boolean;
  right?: boolean;
  name?: string;
  championImage?: string;
  avatar?: string;
  spellImages?: string[];
  teamId?: string;
  noAvatar?: boolean;
  position?: number;
  showPosition?: boolean;
}) => {
  return (
    <div className="champ-player-box">
      <div className={`avatar-container ${noAvatar && "no-avatar"}`}>
        <div
          className="avatar"
          style={{
            backgroundImage: avatar ? `url(${avatar})` : undefined,
          }}
        />
        <div className={`vertical-separator ${right && "left"}`} />
      </div>
      <div className="champion-container">
        {teamId && !picking && !banning && (
          <div
            className="team-image"
            style={{ backgroundImage: `url(/api/teams/logo/${teamId})` }}
          />
        )}
        {picking && (
          <>
            <div className="highlight" />
            <div className="picking">Picking...</div>
          </>
        )}
        {banning && (
          <>
            <div className="highlight" />
            <div className="picking">Banning...</div>
          </>
        )}
        <div
          className="champion"
          style={{
            backgroundImage: championImage
              ? `url(dragontail/img/champion/centered/${championImage}_0.jpg)`
              : undefined,
          }}
        />
        {!!championImage && !picking && (
          <div className={`spell-list ${right && "right"}`}>
            {spellImages?.map((spellImage) => (
              <div
                className="spell"
                style={{
                  backgroundImage: spellImage
                    ? `url(dragontail/newest/img/spell/${spellImage}.png)`
                    : undefined,
                }}
              />
            ))}
          </div>
        )}
        <div className="player-info">
          {!!position && (
            <div
              className={`icon ${!showPosition && "hidden"}`}
              style={{
                backgroundImage: `url(${PositionImages[position - 1]})`,
                transform: position === 1 ? "rotate(180deg)" : undefined,
              }}
            />
          )}
          {/* todo position icons */}
          <div className="name">{name}</div>
        </div>
        <div className={`vertical-separator ${right && "left"}`} />
      </div>
    </div>
  );
};

const SideArrow = ({ ban }: { ban?: boolean }) => (
  <svg
    width="30"
    height="35"
    viewBox="0 0 30 35"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: "rotate(180deg)" }}
  >
    <path d="M30 17.5L0.75 0.612503L0.75 34.3875L30 17.5Z" fill={"#FFFFFFEE"} />
  </svg>
);

const AwaitingDots = () => (
  <svg
    width="15"
    height="3"
    viewBox="0 0 15 3"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 2.324V0H2.016V2.324H0Z" fill="white" />
    <path d="M6.38203 2.324V0H8.39803V2.324H6.38203Z" fill="white" />
    <path d="M12.7641 2.324V0H14.7801V2.324H12.7641Z" fill="white" />
  </svg>
);

interface ChampSelectProps {
  lhmPlayers: LHMPlayer[];
  leftTeam?: LHMTeam;
  rightTeam?: LHMTeam;
  match: LHMMatch | null;
  time: number;
  picks?: LOLPicks;
  tournamentName?: string;
  tournamentRightText?: string;
  tournamentImage?: string;
  bottomImage?: string;
  hidePlayerAvatars?: boolean;
  showPositions?: boolean;
  showChampionIntents: boolean;
}

const ChampSelect = (props: ChampSelectProps) => {
  const {
    leftTeam,
    rightTeam,
    match,
    time,
    picks,
    lhmPlayers,
    tournamentName,
    tournamentRightText,
    tournamentImage,
    bottomImage,
    hidePlayerAvatars,
    showPositions,
    showChampionIntents,
  } = props;

  const [dataDragonChampions, setDataDragonChampions] = useState<any>([]);
  const [dataDragonSummonerSpells, setDataDragonSummonerSpells] = useState<any>(
    []
  );

  const lastLoadedTimeLeft = useRef(picks?.timer.adjustedTimeLeftInPhase);
  const [realTimeLeft, setRealTimeLeft] = useState(
    (picks?.timer.adjustedTimeLeftInPhase || 0) / 1000
  );

  const inProgressAction = picks?.actions
    .flat()
    .find((a) => a.isInProgress && !a.completed);
  const inProgressActionSide = inProgressAction
    ? picks?.myTeam.find((p) => p.cellId === inProgressAction?.actorCellId)
      ? "my"
      : "their"
    : null;
  const inProgressActionId = inProgressAction?.id;
  useEffect(() => {
    console.log("NEW IN PROGRESS ACTION:", inProgressAction);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inProgressActionId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeLeft((t) => Math.max(t - 1, 0));
    }, 1000);

    const dataDragonChampionsResult = fetch("champion.json");
    dataDragonChampionsResult
      .then((res) => res.json())
      .then((res) => {
        console.log("Data dragon champions loaded", res);
        const newChampions: any[] = [];
        Object.values(res.data).forEach((champ: any) => {
          newChampions[Number(champ.key || 0)] = champ;
        });

        console.log("Final champions:", newChampions);
        setDataDragonChampions(newChampions);
      })
      .catch((err) => {
        console.error("Failed to load data dragon champions", err);
      });

    const dataDragonSummonerSpellsResult = fetch("summoner.json");
    dataDragonSummonerSpellsResult
      .then((res) => res.json())
      .then((res) => {
        console.log("Data dragon summoner spells loaded", res);
        const newSpells: any[] = [];
        Object.values(res.data).forEach((spell: any) => {
          newSpells[Number(spell.key || 0)] = spell;
        });

        console.log("Final spells:", newSpells);
        setDataDragonSummonerSpells(newSpells);
      })
      .catch((err) => {
        console.error("Failed to load data dragon spells", err);
      });

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (picks?.timer.adjustedTimeLeftInPhase !== lastLoadedTimeLeft.current) {
      lastLoadedTimeLeft.current = picks?.timer.adjustedTimeLeftInPhase;
      setRealTimeLeft((picks?.timer.adjustedTimeLeftInPhase || 0) / 1000);
      console.log(
        "setting time to",
        (picks?.timer.adjustedTimeLeftInPhase || 0) / 1000
      );
    }
  }, [picks?.timer.adjustedTimeLeftInPhase]);

  const minutes = Math.floor(realTimeLeft / 60);
  const seconds = Math.floor(realTimeLeft % 60);

  const bans = picks?.actions?.flat()?.filter((x) => x.type === "ban") || [];

  const leftBans = bans.filter((ban) => ban.isAllyAction);
  const rightBans = bans.filter((ban) => !ban.isAllyAction);

  const championImageOverrides: { [key: number]: string } = {
    9: "FiddleSticks",
  };

  const getChampionImageNameByKey = (key: number) => {
    return championImageOverrides[key] || dataDragonChampions[key]?.id;
  };

  const prettyTime = (minutes: number, seconds: number) => {
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  let phaseTitle = inProgressAction?.type || "";
  let prettiedTime = prettyTime(minutes, seconds);
  if (picks?.timer?.phase === "PLANNING") {
    phaseTitle = "PLAN";
  } else if (phaseTitle === "ten_bans_reveal") {
    phaseTitle = "BAN";
    prettiedTime = prettyTime(minutes, Math.max(0, seconds - 30));
  }

  return (
    <div className="champ-select">
      <div className="top-bar">
        <div
          className="bar left"
          style={{ backgroundImage: `url(${TeamBar})` }}
        >
          <div className="team-info">
            <div
              className="team-logo"
              style={{
                backgroundImage: leftTeam?.logo
                  ? `url(/api/teams/logo/${leftTeam._id})`
                  : undefined,
              }}
            />
            <div className="team-name">{leftTeam?.name || "Team 1"}</div>
          </div>
        </div>
        <div
          className="bar right"
          style={{
            backgroundImage: `url(${TeamBarAlt})`,
          }}
        >
          <div className="team-info">
            <div className="team-name">{rightTeam?.name || "Team 2"}</div>
            <div
              className="team-logo right"
              style={{
                backgroundImage: rightTeam?.logo
                  ? `url(/api/teams/logo/${rightTeam._id})`
                  : undefined,
              }}
            />
          </div>
        </div>
      </div>
      {!!picks && bans.length > 0 && (
        <>
          {leftBans.length ? (
            <div className="ban-list">
              {leftBans.map((ban, i) => (
                <div
                  className={`ban`}
                  key={i}
                  style={
                    ban.championId
                      ? {
                          backgroundImage: `url(dragontail/newest/img/champion/${getChampionImageNameByKey(
                            ban.championId
                          )}.png)`,
                        }
                      : {}
                  }
                >
                  <div
                    className={`${
                      ban.isInProgress && picks?.timer?.phase !== "PLANNING"
                        ? "awaiting"
                        : ""
                    }`}
                  />
                  <div className="dots">
                    {ban.isInProgress && picks?.timer?.phase !== "PLANNING" && (
                      <AwaitingDots />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
          {rightBans.length ? (
            <div className="ban-list right">
              {rightBans.map((ban, i) => (
                <div
                  className={`ban`}
                  key={i}
                  style={
                    ban.championId
                      ? {
                          backgroundImage: `url(dragontail/newest/img/champion/${getChampionImageNameByKey(
                            ban.championId
                          )}.png)`,
                        }
                      : {}
                  }
                >
                  <div
                    className={`${
                      ban.isInProgress && picks?.timer?.phase !== "PLANNING"
                        ? "awaiting"
                        : ban.championId !== 0
                        ? ""
                        : "empty"
                    }`}
                  />
                </div>
              ))}
            </div>
          ) : null}
        </>
      )}
      <div className="bottom-section">
        <div className="player-list">
          <div className="row left">
            {picks?.myTeam.map((pick, i) => {
              const lhmPlayer = lhmPlayers.find(
                (p) => p.steamid === pick.summonerName
              );
              const spell1 = dataDragonSummonerSpells[pick.spell1Id];
              const spell2 = dataDragonSummonerSpells[pick.spell2Id];
              const isPicking =
                picks?.timer?.phase !== "PLANNING" &&
                inProgressAction?.type === "pick" &&
                inProgressAction?.actorCellId === pick?.cellId;
              const championId =
                pick?.championId ||
                (isPicking || showChampionIntents
                  ? pick?.championPickIntent
                  : 0) ||
                -1;
              return (
                <PlayerBox
                  key={i}
                  championImage={getChampionImageNameByKey(championId)}
                  position={i + 1}
                  showPosition={showPositions}
                  picking={isPicking}
                  banning={
                    pick.cellId === inProgressAction?.actorCellId &&
                    inProgressAction?.type === "ban" &&
                    picks?.timer?.phase !== "PLANNING"
                  }
                  name={lhmPlayer?.username || pick.summonerName}
                  avatar={lhmPlayer?.avatar}
                  spellImages={[spell1?.id, spell2?.id]}
                  teamId={leftTeam?._id}
                  noAvatar={hidePlayerAvatars}
                />
              );
            })}
            {[...Array(5 - (picks?.myTeam.length || 0))].map((_, i) => (
              <PlayerBox key={i + 5} noAvatar={hidePlayerAvatars} />
            ))}
          </div>
          <div className="row right">
            {picks?.theirTeam.map((pick, i) => {
              const lhmPlayer = lhmPlayers.find(
                (p) => p.steamid === pick.summonerName
              );
              const spell1 = dataDragonSummonerSpells[pick.spell1Id];
              const spell2 = dataDragonSummonerSpells[pick.spell2Id];
              const isPicking =
                picks?.timer?.phase !== "PLANNING" &&
                inProgressAction?.type === "pick" &&
                inProgressAction?.actorCellId === pick?.cellId;
              const championId =
                pick?.championId ||
                (isPicking || showChampionIntents
                  ? pick?.championPickIntent
                  : 0) ||
                -1;
              return (
                <PlayerBox
                  championImage={getChampionImageNameByKey(championId)}
                  position={i + 1}
                  showPosition={showPositions}
                  picking={isPicking}
                  banning={
                    pick.cellId === inProgressAction?.actorCellId &&
                    inProgressAction?.type === "ban" &&
                    picks?.timer?.phase !== "PLANNING"
                  }
                  name={lhmPlayer?.username || pick.summonerName}
                  avatar={lhmPlayer?.avatar}
                  spellImages={[spell1?.id, spell2?.id]}
                  teamId={rightTeam?._id}
                  noAvatar={hidePlayerAvatars}
                  right
                />
              );
            })}
            {[...Array(5 - (picks?.theirTeam.length || 0))].map((_, i) => (
              <PlayerBox right key={i + 5} noAvatar={hidePlayerAvatars} />
            ))}
          </div>
        </div>
        <div className="tournament-info">
          <div className="title">{tournamentName}</div>
          <div className="desc-box">
            <div className="desc">
              {match?.matchType ? `Best of ${match.matchType.slice(2)}` : ""}
            </div>
            <div className="desc right">{tournamentRightText}</div>
          </div>
        </div>
        <div className="center-bar">
          <div className="fill" />
        </div>
        <div className="center-info">
          <div className="score-box">
            <div className="score left">{match?.left?.wins || 0}</div>
            <div
              className="tournament-logo"
              style={{
                backgroundImage: tournamentImage
                  ? `url(data:image;base64,${tournamentImage})`
                  : undefined,
              }}
            />
            <div className="score right">{match?.right?.wins || 0}</div>
          </div>
          <div className="timer-box">
            <div className="left arrow">
              {inProgressActionSide === "my" &&
                picks?.timer?.phase !== "PLANNING" &&
                inProgressAction?.type !== "ten_bans_reveal" && (
                  <SideArrow ban={inProgressAction?.type === "ban"} />
                )}
            </div>
            <div
              className="phase"
              style={{ visibility: !!inProgressAction ? "visible" : "hidden" }}
            >
              {`${phaseTitle || "Final"} phase`}
            </div>
            <div className="timer">{prettiedTime}</div>
            <div className="right arrow">
              {inProgressActionSide === "their" &&
                picks?.timer?.phase !== "PLANNING" &&
                inProgressAction?.type !== "ten_bans_reveal" && (
                  <SideArrow ban={inProgressAction?.type === "ban"} />
                )}
            </div>
          </div>
        </div>
        {!!bottomImage && (
          <div
            className="bottom-image"
            style={{
              backgroundImage: `url(data:image;base64,${bottomImage})`,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ChampSelect;
