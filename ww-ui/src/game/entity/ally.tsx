import { setGameStats } from "src/state";
import { GameStats } from "src/types/index.types";
import { Game as GameScene } from "../scenes/Game";
import Enemy from "./enemy";
import Entity from "./entity";

export default class Ally extends Entity {
  declare scene: GameScene;

  minDistanceToPlayer: number = 20;

  constructor(scene: GameScene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    this.level = 1;
    this.health = 100;
    this.speed = 100;
    this.attack = 2;

    this.scene = scene;
    this.setScale(2);
    this.setCollideWorldBounds(true);
    this.initializeHealthBar(x, y, this.width, 4);

    scene.allies.push(this);

    scene.physics.add.overlap(this, scene.player!, () => {
      // TODO: Projectile to hit ally
    });

    for (let i = 0; i < scene.enemies.length; i++) {
      scene.physics.add.overlap(this, scene.enemies[i], () =>
        this.attackTarget(scene.enemies[i])
      );
    }
  }

  private setDead = () => {
    if (!this.scene) return;
    this.setActive(false).setVisible(false);
    this.scene.removeFromAllies(this);
  };

  setLevel(level: number) {
    this.level = level;
  }

  setHealth(health: number) {
    this.health = health;
  }

  incPlayerKills = () => {
    setGameStats((prev: GameStats) => ({
      ...prev,
      player_kills: prev.player_kills + 1,
    }));
  };

  attackTarget = (target: Enemy) => {
    if (!target) return;
    target.takeDamage(this.attack);
  };

  takeDamage = (damage: number) => {
    this.setTint(0xff6666);
    this.health -= damage;
    this.healthBar.updateHealth(this.health);

    const delayedCall = this.scene.time.delayedCall(750, () => {
      this.clearTint();
    });
    const delayedDeath = this.scene.time.delayedCall(900, () => {
      if (this.health <= 0) {
        delayedCall.remove();
        delayedDeath.remove();
        this.setDead();
      }
    });
  };

  moveToTarget = () => {
    if (!this.scene.player) return;

    const player = this.scene.player;
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
