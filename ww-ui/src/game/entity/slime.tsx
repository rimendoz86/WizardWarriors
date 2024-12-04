import Enemy from "./enemy";

export default class Slime extends Enemy {
  health = 3;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
  }

  update(): void {
    this.play(this.texture.key + "-idle", true);
  }
}
