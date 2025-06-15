import Phaser from 'phaser';
import { ParallaxBackground } from '../objects/ParallaxBackground.ts';
import { Player } from '../objects/Player.ts';
import { PlayerHealthUI } from '../ui/PlayerHealthUI.ts';
import { isMobile } from '../utils/device.ts';
import { CollectedWordUI } from '../ui/CollectedWordUI.ts';
import { BossRevealUI } from '../ui/BossRevealUIConfig.ts';
import { BossHealthBar } from '../ui/BossHealthBar.ts';
import { setupSwipeControls } from '../utils/swipe.ts';
import { levels } from '../../data/levels.ts';
import { LevelWordController } from '../logic/LevelWordController.ts';

export class MainScene extends Phaser.Scene {
    private bg!: ParallaxBackground;
    private player!: Player;
    private healthUI!: PlayerHealthUI;
    public bossHealthBar!: BossHealthBar;
    private collectedUI!: CollectedWordUI;
    private bossUI!: BossRevealUI;
    private wordController!: LevelWordController;

    constructor() {
        super('MainScene');
    }

    create() {
        const mobile = isMobile();
        const currentLevel = levels[0];
        const currentWords = [...currentLevel.wordsToReachBoss, ...currentLevel.wordsToDefeatBoss];

        // Фон
        this.bg = new ParallaxBackground(this, [
            { texture: 'bg', speedX: 0, depth: -4, positionX: 0, positionY: 0 },
            { texture: 'bg-cloud-1', speedX: 20, depth: -2, positionX: 0, positionY: 0 },
            { texture: 'bg-cloud-2', speedX: 10, depth: -1, positionX: 0, positionY: 0 },
            { texture: 'bg-rock', speedX: 0, depth: -3, positionX: mobile ? -300 : 0, positionY: 0 },
            { texture: 'bg-front', speedX: 0, depth: -1, positionX: mobile ? -300 : 0, positionY: 0 },
            { texture: 'bg-glass', speedX: 0, depth: 2, positionX: mobile ? -300 : 0, positionY: 0 },
        ]);

        // Игрок
        this.player = new Player(this, {
            y: this.scale.height - 30,
            texture: 'player',
            stepSoundKey: 'player-move',
        });

        // Здоровье
        this.healthUI = new PlayerHealthUI(this, {
            x: mobile ? this.scale.width - 120 : 30,
            y: mobile ? 50 : 88,
            player: this.player,
            iconTexture: 'player-health',
            scale: mobile ? 0.5 : 1,
        });

        // UI собранных букв
        this.collectedUI = new CollectedWordUI(this, {
            x: mobile ? 12 : this.scale.width / 2,
            y: mobile ? 20 : 28,
            word: '',
            tileTexture: 'tile',
        });

        // UI босса
        this.bossUI = new BossRevealUI(this, {
            x: mobile ? this.scale.width - 69 : this.scale.width - 236 / 2 - 18,
            y: mobile ? 90 : 140,
            texture: currentLevel.bossTexture,
            backgroundTexture: 'boss-bg-ui',
            scale: mobile ? 0.5 : 1,
        });

        this.wordController = new LevelWordController({
            scene: this,
            words: currentWords,
            player: this.player,
            collectedUI: this.collectedUI,
            bossUI: this.bossUI,
            onComplete: () => this.scene.start('WinScene'),
            bossHealthBar: new BossHealthBar(this, {
                x: this.scale.width / 2,
                y: mobile ? this.scale.height - 20  : 140,
                width: 496,
                height: 24,
                max: 100,
                initial: 100,
                texture: 'boss-health-bar',
                scale: mobile ? 0.5 : 1
            }),
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

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.wordController.destroy();
        });
    }

    update(time: number, delta: number) {
        this.bg.update(time, delta);
        this.healthUI.update();
        this.wordController.update();
    }
}
