import PhaserGamebus from "../gamebus";
import { SceneWorld } from "./world";

export class SceneHUD extends Phaser.Scene {
  gamebus!: PhaserGamebus;
  bus!: Phaser.Events.EventEmitter;

  declare sceneWorld: SceneWorld;

  declare pulses: number;
  declare pulseCount: Phaser.GameObjects.Text;

  constructor() {
    super("SceneHUD");
  }

  create(data: { sceneWorld: SceneWorld }) {
    this.sceneWorld = data.sceneWorld;
    this.bus = this.gamebus.getBus();

    this.pulses = 0;

    this.pulseCount = this.add
      .text(10, 10, `Step ${this.pulses}`, {
        fontFamily: "Alkalami",
        fontSize: "36px",
        color: "#ffffff",
      })
      .setShadow(2, 2, "#333333", 2, false, true);

    this.gamebus.on("pulse", () => {
      this.pulses++;
      this.pulseCount.setText(`Step ${this.pulses}`);
    });
  }
}
