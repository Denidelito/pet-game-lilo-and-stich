import Phaser from 'phaser';
import { transitionToScene } from '../utils/sceneTransition.ts';

export interface PlayButtonConfig {
    x: number;
    y: number;
    label?: string;
    texture: string;
    targetScene: string;
    onClick?: () => void;
    clickSoundKey?: string;
    depth?: number;
    scale?: number;
}

export class PlayButtonUI {
    public scene: Phaser.Scene;
    private readonly container: Phaser.GameObjects.Container;
    private clicked = false;

    constructor(scene: Phaser.Scene, config: PlayButtonConfig) {
        this.scene = scene;

        const {
            x,
            y,
            texture,
            label = 'ИГРАТЬ',
            targetScene,
            onClick,
            clickSoundKey,
            depth = 100,
            scale = 1,
        } = config;

        const background = scene.add
            .image(0, 0, texture)
            .setOrigin(0.5)
            .setDepth(depth)
            .setScale(scale);

        const text = scene.add
            .text(0, 0, label, {
                fontSize: '100px',
                color: '#ffffff',
                fontFamily: 'RuneScape ENA',
            })
            .setOrigin(0.5)
            .setDepth(depth + 1);

        this.container = scene.add.container(x, y, [background, text]);
        this.container.setSize(background.displayWidth, background.displayHeight);
        this.container.setDepth(depth);
        this.container.setScale(scale);
        this.container.setInteractive({ useHandCursor: true });

        this.container.on('pointerdown', () => {
            if (this.clicked) return;
            this.clicked = true;

            if (clickSoundKey) {
                scene.sound.play(clickSoundKey, { volume: 1 });
            }

            onClick?.();
            transitionToScene(scene, targetScene);
        });

        this.container.on('pointerover', () => {
            if (clickSoundKey) {
                scene.sound.play(clickSoundKey, { volume: 0.3 });
            }

            scene.tweens.add({
                targets: this.container,
                scale: scale * 1.1,
                duration: 150,
                ease: 'Power1',
            });
            text.setColor('#ffcc00');
        });

        this.container.on('pointerout', () => {
            scene.tweens.add({
                targets: this.container,
                scale: scale,
                duration: 150,
                ease: 'Power1',
            });
            text.setColor('#ffffff');
        });
    }

    public destroy(): void {
        this.container.destroy(true);
    }
}
