import { Types } from "phaser";
import MainMenu from "./scenes/MainMenu";
import { Game as MainGame } from "./scenes/Game";

export const config: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  title: "WizardWarriors",
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
      gravity: { x: 0, y: 0 },
    },
  },
  antialias: false,
  pixelArt: true,
  roundPixels: true,
  scene: [MainMenu, MainGame],
};
