import Phaser from 'phaser';
import { ParallaxBackground } from '../objects/ParallaxBackground.ts';
import { Player } from '../objects/Player.ts';
import { PlayerHealthUI } from '../ui/PlayerHealthUI.ts';
import { WordLetterManager } from '../logic/WordLetterManager.ts';
import { isMobile } from '../utils/device.ts';
import { CollectedWordUI } from '../ui/CollectedWordUI.ts';
import { BossRevealUI } from '../ui/BossRevealUIConfig.ts';
import { setupSwipeControls } from '../utils/swipe.ts';
import { levels } from '../../data/levels.ts';

export class MainScene extends Phaser.Scene {
    public bg!: ParallaxBackground;
    public collectedUI!: CollectedWordUI;
    public bossUI!: BossRevealUI;
    private player!: Player;
    private healthUI!: PlayerHealthUI;
    private wordManager!: WordLetterManager;

    constructor() {
        super('MainScene');
    }

    create() {
        const mobile = isMobile();
        const currentLevel = levels[0];
        this.bg = new ParallaxBackground(this, [
            {
                texture: 'bg',
                speedX: 10,
                depth: -4,
                positionX: 0,
                positionY: 0,
            },
            {
                texture: 'bg-cloud-1',
                speedX: 20,
                depth: -2,
                positionX: 0,
                positionY: 0,
            },
            {
                texture: 'bg-cloud-2',
                speedX: 10,
                depth: -1,
                positionX: 0,
                positionY: 0,
            },
            {
                texture: 'bg-rock',
                speedX: 0,
                depth: -3,
                positionX: mobile ? -300 : 0,
                positionY: 0,
            },
            {
                texture: 'bg-front',
                speedX: 0,
                depth: -1,
                positionX: mobile ? -300 : 0,
                positionY: 0,
            },
            {
                texture: 'bg-glass',
                speedX: 0,
                depth: 2,
                positionX: mobile ? -300 : 0,
                positionY: 0,
            },
        ]);

        this.player = new Player(this, {
            y: this.scale.height - 30,
            texture: 'player',
            stepSoundKey: 'player-move',
        });

        this.healthUI = new PlayerHealthUI(this, {
            x: mobile ? this.scale.width - 120 : 30,
            y: mobile ? 50 : 88,
            player: this.player,
            iconTexture: 'player-health',
            scale: mobile ? 0.5 : 1,
        });

        this.wordManager = new WordLetterManager(this, 'ПЕС', this.player);

        this.collectedUI = new CollectedWordUI(this, {
            x: mobile ? 108 : this.scale.width / 2,
            y: mobile ? 20 : 28,
            word: 'ПЕС',
            tileTexture: 'tile',
        });

        this.bossUI = new BossRevealUI(this, {
            x: mobile ? this.scale.width - 69 : this.scale.width - 236 / 2 - 18,
            y: mobile ? 90 : 140,
            texture: currentLevel.bossTexture,
            backgroundTexture: 'boss-bg-ui',
            scale: mobile ? 0.5 : 1,
        });

        this.events.on('letter-caught', (char: string) => {
            this.collectedUI.addLetter(char);
        });

        if (mobile) {
            setupSwipeControls(
                this,
                () => this.player.moveLeft(),
                () => this.player.moveRight()
            );
        } else {
            this.input.keyboard?.on('keydown-LEFT', () => this.player.moveLeft());
            this.input.keyboard?.on('keydown-RIGHT', () => this.player.moveRight());
        }
    }

    update(_time: number, delta: number) {
        this.bg.update(_time, delta);
        this.healthUI.update();

        this.wordManager.update();
        if (this.wordManager.isComplete()) {
            this.scene.start('WinScene');
        }
    }
}
