import Phaser from 'phaser';
import {Player} from "../objects/Player.ts";

export interface PlayerHealthUIConfig {
    x: number;
    y: number;
    player: Player;
    iconTexture: string;
    labelPrefix?: string;
    depth?: number;
    scale?: number;
    style?: Phaser.Types.GameObjects.Text.TextStyle;
}

export class PlayerHealthUI {
    public readonly scene: Phaser.Scene;
    private readonly player: Player;
    private readonly label: Phaser.GameObjects.Text;
    private readonly icon: Phaser.GameObjects.Image;
    private readonly labelPrefix: string;

    constructor(scene: Phaser.Scene, config: PlayerHealthUIConfig) {
        this.scene = scene;
        this.player = config.player;
        this.labelPrefix = config.labelPrefix ?? 'x';

        const scale = config.scale ?? 1.4;

        this.icon = scene.add
            .image(config.x, config.y, config.iconTexture)
            .setOrigin(0, 0.5)
            .setDepth(config.depth ?? 100)
            .setScale(scale);

        this.label = scene.add
            .text(config.x + this.icon.displayWidth - 50 * scale, config.y, '', {
                fontSize: '32px',
                color: '#E8B976',
                fontFamily: 'RuneScape ENA',
                ...config.style,
            })
            .setOrigin(0, 0.5)
            .setScale(scale)
            .setDepth(config.depth ?? 100);

        this.update();
    }

    public update(): void {
        const hp = this.player.getHealth();
        this.label.setText(`${this.labelPrefix}${hp}`);
    }

    public destroy(): void {
        this.label.destroy();
        this.icon.destroy();
    }
}
