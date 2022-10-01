import Phaser from "phaser";

import outsideMap from "../assets/map/outside.tmj?url";
//import images from "../assets/map/dungeonPack/Isometric/*?url";

const imageIso = import.meta.glob("../assets/map/dungeonPack/Isometric/*", { eager: true });

const RESOURCES = {
  MAP_OUTSIDE: "map-outside",
};

export class SceneMain extends Phaser.Scene {
  declare controls: Phaser.Cameras.Controls.SmoothedKeyControl;

  constructor() {
    super({ key: "SceneMain" });
  }

  async preload() {
    this.load.tilemapTiledJSON(RESOURCES.MAP_OUTSIDE, outsideMap);
    for (const sprite in imageIso) {
      this.load.image(sprite.replace("../assets/map/", ""), imageIso[sprite].default);
    }
  }

  create() {
    this.add.text(100, 100, "Maaain", {
      font: "15vw verdana",
      color: "white",
    });

    imageIso;

    const map = this.make.tilemap({ key: RESOURCES.MAP_OUTSIDE });

    // add the tileset image we are using
    //const tileset = map.addTilesetImage("standard_tiles", "base_tiles");
    for (const sprite in imageIso) {
      map.addTilesetImage(sprite.replace("../assets/map/", ""), sprite.replace("../assets/map/", ""));
    }
    // create the layers we want in the right order
    map.createLayer("Floor", map.tilesets);

    const cursors = this.input.keyboard.createCursorKeys();

    this.cameras.main.setZoom(0.5);

    var controlConfig = {
      camera: this.cameras.main,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      acceleration: 0.04,
      drag: 0.0005,
      maxSpeed: 0.7,
    };

    this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
  }

  update(time, delta) {
    this.controls.update(delta);
  }
}
