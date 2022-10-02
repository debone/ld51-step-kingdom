import Phaser from "phaser";

declare var WebFont: any;

import outsideMap from "../assets/map/outside.tmj?url";
import human from "../assets/map/dungeonPack/Characters/Male/Male_6_Idle0.png?url";

export const imageIso = import.meta.glob<{ default: string }>("../assets/map/dungeonPack/Isometric/*", { eager: true });

export const RESOURCES = {
  MAP_OUTSIDE: "map-outside",
  HUMAN: "human",
};

export class SceneMain extends Phaser.Scene {
  declare keySpace: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: "SceneMain" });
  }

  async preload() {
    this.load.tilemapTiledJSON(RESOURCES.MAP_OUTSIDE, outsideMap);
    for (const sprite in imageIso) {
      this.load.image(sprite.replace("../assets/map/", ""), imageIso[sprite].default);
    }

    this.load.image(RESOURCES.HUMAN, human);

    this.load.script("webfont", "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js");
  }
  create() {
    WebFont.load({
      google: {
        families: ["Alkalami"],
      },
      active: () => {
        this.add
          .text(100, 200, "Step Kingdom", {
            fontFamily: "Alkalami",
            fontSize: "100px",
            color: "#ffffff",
          })
          .setShadow(2, 2, "#333333", 2, false, true);
        this.add
          .text(200, 320, "Press space to start", {
            fontFamily: "Alkalami",
            fontSize: "32px",
            color: "#ffffff",
          })
          .setShadow(2, 2, "#333333", 2, false, true);
      },
    });

    this.keySpace = this.input.keyboard!.addKey("SPACE");
  }

  update(/*time, delta*/) {
    if (Phaser.Input.Keyboard.JustDown(this.keySpace)) {
      this.scene.transition({
        target: "SceneWorld",
        duration: 0, //2000,
        moveBelow: true,
      });
    }
  }
}
