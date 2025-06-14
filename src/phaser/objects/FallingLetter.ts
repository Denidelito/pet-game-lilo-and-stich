import Phaser from 'phaser';

export class FallingLetter {
    public readonly sprite: Phaser.GameObjects.Text;
    public readonly char: string;

    constructor(
        scene: Phaser.Scene,
        char: string,
        x: number,
        y: number,
        speed: number,
        fontSize = 80
    ) {
        this.char = char;

        this.sprite = scene.add
            .text(x, y, char, {
                fontFamily: 'RuneScape ENA',
                fontSize: `${fontSize}px`,
                color: '#ffffff',
            })
            .setOrigin(0.5)
            .setDepth(1);

        scene.tweens.add({
            targets: this.sprite,
            y: scene.scale.height + 50,
            duration: speed,
            onComplete: () => this.destroy(),
        });
    }

    public destroy(): void {
        this.sprite.destroy();
    }
}
