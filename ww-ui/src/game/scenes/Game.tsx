import { Physics, Scene } from "phaser";
import Player from "src/game/entity/player";
import { EventBus } from "../EventBus";
import { ANIMS, CONSTANTS, ENTITY } from "../constants";
import Enemy from "../entity/enemy";
import Slime from "../entity/slime";
import Ally from "../entity/ally";

export class Game extends Scene {
  cursors: object | null;
  player: Physics.Arcade.Sprite | null;
  allies: Ally[] = [];
  enemies: Enemy[] = [];

  collisionLayer: Phaser.Tilemaps.TilemapLayer | null = null;
  elevationLayer: Phaser.Tilemaps.TilemapLayer | null = null;

  constructor() {
    super(CONSTANTS.SCENES.GAME);

    this.cursors = null;
    this.player = null;
  }

  spawnEnemy = () => {
    let spawnX: number, spawnY: number;
    let isOverlapping;

    do {
      spawnX = Math.random() * this.physics.world.bounds.right;
      spawnY = Math.random() * this.physics.world.bounds.height;

      isOverlapping = this.enemies.some((existingEnemy) => {
        const distance = Phaser.Math.Distance.Between(
          spawnX,
          spawnY,
          existingEnemy.x,
          existingEnemy.y
        );
        return distance < existingEnemy.width;
      });
    } while (isOverlapping);

    new Slime(this, spawnX, spawnY, ENTITY.ENEMY.SLIME);
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

    const ally = new Ally(this, 630, 305, ENTITY.ALLY);

    this.physics.add.collider(ally, this.collisionLayer!);
    this.physics.add.collider(ally, this.elevationLayer!);

    this.allies.push(ally);

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

    for (let i = 0; i < this.allies.length; i++) {
      this.allies[i].update(time, delta);
    }

    for (let i = 0; i < this.enemies.length; i++) {
      this.enemies[i].update(time, delta);
    }
  }
}
