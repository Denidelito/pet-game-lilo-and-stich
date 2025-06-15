import Phaser from 'phaser';

export interface BossHealthBarConfig {
    x: number;
    y: number;
    width: number;
    height: number;
    max: number;
    initial?: number;
    texture?: string;
    backgroundColor?: number;
    fillColor?: number;
    depth?: number;
    scale?: number;
}

export class BossHealthBar {
    public readonly scene: Phaser.Scene;
    private readonly container: Phaser.GameObjects.Container;
    private readonly barBg: Phaser.GameObjects.Rectangle;
    private readonly barFill: Phaser.GameObjects.Rectangle;
    private readonly backgroundSprite?: Phaser.GameObjects.Image;

    private readonly width: number;
    private readonly height: number;
    private readonly max: number;
    private current: number;

    constructor(scene: Phaser.Scene, config: BossHealthBarConfig) {
        this.scene = scene;
        this.width = config.width;
        this.height = config.height;
        this.max = config.max;
        this.current = config.initial ?? config.max;

        const bgColor = config.backgroundColor ?? 0x2c6ea4;
        const fillColor = config.fillColor ?? 0xa12f1f;
        const depth = config.depth ?? 50;

        const items: Phaser.GameObjects.GameObject[] = [];

        if (config.texture) {
            this.backgroundSprite = scene.add.image(0, 0, config.texture)
                .setOrigin(0.5)
                .setDepth(depth);
            items.push(this.backgroundSprite);
        }

        this.barBg = scene.add.rectangle(0, 0, this.width, this.height, bgColor)
            .setOrigin(0.5)
            .setDepth(depth);

        this.barFill = scene.add.rectangle(0, 0, this.getFillWidth(), this.height - 4, fillColor)
            .setOrigin(0.5)
            .setDepth(depth + 1);

        items.push(this.barBg, this.barFill);

        this.container = scene.add.container(config.x, config.y, items);
        this.container.setDepth(depth).setScale(config.scale);

        this.setValue(this.current);
    }

    private getFillWidth(): number {
        const ratio = Phaser.Math.Clamp(this.current / this.max, 0, 1);
        return (this.width) * ratio;
    }

    public setVisible(visible: boolean): void {
        this.container.setVisible(visible);
    }

    public setValue(value: number): void {
        this.current = Phaser.Math.Clamp(value, 0, this.max);
        const newWidth = this.getFillWidth();

        this.barFill.setDisplaySize(newWidth, this.height);
        this.barFill.setX(-this.width / 2 + newWidth / 2);
    }

    public damage(amount: number): void {
        this.setValue(this.current - amount);
    }

    public isDead(): boolean {
        return this.current <= 0;
    }

    public destroy(): void {
        this.container.destroy();
    }
}
