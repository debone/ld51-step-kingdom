/*enum Directions {
  UP = 0,
  RIGHT = 1,
  DOWN = 2,
  LEFT = 3,
}

const inFrontOf = {
  [Directions.UP]: { x: 0, y: -1 },
  [Directions.DOWN]: { x: 0, y: 1 },
  [Directions.LEFT]: { x: -1, y: 0 },
  [Directions.RIGHT]: { x: 1, y: 0 },
};

enum Status {
  NORMAL = 0,
  HANDSUP = 1,
  WALKING_NORMAL = 2,
  WALKING_HANDSUP = 3,
}*/

export class Human extends Phaser.GameObjects.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    frame?: string | number | undefined
  ) {
    super(scene, x, y, texture, frame);

    //this.playerPos = new Phaser.Math.Vector2(x, y);
  }
}
