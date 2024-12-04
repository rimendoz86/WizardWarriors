import { Physics, Scene } from "phaser";
import Player from "src/game/entity/player";
import { EventBus } from "../EventBus";
import { ANIMS, CONSTANTS, ENTITY } from "../constants";
import Enemy from "../entity/enemy";
import Slime from "../entity/slime";

export class Game extends Scene {
  cursors: object | null;
  player: Physics.Arcade.Sprite | null;
  enemies: Enemy[];

  collisionLayer: Phaser.Tilemaps.TilemapLayer | null;
  elevationLayer: Phaser.Tilemaps.TilemapLayer | null;

  constructor() {
    super(CONSTANTS.SCENES.GAME);

    this.cursors = null;
    this.player = null;
    this.enemies = new Array<Enemy>();

    this.collisionLayer = null;
    this.elevationLayer = null;
  }

  spawnEnemy = () => {
    const spawnX = Math.random() * this.physics.world.bounds.right;
    const spawnY = Math.random() * this.physics.world.bounds.height;
    const enemy = new Slime(this, spawnX, spawnY, ENTITY.ENEMY.SLIME);
    this.physics.add.collider(enemy, this.collisionLayer!);
    this.physics.add.collider(enemy, this.elevationLayer!);
    this.physics.add.collider(enemy, this.player!);

    for (let i = 0; i < this.enemies.length; i++) {
      this.physics.add.overlap(enemy, this.enemies[i], () => {
        const randomX = Math.random() < 0.5 ? -2 : 2;
        const randomY = Math.random() < 0.5 ? -2 : 2;

        enemy.setPosition(
          this.enemies[i].getBounds().centerX - randomX,
          this.enemies[i].getBounds().centerY - randomY
        );
      });
    }

    this.enemies.push(enemy);
  };

  create() {
    this.input.keyboard?.addKeys({
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
    });

    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("DesertTilemap", "tiles")!;
    map.createLayer("ground", tileset, 0, 0);
    this.elevationLayer = map.createLayer("elevation", tileset, 0, 0);
    this.collisionLayer = map.createLayer("collisions", tileset, 0, 0);

    this.collisionLayer?.setCollisionBetween(45, 54);
    this.elevationLayer?.setCollisionBetween(79, 81);
    this.elevationLayer?.setCollisionBetween(93, 95);
    this.elevationLayer?.setCollisionBetween(107, 109);

    this.player = new Player(this, 640, 310, ENTITY.PLAYER);

    this.physics.add.collider(this.player, this.collisionLayer!);
    this.physics.add.collider(this.player, this.elevationLayer!);

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

    this.time.addEvent({
      delay: 5000,
      loop: true,
      callback: this.spawnEnemy,
      callbackScope: this,
    });

    EventBus.emit("current-scene-ready", this);
  }

  update(time: number, delta: number) {
    this.player?.update(time, delta);

    for (let i = 0; i < this.enemies.length; i++) {
      const enemy = this.enemies[i];
      enemy.update();
    }
  }
}
