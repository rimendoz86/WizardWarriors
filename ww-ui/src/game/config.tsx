import { Types } from "phaser";
import MenuScene from "src/scenes/MenuScene";

const gameConfig: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  title: "ww",
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

export default gameConfig;
