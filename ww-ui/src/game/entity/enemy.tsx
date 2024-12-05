import { Game as GameScene } from "../scenes/Game";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  health: number = 0;
  speed: number = 50;
  target: Phaser.Physics.Arcade.Sprite | null = null;
  detectionRange: number = 200;

  declare scene: GameScene;

  constructor(scene: GameScene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this, false);

    this.setScale(2);
    this.setImmovable(true);
    this.setCollideWorldBounds(true);

    this.setInteractive().on("pointerdown", this.hit, this);

    scene.enemies.push(this);

    scene.physics.add.collider(this, scene.collisionLayer!);
    scene.physics.add.collider(this, scene.elevationLayer!);
    scene.physics.add.collider(this, scene.player!);
  }

  hit = () => {
    this.setActive(false).setVisible(false);
  };

  setTarget = (target: Phaser.Physics.Arcade.Sprite | null) => {
    this.target = target;
  };

  findClosestTarget = () => {
    let closestTarget: Phaser.Physics.Arcade.Sprite | null = null;
    let closestDistance = this.detectionRange;

    const player = this.scene.player;
    const allies = this.scene.allies;

    if (player) {
      const playerDistance = Phaser.Math.Distance.Between(
        this.x,
        this.y,
        player.x,
        player.y
      );
      if (playerDistance <= this.detectionRange) {
        closestTarget = player;
        closestDistance = playerDistance;
      }
    }

    for (const ally of allies) {
      const allyDistance = Phaser.Math.Distance.Between(
        this.x,
        this.y,
        ally.x,
        ally.y
      );
      if (allyDistance < closestDistance) {
        closestTarget = ally;
        closestDistance = allyDistance;
      }
    }

    this.target = closestTarget;
  };

  moveToTarget = () => {
    if (!this.target) {
      this.setVelocity(0, 0);
      return;
    }

    const angle = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      this.target.x,
      this.target.y
    );

    this.setVelocity(
      Math.cos(angle) * this.speed,
      Math.sin(angle) * this.speed
    );
  };

  update(_time: number, _delta: number): void {
    this.findClosestTarget();
    this.moveToTarget();
    this.play(this.texture.key + "-idle", true);
  }
}
