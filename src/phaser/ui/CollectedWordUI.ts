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
    private readonly tileTexture: string;
    private readonly font: string;
    private readonly tileSize: number;
    private readonly depth: number;
    private readonly x: number;
    private readonly y: number;
    private readonly mobile: boolean;

    private letters: Phaser.GameObjects.Text[] = [];
    private tiles: Phaser.GameObjects.Image[] = [];
    private currentIndex = 0;

    constructor(scene: Phaser.Scene, config: CollectedWordUIConfig) {
        this.scene = scene;
        this.tileTexture = config.tileTexture;
        this.font = config.font ?? 'RuneScape ENA';
        this.tileSize = config.tileSize ?? 64;
        this.depth = config.depth ?? 100;
        this.x = config.x;
        this.y = config.y;
        this.mobile = isMobile();

        this.container = scene.add.container(0, 0);
        this.container.setDepth(this.depth);

        this.setWord(config.word);
    }

    public setWord(word: string): void {
        this.container.removeAll(true);
        this.letters = [];
        this.tiles = [];
        this.currentIndex = 0;

        const upperWord = word.toUpperCase();

        for (let i = 0; i < upperWord.length; i++) {
            const x = this.mobile ? 0 : i * (this.tileSize + 8);
            const y = this.mobile ? i * (this.tileSize + 8) : 0;

            const tile = this.scene.add
                .image(x, y, this.tileTexture)
                .setOrigin(0, 0)
                .setDisplaySize(this.tileSize, this.tileSize)
                .setAlpha(0.5)
                .setDepth(this.depth);

            const letter = this.scene.add
                .text(x + this.tileSize / 2, y + this.tileSize / 2, upperWord[i], {
                    fontSize: `${this.tileSize * 0.6}px`,
                    fontFamily: this.font,
                    color: '#ffffff',
                })
                .setOrigin(0.5)
                .setAlpha(0.3)
                .setDepth(this.depth + 1);

            this.tiles.push(tile);
            this.letters.push(letter);
            this.container.add([tile, letter]);
        }

        const totalWidth = upperWord.length * (this.tileSize + 8);
        this.container.setPosition(this.mobile ? this.x : this.x - totalWidth / 2, this.y);
    }

    public addLetter(_letter: string): void {
        if (this.currentIndex < this.letters.length) {
            this.letters[this.currentIndex].setAlpha(1);
            this.tiles[this.currentIndex].setAlpha(1);
            this.currentIndex++;
        }
    }

    public reset(): void {
        this.currentIndex = 0;
        this.letters.forEach((letter, index) => {
            letter.setAlpha(0.3);
            this.tiles[index].setAlpha(0.5);
        });
    }


    public destroy(): void {
        this.container.destroy();
    }
}
