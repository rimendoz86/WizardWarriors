import Projectile from "./projectile";
import { Game as GameScene } from "../scenes/Game";
import { ANIMS } from "../constants";

export default class Fireball extends Projectile {
  private destX: number;
  private destY: number;

  constructor(
    scene: GameScene,
    x: number,
    y: number,
    destX: number,
    destY: number,
    texture: string
  ) {
    super(scene, x, y, texture);

    this.destX = destX;
    this.destY = destY;
    this.setScale(2);
    this.speed = 250;
    this.play(ANIMS.SKILL.FIREBALL);
  }
}
