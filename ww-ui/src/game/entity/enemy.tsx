import { Game as GameScene } from "../scenes/Game";
import Ally from "./ally";
import Entity from "./entity";
import Player from "./player";

export default class Enemy extends Entity {
  declare scene: GameScene;

  constructor(scene: GameScene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    this.level = 1;
    this.health = 2;
    this.speed = 75;
    this.attack = 5;

    this.scene = scene;
    this.setScale(2);
    this.setImmovable(true);
    this.setCollideWorldBounds(true);
    this.initializeHealthBar(x, y, this.width, 4);

    scene.enemies.push(this);

    scene.physics.add.collider(this, scene.player!, () =>
      this.attackTarget(scene.player!)
    );

    for (let i = 0; i < scene.allies.length; i++) {
      scene.physics.add.overlap(this, scene.allies[i], () =>
        this.attackTarget(scene.allies[i])
      );
    }
  }

  setDead = () => {
    if (!this.scene) return;
    this.incPlayerKills();
    this.scene.removeFromEnemies(this);
    this.setActive(false).setVisible(false);
  };

  attackTarget = (target: Player | Ally) => {
    if (!target) return;
    target.takeDamage(this.attack, this);
  };

  findClosestTarget = () => {
    let closestTarget: Entity | null = null;
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

    this.setTarget(closestTarget);
  };

  setTarget = (target: Entity | null) => {
    this.target = target;
  };

  update(_time: number, _delta: number): void {
    this.findClosestTarget();
    this.moveToTarget();
    this.play(this.texture.key + "-idle", true);
  }
}
