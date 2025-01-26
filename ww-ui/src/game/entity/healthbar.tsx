export default class HealthBar {
  private scene: Phaser.Scene;
  private x: number;
  private y: number;
  private width: number;
  private height: number;
  private maxHealth: number;
  private currentHealth: number;
  private bar: Phaser.GameObjects.Graphics;
  private background: Phaser.GameObjects.Graphics;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    maxHealth: number
  ) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.maxHealth = maxHealth;
    this.currentHealth = maxHealth;

    this.background = scene.add.graphics();
    this.background.fillStyle(0x000, 1);
    this.background.fillRect(x, y, width, height);

    this.bar = scene.add.graphics();
    this.updateBar();
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;

    this.background.clear();
    this.background.fillStyle(0x000, 1);
    this.background.fillRect(x, y, this.width, this.height);

    this.updateBar();
  }

  updateHealth(newHealth: number) {
    this.currentHealth = Phaser.Math.Clamp(newHealth, 0, this.maxHealth);
    this.updateBar();
  }

  private updateBar() {
    const healthPercentage = this.currentHealth / this.maxHealth;

    this.bar.clear();
    this.bar.fillStyle(0x00ff4c, 1);
    this.bar.fillRect(
      this.x,
      this.y,
      this.width * healthPercentage,
      this.height
    );
  }

  destroy() {
    this.bar.destroy();
    this.background.destroy();
  }
}
