export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this, false);

    this.setScale(2).refreshBody();
    this.setCollideWorldBounds(true);
  }

  update(): void {
    const cursors =
      this.scene.input.keyboard && this.scene.input.keyboard.createCursorKeys();

    if (!cursors) return;

    if (cursors.left.isDown) {
      this.setVelocityX(-160);

      this.play("left", true);
    } else if (cursors.right.isDown) {
      this.setVelocityX(160);

      this.play("right", true);
    } else if (cursors.up.isDown) {
      this.setVelocityY(-160);

      this.play("up", true);
    } else if (cursors.down.isDown) {
      this.setVelocityY(160);

      this.play("down", true);
    } else {
      this.setVelocityX(0);
      this.setVelocityY(0);

      this.play("idle");
    }
  }
}
