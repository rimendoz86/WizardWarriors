import { setGameStats } from "src/state";
import { GameStats } from "src/types/index.types";
import { Game as GameScene } from "../scenes/Game";
import Ally from "./ally";
import Player from "./player";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  declare scene: GameScene;

  level: number = 1;
  health: number = 0;
  speed: number = 75;
  attack: number = 5;

  detectionRange: number = 200;
  target: Phaser.Physics.Arcade.Sprite | null = null;

  constructor(scene: GameScene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this, false);

    this.setScale(2);
    this.setImmovable(true);
    this.setCollideWorldBounds(true);

    this.setInteractive().on("pointerdown", this.hit);

    scene.enemies.push(this);

    scene.physics.add.collider(this, scene.collisionLayer!);
    scene.physics.add.collider(this, scene.elevationLayer!);
    scene.physics.add.collider(this, scene.player!, () =>
      this.attackTarget(scene.player!)
    );

    for (let i = 0; i < scene.allies.length; i++) {
      scene.physics.add.overlap(this, scene.allies[i], () =>
        this.attackTarget(scene.allies[i])
      );
    }
  }

  incPlayerKills = () => {
    setGameStats((prev: GameStats) => ({
      ...prev,
      player_kills: prev.player_kills + 1,
    }));
  };

  hit = (_pointer: Phaser.Input.Pointer) => {
    // TODO: Temporary until we implement a projectile to hit the enemy.
    // TODO: Enemies have to deal damage and take damage from player's allies.
    this.setTint(0xff6666);
    this.health = this.health - this.scene.player!.attack!;

    if (this.scene) {
      this.scene.time.delayedCall(350, () => {
        this.clearTint();
        if (this.health <= 0) {
          this.scene.time.delayedCall(150, () => {
            this.setDead();
          });
        }
      });
    }
  };

  private setDead = () => {
    this.setActive(false).setVisible(false);
    if (this.scene) {
      this.scene.removeFromEnemies(this);
      this.incPlayerKills();
    }
    this.destroy();
  };

  attackTarget = (target: Player | Ally) => {
    target.takeDamage(this.attack);
  };

  takeDamage = (damage: number) => {
    this.setTint(0xff6666);
    this.health -= damage;

    this.scene.time.delayedCall(350, () => {
      this.clearTint();
      if (this.health <= 0) {
        this.scene.time.delayedCall(150, () => {
          this.setDead();
        });
      }
    });
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
    if (!this.target || this.health <= 0) {
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
