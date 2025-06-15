import Phaser from 'phaser';

export interface GameOverOverlayConfig {
    title?: string;
    message: string;
    scale?: number;
    onWatchAd: () => void;
    onExit: () => void;
}

export class GameOverOverlay {
    private readonly scene: Phaser.Scene;
    private readonly container: Phaser.GameObjects.Container;
    private readonly isMobile: boolean;

    constructor(scene: Phaser.Scene, config: GameOverOverlayConfig) {
        this.scene = scene;
        this.isMobile = scene.scale.width < 600;
        const font = 'RuneScape ENA';

        const { width, height } = scene.scale;
        const baseScale = config.scale ?? 1;

        const textSize = this.isMobile ? '22px' : '28px';
        const titleSize = this.isMobile ? '36px' : '48px';
        const buttonSize = this.isMobile ? '32px' : '44px';

        const overlay = scene.add.rectangle(0, 0, width * 2, height * 2, 0x000000, 0.6).setOrigin(0);

        const panel = scene.add
            .image(width / 2, height / 2, 'information-table')
            .setOrigin(0.5)
            .setScale(baseScale);

        const title = scene.add.text(width / 2, height / 2 - 85 * baseScale, config.title ?? 'Ты упустил буквы...', {
            fontFamily: font,
            fontSize: titleSize,
            color: '#fff4d3',
        }).setOrigin(0.5);

        const message = scene.add.text(width / 2, height / 2 + 15 * baseScale, config.message, {
            fontFamily: font,
            fontSize: textSize,
            color: '#ffffff',
            wordWrap: { width: this.isMobile ? 280 : 382 },
            align: 'center',
        }).setOrigin(0.5);

        const adButtonBg = scene.add.image(width / 2, height / 2 + 190 * baseScale, 'button-big')
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setScale(baseScale);

        const adButtonText = scene.add.text(adButtonBg.x, adButtonBg.y, 'Смотреть рекламу', {
            fontFamily: font,
            fontSize: buttonSize,
            color: '#ffffff',
        }).setOrigin(0.5);

        const exitButtonBg = scene.add.image(width / 2, height / 2 + 300 * baseScale, 'button')
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setScale(baseScale);

        const exitButtonText = scene.add.text(exitButtonBg.x, exitButtonBg.y, 'Выйти', {
            fontFamily: font,
            fontSize: buttonSize,
            color: '#ffffff',
        }).setOrigin(0.5);

        this.container = scene.add.container(0, 0, [
            overlay,
            panel,
            title,
            message,
            adButtonBg,
            adButtonText,
            exitButtonBg,
            exitButtonText,
        ]);
        this.container.setDepth(999);

        this.setupButton(adButtonBg, adButtonText, baseScale, () => config.onWatchAd());
        this.setupButton(exitButtonBg, exitButtonText, baseScale, () => config.onExit());
    }

    private setupButton(
        button: Phaser.GameObjects.Image,
        text: Phaser.GameObjects.Text,
        baseScale: number,
        onClick: () => void
    ): void {
        button.on('pointerover', () => {
            this.scene.tweens.add({
                targets: [button, text],
                scale: baseScale * 1.1,
                duration: 150,
                ease: 'Power1',
            });
            text.setColor('#ffcc00');
            this.scene.sound.play('button-click', { volume: 0.2 });
        });

        button.on('pointerout', () => {
            this.scene.tweens.add({
                targets: [button, text],
                scale: baseScale,
                duration: 150,
                ease: 'Power1',
            });
            text.setColor('#ffffff');
        });

        button.on('pointerup', () => {
            if (!this.isMobile) {
                this.scene.sound.play('button-click', { volume: 0.4 });
            }
            onClick();
            this.destroy();
        });
    }

    public destroy(): void {
        this.container.destroy();
    }
}
