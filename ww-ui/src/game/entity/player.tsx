import { setGameStats } from "src/state";
import { GameStats } from "src/types/index.types";
import { ANIMS, ENTITY } from "../constants";
import { Game as GameScene } from "../scenes/Game";
import Ally from "./ally";
import Enemy from "./enemy";
import Entity from "./entity";
import Fireball from "./fireball";

export default class Player extends Entity {
  declare scene: GameScene;

  constructor(scene: GameScene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    this.scene = scene;
    this.setScale(2);
    this.setImmovable(true);
    this.setCollideWorldBounds(true);

    this.initializeHealthBar(x, y, this.width, 4);
  }

  incPlayerKills = () => {
    setGameStats((prev: GameStats) => ({
      ...prev,
      player_kills: prev.player_kills + 1,
    }));
  };

  attackTarget = (target: Ally | Enemy) => {
    if (!target) return;
    target.takeDamage(this.attack);
  };

  castFireball = (destX: number, destY: number) => {
    const angle = Phaser.Math.Angle.Between(this.x, this.y, destX, destY);
    const fireball = new Fireball(
      this.scene,
      this.x,
      this.y,
      destX,
      destY,
      ENTITY.SKILL.FIREBALL
    );

    fireball.setRotation(angle);
    fireball.setVelocity(
      Math.cos(angle) * fireball.speed,
      Math.sin(angle) * fireball.speed
    );

    this.scene.physics.overlap(fireball, this.scene.enemies, (f, e) => {
      const fireball = f as Fireball;
      const enemy = e as Enemy;

      console.log("IS THIS WORKING?", fireball, enemy);

      enemy.setDead();
      fireball.setVisible(false);
    });
  };

  takeDamage = (damage: number) => {
    this.setTint(0xff6666);
    this.health -= damage;

    this.scene.time.delayedCall(350, () => {
      this.healthBar.updateHealth(this.health);
      this.clearTint();
      if (this.health <= 0) {
        this.scene.time.delayedCall(150, () => {
          this.setActive(false).setVisible(false);
        });
        this.scene.gameOver();
      }
    });
  };

  update(_time: number, _delta: number): void {
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
      this.setVelocityY(-1 * this.speed);
      this.play(ANIMS.PLAYER.UP, true);
    } else if (KEYS.A.isDown || KEYS.LEFT.isDown) {
      this.setVelocityX(-1 * this.speed);
      this.play(ANIMS.PLAYER.LEFT, true);
    } else if (KEYS.S.isDown || KEYS.DOWN.isDown) {
      this.setVelocityY(1 * this.speed);
      this.play(ANIMS.PLAYER.DOWN, true);
    } else if (KEYS.D.isDown || KEYS.RIGHT.isDown) {
      this.setVelocityX(1 * this.speed);
      this.play(ANIMS.PLAYER.RIGHT, true);
    } else {
      this.setVelocityX(0);
      this.setVelocityY(0);

      this.play(ANIMS.PLAYER.IDLE);
    }
  }
}
