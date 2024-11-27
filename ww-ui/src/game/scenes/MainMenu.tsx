import { GameObjects, Scene } from "phaser";
import { CONSTANTS } from "../constants";

export default class MenuScene extends Scene {
  startButton: GameObjects.Text | null = null;

  constructor() {
    super(CONSTANTS.SCENES.MENU);
  }

  init() {
    this.scale.on("resize", this.resize, this);
  }

  preload() {
    this.load.image("tiles", "assets/DesertTilemap.png");
    this.load.tilemapTiledJSON("map", "assets/map1.json");
    this.load.spritesheet("player", "assets/player/player.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
  }

  create() {
    this.startButton = this.add.text(600, 320, "Start Game", {
      fixedHeight: 40,
      color: "#ff0",
    });

    this.startButton
      .setInteractive({ useHandCursor: true })
      .setStyle({ fontStyle: "fff" })
      .on("pointerover", () => this.enterHoverState())
      .on("pointerout", () => this.enterRestState())
      .on("pointerdown", () => this.scene.start(CONSTANTS.SCENES.GAME));
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
