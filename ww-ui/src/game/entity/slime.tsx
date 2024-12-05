import { Game as GameScene } from "../scenes/Game";
import Enemy from "./enemy";

export default class Slime extends Enemy {
  health = 3;

  declare scene: GameScene;

  constructor(scene: GameScene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
  }

  update(): void {
    this.findClosestTarget();
    this.moveToTarget();
    this.play(this.texture.key + "-idle", true);
  }
}
