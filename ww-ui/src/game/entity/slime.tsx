import { Game as GameScene } from "../scenes/Game";
import Enemy from "./enemy";

export default class Slime extends Enemy {
  declare scene: GameScene;

  constructor(scene: GameScene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
  }
}
