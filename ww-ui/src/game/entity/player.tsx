export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this, false);

    this.setScale(2).refreshBody();
    this.setCollideWorldBounds(true);
  }

  update(): void {
    if (!this.scene.input.keyboard) return;

    const KEYS = {
      W: this.scene.input.keyboard.addKey("w"),
      A: this.scene.input.keyboard.addKey("a"),
      S: this.scene.input.keyboard.addKey("s"),
      D: this.scene.input.keyboard.addKey("d"),
    };

    if (KEYS.W.isDown) {
      this.setVelocityY(-160);
      this.play("up", true);
    } else if (KEYS.A.isDown) {
      this.setVelocityX(-160);
      this.play("left", true);
    } else if (KEYS.S.isDown) {
      this.setVelocityY(160);
      this.play("down", true);
    } else if (KEYS.D.isDown) {
      this.setVelocityX(160);
      this.play("right", true);
    } else {
      this.setVelocityX(0);
      this.setVelocityY(0);

      this.play("idle");
    }
  }
}
