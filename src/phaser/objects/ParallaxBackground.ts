import Phaser from 'phaser';

export class ParallaxBackground {
    public scene: Phaser.Scene;

    private readonly layers: Phaser.GameObjects.TileSprite[] = [];
    private readonly speeds: number[];

    constructor(
        scene: Phaser.Scene,
        layerConfigs: {
            texture: string;
            speed: number;
            depth?: number
        }[]
    ) {
        this.scene = scene;
        this.speeds = [];

        const { width, height } = scene.scale;

        for (const config of layerConfigs) {
            const layer = scene.add
                .tileSprite(0, 0, width, height, config.texture)
                .setOrigin(0)
                .setDepth(config.depth ?? 0);

            this.layers.push(layer);
            this.speeds.push(config.speed);
        }

        scene.scale.on('resize', this.onResize, this);
    }

    public update(): void {
        this.layers.forEach((layer, index) => {
            layer.tilePositionX += this.speeds[index];
        });
    }

    private onResize(gameSize: Phaser.Structs.Size): void {
        const { width, height } = gameSize;
        this.layers.forEach(layer => {
            layer.setSize(width, height);
        });
    }
}
