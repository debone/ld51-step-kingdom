import "../../src/style.css";

import Phaser from "phaser";

import { SceneMain } from "../../src/scenes/main";
import colors from "../../src/colors";

const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  width: 800,
  height: 600,
  backgroundColor: colors[0],
  //"render.transparent": true,
  parent: "game-container",
  physics: {
    default: "arcade",
  },
  scene: [SceneMain],
};

new Phaser.Game(config);
