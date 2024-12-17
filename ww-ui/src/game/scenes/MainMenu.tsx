import { GameObjects, Scene } from "phaser";
import { CONSTANTS } from "../constants";
import { EventBus } from "../EventBus";

export default class MenuScene extends Scene {
  startButton: GameObjects.Text | null = null;

  constructor() {
    super(CONSTANTS.SCENES.MENU);
  }

  init() {
    this.scale.on("resize", this.resize, this);
  }

  create() {
    this.startButton = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      "Start Game",
      {
        fontSize: "32px",
        color: "#ff0",
      }
    );

    this.startButton
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5)
      .on("pointerover", () => this.enterHoverState())
      .on("pointerout", () => this.enterRestState())
      .on("pointerdown", () => this.scene.switch(CONSTANTS.SCENES.GAME));

    EventBus?.emit("current-scene-ready", this);
  }

  enterHoverState() {
    this.startButton?.setStyle({ fill: "#fff" });
  }

  enterRestState() {
    this.startButton?.setStyle({ fill: "#ff0" });
  }

  resize(gameSize: GameObjects.Components.Size) {
    this.cameras.resize(gameSize.width, gameSize.height);
  }
}
