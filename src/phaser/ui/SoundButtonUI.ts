import Phaser from 'phaser';

export interface SoundToggleButtonConfig {
    x: number;
    y: number;
    textureOn: string;
    textureOff: string;
    initialMuted?: boolean;
    scale?: number;
    depth?: number;
}

export class SoundButtonUI {
    private readonly scene: Phaser.Scene;
    private readonly button: Phaser.GameObjects.Image;
    private readonly textureOn: string;
    private readonly textureOff: string;
    private readonly baseScale: number;

    constructor(scene: Phaser.Scene, config: SoundToggleButtonConfig) {
        this.scene = scene;

        const {
            x,
            y,
            textureOn,
            textureOff,
            initialMuted = false,
            scale = 1.4,
            depth = 100,
        } = config;

        this.textureOn = textureOn;
        this.textureOff = textureOff;
        this.baseScale = scale;

        this.scene.sound.mute = initialMuted;

        this.button = scene.add
            .image(x, y, initialMuted ? textureOff : textureOn)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setScale(scale)
            .setDepth(depth);

        this.button.on('pointerdown', this.toggleMute, this);

        this.button.on('pointerover', () => {
            scene.tweens.add({
                targets: this.button,
                scale: this.baseScale * 1.1,
                duration: 150,
                ease: 'Power1',
            });
        });

        this.button.on('pointerout', () => {
            scene.tweens.add({
                targets: this.button,
                scale: this.baseScale,
                duration: 150,
                ease: 'Power1',
            });
        });
    }

    private toggleMute(): void {
        const isMuted = this.scene.sound.mute;
        const nextMute = !isMuted;

        this.scene.sound.mute = nextMute;

        const newTexture = nextMute ? this.textureOff : this.textureOn;
        this.button.setTexture(newTexture);
    }

    public destroy(): void {
        this.button.destroy();
    }
}
