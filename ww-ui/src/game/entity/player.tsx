import { ANIMS } from "../constants";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this, false);

    this.setScale(2);
    this.setImmovable(true);
    this.setCollideWorldBounds(true);
  }

  update(): void {
    if (!this.scene.input.keyboard) return;

    const KEYS = {
      W: this.scene.input.keyboard.addKey("w"),
      A: this.scene.input.keyboard.addKey("a"),
      S: this.scene.input.keyboard.addKey("s"),
      D: this.scene.input.keyboard.addKey("d"),
      UP: this.scene.input.keyboard.addKey("up"),
      DOWN: this.scene.input.keyboard.addKey("down"),
      LEFT: this.scene.input.keyboard.addKey("left"),
      RIGHT: this.scene.input.keyboard.addKey("right"),
    };

    if (KEYS.W.isDown || KEYS.UP.isDown) {
      this.setVelocityY(-160);
      this.play(ANIMS.PLAYER.UP, true);
    } else if (KEYS.A.isDown || KEYS.LEFT.isDown) {
      this.setVelocityX(-160);
      this.play(ANIMS.PLAYER.LEFT, true);
    } else if (KEYS.S.isDown || KEYS.DOWN.isDown) {
      this.setVelocityY(160);
      this.play(ANIMS.PLAYER.DOWN, true);
    } else if (KEYS.D.isDown || KEYS.RIGHT.isDown) {
      this.setVelocityX(160);
      this.play(ANIMS.PLAYER.RIGHT, true);
    } else {
      this.setVelocityX(0);
      this.setVelocityY(0);

      this.play(ANIMS.PLAYER.IDLE);
    }
  }
}
