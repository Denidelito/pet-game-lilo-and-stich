import Phaser from 'phaser';

export interface OnboardingOverlayConfig {
    steps: string[];
    buttonText?: string;
    textureFrame?: string;
    scale?: number;
    onComplete?: () => void;
}

export class OnboardingOverlay {
    public readonly scene: Phaser.Scene;
    private readonly container: Phaser.GameObjects.Container;
    private readonly textObject: Phaser.GameObjects.Text;
    private readonly buttonText: Phaser.GameObjects.Text;
    private readonly steps: string[];
    private readonly isMobile: boolean;
    private currentStep = 0;

    constructor(scene: Phaser.Scene, config: OnboardingOverlayConfig) {
        this.scene = scene;
        this.steps = config.steps;
        this.isMobile = scene.scale.width < 600;

        const { width, height } = scene.scale;
        const font = 'RuneScape ENA';
        const baseScale = config.scale ?? 1;

        const textSize = this.isMobile ? '22px' : '28px';
        const buttonSize = this.isMobile ? '36px' : '48px';
        const titleSize = this.isMobile ? '36px' : '48px';

        const overlay = scene.add.rectangle(0, 0, width * 2, height * 2, 0x000000, 0.4)
            .setOrigin(0);

        const panel = scene.add.image(width / 2, height / 2, 'information-table')
            .setOrigin(0.5)
            .setScale(baseScale);

        const title = scene.add.text(width / 2, height / 2 - 95 * baseScale, 'Обучение', {
            fontFamily: font,
            fontSize: titleSize,
            color: '#fff4d3',
        }).setOrigin(0.5);

        this.textObject = scene.add.text(width / 2, height / 2 + 20 * baseScale, config.steps[0], {
            fontFamily: font,
            fontSize: textSize,
            color: '#ffffff',
            wordWrap: { width: this.isMobile ? 280 : 382 },
            align: 'center',
        }).setOrigin(0.5);

        const buttonBg = scene.add.image(width / 2, height / 2 + 210 * baseScale, config.textureFrame ?? 'button')
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setScale(baseScale);

        this.buttonText = scene.add.text(buttonBg.x, buttonBg.y, config.buttonText ?? 'ПРОДОЛЖИТЬ', {
            fontFamily: font,
            fontSize: buttonSize,
            color: '#ffffff',
        }).setOrigin(0.5);

        this.container = scene.add.container(0, 0, [
            overlay,
            panel,
            title,
            this.textObject,
            buttonBg,
            this.buttonText,
        ]);
        this.container.setDepth(999);

        // Hover + Click
        buttonBg.on('pointerover', () => {
            scene.tweens.add({
                targets: [buttonBg, this.buttonText],
                scale: baseScale * 1.1,
                duration: 150,
                ease: 'Power1',
            });
            this.buttonText.setColor('#ffcc00');
            scene.sound.play('button-click', { volume: 0.2 });
        });

        buttonBg.on('pointerout', () => {
            scene.tweens.add({
                targets: [buttonBg, this.buttonText],
                scale: baseScale,
                duration: 150,
                ease: 'Power1',
            });
            this.buttonText.setColor('#ffffff');
        });

        buttonBg.on('pointerup', () => {
            if (!this.isMobile) {
                scene.sound.play('button-click', { volume: 0.4 });
            }
            this.nextStep(config.onComplete);
        });
    }

    private nextStep(onComplete?: () => void): void {
        this.currentStep++;

        if (this.currentStep >= this.steps.length) {
            this.destroy();
            onComplete?.();
        } else {
            this.textObject.setText(this.steps[this.currentStep]);

            if (this.currentStep === this.steps.length - 1) {
                this.buttonText.setText('ЗАКРЫТЬ');
            }
        }
    }

    public destroy(): void {
        this.container.destroy();
    }
}