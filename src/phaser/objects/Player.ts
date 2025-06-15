import Phaser from 'phaser';
import {isMobile} from "../utils/device.ts";

export interface PlayerConfig {
    y: number;
    texture: string;
    scale?: number;
    depth?: number;
    stepSoundKey?: string;
    maxHealth?: number;
    onDeath?: () => void;
}

export class Player {
    private readonly scene: Phaser.Scene;
    private readonly sprite: Phaser.GameObjects.Sprite;
    private readonly columns: number;
    private readonly columnWidth: number;
    private currentIndex: number;
    private readonly stepSoundKey?: string;

    private readonly maxHealth: number;
    private health: number;
    private readonly onDeath?: () => void;

    constructor(scene: Phaser.Scene, config: PlayerConfig) {
        this.scene = scene;
        this.stepSoundKey = config.stepSoundKey;
        this.maxHealth = config.maxHealth ?? 3;
        this.health = this.maxHealth;
        this.onDeath = config.onDeath;

        const { width } = scene.scale;
        const mobile = isMobile();

        this.columns = mobile ? 3 : 12;
        this.columnWidth = width / this.columns;
        this.currentIndex = Math.floor(this.columns / 2);

        const x = this.columnWidth * this.currentIndex + this.columnWidth / 2;

        this.sprite = this.scene.add
            .sprite(x, config.y, config.texture)
            .setOrigin(0.5, 1)
            .setDepth(config.depth ?? 1)
            .setScale(config.scale ?? 1);
    }

    public moveLeft(): void {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.spawnDust();
            this.playStepSound();
            this.updatePosition();
        }
    }

    public moveRight(): void {
        if (this.currentIndex < this.columns - 1) {
            this.currentIndex++;
            this.spawnDust();
            this.playStepSound();
            this.updatePosition();
        }
    }

    private playStepSound(): void {
        if (this.stepSoundKey) {
            this.scene.sound.play(this.stepSoundKey, { volume: 0.2 });
        }
    }

    private spawnDust(): void {
        const baseX = this.sprite.x;
        const baseY = this.sprite.y;

        for (let i = 0; i < 4; i++) {
            const dust = this.scene.add
                .image(
                    baseX + Phaser.Math.Between(-10, 10),
                    baseY,
                    'dust'
                )
                .setAlpha(1)
                .setScale(Phaser.Math.FloatBetween(0.3, 0.6))
                .setDepth(this.sprite.depth - 1)
                .setBlendMode(Phaser.BlendModes.ADD)
                .setOrigin(0.5, 1);

            const targetY = dust.y - Phaser.Math.Between(10, 30);
            const targetX = dust.x + Phaser.Math.Between(-10, 10);

            this.scene.tweens.add({
                targets: dust,
                x: targetX,
                y: targetY,
                alpha: 0,
                duration: 400,
                ease: 'Cubic.easeOut',
                onComplete: () => dust.destroy(),
            });
        }
    }

    private updatePosition(): void {
        const targetX = this.columnWidth * this.currentIndex + this.columnWidth / 2;

        this.scene.tweens.add({
            targets: this.sprite,
            x: targetX,
            duration: 150,
            ease: 'Power2',
        });
    }

    public takeDamage(amount: number = 1): void {
        this.health -= amount;

        if (this.health <= 0) {
            this.health = 0;
            this.onDeath?.();
        }


        this.scene.sound.play('damage', { volume: 0.4 });
        this.flashRed();
        this.jumpOnHit();
    }

    private flashRed(): void {
        this.sprite.setTint(0xff0000);

        this.scene.time.delayedCall(150, () => {
            this.sprite.clearTint();
        });
    }

    private jumpOnHit(): void {
        this.scene.tweens.add({
            targets: this.sprite,
            y: this.sprite.y - 30,
            duration: 100,
            ease: 'Power2',
            yoyo: true,
        });
    }


    public heal(amount: number = 1): void {
        this.health = Math.min(this.health + amount, this.maxHealth);
    }

    public isDead(): boolean {
        return this.health <= 0;
    }

    public getHealth(): number {
        return this.health;
    }

    public getMaxHealth(): number {
        return this.maxHealth;
    }

    public destroy(): void {
        this.sprite.destroy();
    }
}
