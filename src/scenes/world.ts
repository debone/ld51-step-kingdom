import { Pane } from "tweakpane";

import Phaser from "phaser";

import { Directions, Human } from "../entities/human";
import { imageIso, RESOURCES } from "./main";
import { AliveGroup } from "../systems/alive";

//const imageIso = import.meta.glob<{ default: string }>("../assets/map/dungeonPack/Isometric/*", { eager: true });

let clog: any;
function log(log: any) {
  if (log !== clog) {
    console.log(log);
    clog = log;
  }
}
log(1);

/*
let num: number;
let isSet: boolean = false;
function debugEvery(after: number) {
  if (num < 0) {
    return;
  }
  if (!isSet) {
    num = after;
    isSet = true;
  } else {
    num--;
  }

  if (num === 0) {
    debugger;
    num = after;
  }
}*/

//const mapSizeX = 16;
const mapSizeY = 16;

const tileSizeX = 256;
const tileSizeY = 128;

const tileFloorHeight: { [index: number]: number } = {
  86: 10,
  87: 10,
  88: 10,
  89: 10,
  90: 10,
  91: 10,
  92: 10,
  93: 10,
  122: 20,
  123: 20,
  124: 20,
  125: 20,
};

export class SceneWorld extends Phaser.Scene {
  declare controls: Phaser.Cameras.Controls.SmoothedKeyControl;

  constructor() {
    super({ key: "SceneWorld" });
  }

  declare floorLayer: Phaser.Tilemaps.TilemapLayer;
  declare objects: Phaser.GameObjects.Group;
  declare pane: Pane;
  declare params: any;
  declare marker: Phaser.GameObjects.Graphics;
  declare cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  declare map: Phaser.Tilemaps.Tilemap;

  create() {
    this.params = {
      coord: { x: 50, y: 25 },
    };
    this.pane = new Pane();
    this.pane.addInput(this.params, "coord");

    this.add.text(100, 100, "Maaain", {
      font: "15vw verdana",
      color: "white",
    });

    this.map = this.add.tilemap(RESOURCES.MAP_OUTSIDE);
    console.log(this.map);

    // add the tileset image we are using
    //const tileset = map.addTilesetImage("standard_tiles", "base_tiles");
    for (const sprite in imageIso) {
      const tile = this.map.addTilesetImage(sprite.replace("../assets/map/", ""), sprite.replace("../assets/map/", ""));
      tile!.tileOffset.set(0, 384);
    }
    // create the layers we want in the right order
    this.floorLayer = this.map.createLayer("Floor", this.map.tilesets)!;
    this.floorLayer.setCullPadding(1, 4);

    //this.floorLayer.setPosition(0, -256)

    this.objects = new AliveGroup(this, this.map);

    const humanPlace = this.map.tileToWorldXY(9, 9)!;
    const human = new Human(this, humanPlace.x, humanPlace.y, 9, 9, RESOURCES.HUMAN, "player", Directions.LEFT);
    this.objects.add(human);
    this.add.existing(human);

    this.cursors = this.input.keyboard!.createCursorKeys();

    //this.cameras.main.setBounds(-2048, 500, 4096, 2048);
    //this.cameras.main.useBounds = true;
    this.cameras.main.setZoom(0.5);
    this.cameras.main.centerOn(tileSizeX / 2, (tileSizeY * mapSizeY) / 2);

    var controlConfig = {
      camera: this.cameras.main,
      left: this.cursors.left,
      right: this.cursors.right,
      up: this.cursors.up,
      down: this.cursors.down,
      acceleration: 0.04,
      drag: 0.0005,
      maxSpeed: 0.7,
    };

    this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
    //this.floorLayer.renderDebug(this.graphics);
    //this.floorLayer.setAlpha(0);

    this.marker = this.add.graphics();
    //this.marker.fillStyle(0x9966ff, 1);
    //this.marker.fillCircle(0, 0, 10);
    //this.marker.fillCircle(128, 64, 10);
    //this.marker.fillCircle(256, 512, 10);
    //this.marker.fillCircle(128, 448, 10);

    this.marker.lineStyle(7, 0x9966ff, 1);
    this.marker.beginPath();
    this.marker.moveTo(128, 0);
    this.marker.lineTo(256, 64);
    this.marker.lineTo(128, 128);
    this.marker.lineTo(0, 64);
    this.marker.lineTo(128, 0);
    this.marker.closePath();
    this.marker.strokePath(); //(0, 0, this.map.tileWidth, this.map.tileHeight);
    //this.floorLayer.tilemap.renderDebugFull(this.marker);
  }

  update(_time: number, delta: number) {
    this.controls.update(delta);

    if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
      this.objects.emit("pulse", _time);
    }

    //this.floorLayer.setOrigin(0, -1);
    //this.floorLayer.setPosition(0, this.params.X);
    const worldPoint = this.input.activePointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;

    const pointerTile = this.map.worldToTileXY(
      worldPoint.x - this.map.tileWidth / 2,
      worldPoint.y, //- this.map.tileWidth / 2,
      true
    );

    //    console.log(this.map.getTileAt(pointerTile.x, pointerTile.y));

    if (pointerTile) {
      const worldCoord = this.map.tileToWorldXY(pointerTile.x, pointerTile.y);

      if (worldCoord) {
        const tileAt = this.map.getTileAt(pointerTile.x, pointerTile.y);
        if (tileAt) {
          // Snap to tile coordinates, but in world space
          this.marker.x = worldCoord.x;
          this.marker.y = worldCoord.y - tileFloorHeight[tileAt.index];

          //debugEvery(500);

          this.params.coord.x = pointerTile.x;
          this.params.coord.y = pointerTile.y;
        }
      }
    }

    this.pane.refresh();
  }
}
