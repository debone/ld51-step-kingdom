import { Pane } from "tweakpane";

import Phaser, { Display } from "phaser";

const Color = Display.Color;

import { Directions, Human, HumanTypes, Moves } from "../entities/human";
import { imageIso, RESOURCES } from "./main";
import { AliveGroup } from "../systems/alive";
import PhaserGamebus from "../gamebus";

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
  gamebus!: PhaserGamebus;
  bus!: Phaser.Events.EventEmitter;

  constructor() {
    super({ key: "SceneWorld" });
  }

  declare floorLayer: Phaser.Tilemaps.TilemapLayer;
  declare structureLayer: Phaser.Tilemaps.TilemapLayer;
  declare collisionLayer: Phaser.Tilemaps.TilemapLayer;
  declare objectLayer: Phaser.Tilemaps.ObjectLayer;
  declare objects: Phaser.GameObjects.Group;
  declare pane: Pane;
  declare params: any;
  declare marker: Phaser.GameObjects.Graphics;
  declare cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  declare map: Phaser.Tilemaps.Tilemap;

  addHuman(x: number, y: number, direction: Directions, type: HumanTypes) {
    const archerOnePlace = this.map.tileToWorldXY(x, y);

    if (archerOnePlace === null) {
      return;
    }

    const human = new Human(this, archerOnePlace.x, archerOnePlace.y, x, y, type, direction);

    this.objects.add(human);
    this.add.existing(human);

    if (type === HumanTypes.PLAYER) {
      let wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      let aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      let sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      let dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      let oneKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
      let twoKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
      let threeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
      let fourKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);

      wKey.on("down", function () {
        human.setDirection(Directions.UP);
      });
      aKey.on("down", function () {
        human.setDirection(Directions.LEFT);
      });
      sKey.on("down", function () {
        human.setDirection(Directions.DOWN);
      });
      dKey.on("down", function () {
        human.setDirection(Directions.RIGHT);
      });

      oneKey.on("down", function () {
        human.setIntent(Moves.ATTACK);
      });
      twoKey.on("down", function () {
        human.setIntent(Moves.DEFEND);
      });
      threeKey.on("down", function () {
        human.setIntent(Moves.MOVE);
      });
      fourKey.on("down", function () {
        human.setIntent(Moves.REST);
      });
    }

    return human;
  }

  drawMark(x: number, y: number, color: Color, graphics: Phaser.GameObjects.Graphics) {
    // this.floorLayer?
    const worldCoord = this.floorLayer.tileToWorldXY(x, y);
    const tileAt = this.floorLayer.getTileAt(x, y);

    // Snap to tile coordinates, but in world space
    let tx = worldCoord.x;
    let ty = tileAt ? worldCoord.y - tileFloorHeight[tileAt.index] : worldCoord.y;

    graphics.lineStyle(7, color.color, 1);
    graphics.translateCanvas(tx, ty);
    graphics.beginPath();
    graphics.moveTo(128, 0);
    graphics.lineTo(256, 64);
    graphics.lineTo(128, 128);
    graphics.lineTo(0, 64);
    graphics.lineTo(128, 0);
    graphics.closePath();
    graphics.strokePath();
  }

  removeHuman() {}

  create() {
    this.scene.run("SceneHUD", { sceneWorld: this });

    this.bus = this.gamebus.getBus();

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

    this.structureLayer = this.map.createLayer("Scenary", this.map.tilesets)!;

    this.collisionLayer = this.map.createLayer("Collision", [])!;

    this.objectLayer = this.map.getObjectLayer("Objects")!;

    this.objects = new AliveGroup(this, this.map);

    this.objectLayer.objects.map((object) => {
      const objectType = object.properties?.filter((property) => property.name === "type")[0];
      if (objectType) {
        const direction = object.properties.filter((property) => property.name === "direction")[0];
        console.log("adding human", direction, objectType, object);
        this.addHuman(
          Math.floor((object.x! - 64) / 128),
          Math.floor((object.y! - 64) / 128),
          direction.value,
          objectType.value
        );
      }
    });

    //this.floorLayer.setPosition(0, -256)

    /*
    const humanPlace = this.map.tileToWorldXY(10, 7)!;
    const human = new Human(
      this,
      humanPlace.x,
      humanPlace.y,
      10,
      7,
      RESOURCES.HUMAN_LEFT,
      HumanTypes.PLAYER,
      Directions.LEFT
    );
    this.objects.add(human);
    this.add.existing(human);*/
    //this.addHuman(10, 7, Directions.LEFT, HumanTypes.PLAYER);

    //
    //this.addHuman(3, 7, Directions.RIGHT, HumanTypes.ARCHER);
    //this.addHuman(4, 7, Directions.RIGHT, HumanTypes.ARROW);
    /*const archerOnePlace = this.map.tileToWorldXY(4, 7)!;
    const archerOne = new Human(
      this,
      archerOnePlace.x,
      archerOnePlace.y,
      4,
      7,
      RESOURCES.HUMAN_RIGHT,
      "archer",
      Directions.RIGHT
    );
    this.objects.add(archerOne);
    this.add.existing(archerOne);*/
    /*
    const archerTwoPlace = this.map.tileToWorldXY(4, 6)!;
    const archerTwo = new Human(
      this,
      archerTwoPlace.x,
      archerTwoPlace.y,
      4,
      6,
      RESOURCES.HUMAN_RIGHT,
      "archer",
      Directions.RIGHT
    );
    this.objects.add(archerTwo);
    this.add.existing(archerTwo); */

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
    this.drawMark(7, 7, Color.RandomRGB(), this.marker);

    //(0, 0, this.map.tileWidth, this.map.tileHeight);
    //this.floorLayer.tilemap.renderDebugFull(this.marker);
  }

  update(_time: number, delta: number) {
    this.controls.update(delta);

    if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
      this.gamebus.emit("pulse", _time);
      this.objects.emit("pulse", _time);
    }

    //this.floorLayer.setOrigin(0, -1);
    //this.floorLayer.setPosition(0, this.params.X);
    const worldPoint = this.input.activePointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;

    const pointerTile = this.floorLayer.worldToTileXY(
      worldPoint.x - this.map.tileWidth / 2,
      worldPoint.y, //- this.map.tileWidth / 2,
      true
    );

    //    console.log(this.map.getTileAt(pointerTile.x, pointerTile.y));

    if (pointerTile) {
      this.marker.clear();
      this.drawMark(pointerTile.x, pointerTile.y, Color.IntegerToColor(0x9966ff), this.marker);
      // Snap to tile coordinates, but in world space
      //this.marker.x = worldCoord.x;
      //this.marker.y = worldCoord.y - tileFloorHeight[tileAt.index];

      //log(`mouse is at, ${worldCoord.x}, ${worldCoord.y}`);
      //debugEvery(500);

      this.params.coord.x = pointerTile.x;
      this.params.coord.y = pointerTile.y;
    }

    this.pane.refresh();
  }
}
