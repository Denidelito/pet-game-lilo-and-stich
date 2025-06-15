import Phaser from 'phaser';
import { FallingLetter } from '../objects/FallingLetter.ts';
import { Player } from '../objects/Player.ts';
import { isMobile } from '../utils/device.ts';

export class WordLetterManager {
    private readonly scene: Phaser.Scene;
    private readonly targetWord: string;
    private readonly player: Player;
    private readonly alphabet = 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';

    private readonly columns: number;
    private readonly columnWidth: number;
    private readonly activeLetters: FallingLetter[] = [];

    private currentIndex = 0;
    private spawner?: Phaser.Time.TimerEvent;

    constructor(scene: Phaser.Scene, word: string, player: Player) {
        this.scene = scene;
        this.targetWord = word.toUpperCase();
        this.player = player;

        const mobile = isMobile();
        this.columns = mobile ? 3 : 12;
        this.columnWidth = scene.scale.width / this.columns;

        this.startSpawner();
    }

    private startSpawner(): void {
        const mobile = isMobile();

        this.spawner = this.scene.time.addEvent({
            delay: mobile ? 1000 : 600,
            loop: true,
            callback: () => this.spawnLetter(),
        });
    }

    private spawnLetter(): void {

        if (this.currentIndex >= this.targetWord.length) return;

        const correctChar = this.targetWord[this.currentIndex];
        const isCorrect = Phaser.Math.Between(1, 10) === 1;

        const incorrectPool = this.alphabet
            .split('')
            .filter(c => c !== correctChar);

        const char = isCorrect
            ? correctChar
            : Phaser.Utils.Array.GetRandom(incorrectPool);

        const colIndex = Phaser.Math.Between(0, this.columns - 1);
        const x = colIndex * this.columnWidth + this.columnWidth / 2;

        const letter = new FallingLetter(this.scene, char, x, -50, 3000);
        this.activeLetters.push(letter);
    }

    private getPlayerCatchZone(): Phaser.Geom.Rectangle {
        const sprite = this.player['sprite'] as Phaser.GameObjects.Sprite;

        const catchHeight = sprite.displayHeight * 0.2;
        const catchY = sprite.y - sprite.displayHeight / 2;

        return new Phaser.Geom.Rectangle(
            sprite.x - 50,
            catchY,
            100,
            catchHeight
        );
    }

    public update(): void {
        this.activeLetters.forEach(letter => {
            const overlap = Phaser.Geom.Intersects.RectangleToRectangle(
                letter.sprite.getBounds(),
                this.getPlayerCatchZone()
            );

            if (overlap) {
                const expected = this.targetWord[this.currentIndex];
                const char = letter.char.toUpperCase();

                if (char === expected) {
                    this.currentIndex++;
                    this.scene.events.emit('letter-caught', char);
                } else {
                    this.player.takeDamage(1);
                }

                letter.destroy();
            }
        });

        this.activeLetters.splice(
            0,
            this.activeLetters.length,
            ...this.activeLetters.filter(l => l.sprite.active)
        );
    }

    public isComplete(): boolean {
        return this.currentIndex >= this.targetWord.length;
    }

    public destroy(): void {
        this.spawner?.remove(false);
        this.activeLetters.forEach(letter => letter.destroy());
        this.activeLetters.length = 0;
    }
}
