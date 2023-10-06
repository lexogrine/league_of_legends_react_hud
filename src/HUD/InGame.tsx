import React from "react";
import TopBar from "./assets/TopBar.svg";
import Tower from "./assets/Tower.svg";
import { LHMMatch, LHMPlayer, LHMTeam, LOLStatistics } from "../api/interfaces";
import { avatars } from "../api/avatars";
import CameraView from "./Camera/Camera";
import CameraContainer from "./Camera/Container";

const bestOfToAmount = (bo?: string) => {
  switch (bo) {
    case "bo1":
      return 1;
    case "bo3":
      return 2;
    case "bo5":
      return 3;
    case "bo7":
      return 4;
    default:
      return 0;
  }
};

interface InGameProps {
  leftTeam?: LHMTeam;
  rightTeam?: LHMTeam;
  match?: LHMMatch;
  time?: number;
  statistics?: LOLStatistics;
  observedPlayerLeft?: LHMPlayer;
  observedPlayerRight?: LHMPlayer;
  bottomLeftImage?: string;
  bottomImages?: string[];
  hideTopBar?: boolean;
}

const InGame = (props: InGameProps) => {
  const {
    leftTeam,
    rightTeam,
    match,
    time,
    statistics,
    observedPlayerLeft,
    observedPlayerRight,
    bottomImages,
    bottomLeftImage,
    hideTopBar,
  } = props;

  const minutes = time ? Math.floor(time / 60) : 0;
  const seconds = time ? Math.floor(time % 60) : 0;

  return (
    <div className="ingame">
      <div className={`top-bar-container ${hideTopBar && "hidden"}`}>
        <div className="top-bar" style={{ backgroundImage: `url(${TopBar})` }}>
          {!!leftTeam && (
            <div
              className="team-logo"
              style={{
                backgroundImage: `url(/api/teams/logo/${leftTeam?._id})`,
              }}
            />
          )}
          {!!rightTeam && (
            <div
              className="team-logo right"
              style={{
                backgroundImage: `url(/api/teams/logo/${rightTeam?._id})`,
              }}
            />
          )}
          <div className="inner-section">
            <div className="inner-inner-section">
              <div className="team-info">
                <div className="name">{leftTeam?.shortName || "ONE"}</div>
                <div className="bo-box">
                  {[...Array(match?.left?.wins || 0)].map((_, i) => (
                    <div className="box win" key={i} />
                  ))}
                  {[
                    ...Array(
                      bestOfToAmount(match?.matchType) -
                        (match?.left?.wins || 0)
                    ),
                  ].map((_, i) => (
                    <div className="box" key={i + 10} />
                  ))}
                </div>
              </div>
              <div className="separator" />
              <div className="tower-info">
                <div
                  className="tower-icon"
                  style={{ backgroundImage: `url(${Tower})` }}
                />
                <div className="amount">
                  {statistics?.red.turretsDestroyed || 0}
                </div>
              </div>
              <div className="separator" />
              <div className="team-score">{statistics?.blue?.kills || 0}</div>
            </div>
            <div className="inner-inner-section right">
              <div className="team-info">
                <div className="name">{rightTeam?.shortName || "TWO"}</div>
                <div className="bo-box">
                  {[...Array(match?.right?.wins || 0)].map((_, i) => (
                    <div className="box win right" key={i} />
                  ))}
                  {[
                    ...Array(
                      bestOfToAmount(match?.matchType) -
                        (match?.right?.wins || 0)
                    ),
                  ].map((_, i) => (
                    <div className="box" key={i + 10} />
                  ))}
                </div>
              </div>
              <div className="separator" />
              <div className="tower-info">
                <div
                  className="tower-icon"
                  style={{ backgroundImage: `url(${Tower})` }}
                />
                <div className="amount">
                  {statistics?.blue.turretsDestroyed || 0}
                </div>
              </div>
              <div className="separator" />
              <div className="team-score right">
                {statistics?.red?.kills || 0}
              </div>
            </div>
          </div>
          <div className="timer">
            {minutes}:{seconds < 10 ? "0" : ""}
            {seconds}
          </div>
        </div>
      </div>
      <div className={`player-preview-box ${!observedPlayerLeft && "hidden"}`}>
        <div className="player-preview-inner-box">
          <div
            className="player-preview"
            style={{
              backgroundImage: observedPlayerLeft?.avatar
                ? `url(${observedPlayerLeft.avatar}),linear-gradient(0deg, #0E0B13 0%, #20192B 100%)`
                : "linear-gradient(0deg, #0E0B13 0%, #20192B 100%)",
            }}
          >
            <CameraContainer
              observedSteamid={observedPlayerLeft?.steamid || ""}
            />
          </div>
          <div className="bottom-deco" />
          <div className="name">{observedPlayerLeft?.username}</div>
        </div>
      </div>
      <div
        className={`player-preview-box right ${
          !observedPlayerRight && "hidden"
        }`}
      >
        <div className="player-preview-inner-box">
          <div
            className="player-preview"
            style={{
              backgroundImage: observedPlayerRight?.avatar
                ? `url(${observedPlayerRight.avatar}),linear-gradient(0deg, #0E0B13 0%, #20192B 100%)`
                : "linear-gradient(0deg, #0E0B13 0%, #20192B 100%)",
            }}
          >
            <CameraContainer
              observedSteamid={observedPlayerRight?.steamid || ""}
            />
          </div>
          <div className="bottom-deco" />
          <div className="name">{observedPlayerRight?.username}</div>
        </div>
      </div>
      {bottomImages?.length && (
        <div className="bottom-image">
          {bottomImages.map((image) => (
            <div
              className="bottom-image-inner"
              style={{
                backgroundImage: `url(data:image;base64,${image})`,
              }}
            />
          ))}
        </div>
      )}
      {!!bottomLeftImage && (
        <div
          className="bottom-left-image"
          style={{
            backgroundImage: `url(data:image;base64,${bottomLeftImage}),linear-gradient(0deg, #0E0B13 0%, #20192B 100%)`,
          }}
        />
      )}
    </div>
  );
};

export default InGame;
