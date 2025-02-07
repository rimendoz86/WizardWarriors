import { Types } from "phaser";
import { Game as MainGame } from "./scenes/Game";
import GameOverScene from "./scenes/GameOverScene";
import MainMenu from "./scenes/MainMenu";
import PauseScene from "./scenes/PauseScene";
import PreloadScene from "./scenes/PreloadScene";

export const config: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  title: "WizardWarriors",
  parent: "game-content",
  backgroundColor: "#fff",
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
      debug: process.env.NEXT_PUBLIC_DEBUG === "true",
    },
  },
  antialias: false,
  pixelArt: true,
  roundPixels: true,
  scene: [PreloadScene, MainMenu, MainGame, PauseScene, GameOverScene],
};
