import { GameObjects, Scene } from "phaser";
import { SCENES } from "../constants";

export default class PauseScene extends Scene {
  PauseText: GameObjects.Text | null = null;

  constructor() {
    super(SCENES.PAUSE);
  }

  create() {
    this.input.keyboard?.addKeys({
      esc: Phaser.Input.Keyboard.KeyCodes.ESC,
    });

    this.input?.keyboard?.on("keydown-ESC", () => {
      this.PauseText?.setVisible(false);
      this.scene.pause();
      this.scene.run(SCENES.GAME);
    });

    this.PauseText = this.add
      .text(this.scale.width / 2, this.scale.height / 2, "PAUSED", {
        fontSize: "48px",
        fontStyle: "bold",
        color: "#00222E",
        strokeThickness: 1,
        stroke: "#fff",
      })
      .setOrigin(0.5);
  }

  update() {
    if (this.scene.isActive()) {
      this.PauseText?.setVisible(true);
    }
  }
}
