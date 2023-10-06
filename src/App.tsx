import React, { useEffect } from "react";
import Layout from "./HUD/Layout";
import io from "socket.io-client";
import { port, isDev } from "./api/api";
import ActionManager, { ConfigManager } from "./api/actionManager";
import { initiateConnection } from "./HUD/Camera/mediaStream";

export const actions = new ActionManager();
export const configs = new ConfigManager();

export const socket = io(isDev ? `localhost:${port}` : "/");

let isInWindow = !!window.parent.ipcApi;

if (isInWindow) {
  window.parent.ipcApi.receive("raw", (data: any) => {});
}

const App = () => {
  useEffect(() => {
    const href = window.location.href;
    socket.emit("started");
    let isDev = false;
    let name = "";
    if (href.indexOf("/huds/") === -1) {
      isDev = true;
      name = (Math.random() * 1000 + 1)
        .toString(36)
        .replace(/[^a-z]+/g, "")
        .substr(0, 15);
    } else {
      const segment = href.substr(href.indexOf("/huds/") + 6);
      name = segment.substr(0, segment.lastIndexOf("/"));
    }

    socket.on("readyToRegister", () => {
      socket.emit("register", name, isDev, "leagueoflegends");
      initiateConnection();
    });
    socket.on(`hud_config`, (data: any) => {
      configs.save(data);
    });
    socket.on(`hud_action`, (data: any) => {
      actions.execute(data.action, data.data);
    });
    socket.on("keybindAction", (action: string) => {
      actions.execute(action);
    });

    socket.on("refreshHUD", () => {
      window.top?.location.reload();
    });

    // socket.on("update", (data: string) => RLI?.feed(data));

    // socket.on("match", () => {
    //   loadMatch(true);
    // });

    // loadMatch(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <Layout configs={configs} actions={actions} />;
};

export default App;
