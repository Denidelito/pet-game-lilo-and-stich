import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
    private progressBar!: Phaser.GameObjects.Graphics;
    private progressBox!: Phaser.GameObjects.Graphics;

    constructor() {
        super('PreloadScene');
    }

    preload(): void {
        const {width, height} = this.scale;

        this.progressBox = this.add.graphics();
        this.progressBox.fillStyle(0x222222, 0.8);
        this.progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

        this.progressBar = this.add.graphics();

        this.load.on('progress', (value: number) => {
            this.progressBar.clear();
            this.progressBar.fillStyle(0xffffff, 1);
            this.progressBar.fillRect(
                width / 2 - 150,
                height / 2 - 15,
                300 * value,
                30,
            );
        });

        this.load.on('complete', () => {
            this.progressBar.destroy();
            this.progressBox.destroy();
        });

        //Audio
        this.load.audio('jingle', 'assets/audio/jingle.wav');

        //Audio UI
        this.load.audio('button-click', 'assets/sound/ui/button_click.wav');

        //UI
        this.load.image('button-play', 'assets/ui/button-play.png');
        this.load.image('sound-on', 'assets/ui/sound-on.png');
        this.load.image('sound-off', 'assets/ui/sound-off.png');

        //assets
        this.load.image('player', 'assets/player.png');
        this.load.image('dust', 'assets/dust.png');

        // background
        this.load.image('bg', 'assets/bg/bg.png');
        this.load.image('bg-cloud-1', 'assets/bg/bg-cloud.png');
        this.load.image('bg-cloud-2', 'assets/bg/bg-cloud2.png');
        this.load.image('bg-glass', 'assets/bg/bg-grass.png');
        this.load.image('bg-rock', 'assets/bg/bg-rock.png');
        this.load.image('bg-front', 'assets/bg/bg-front.png');
    }

    create(): void {
        this.sound.play('jingle', {
            volume: 0.5,
            loop: true,
        });

        this.scene.start('MenuScene');
    }
}
