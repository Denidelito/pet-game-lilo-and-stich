import Phaser from 'phaser';
import type { SDK } from 'ysdk';
import { initYandexSDK } from '../utils/initYSDK.ts';
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
import { LevelIntroText } from '../ui/LevelIntroText.ts';
import { OnboardingOverlay } from '../ui/OnboardingOverlay.ts';
import { TabFocusController } from '../utils/TabFocusController';
import { GameOverOverlay } from '../ui/GameOverOverlay.ts';

export class MainScene extends Phaser.Scene {
    private bg!: ParallaxBackground;
    private player!: Player;
    private healthUI!: PlayerHealthUI;
    private collectedUI!: CollectedWordUI;
    private bossUI!: BossRevealUI;
    private bossHealthBar!: BossHealthBar;
    private wordController: LevelWordController | null = null;
    public tabFocusController!: TabFocusController;

    private onboardingDone = false;
    public levelIndex = 0;
    public levelTheme = '';

    private ysdk: SDK | null = null;

    constructor() {
        super('MainScene');
    }

    async create(): Promise<void> {
        this.ysdk = await initYandexSDK();
        this.tabFocusController = new TabFocusController(this);

        const mobile = isMobile();
        const currentLevel = levels[this.levelIndex];
        const currentWords = [...currentLevel.wordsToReachBoss, ...currentLevel.wordsToDefeatBoss];
        this.levelTheme = currentLevel.theme;

        // Фон
        this.bg = new ParallaxBackground(this, [
            { texture: 'bg', speedX: 0, depth: -4, positionX: 0 },
            { texture: 'bg-cloud-1', speedX: 20, depth: -2, positionX: 0 },
            { texture: 'bg-cloud-2', speedX: 10, depth: -1, positionX: 0 },
            { texture: 'bg-rock', speedX: 0, depth: -3, positionX: mobile ? -450 : 0 },
            { texture: 'bg-front', speedX: 0, depth: -1, positionX: mobile ? -450 : 0 },
            { texture: 'bg-glass', speedX: 0, depth: 2, positionX: mobile ? -450 : 0 },
        ]);

        // Игрок
        this.player = new Player(this, {
            y: this.scale.height - 30,
            texture: 'player',
            stepSoundKey: 'player-move',
            onDeath: () => {
                this.wordController?.destroy();
                this.wordController = null;

                this.physics.world.pause();
                this.time.paused = true;

                new GameOverOverlay(this, {
                    message: 'Ты не успел собрать слово и потерял все жизни. Посмотри рекламу и продолжи или начни игру с начала.',
                    onWatchAd: () => {
                        this.ysdk?.adv.showRewardedVideo({
                            callbacks: {
                                onOpen: () => {
                                    this.player.heal(this.player.getMaxHealth());
                                    this.healthUI.update();
                                },
                                onClose: () => {
                                    this.physics.world.resume();
                                    this.time.paused = false;

                                    const currentLevel = levels[this.levelIndex];
                                    const currentWords = [
                                        ...currentLevel.wordsToReachBoss,
                                        ...currentLevel.wordsToDefeatBoss,
                                    ];

                                    this.collectedUI.reset();
                                    this.startLevel(currentWords);
                                },
                            },
                        });
                    },
                    onExit: () => {
                        this.physics.world.resume();
                        this.time.paused = false;
                        this.scene.start('MenuScene');
                    },
                    scale: mobile ? 0.8 : 1,
                });
            },
        });

        // UI
        this.healthUI = new PlayerHealthUI(this, {
            x: mobile ? this.scale.width - 120 : 30,
            y: mobile ? 50 : 88,
            player: this.player,
            iconTexture: 'player-health',
            scale: mobile ? 0.5 : 1,
        });

        this.collectedUI = new CollectedWordUI(this, {
            x: mobile ? 12 : this.scale.width / 2,
            y: mobile ? 20 : 28,
            word: 'Стич',
            tileTexture: 'tile',
        });

        this.bossUI = new BossRevealUI(this, {
            x: mobile ? this.scale.width - 69 : this.scale.width - 236 / 2 - 18,
            y: mobile ? 90 : 140,
            texture: currentLevel.bossTexture,
            backgroundTexture: 'boss-bg-ui',
            scale: mobile ? 0.5 : 1,
        });

        this.bossHealthBar = new BossHealthBar(this, {
            x: this.scale.width / 2,
            y: mobile ? this.scale.height - 20 : 140,
            width: 496,
            height: 24,
            max: 100,
            initial: 100,
            texture: 'boss-health-bar',
            scale: mobile ? 0.5 : 1,
        });
        this.bossHealthBar.setVisible(false);

        // Обучение
        new OnboardingOverlay(this, {
            steps: [
                'Смотри на тему уровня, лови буквы и собирай из них слова. Если ты поймаешь букву, которая не подходит для слова, ты лишишься части здоровья.',
                'После сбора трёх слов ты столкнешься с боссом уровня. Чтобы победить его, нужно снизить его шкалу здоровья до нуля.',
                'Для перемещения используй клавиши ←/→ или A/D.',
            ],
            buttonText: 'Продолжить',
            scale: mobile ? 0.8 : 1,
            onComplete: () => {
                this.onboardingDone = true;
                this.startLevel(currentWords);
            },
        });

        // Управление
        if (mobile) {
            setupSwipeControls(
                this,
                () => this.player.moveLeft(),
                () => this.player.moveRight()
            );
        } else {
            this.input.keyboard?.on('keydown-LEFT', () => this.player.moveLeft());
            this.input.keyboard?.on('keydown-RIGHT', () => this.player.moveRight());
            this.input.keyboard?.on('keydown-A', () => this.player.moveLeft());
            this.input.keyboard?.on('keydown-D', () => this.player.moveRight());
        }

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.wordController?.destroy();
        });
    }

    private startLevel(words: string[]): void {
        this.wordController = new LevelWordController({
            scene: this,
            words,
            player: this.player,
            collectedUI: this.collectedUI,
            bossUI: this.bossUI,
            bossHealthBar: this.bossHealthBar,
            onComplete: () => this.scene.start('WinScene'),
        });

        new LevelIntroText(this, {
            level: this.levelIndex + 1,
            text: this.levelTheme,
            duration: 2500,
        });
    }

    update(time: number, delta: number): void {
        if (!this.onboardingDone) return;

        this.bg.update(time, delta);
        this.healthUI.update();
        this.wordController?.update();
    }
}
