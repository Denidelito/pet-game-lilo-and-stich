import Phaser from 'phaser';
import { isMobile } from '../utils/device.ts';

export interface CollectedWordUIConfig {
  x: number;
  y: number;
  word: string;
  tileTexture: string;
  font?: string;
  depth?: number;
  tileSize?: number;
}

export class CollectedWordUI {
  public readonly scene: Phaser.Scene;
  private readonly container: Phaser.GameObjects.Container;
  private readonly letters: Phaser.GameObjects.Text[] = [];
  private currentIndex = 0;
  private readonly word: string;

  constructor(scene: Phaser.Scene, config: CollectedWordUIConfig) {
    this.scene = scene;
    this.word = config.word.toUpperCase();
    const font = config.font ?? 'RuneScape ENA';
    const tileSize = config.tileSize ?? 64;

    const tiles: Phaser.GameObjects.GameObject[] = [];
    const mobile = isMobile();

    for (let i = 0; i < this.word.length; i++) {
      const x = mobile ? 0 : i * (tileSize + 8);
      const y = mobile ? i * (tileSize + 8) : 0;

      const tile = scene.add
        .image(x, y, config.tileTexture)
        .setOrigin(0, 0)
        .setDisplaySize(tileSize, tileSize)
        .setDepth(config.depth ?? 100);

      const letter = scene.add
        .text(x + tileSize / 2, y + tileSize / 2, this.word[i], {
          fontSize: `${tileSize * 0.6}px`,
          fontFamily: font,
          color: '#ffffff',
        })
        .setOrigin(0.5)
        .setAlpha(0.3) // полупрозрачный
        .setDepth((config.depth ?? 100) + 1);

      this.letters.push(letter);
      tiles.push(tile, letter);
    }

    this.container = scene.add.container(0, 0, tiles);
    this.container
      .setDepth(config.depth ?? 100)
      .setPosition(config.x - tileSize * this.word.length / 2, config.y);
  }

  public addLetter(letter: string): void {
    const upper = letter.toUpperCase();
    if (
      this.currentIndex < this.letters.length &&
      this.word[this.currentIndex] === upper
    ) {
      this.letters[this.currentIndex].setAlpha(1);
      this.currentIndex++;
    }
  }

  public reset(): void {
    this.currentIndex = 0;
    this.letters.forEach(letter => letter.setAlpha(0.3));
  }

  public destroy(): void {
    this.container.destroy();
  }
}
