import { Pane } from "tweakpane";

import Phaser from "phaser";

import outsideMap from "../assets/map/outside.tmj?url";
//import images from "../assets/map/dungeonPack/Isometric/*?url";

const imageIso = import.meta.glob<{ default: string }>("../assets/map/dungeonPack/Isometric/*", { eager: true });

const RESOURCES = {
  MAP_OUTSIDE: "map-outside",
};

const mapSizeX = 16;
const mapSizeY = 16;

const tileSizeX = 256;
const tileSizeY = 128;

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

  declare floorLayer: Phaser.Tilemaps.TilemapLayer;
  declare pane: Pane;
  declare params: any;
  declare graphics: Phaser.GameObjects.Graphics;
  create() {
    this.params = {
      X: 0,
    };
    this.pane = new Pane();
    this.pane.addInput(this.params, "X", {
      min: -500,
      max: 500,
    });

    this.add.text(100, 100, "Maaain", {
      font: "15vw verdana",
      color: "white",
    });

    imageIso;

    const map = this.add.tilemap(RESOURCES.MAP_OUTSIDE);

    console.log(map);

    // add the tileset image we are using
    //const tileset = map.addTilesetImage("standard_tiles", "base_tiles");
    for (const sprite in imageIso) {
      map.addTilesetImage(sprite.replace("../assets/map/", ""), sprite.replace("../assets/map/", ""));
    }
    // create the layers we want in the right order
    this.floorLayer = map.createLayer("Floor", map.tilesets);
    this.floorLayer.setCullPadding(1, 4);
    this.floorLayer.setOrigin(0, -256);

    const cursors = this.input.keyboard.createCursorKeys();

    //this.cameras.main.setBounds(-2048, 500, 4096, 2048);
    //this.cameras.main.useBounds = true;
    this.cameras.main.setZoom(0.3);
    this.cameras.main.centerOn(tileSizeX / 2, 384 + (tileSizeY * mapSizeY) / 2);

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
    //this.floorLayer.renderDebug(this.graphics);
    //this.floorLayer.setAlpha(0);

    this.graphics = this.add.graphics();

    this.graphics.fillStyle(0x9966ff, 1);
    this.graphics.fillCircle(0, 0, 10);
    this.graphics.fillCircle(0, 512, 10);
    this.graphics.fillCircle(256, 512, 10);
    this.graphics.fillCircle(128, 448, 10);
  }

  update(_time: number, delta: number) {
    this.controls.update(delta);
    //this.floorLayer.setOrigin(0, -1);
    //this.floorLayer.setPosition(0, this.params.X);
  }
}
