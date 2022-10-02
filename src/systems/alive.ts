import { Human, inFrontOf, Moves } from "../entities/human";

export class AliveGroup extends Phaser.GameObjects.Group {
  declare map: Phaser.Tilemaps.Tilemap;

  constructor(scene: Phaser.Scene, map: Phaser.Tilemaps.Tilemap) {
    super(scene);

    this.map = map;

    this.on("wololo", (eee) => {
      console.log("group", eee);
    });

    this.on("pulse", () => {
      //collect all the intents
      const intents = this.getChildren().map((child: any) => child.getIntent()!);
      //execute them
      this.runHumans(intents);
    });

    //this.createCallback = (obj) => console.log("added to group", obj);
    this.removeCallback = (obj) => console.log("removed from group", obj);
  }

  createCallback = (obj: Phaser.GameObjects.GameObject) => {
    console.log("added to group 2", obj);
    console.log("there are %d alive", this.getLength());
  };

  runHumans(intents: { move: Moves; owner: Human }[]) {
    for (const intent of intents) {
      const subject = intent.owner;
      switch (intent.move) {
        case Moves.ATTACK:
          break;
        case Moves.DEFEND:
          break;
        case Moves.MOVE:
          const x = subject.getPosition().x + inFrontOf[subject.direction].x;
          const y = subject.getPosition().y + inFrontOf[subject.direction].y;
          const newWorldPos = this.map.tileToWorldXY(x, y)!;
          subject[Moves.MOVE]({ x, y }, newWorldPos);
          break;
        case Moves.REST:
          break;
      }
      //this.getMatching;
    }
  }
}
