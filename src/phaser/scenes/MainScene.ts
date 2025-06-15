import Phaser from 'phaser';
import {ParallaxBackground} from "../objects/ParallaxBackground.ts";
import {Player} from "../objects/Player.ts";
import {PlayerHealthUI} from "../ui/PlayerHealthUI.ts";
import {WordLetterManager} from "../logic/WordLetterManager.ts";
import {LevelInfoUI} from "../ui/LevelInfoUI.ts";
import {isMobile} from "../utils/device.ts";
import {CollectedWordUI} from "../ui/CollectedWordUI.ts";
import {setupSwipeControls} from "../utils/swipe.ts";

export class MainScene extends Phaser.Scene {
    public bg!: ParallaxBackground;
    public levelUI!: LevelInfoUI;
    public collectedUI!: CollectedWordUI;
    private player!: Player;
    private healthUI!: PlayerHealthUI;
    private wordManager!: WordLetterManager;

    constructor() {
        super('MainScene');
    }

    create() {
        const mobile = isMobile();
        this.bg = new ParallaxBackground(this, [
            {texture: 'bg', speedX: 10, depth: -4, positionX: 0, positionY: mobile ? -230 : 0},
            {texture: 'bg-cloud-1', speedX: 20, depth: -2, positionX: 0, positionY: mobile ? -230 : 0},
            {texture: 'bg-cloud-2', speedX: 10, depth: -1, positionX: 0, positionY: mobile ? -230 : 0},
            {texture: 'bg-rock', speedX: 0, depth: -3, positionX: mobile ? -300 : 0, positionY: mobile ? -230 : 0},
            {texture: 'bg-front', speedX: 0, depth: -1, positionX: mobile ? -300 : 0, positionY: mobile ? -230 : 0},
            {texture: 'bg-glass', speedX: 0, depth: 2, positionX: mobile ? -300 : 0, positionY: mobile ? -230 : 0},
        ]);

        this.player = new Player(this, {
            y: mobile ? this.scale.height - 244 : this.scale.height - 30,
            texture: 'player',
            stepSoundKey: 'player-move',
        });

        this.healthUI = new PlayerHealthUI(this, {
            x: mobile ? this.scale.width - 120 : 30,
            y: mobile ? 50 : 88,
            player: this.player,
            iconTexture: 'player-health',
            scale: mobile ? .5 : 1
        });

        this.wordManager = new WordLetterManager(this, 'ПЕС', this.player);

        this.levelUI = new LevelInfoUI(this, {
            x: mobile ? 0 : this.scale.width - 254,
            y: mobile ? this.scale.height - 236 : 28,
            word: 'ПЕС',
            characterTexture: 'experiment-007',
            backgroundTexture: mobile ? 'information-table-mobile' : 'information-table',
        });

        this.collectedUI = new CollectedWordUI(this, {
            x: mobile ? 108 : this.scale.width / 2,
            y: mobile ? 20 : 28,
            word: 'ПЕС',
            tileTexture: 'tile',
        });

        this.events.on('letter-caught', (char: string) => {
            this.levelUI.markLetterCaught(char);
            this.collectedUI.addLetter(char);
        });

        if (mobile) {
            setupSwipeControls(this, () => this.player.moveLeft(), () => this.player.moveRight());
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
