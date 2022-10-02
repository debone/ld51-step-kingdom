export enum Directions {
  UP = 0,
  RIGHT = 1,
  DOWN = 2,
  LEFT = 3,
}

export const inFrontOf = {
  [Directions.UP]: { x: 0, y: -1 },
  [Directions.DOWN]: { x: 0, y: 1 },
  [Directions.LEFT]: { x: -1, y: 0 },
  [Directions.RIGHT]: { x: 1, y: 0 },
};

export enum Moves {
  ATTACK = 0,
  DEFEND = 1,
  REST = 2,
  MOVE = 3,
}

export const MovesStats = {
  [Moves.ATTACK]: {
    costStamina: 2,
  },
  [Moves.DEFEND]: {
    costStamina: 1,
  },
  [Moves.MOVE]: {
    costStamina: 0,
  },
  [Moves.REST]: {
    costStamina: -2,
  },
};

/*
enum Status {
  NORMAL = 0,
  HANDSUP = 1,
  WALKING_NORMAL = 2,
  WALKING_HANDSUP = 3,
}*/

export const PlayerHuman = {
  health: 5,
  maxHealth: 5,
  stamina: 5,
  maxStamina: 5,
  type: "player",
};

export const PeasantHuman = {
  stamina: 2,
  maxStamina: 2,
  health: 1,
  maxHealth: 1,
  type: "peasant",
};

export const KnightHuman = {
  health: 3,
  maxHealth: 3,
  stamina: 3,
  maxStamina: 3,
  type: "knight",
};

export const ArcherHuman = {
  health: 2,
  maxHealth: 2,
  stamina: 4,
  maxStamina: 4,
  type: "archer",
};

export const ArrowHuman = {
  health: 1,
  maxHealth: 1,
  stamina: 0,
  maxStamina: 0,
  type: "arrow",
};

export class Human extends Phaser.GameObjects.Sprite {
  declare hud: Phaser.GameObjects.Text;

  declare posX: number;
  declare posY: number;

  declare stamina: number;
  declare health: number;

  declare maxStamina: number;
  declare maxHealth: number;

  declare humanType:
    | typeof PlayerHuman
    | typeof PeasantHuman
    | typeof KnightHuman
    | typeof ArcherHuman
    | typeof ArrowHuman;

  declare direction: Directions;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    posX: number,
    posY: number,
    texture: string | Phaser.Textures.Texture,
    humanType:
      | typeof PlayerHuman["type"]
      | typeof PeasantHuman["type"]
      | typeof KnightHuman["type"]
      | typeof ArcherHuman["type"]
      | typeof ArrowHuman["type"],
    direction: Directions,
    frame?: string | number | undefined
  ) {
    super(scene, x, y, texture, frame);

    this.posX = posX;
    this.posY = posY;

    this.setOrigin(0, 0.75);

    switch (humanType) {
      case "player":
        this.humanType = Object.assign({}, PlayerHuman);
        break;
      case "peasant":
        this.humanType = Object.assign({}, PeasantHuman);
        break;
      case "knight":
        this.humanType = Object.assign({}, KnightHuman);
        break;
      case "archer":
        this.humanType = Object.assign({}, ArcherHuman);
        break;
      case "arrow":
        this.humanType = Object.assign({}, ArrowHuman);
        break;
    }

    this.maxHealth = this.humanType.maxHealth;
    this.health = this.humanType.health;

    this.maxStamina = this.humanType.maxStamina;
    this.stamina = this.humanType.stamina;

    this.direction = direction;

    //this.playerPos = new Phaser.Math.Vector2(x, y);
    this.hud = this.scene.add
      .text(this.getCenter().x, this.getCenter().y, this.getHudText(), {
        fontFamily: "Alkalami",
        fontSize: "36px",
        color: "#ffffff",
      })
      .setShadow(2, 2, "#333333", 2, false, true);
  }

  updateHud() {
    this.hud.setPosition(this.getCenter().x, this.getCenter().y);
    this.hud.setText(this.getHudText());
  }

  getHudText() {
    return `Life ${this.health}/${this.maxHealth}\nStam ${this.stamina}/${this.maxStamina}`;
  }

  getPosition() {
    return { x: this.posX, y: this.posY };
  }

  declare currentIntent: {};

  setIntent() {}

  getIntent() {
    return { move: Moves.MOVE, owner: this };
  }

  [Moves.MOVE](newTilePos: { x: number; y: number }, newWorldPos: Phaser.Math.Vector2) {
    this.stamina -= MovesStats[Moves.MOVE].costStamina;

    this.posX = newTilePos.x;
    this.posY = newTilePos.y;

    this.setPosition(newWorldPos.x, newWorldPos.y);
    this.updateHud();
  }
}
