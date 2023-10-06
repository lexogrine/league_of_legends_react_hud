import React from "react";
import { addonApi, lhmApi } from "../api/api";
import {
  GameData,
  LHMMatch,
  LHMPlayer,
  LHMTeam,
  LOLPlayer,
} from "../api/interfaces";

interface Props {
  gameData: GameData;
  statistics?: any;
  match: LHMMatch | null;
  teams: LHMTeam[];
}

const Game = (props: Props) => {
  const data = props.gameData;
  const stats = props.statistics;
  const match = props.match;
  const teams = props.teams;

  const leftTeam = teams.find((t) => t._id === match?.left?.id);
  const rightTeam = teams.find((t) => t._id === match?.right?.id);

  return (
    <div className="game">
      <div className="gameInfo big">
        <div className="gameInfoInner">
          {leftTeam?.logo ? (
            <img
              className="logo"
              src={lhmApi.teams.getDirectLogo(leftTeam.logo)}
              alt={leftTeam.name}
            />
          ) : (
            <div className="logo" />
          )}
          <div className="label big">
            {leftTeam?.name || "Blue"} vs {rightTeam?.name || "Red"}
          </div>
          {rightTeam?.logo ? (
            <img
              className="logo"
              src={lhmApi.teams.getDirectLogo(rightTeam.logo)}
              alt={rightTeam.name}
            />
          ) : (
            <div className="logo" />
          )}
        </div>
        <div className="label big">{match?.matchType}</div>
        <div className="label big alt">
          {match?.left?.wins || 0} to {match?.right?.wins || 0}
        </div>
      </div>
      <div className="gameInfo">
        <div className="label">Game time:</div>
        <div className="value">
          {Math.floor(data.gameTime / 60)}:
          {Math.floor(data.gameTime) % 60 < 10 ? "0" : ""}
          {Math.floor(data.gameTime) % 60}
        </div>
      </div>
      <div className="gameInfo">
        <div className="label">Game mode:</div>
        <div className="value">{data.gameMode}</div>
      </div>
      {stats ? (
        <>
          <div className="gameInfo">
            <div className="label">Kills:</div>
            <div className="value">
              {stats.blue.kills} / {stats.red.kills}
            </div>
          </div>
          {/* <div className="gameInfo">
            <div className="label">Dragons:</div>
            <div className="value">
              {stats.blue.dragons} / {stats.red.dragons}
            </div>
          </div>
          <div className="gameInfo">
            <div className="label">Heralds:</div>
            <div className="value">
              {stats.blue.heralds} / {stats.red.heralds}
            </div>
          </div>
          <div className="gameInfo">
            <div className="label">Barons:</div>
            <div className="value">
              {stats.blue.barons} / {stats.red.barons}
            </div>
          </div> */}
          <div className="gameInfo">
            <div className="label">Turrets:</div>
            <div className="value">
              {stats.red.turretsDestroyed} / {stats.blue.turretsDestroyed}
            </div>
          </div>
          <div className="gameInfo">
            <div className="label">Inhibitors:</div>
            <div className="value">
              {stats.red.inhibitorsDestroyed} / {stats.blue.inhibitorsDestroyed}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Game;
