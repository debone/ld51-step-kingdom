import Phaser from "phaser";

export default class PhaserGamebus extends Phaser.Plugins.BasePlugin {
  gamebus!: Phaser.Events.EventEmitter;

  init(): void {
    this.gamebus = new Phaser.Events.EventEmitter();
  }

  getBus(): Phaser.Events.EventEmitter {
    return this.gamebus;
  }

  on(event: string | symbol, fn: (...args: unknown[]) => void): Phaser.Events.EventEmitter {
    return this.gamebus.on.call(this.gamebus, event, fn);
  }

  emit(event: string | symbol, ...args: unknown[]): boolean {
    return this.gamebus.emit.call(this.gamebus, event, args);
  }
}
