import { Game as GameScene } from "../scenes/Game";

export default class Projectile extends Phaser.Physics.Arcade.Sprite {
  declare scene: GameScene;

  id: string;
  speed: number;

  constructor(scene: GameScene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    this.id = Phaser.Math.RND.uuid();
    this.name = texture;

    scene.add.existing(this);
    scene.physics.add.existing(this, false);

    scene.physics.add.overlap(this, scene.collisionLayer!);
    scene.physics.add.overlap(this, scene.elevationLayer!);

    this.body?.setCircle(8);
    this.speed = 100;

    this.setOrigin(0.5, 0.5);
  }

  projectileOverlap: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (
    p,
    _l
  ) => {
    const proj = p as Projectile;
    proj.setActive(false);
    proj.setVisible(false);
  };
}
