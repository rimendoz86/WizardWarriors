import Projectile from "./projectile";
import { Game as GameScene } from "../scenes/Game";
import { ANIMS } from "../constants";
import Enemy from "./enemy";

export default class Fireball extends Projectile {
  private destX: number;
  private destY: number;
  private damage: number;

  constructor(
    scene: GameScene,
    x: number,
    y: number,
    destX: number,
    destY: number,
    attackDamage: number,
    texture: string
  ) {
    super(scene, x, y, texture);

    this.destX = destX;
    this.destY = destY;
    this.damage = attackDamage;
    this.setScale(2);
    this.speed = 250;
    this.play(ANIMS.SKILL.FIREBALL);

    scene.physics.add.overlap(this, scene.enemies, this.onHitEntity);
  }

  explode = () => {
    this.setVelocity(0, 0);
    this.setActive(false);
    this.setVisible(false);
    this.destroy();
  };

  onHitEntity: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (f, e) => {
    const fireball = f as Fireball;
    const enemy = e as Enemy;

    fireball.explode();
    enemy.takeDamage(this.damage);
  };
}
