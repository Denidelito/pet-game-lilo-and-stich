import Phaser from 'phaser';
import { isMobile } from '../utils/device.ts';

export interface BossRevealUIConfig {
    x: number;
    y: number;
    texture: string;
    backgroundTexture?: string;
    revealSteps?: number;
    scale?: number;
    depth?: number;
}

export class BossRevealUI {
    public readonly scene: Phaser.Scene;
    private readonly bossSprite: Phaser.GameObjects.Image;
    private readonly background?: Phaser.GameObjects.Image;
    private revealCount = 0;
    private readonly maxReveals: number;

    constructor(scene: Phaser.Scene, config: BossRevealUIConfig) {
        this.scene = scene;
        this.maxReveals = config.revealSteps ?? 3;

        const scale = config.scale ?? 1;
        const depth = config.depth ?? 10;
        const mobiele = isMobile();

        if (config.backgroundTexture) {
            this.background = scene.add
                .image(config.x, config.y + 110, config.backgroundTexture)
                .setOrigin(0.5)
                .setScale(scale)
                .setDepth(depth - 1);
        }

        this.bossSprite = scene.add
            .image(config.x, mobiele ? config.y + 55 : config.y, config.texture)
            .setOrigin(0.5)
            .setTint(0x000000)
            .setAlpha(0.3)
            .setScale(scale)
            .setDepth(depth);
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
        this.background?.destroy();
    }
}
