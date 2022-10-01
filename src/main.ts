import "./style.css";

import Phaser from "phaser";

import { SceneMain } from "./scenes/main";

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
  scene: [SceneMain],
};

new Phaser.Game(config);
