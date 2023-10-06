import React from "react";
import { addonApi } from "../api/api";
import { JoinedPlayer, LHMPlayer, LOLPlayer } from "../api/interfaces";

interface Props {
  data: JoinedPlayer;
}

const Player = (props: Props) => {
  const data = props.data;

  return (
    <div className="player">
      <div className="playerAvatar">
        {data.lhm?.avatar ? (
          <img
            src={data.lhm?.avatar}
            alt="LHM Avatar"
            className="playerAvatarImg"
          />
        ) : (
          <div className="playerAvatarImg" />
        )}
      </div>
      <div className="playerInner">
        <div className="playerInfo">
          <div className="label">LHM Data:</div>
          {data.lhm ? (
            <div className="value">
              {data.lhm?.firstName} {data.lhm?.lastName} from{" "}
              {data.lhm?.country} (Team: {data.lhm?.team})
            </div>
          ) : (
            <div className="value">No LHM data found</div>
          )}
        </div>
        <div className="playerInfo">
          <div className="label">Summoner's name:</div>
          <div className="value">{data.summonerName}</div>
        </div>
        <div className="playerInfo">
          <div className="label">Level:</div>
          <div className="value">{data.level}</div>
        </div>
        <div className="playerInfo">
          <div className="label">Champion:</div>
          <div className="value">{data.championName}</div>
        </div>
        <div className="playerInfo">
          <div className="label">KDA:</div>
          <div className="value">
            {data.scores.kills} / {data.scores.deaths} / {data.scores.assists}
          </div>
        </div>
        <div className="playerInfo">
          <div className="label">Summoner Spells:</div>
          <div className="value">
            {data.summonerSpells.summonerSpellOne.displayName} /{" "}
            {data.summonerSpells.summonerSpellTwo.displayName}
          </div>
        </div>
        <div className="playerInfo">
          <div className="label">Runes:</div>
          <div className="value">
            {data.runes.keystone.displayName} /{" "}
            {data.runes.primaryRuneTree.displayName} /{" "}
            {data.runes.secondaryRuneTree.displayName}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
