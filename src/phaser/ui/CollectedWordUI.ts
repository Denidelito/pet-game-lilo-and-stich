import Phaser from 'phaser';
import {isMobile} from "../utils/device.ts";

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

    constructor(scene: Phaser.Scene, config: CollectedWordUIConfig) {
        this.scene = scene;
        const word = config.word.toUpperCase();
        const font = config.font ?? 'RuneScape ENA';
        const tileSize = config.tileSize ?? 64;

        const tiles: Phaser.GameObjects.GameObject[] = [];
        const mobile = isMobile();

        for (let i = 0; i < word.length; i++) {
            const x = mobile ? 0 : i * (tileSize + 8);
            const y = mobile ? i * (tileSize + 8) : 0;

            const tile = scene.add
                .image(x, y, config.tileTexture)
                .setOrigin(0, 0)
                .setDisplaySize(tileSize, tileSize)
                .setDepth(config.depth ?? 100);

            const letter = scene.add
                .text(x + tileSize / 2, y + tileSize / 2, '', {
                    fontSize: `${tileSize * 0.6}px`,
                    fontFamily: font,
                    color: '#ffffff',
                })
                .setOrigin(0.5)
                .setDepth((config.depth ?? 100) + 1);

            this.letters.push(letter);
            tiles.push(tile, letter);
        }

        this.container = scene.add.container(0, 0, tiles);
        this.container.setDepth(config.depth ?? 100).setPosition(config.x - tileSize * word.length / 2, config.y);
    }

    public addLetter(letter: string): void {
        if (this.currentIndex < this.letters.length) {
            this.letters[this.currentIndex].setText(letter.toUpperCase());
            this.currentIndex++;
        }
    }

    public reset(): void {
        this.currentIndex = 0;
        this.letters.forEach(letter => letter.setText(''));
    }

    public destroy(): void {
        this.container.destroy();
    }
}
