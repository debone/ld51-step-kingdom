export enum Directions {
  UP = "up",
  RIGHT = "right",
  DOWN = "down",
  LEFT = "left",
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

export enum HumanTypes {
  PLAYER = "player",
  PEASANT = "peasant",
  KNIGHT = "knight",
  ARCHER = "archer",
  ARROW = "arrow",
}

export const PlayerHuman = {
  health: 5,
  maxHealth: 5,
  stamina: 5,
  maxStamina: 5,
  type: HumanTypes.PLAYER,
};

export const PeasantHuman = {
  stamina: 2,
  maxStamina: 2,
  health: 1,
  maxHealth: 1,
  type: HumanTypes.PEASANT,
};

export const KnightHuman = {
  health: 3,
  maxHealth: 3,
  stamina: 3,
  maxStamina: 3,
  type: HumanTypes.KNIGHT,
};

export const ArcherHuman = {
  health: 2,
  maxHealth: 2,
  stamina: 4,
  maxStamina: 4,
  type: HumanTypes.ARCHER,
};

export const ArrowHuman = {
  health: 1,
  maxHealth: 1,
  stamina: 0,
  maxStamina: 0,
  type: HumanTypes.ARROW,
};

export class Human extends Phaser.GameObjects.Sprite {
  declare hud: Phaser.GameObjects.Text;

  declare posX: number;
  declare posY: number;

  declare _stamina: number;
  declare _health: number;

  get stamina(): number {
    return this._stamina;
  }

  set stamina(amount: number) {
    console.log("sta", this.humanType.type, amount);
    this._stamina = Math.max(0, Math.min(this.maxStamina, amount));
    if (this._stamina === 0) {
      console.log("rest mate");
    }
  }

  get health(): number {
    return this._health;
  }

  set health(amount: number) {
    this._health = Math.max(0, Math.min(this.maxHealth, amount));
    if (this._health === 0) {
      console.log("deaded");
    }
  }

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
    humanType: HumanTypes,
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
    if (this.humanType.type !== "arrow") {
      this.hud = this.scene.add
        .text(this.getCenter().x, this.getCenter().y, this.getHudText(), {
          fontFamily: "Alkalami",
          fontSize: "36px",
          color: "#ffffff",
        })
        .setShadow(2, 2, "#333333", 2, false, true);
    }
  }

  updateHud() {
    if (this.humanType.type === "arrow") {
      return;
    }

    this.hud.setPosition(this.getCenter().x, this.getCenter().y);
    this.hud.setText(this.getHudText());
  }

  getHudText() {
    return `Life ${this.health}/${this.maxHealth}\nStam ${this.stamina}/${this.maxStamina}`;
  }

  getPosition() {
    return { x: this.posX, y: this.posY };
  }

  think() {
    if (this.humanType.type === "player") {
      this.setIntent(Moves.MOVE);
      return;
    }

    if (this.humanType.type === "archer") {
      if (this.stamina >= MovesStats[Moves.ATTACK].costStamina) {
        console.log("attack");
        this.setIntent(Moves.ATTACK);
      } else {
        console.log("rest");
        this.setIntent(Moves.REST);
      }
      return;
    }

    if (this.humanType.type === "arrow") {
      this.setIntent(Moves.MOVE);
      return;
    }
  }

  declare currentIntent: {};

  setIntent(move: Moves) {
    this.currentIntent = { move, owner: this };
  }

  getIntent() {
    return this.currentIntent;
  }

  [Moves.MOVE](newTilePos: { x: number; y: number }, newWorldPos: Phaser.Math.Vector2) {
    this.posX = newTilePos.x;
    this.posY = newTilePos.y;

    this.setPosition(newWorldPos.x, newWorldPos.y);

    if (this.humanType.type !== "arrow") {
      this.stamina -= MovesStats[Moves.MOVE].costStamina;
      this.updateHud();
    }
  }

  [Moves.ATTACK](pos: { x: number; y: number }, direction: Directions) {
    this.stamina -= MovesStats[Moves.ATTACK].costStamina;

    this.updateHud();
  }

  [Moves.REST]() {
    this.stamina -= MovesStats[Moves.REST].costStamina;
    this.updateHud();
  }
}
