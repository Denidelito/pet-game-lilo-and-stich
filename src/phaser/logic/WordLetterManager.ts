import Phaser from 'phaser';
import {FallingLetter} from "../objects/FallingLetter.ts";
import {Player} from "../objects/Player.ts";
import {isMobile} from "../utils/device.ts";

export class WordLetterManager {
    private readonly scene: Phaser.Scene;
    private readonly targetWord: string;
    private readonly player: Player;
    private readonly activeLetters: FallingLetter[] = [];
    private readonly usedLetters: Set<string> = new Set();
    private readonly alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    private readonly columns: number;
    private readonly columnWidth: number;

    constructor(scene: Phaser.Scene, word: string, player: Player) {
        this.scene = scene;
        this.targetWord = word.toUpperCase();
        this.player = player;

        const mobile = isMobile();
        this.columns = mobile ? 3 : 12;
        this.columnWidth = scene.scale.width / this.columns;

        this.launchSpawner();
    }

    private launchSpawner(): void {
        this.scene.time.addEvent({
            delay: 800,
            loop: true,
            callback: () => this.spawnLetter(),
        });
    }

    private spawnLetter(): void {
        const isCorrect = Phaser.Math.Between(0, 1) === 0;
        const correctPool = this.targetWord.split('').filter(c => !this.usedLetters.has(c));
        const incorrectPool = this.alphabet.split('').filter(c => !this.targetWord.includes(c));

        const char = isCorrect && correctPool.length > 0
            ? Phaser.Utils.Array.GetRandom(correctPool)
            : Phaser.Utils.Array.GetRandom(incorrectPool);

        const colIndex = Phaser.Math.Between(0, this.columns - 1);
        const x = colIndex * this.columnWidth + this.columnWidth / 2;

        const letter = new FallingLetter(this.scene, char, x, -50, 3000);
        this.activeLetters.push(letter);
    }

    public update(): void {
        this.activeLetters.forEach(letter => {
            const overlap = Phaser.Math.Distance.Between(
                letter.sprite.x,
                letter.sprite.y,
                this.player['sprite'].x,
                this.player['sprite'].y
            ) < 40;

            if (overlap) {
                if (this.targetWord.includes(letter.char)) {
                    this.usedLetters.add(letter.char);
                } else {
                    this.player.takeDamage(1);
                }

                letter.destroy();
            }
        });

        this.activeLetters.filter(l => l.sprite.active);
    }

    public isComplete(): boolean {
        return this.targetWord
            .split('')
            .every(char => this.usedLetters.has(char));
    }

    public destroy(): void {
        this.activeLetters.forEach(letter => letter.destroy());
    }
}

