import { Player } from '../objects/Player.ts';
import { WordLetterManager } from './WordLetterManager.ts';
import { CollectedWordUI } from '../ui/CollectedWordUI.ts';
import { BossRevealUI } from '../ui/BossRevealUIConfig.ts';
import { BossHealthBar } from '../ui/BossHealthBar.ts';

export interface LevelWordControllerConfig {
    scene: Phaser.Scene;
    words: string[];
    player: Player;
    collectedUI: CollectedWordUI;
    bossUI: BossRevealUI;
    bossHealthBar: BossHealthBar;
    onComplete: () => void;
}

export class LevelWordController {
    private readonly scene: Phaser.Scene;
    private readonly words: string[];
    private readonly player: Player;
    private readonly collectedUI: CollectedWordUI;
    private readonly bossUI: BossRevealUI;
    private readonly bossHealthBar: BossHealthBar;
    private readonly onComplete: () => void;

    private currentWordIndex = 0;
    private wordManager: WordLetterManager;
    private isInBossFight = false;
    private readonly bossStartIndex: number;

    constructor(config: LevelWordControllerConfig) {
        this.scene = config.scene;
        this.words = config.words;
        this.player = config.player;
        this.collectedUI = config.collectedUI;
        this.bossUI = config.bossUI;
        this.bossHealthBar = config.bossHealthBar;
        this.onComplete = config.onComplete;

        this.bossStartIndex = Math.floor(this.words.length / 2);

        this.wordManager = new WordLetterManager(this.scene, this.currentWord, this.player);
        this.collectedUI.setWord(this.currentWord);

        this.bossHealthBar.setVisible(false); // полоска скрыта до начала боя

        this.scene.events.on('letter-caught', this.handleLetterCaught);
    }

    private get currentWord(): string {
        return this.words[this.currentWordIndex];
    }

    private handleLetterCaught = (char: string): void => {
        this.collectedUI.addLetter(char);

        if (this.wordManager.isComplete()) {
            this.wordManager.destroy();
            this.bossUI.revealPart();

            this.currentWordIndex++;

            if (!this.isInBossFight && this.currentWordIndex === this.bossStartIndex) {
                this.isInBossFight = true;
                this.bossHealthBar.setVisible(true);
                this.bossHealthBar.setValue(100);
            }

            if (this.isInBossFight && this.currentWordIndex !== this.bossStartIndex) {
                const remainingBossWords = this.words.length - this.bossStartIndex;
                const damagePerWord = 100 / remainingBossWords;
                this.bossHealthBar.damage(damagePerWord);
            }

            if (this.currentWordIndex >= this.words.length) {
                this.scene.time.delayedCall(500, () => this.onComplete());
                return;
            }

            const nextWord = this.currentWord;
            this.collectedUI.setWord(nextWord);
            this.collectedUI.reset();
            this.wordManager = new WordLetterManager(this.scene, nextWord, this.player);
        }
    };

    public update(): void {
        this.wordManager.update();
    }

    public destroy(): void {
        this.wordManager.destroy();
        this.scene.events.off('letter-caught', this.handleLetterCaught);
    }
}
