import Phaser from 'phaser';

export interface ParallaxLayerConfig {
  texture: string;
  speedX?: number;
  speedY?: number;
  depth?: number;
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

    const { height } = scene.scale;

    for (const config of layerConfigs) {
      const speedX = config.speedX ?? 0;
      const speedY = config.speedY ?? 0;

      const texture = scene.textures.get(config.texture);
      const frame = texture.getSourceImage() as HTMLImageElement;

      const aspectRatio = frame.width / frame.height;
      const targetHeight = height;
      const targetWidth = targetHeight * aspectRatio;

      const imageA = scene.add
        .image(0, 0, config.texture)
        .setOrigin(0)
        .setDisplaySize(targetWidth, targetHeight)
        .setDepth(config.depth ?? 0);

      const imageB = scene.add
        .image(targetWidth, 0, config.texture)
        .setOrigin(0)
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
    const { height } = gameSize;

    this.layers.forEach(({ imageA, imageB }) => {
      const texture = this.scene.textures.get(imageA.texture.key);
      const frame = texture.getSourceImage() as HTMLImageElement;

      const aspectRatio = frame.width / frame.height;
      const targetHeight = height;
      const targetWidth = targetHeight * aspectRatio;

      imageA.setDisplaySize(targetWidth, targetHeight).setPosition(0, 0);
      imageB
        .setDisplaySize(targetWidth, targetHeight)
        .setPosition(targetWidth, 0);
    });
  }
}
