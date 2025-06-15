import Phaser from 'phaser';

export interface LevelIntroTextConfig {
    text: string;
    level?: number;
    duration?: number;
    delay?: number;
    onComplete?: () => void;
}

export class LevelIntroText {
    private readonly scene: Phaser.Scene;
    private readonly container: Phaser.GameObjects.Container;
    private readonly levelText: Phaser.GameObjects.Text;
    private readonly themeText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, config: LevelIntroTextConfig) {
        this.scene = scene;

        const { width, height } = scene.scale;
        const font = 'RuneScape ENA, serif';
        const holdDuration = config.duration ?? 3000;
        const delay = config.delay ?? 500;

        const levelStr = `УРОВЕНЬ ${config.level ?? 1}`.toUpperCase();
        const themeStr = config.text.toUpperCase();

        this.levelText = scene.add.text(width / 2, height / 2 - 60, levelStr, {
            fontFamily: font,
            fontSize: '72px',
            color: '#E8B976',
            stroke: '#4E2512',
            strokeThickness: 6,
            align: 'center',
        }).setOrigin(0.5).setAlpha(0).setScale(0.8).setDepth(999);

        this.themeText = scene.add.text(width / 2, height / 2 + 20, themeStr, {
            fontFamily: font,
            fontSize: '102px',
            color: '#E8B976',
            stroke: '#4E2512',
            strokeThickness: 6,
            align: 'center',
        }).setOrigin(0.5).setAlpha(0).setScale(0.8).setDepth(999);

        this.container = scene.add.container(0, 0, [this.levelText, this.themeText]);

        scene.time.delayedCall(delay, () => this.fadeIn(holdDuration, config.onComplete));
    }

    private fadeIn(holdDuration: number, onComplete?: () => void): void {
        this.scene.tweens.add({
            targets: [this.levelText, this.themeText],
            alpha: 1,
            scale: 1,
            duration: 800,
            ease: 'Quad.easeOut',
            onComplete: () => this.hold(holdDuration, onComplete),
        });
    }

    private hold(holdDuration: number, onComplete?: () => void): void {
        this.scene.time.delayedCall(holdDuration, () => this.fadeOut(onComplete));
    }

    private fadeOut(onComplete?: () => void): void {
        this.scene.tweens.add({
            targets: [this.levelText, this.themeText],
            alpha: 0,
            scale: 1.2,
            duration: 1000,
            ease: 'Quad.easeIn',
            onComplete: () => {
                this.destroy();
                onComplete?.();
            },
        });
    }

    public destroy(): void {
        this.container.destroy();
    }
}
