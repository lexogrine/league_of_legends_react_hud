import React from "react";
import { addonApi } from "../api/api";
import { GameData, LHMPlayer, LOLPlayer } from "../api/interfaces";
import { Event } from "../api/interfaces";
interface Props {
  events: Event[];
}

const Events = (props: Props) => {
  const data = props.events;

  return (
    <div className="event">
      Current events:
      {data.map((x) => (
        <div className="eventInfo" key={x.EventID}>
          ID({x.EventID}) - {x.EventName} - {x.EventTime}
        </div>
      ))}
    </div>
  );
};

export default Events;
