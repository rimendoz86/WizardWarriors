import { GameObjects, Scene } from "phaser";
import {
  getGameStats,
  isGameSaved,
  setGameSaved,
  setGameStats,
} from "src/state";
import { CONSTANTS } from "../constants";
import { EventBus } from "../EventBus";

export default class GameOverScene extends Scene {
  buttons: GameObjects.Text[] = [];

  constructor() {
    super(CONSTANTS.SCENES.GAME_OVER);
  }

  init() {
    this.scale.on("resize", this.resize, this);

    setGameStats((prev) => ({
      ...prev,
      is_game_over: true,
    }));

    if (!isGameSaved()) {
      EventBus.emit("save-game", getGameStats());
      setGameSaved(true);
    }
  }

  create() {
    this.add
      .text(600, 240, "Game Over", {
        fontSize: "48px",
        color: "#ff0000",
      })
      .setOrigin(0.5);

    const newGameButton = this.createButton(600, 300, "New Game", () => {
      setGameSaved(false);
      this.scene.start(CONSTANTS.SCENES.GAME);
    });

    const menuButton = this.createButton(600, 360, "Main Menu", () => {
      setGameSaved(false);
      this.scene.start(CONSTANTS.SCENES.MENU);
    });

    this.buttons.push(newGameButton, menuButton);
  }

  createButton(
    x: number,
    y: number,
    text: string,
    onClick: () => void
  ): GameObjects.Text {
    const button = this.add
      .text(x, y, text, {
        fontSize: "32px",
        color: "#ff0",
      })
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5);

    button
      .on("pointerover", () => this.enterHoverState(button))
      .on("pointerout", () => this.enterRestState(button))
      .on("pointerdown", onClick);

    return button;
  }

  enterHoverState(button: GameObjects.Text) {
    button.setStyle({ fill: "#fff" });
  }

  enterRestState(button: GameObjects.Text) {
    button.setStyle({ fill: "#ff0" });
  }

  resize(gameSize: GameObjects.Components.Size) {
    this.cameras.resize(gameSize.width, gameSize.height);
  }
}
