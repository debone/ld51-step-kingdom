import "./style.css";

import Phaser from "phaser";

import { SceneMain } from "./scenes/main";
import { SceneWorld } from "./scenes/world";
import { SceneHUD } from "./scenes/hud";

import { GAME_CONFIG } from "./consts";
import PhaserGamebus from "./gamebus";

export const config = {
  ...GAME_CONFIG,
  plugins: {
    global: [
      {
        key: "PhaserGamebus",
        plugin: PhaserGamebus,
        start: true,
        mapping: "gamebus",
      },
    ],
  },
  scene: [SceneMain, SceneWorld, SceneHUD],
};

new Phaser.Game(config);
