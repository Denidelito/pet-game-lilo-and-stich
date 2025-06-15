import Phaser from 'phaser';
import {isMobile} from "../utils/device.ts";

export interface LevelInfoUIConfig {
    x: number;
    y: number;
    word: string;
    backgroundTexture: string;
    characterTexture: string;
    depth?: number;
}

export class LevelInfoUI {
    public readonly scene: Phaser.Scene;
    private readonly container: Phaser.GameObjects.Container;
    private readonly catchLabel: Phaser.GameObjects.Text;
    private readonly word: string;
    private currentIndex = 0;

    constructor(scene: Phaser.Scene, config: LevelInfoUIConfig) {
        this.scene = scene;
        this.word = config.word.toUpperCase();


        const font = 'RuneScape ENA';
        const mobile = isMobile();
        const bg = scene.add.image(0, 0, config.backgroundTexture).setOrigin(0, 0);
        const character = scene.add.image(mobile ? 106 : bg.width / 2, 220, config.characterTexture).setOrigin(0.5, 1);

        if (mobile) {
            bg.setDisplaySize(scene.scale.width, 236);
        }

        const positionTextX = mobile ? scene.scale.width - 190 / 2 : bg.width / 2;

        const themeLabel = scene.add
            .text(positionTextX, mobile ? 14 : 246, 'Тема уровня', {
                fontSize: '28px',
                color: '#E8B976',
                fontFamily: font,
            })
            .setOrigin(0.5, 0);

        const wordText = scene.add
            .text(positionTextX, themeLabel.y + 40, config.word, {
                fontSize: '48px',
                color: '#ffffff',
                fontFamily: font,
            })
            .setOrigin(0.5, 0);

        this.catchLabel = scene.add
            .text(positionTextX, wordText.y + 60, `Поймай букву ${this.word[0]} и собери из неё слово`, {
                fontSize: '28px',
                color: '#E8B976',
                fontFamily: font,
                wordWrap: { width: mobile ? 174 : bg.width - 30},
                align: 'center',
            })
            .setOrigin(0.5, 0);

        this.container = scene.add.container(config.x, config.y, [
            bg,
            character,
            themeLabel,
            wordText,
            this.catchLabel,
        ]);

        this.container.setDepth(config.depth ?? 100);
    }

    public markLetterCaught(letter: string): void {
        if (this.word[this.currentIndex] === letter.toUpperCase()) {
            this.currentIndex++;
            if (this.currentIndex < this.word.length) {
                this.catchLabel.setText(`Поймай букву ${this.word[this.currentIndex]} букву и собери из неё слово`);
            } else {
                this.catchLabel.setText(`Слово собрано!`);
            }
        }
    }

    public destroy(): void {
        this.container.destroy();
    }
}
