import { Scene } from "phaser";
import Player from "src/game/entity/player";
import { getGameStats } from "src/state";
import { GameStats } from "src/types/index.types";
import { EventBus } from "../EventBus";
import { CONSTANTS, ENTITY } from "../constants";
import Ally from "../entity/ally";
import Enemy from "../entity/enemy";
import Slime from "../entity/slime";
import { Game as GameScene } from "../scenes/Game";

export class Game extends Scene {
  player: Player | null;
  allies: Ally[] = [];
  enemies: Enemy[] = [];

  collisionLayer: Phaser.Tilemaps.TilemapLayer | null = null;
  elevationLayer: Phaser.Tilemaps.TilemapLayer | null = null;

  constructor() {
    super(CONSTANTS.SCENES.GAME);

    this.player = null;
  }

  loadGameStats = (gameStats: GameStats) => {
    const { player_level, total_allies, total_enemies } = gameStats;

    this.player?.setLevel(player_level);

    for (let i = 0; i < total_allies; i++) {
      this.spawnAlly();
    }

    for (let i = 0; i < total_enemies; i++) {
      this.spawnEnemy();
    }
  };

  private spawnEntity<T extends Phaser.GameObjects.Sprite>(
    entityClass: new (
      scene: GameScene,
      x: number,
      y: number,
      type: string
    ) => T,
    entityType: string,
    existingEntities: T[]
  ): void {
    let spawnX: number, spawnY: number;
    let isOverlapping: boolean;

    do {
      spawnX = Math.random() * this.physics.world.bounds.right;
      spawnY = Math.random() * this.physics.world.bounds.height;

      isOverlapping = existingEntities.some((existingEntity) => {
        const distance = Phaser.Math.Distance.Between(
          spawnX,
          spawnY,
          existingEntity.x,
          existingEntity.y
        );
        return distance < existingEntity.width;
      });
    } while (isOverlapping);

    new entityClass(this, spawnX, spawnY, entityType);
  }

  gameOver() {
    this.player?.destroy();
    this.allies.forEach((ally) => ally.destroy());
    this.enemies.forEach((enemy) => enemy.destroy());

    this.allies = [];
    this.enemies = [];
    this.player = null;

    this.scene.stop();
    this.scene.start(CONSTANTS.SCENES.GAME_OVER);
  }

  spawnAlly = () => {
    this.spawnEntity(Ally, ENTITY.ALLY, this.allies);
  };

  spawnEnemy = () => {
    this.spawnEntity(Slime, ENTITY.ENEMY.SLIME, this.enemies);
  };

  removeFromAllies = (ally: Ally) => {
    const index = this.allies.indexOf(ally);
    if (index > -1) {
      this.allies.splice(index, 1);
    }
  };

  removeFromEnemies = (enemy: Enemy) => {
    const index = this.enemies.indexOf(enemy);
    if (index > -1) {
      this.enemies.splice(index, 1);
    }
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

    this.time.addEvent({
      delay: 5000,
      loop: true,
      callback: this.spawnEnemy,
      callbackScope: this,
    });

    this.loadGameStats(getGameStats());

    EventBus?.emit("current-scene-ready", this);
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
