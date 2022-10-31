import { Types } from "phaser";
import MenuScene from "src/scenes/MenuScene";

export const config: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  title: "ww",
  parent: "game-content",
  width: 1280,
  height: 720,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
    },
  },
  antialias: false,
  pixelArt: true,
  roundPixels: true,
  scene: [MenuScene],
};
