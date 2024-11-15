import { Scene, Types } from "phaser";
import Player from "src/game/entity/player";

let player: Types.Physics.Arcade.SpriteWithDynamicBody;

export default class GameScene extends Scene {
  constructor() {
    super("GameScene");
  }

  public cursors: object | null = null;

  preload() {
    this.load.image("tiles", "assets/DesertTilemap.png");
    this.load.tilemapTiledJSON("map", "assets/map1.json");
    this.load.spritesheet("player", "assets/player/player.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
  }

  create() {
    // this work buy typescript is complaining
    this.input.keyboard?.addKeys({
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
    });

    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("DesertTilemap", "tiles");
    if (tileset) {
      map.createLayer("ground", tileset, 0, 0);
      const elevationLayer = map.createLayer("elevation", tileset, 0, 0);
      const collisionLayer = map.createLayer("collisions", tileset, 0, 0);

      collisionLayer?.setCollisionBetween(45, 54);
      elevationLayer?.setCollisionBetween(78, 81);
      elevationLayer?.setCollisionBetween(92, 95);
      elevationLayer?.setCollisionBetween(106, 109);

      player = new Player(
        this,
        640,
        310,
        "player"
      ) as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

      this.physics.add.collider(player, collisionLayer!);
      this.physics.add.collider(player, elevationLayer!);
    }

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", { start: 6, end: 8 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "idle",
      frames: [{ key: "player", frame: 1 }],
      frameRate: 24,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", { start: 12, end: 14 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "up",
      frames: this.anims.generateFrameNumbers("player", { start: 18, end: 20 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "down",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 2 }),
      frameRate: 8,
      repeat: -1,
    });
  }

  update() {
    player.update();
  }
}
