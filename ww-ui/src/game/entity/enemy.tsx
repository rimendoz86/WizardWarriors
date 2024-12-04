export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  health: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this, false);

    this.setScale(2);
    this.setImmovable(true);
    this.setCollideWorldBounds(true);

    this.setInteractive().on("pointerdown", this.setTarget, this);
  }

  setTarget = () => {
    this.setActive(false).setVisible(false);
  };

  update(): void {
    this.play(this.texture.key + "-idle", true);
  }
}
