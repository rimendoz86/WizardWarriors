import { setGameStats } from "src/state";
import { GameStats } from "src/types/index.types";
import { Game as GameScene } from "../scenes/Game";
import HealthBar from "./healthbar";

export default class Entity extends Phaser.Physics.Arcade.Sprite {
  declare scene: GameScene;

  id: string;
  level: number = 1;
  attack: number = 1;
  health: number = 100;
  speed: number = 100;

  healthBar!: HealthBar;

  // also used for checking if an entity is close to the player
  minDistanceToPlayer: number = 20;

  // used for checking if an entity is close to an enemy
  detectionRange: number = 200;
  target: Entity | null = null;

  constructor(scene: GameScene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    this.id = Phaser.Math.RND.uuid();
    this.name = texture;

    scene.add.existing(this);
    scene.physics.add.existing(this, false);

    scene.physics.add.collider(this, scene.collisionLayer!);
    scene.physics.add.collider(this, scene.elevationLayer!);
  }

  initializeHealthBar(
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    this.healthBar = new HealthBar(
      this.scene,
      x - this.displayWidth / 1.9,
      y + this.displayHeight / 1.5,
      width * 2.05,
      height,
      this.health
    );
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    this.healthBar.setPosition(
      this.x - this.displayWidth / 2,
      this.y + this.displayHeight / 1.5
    );
  }

  destroy(fromScene?: boolean): void {
    super.destroy(fromScene);

    this.healthBar.destroy();
  }

  findClosestTarget = () => {};
  setDead = () => {};

  setLevel = (level: number) => {
    this.level = level;
  };

  setHealth = (health: number) => {
    this.health = health;
  };

  incPlayerKills = () => {
    setGameStats((prev: GameStats) => {
      const newPlayerKills = prev.player_kills + 1;
      const newPlayerLevel = Math.floor(
        1 + Math.sqrt(1 + 8 * newPlayerKills) / 2
      );

      if (newPlayerLevel > prev.player_level) {
        this.scene.startSpawnLoop(); // we would want to spawn more enemies on level up
      }

      return {
        ...prev,
        player_level: newPlayerLevel,
        player_kills: prev.player_kills + 1,
      };
    });
  };

  takeDamage = (damage: number) => {
    this.setTint(0xff6666);
    this.health -= damage;
    this.healthBar.updateHealth(this.health);
    this.logDamage(damage);

    const delayedCall = this.scene.time.delayedCall(500, () => {
      this.clearTint();
    });
    const delayedDeath = this.scene.time.delayedCall(750, () => {
      if (this.health <= 0) {
        delayedCall.remove();
        delayedDeath.remove();
        this.setDead();
      }
    });
  };

  attackTarget = (target: Entity): void => {
    if (!target) return;
    target.takeDamage(this.attack);
  };

  logDamage = (amount: number): void => {
    console.log(`${this.name}-${this.id} took ${amount} damage.`);
  };

  setTarget = (target: Entity | null) => {
    this.target = target;
  };

  moveToTarget = () => {
    const target = this.getTarget();
    if (!target || this.health <= 0) {
      this.setVelocity(0, 0);
      return;
    }

    const distance = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      target.x,
      target.y
    );

    if (this.shouldStopMoving(distance)) {
      this.setVelocity(0, 0);
      return;
    }

    const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
    this.setVelocity(
      Math.cos(angle) * this.speed,
      Math.sin(angle) * this.speed
    );
  };

  getTarget = (): Entity | null => {
    return this.target;
  };

  shouldStopMoving = (_distance: number): boolean => {
    return false;
  };
}
