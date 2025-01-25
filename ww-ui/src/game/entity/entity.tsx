import { Game as GameScene } from "../scenes/Game";
import HealthBar from "./healthbar";

export default class Entity extends Phaser.Physics.Arcade.Sprite {
  declare scene: GameScene;

  level: number = 1;
  attack: number = 1;
  health: number = 100;
  speed: number = 100;

  healthBar!: HealthBar;

  constructor(scene: GameScene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this, false);

    scene.physics.add.collider(this, scene.collisionLayer!);
    scene.physics.add.collider(this, scene.elevationLayer!);
  }

  initializeHealthBar(
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    this.healthBar = new HealthBar(
      this.scene,
      x - this.displayWidth / 1.9,
      y + this.displayHeight / 1.5,
      width * 2.05,
      height,
      this.health
    );
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    this.healthBar.setPosition(
      this.x - this.displayWidth / 2,
      this.y + this.displayHeight / 1.5
    );
  }

  destroy(fromScene?: boolean): void {
    super.destroy(fromScene);

    this.healthBar.destroy();
  }
}
