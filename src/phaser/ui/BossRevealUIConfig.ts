import Phaser from 'phaser';

export interface BossRevealUIConfig {
  x: number;
  y: number;
  texture: string;
  revealSteps?: number;
  scale?: number;
  depth?: number;
}

export class BossRevealUI {
  public readonly scene: Phaser.Scene;
  private readonly bossSprite: Phaser.GameObjects.Image;
  private revealCount = 0;
  private readonly maxReveals: number;

  constructor(scene: Phaser.Scene, config: BossRevealUIConfig) {
    this.scene = scene;
    this.maxReveals = config.revealSteps ?? 3;

    this.bossSprite = scene.add.image(config.x, config.y, config.texture)
      .setOrigin(0.5)
      .setTint(0x000000)
      .setAlpha(0.3)
      .setScale(config.scale ?? 1)
      .setDepth(config.depth ?? 10);
  }

  public revealPart(): void {
    this.revealCount = Math.min(this.revealCount + 1, this.maxReveals);

    const progress = this.revealCount / this.maxReveals;

    this.bossSprite.clearTint();
    this.bossSprite.setAlpha(0.3 + 0.7 * progress);

    if (this.revealCount < this.maxReveals) {
      this.bossSprite.setTint(0x000000);
    }
  }

  public reset(): void {
    this.revealCount = 0;
    this.bossSprite.setTint(0x000000);
    this.bossSprite.setAlpha(0.3);
  }

  public destroy(): void {
    this.bossSprite.destroy();
  }
}
