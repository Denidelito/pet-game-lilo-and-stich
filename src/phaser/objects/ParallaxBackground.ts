import Phaser from 'phaser';
import { isMobile } from '../utils/device.ts';

export interface ParallaxLayerConfig {
    texture: string;
    speedX?: number;
    speedY?: number;
    depth?: number;
    positionX?: number;
}

interface ParallaxSprite {
    imageA: Phaser.GameObjects.Image;
    imageB: Phaser.GameObjects.Image;
    speedX: number;
    speedY: number;
}

export class ParallaxBackground {
    public readonly scene: Phaser.Scene;
    private readonly layers: ParallaxSprite[] = [];

    constructor(scene: Phaser.Scene, layerConfigs: ParallaxLayerConfig[]) {
        this.scene = scene;
        const mobile = isMobile();

        for (const config of layerConfigs) {
            const speedX = config.speedX ?? 0;
            const speedY = config.speedY ?? 0;
            const texture = scene.textures.get(config.texture);
            const frame = texture.getSourceImage() as HTMLImageElement;

            const aspectRatio = frame.width / frame.height;
            const { width, height } = scene.scale;

            let targetWidth: number;
            let targetHeight: number;
            let posY: number;
            let originY: number;

            if (mobile) {
                targetHeight = height;
                targetWidth = targetHeight * aspectRatio;
                posY = 0;
                originY = 0;
            } else {
                // десктоп: растягиваем на весь экран, прижимаем к низу
                const scaleX = width / frame.width;
                const scaleY = height / frame.height;
                const scale = Math.max(scaleX, scaleY);

                targetWidth = frame.width * scale;
                targetHeight = frame.height * scale;
                posY = height;
                originY = 1;
            }

            const imageA = scene.add.image(config.positionX ?? 0, posY, config.texture)
                .setOrigin(0, originY)
                .setDisplaySize(targetWidth, targetHeight)
                .setDepth(config.depth ?? 0);

            const imageB = scene.add.image(targetWidth, posY, config.texture)
                .setOrigin(0, originY)
                .setDisplaySize(targetWidth, targetHeight)
                .setDepth(config.depth ?? 0);

            this.layers.push({ imageA, imageB, speedX, speedY });
        }

        scene.scale.on('resize', this.onResize, this);
    }

    public update(_time: number, delta: number): void {
        const dt = delta / 1000;

        this.layers.forEach(({ imageA, imageB, speedX, speedY }) => {
            const dx = speedX * dt;
            const dy = speedY * dt;

            imageA.x -= dx;
            imageB.x -= dx;
            imageA.y -= dy;
            imageB.y -= dy;

            const width = imageA.displayWidth;
            const height = imageA.displayHeight;

            if (imageA.x + width <= 0) imageA.x = imageB.x + width;
            if (imageB.x + width <= 0) imageB.x = imageA.x + width;

            if (imageA.y + height <= 0) imageA.y = imageB.y + height;
            if (imageB.y + height <= 0) imageB.y = imageA.y + height;
        });
    }

    private onResize(gameSize: Phaser.Structs.Size): void {
        const { width, height } = gameSize;
        const mobile = isMobile();

        this.layers.forEach(({ imageA, imageB }) => {
            const texture = this.scene.textures.get(imageA.texture.key);
            const frame = texture.getSourceImage() as HTMLImageElement;
            const aspectRatio = frame.width / frame.height;

            let targetWidth: number;
            let targetHeight: number;
            let posY: number;
            let originY: number;

            if (mobile) {
                targetHeight = height;
                targetWidth = targetHeight * aspectRatio;
                posY = 0;
                originY = 0;
            } else {
                const scaleX = width / frame.width;
                const scaleY = height / frame.height;
                const scale = Math.max(scaleX, scaleY);

                targetWidth = frame.width * scale;
                targetHeight = frame.height * scale;
                posY = height;
                originY = 1;
            }

            imageA.setDisplaySize(targetWidth, targetHeight).setOrigin(0, originY).setPosition(0, posY);
            imageB.setDisplaySize(targetWidth, targetHeight).setOrigin(0, originY).setPosition(targetWidth, posY);
        });
    }
}
