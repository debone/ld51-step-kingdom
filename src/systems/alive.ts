import { Human, HumanTypes, inFrontOf, Moves } from "../entities/human";
import { SceneWorld } from "../scenes/world";

export class AliveGroup extends Phaser.GameObjects.Group {
  declare map: Phaser.Tilemaps.Tilemap;
  declare sceneWorld: SceneWorld;

  constructor(scene: SceneWorld, map: Phaser.Tilemaps.Tilemap) {
    super(scene);

    this.map = map;
    this.sceneWorld = scene;

    this.on("pulse", () => {
      const children = this.getChildren() as Human[];

      //think
      children.forEach((child) => {
        child.think();
        child.updateMarker();
      });

      //collect all the intents
      const intents = children.map((child) => child.getIntent());
      //execute them
      this.runHumans(intents);

      children.forEach((child) => {
        child.updateHud();
        child.think();
        child.updateMarker();
      });
    });

    //this.createCallback = (obj) => console.log("added to group", obj);
    this.removeCallback = (obj) => console.log("removed from group", obj);
  }

  createCallback = (_obj: Phaser.GameObjects.GameObject) => {};

  getInPos(x: number, y: number, type) {
    return (this.getChildren() as Human[]).find(
      (child) => child.humanType.type === type && child.getPosition().x === x && child.getPosition().y === y
    );
  }

  runHumans(intents: { move: Moves; owner: Human }[]) {
    for (const intent of intents) {
      const subject = intent.owner;
      switch (intent.move) {
        case Moves.ATTACK: {
          const x = subject.getPosition().x;
          const y = subject.getPosition().y;

          const dirX = subject.getPosition().x + inFrontOf[subject.direction].x;
          const dirY = subject.getPosition().y + inFrontOf[subject.direction].y;

          if (subject.humanType.type === "archer") {
            this.sceneWorld.addHuman(dirX, dirY, subject.direction, HumanTypes.ARROW);
          }

          subject[Moves.ATTACK]({ x, y }, subject.direction);

          break;
        }
        case Moves.DEFEND: {
          break;
        }
        case Moves.MOVE: {
          let x = subject.getPosition().x + inFrontOf[subject.direction].x;
          let y = subject.getPosition().y + inFrontOf[subject.direction].y;
          const newWorldPos = this.map.tileToWorldXY(x, y)!;

          if (subject.humanType.type === "arrow") {
            const human =
              this.getInPos(x, y, "player") ||
              this.getInPos(subject.getPosition().x, subject.getPosition().y, "player");
            if (human) {
              human.health = human.health - 1;
              //this.a
              subject.destroy();
              continue;
            }
          }

          if (subject.humanType.type !== HumanTypes.ARROW && this.map.getTileAt(x, y, false, "Collision")) {
            continue;
          }

          subject[Moves.MOVE]({ x, y }, newWorldPos);
          break;
        }
        case Moves.REST:
          subject[Moves.REST]();
          break;
      }
      //this.getMatching;
    }
  }
}
