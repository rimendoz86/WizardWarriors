import { GameObjects, Scene } from "phaser";
import { CONSTANTS } from "../constants";
import { EventBus } from "../EventBus";

export default class MenuScene extends Scene {
  backgroundImage: GameObjects.Image | null = null;
  startButton: GameObjects.Text | null = null;

  constructor() {
    super(CONSTANTS.SCENES.MENU);
  }

  init() {
    this.scale.on("resize", this.resize, this);
  }

  create() {
    this.backgroundImage = this.add
      .image(this.scale.width / 2, this.scale.height / 2, "wizard-magus")
      .setDisplaySize(this.scale.width, this.scale.height);

    this.startButton = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      "Start Game",
      {
        fontSize: "32px",
        fontStyle: "bold",
        color: "#00ff00",
        strokeThickness: 6,
        stroke: "#000",
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
    this.startButton?.setStyle({ fill: "#00ff00" });
  }

  resize(gameSize: GameObjects.Components.Size) {
    this.cameras.resize(gameSize.width, gameSize.height);
  }
}
