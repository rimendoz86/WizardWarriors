import { GameObjects, Scene } from "phaser";
import { SCENES } from "src/constants";
import GameScene from "./GameScene";

let startButton: any;

export default class MenuScene extends Scene {
  constructor() {
    super("MenuScene");
  }

  init() {
    this.scale.on("resize", this.resize, this);
  }

  create() {
    this.scene.add(SCENES.GAME, GameScene, false);

    startButton = this.add.text(600, 320, "Start Game", {
      fixedHeight: 40,
      color: "#ff0",
    });
    startButton
      .setInteractive({ useHandCursor: true })
      .setStyle("fff", 1)
      .on("pointerover", () => this.enterHoverState())
      .on("pointerout", () => this.enterRestState())
      .on("pointerdown", () => this.scene.start(SCENES.GAME));
  }

  enterHoverState() {
    startButton.setStyle({ fill: "#fff" });
  }

  enterRestState() {
    startButton.setStyle({ fill: "#ff0" });
  }

  resize(gameSize: GameObjects.Components.Size) {
    this.cameras.resize(gameSize.width, gameSize.height);
  }
}
