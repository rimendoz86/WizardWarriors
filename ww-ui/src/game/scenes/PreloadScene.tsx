import { GameObjects, Scene } from "phaser";
import { ANIMS, CONSTANTS, ENTITY } from "../constants";

export default class PreloadScene extends Scene {
  constructor() {
    super(CONSTANTS.SCENES.PRELOAD);
  }

  init() {
    this.scale.on("resize", this.resize, this);
  }

  preload() {
    this.load.image("wizard-magus", "assets/wizard-magus.png");
    this.load.image("tiles", "assets/DesertTilemap.png");
    this.load.tilemapTiledJSON("map", "assets/map1.json");
    this.load.spritesheet(ENTITY.PLAYER, "assets/player/player.png", {
      frameWidth: 16,
      frameHeight: 16,
      startFrame: 0,
      endFrame: 23,
    });
    this.load.spritesheet(ENTITY.ALLY, "assets/player/ally.png", {
      frameWidth: 16,
      frameHeight: 16,
      startFrame: 9,
      endFrame: 17,
    });
    this.load.spritesheet(ENTITY.ENEMY.SLIME, "assets/enemies/slime.png", {
      frameWidth: 16,
      frameHeight: 16,
      startFrame: 0,
      endFrame: 3,
    });
    this.load.spritesheet(ENTITY.SKILL.FIREBALL, "assets/skills/fireball.png", {
      frameWidth: 16,
      frameHeight: 16,
      startFrame: 0,
      endFrame: 4,
    });
  }

  create() {
    // PLAYER ANIMATIONS
    this.anims.create({
      key: ANIMS.PLAYER.IDLE,
      frames: [{ key: ENTITY.PLAYER, frame: 1 }],
      frameRate: 24,
    });

    this.anims.create({
      key: ANIMS.PLAYER.UP,
      frames: this.anims.generateFrameNumbers(ENTITY.PLAYER, {
        start: 18,
        end: 20,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: ANIMS.PLAYER.DOWN,
      frames: this.anims.generateFrameNumbers(ENTITY.PLAYER, {
        start: 0,
        end: 2,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: ANIMS.PLAYER.LEFT,
      frames: this.anims.generateFrameNumbers(ENTITY.PLAYER, {
        start: 6,
        end: 8,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: ANIMS.PLAYER.RIGHT,
      frames: this.anims.generateFrameNumbers(ENTITY.PLAYER, {
        start: 12,
        end: 14,
      }),
      frameRate: 8,
      repeat: -1,
    });

    // ALLY ANIMATIONS
    this.anims.create({
      key: ANIMS.ALLY.IDLE,
      frames: [{ key: ENTITY.ALLY, frame: 0 }],
      frameRate: 24,
    });

    this.anims.create({
      key: ANIMS.ALLY.UP,
      frames: [
        { key: ENTITY.ALLY, frame: 2 },
        { key: ENTITY.ALLY, frame: 5 },
        { key: ENTITY.ALLY, frame: 8 },
      ],
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: ANIMS.ALLY.DOWN,
      frames: [
        { key: ENTITY.ALLY, frame: 0 },
        { key: ENTITY.ALLY, frame: 3 },
        { key: ENTITY.ALLY, frame: 6 },
      ],
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: ANIMS.ALLY.LEFT,
      frames: [
        { key: ENTITY.ALLY, frame: 1 },
        { key: ENTITY.ALLY, frame: 4 },
        { key: ENTITY.ALLY, frame: 7 },
      ],
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: ANIMS.ALLY.RIGHT,
      frames: [
        { key: ENTITY.ALLY, frame: 1 },
        { key: ENTITY.ALLY, frame: 4 },
        { key: ENTITY.ALLY, frame: 7 },
      ],
      frameRate: 8,
      repeat: -1,
    });

    // SLIME ANIMATIONS
    this.anims.create({
      key: ANIMS.SLIME.IDLE,
      frames: this.anims.generateFrameNumbers(ENTITY.ENEMY.SLIME, {
        start: 0,
        end: 3,
      }),
      frameRate: 8,
      repeat: -1,
    });

    // SKILL ANIMATIONS
    // FIREBALL
    this.anims.create({
      key: ANIMS.SKILL.FIREBALL,
      frames: this.anims.generateFrameNumbers(ENTITY.SKILL.FIREBALL, {
        start: 0,
        end: 4,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.scene.start(CONSTANTS.SCENES.MENU);
  }

  resize(gameSize: GameObjects.Components.Size) {
    this.cameras.resize(gameSize.width, gameSize.height);
  }
}
