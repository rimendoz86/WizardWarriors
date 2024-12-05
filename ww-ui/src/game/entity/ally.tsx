import { Game as GameScene } from "../scenes/Game";

export default class Ally extends Phaser.Physics.Arcade.Sprite {
  declare scene: GameScene;

  minDistanceToPlayer: number = 20;

  constructor(scene: GameScene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this, false);

    this.setScale(2);
    this.setCollideWorldBounds(true);
  }

  moveToTarget = () => {
    const player = this.scene.player!;
    const playerBounds = player.getBounds();
    const distance = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      playerBounds.centerX,
      playerBounds.centerY
    );

    if (distance < this.minDistanceToPlayer) {
      this.setVelocity(0, 0);
      return;
    }

    const angle = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      playerBounds.centerX,
      playerBounds.centerY
    );
    this.setVelocity(Math.cos(angle) * 50, Math.sin(angle) * 50);
  };

  update(_time: number, _delta: number): void {
    this.moveToTarget();

    const player = this.scene.player!;
    const playerBounds = player.getBounds();
    const distance = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      playerBounds.centerX,
      playerBounds.centerY
    );

    if (distance < this.minDistanceToPlayer) {
      this.play(`${this.texture.key}-idle`, true);
      return;
    }

    const angle = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      playerBounds.centerX,
      playerBounds.centerY
    );
    const RIGHT_BOUNDARY = Math.PI / 4;
    const LEFT_BOUNDARY = -Math.PI / 4;
    const UP_BOUNDARY = -(3 * Math.PI) / 4;
    const DOWN_BOUNDARY = (3 * Math.PI) / 4;

    if (angle >= LEFT_BOUNDARY && angle <= RIGHT_BOUNDARY) {
      this.setFlipX(true);
      this.play(`${this.texture.key}-right`, true);
    } else if (angle > RIGHT_BOUNDARY && angle < DOWN_BOUNDARY) {
      this.play(`${this.texture.key}-down`, true);
    } else if (angle <= LEFT_BOUNDARY && angle > UP_BOUNDARY) {
      this.play(`${this.texture.key}-up`, true);
    } else {
      this.setFlipX(false);
      this.play(`${this.texture.key}-left`, true);
    }
  }
}
